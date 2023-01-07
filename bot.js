/*
  Project: Tech4Good Telegram Bot - t.me/JinsoRaj
  Langauge: Node.js
  Framework: grammYjs
  configs: https://t.me/c/1191474847/4711
*/
import { Bot, InlineKeyboard, GrammyError, HttpError } from"grammy";
import { checkNewDiscourse } from "./helpers/newEntries.js";
 import { getPosts } from "./helpers/searchDiscourse.js"
import { addChat, removeChat } from "./database/methods.js";
import cron from "node-cron";
import * as dotenv from 'dotenv'
dotenv.config()
export const bot = new Bot(process.env.BOT_TOKEN);

// Handle the /start command.
bot.command("start", async (ctx) => {
  ctx.reply("😄 Hi..\nYou are now subscribed to <a href='https://t4glabs.discourse.group'>Tech4Good Forum</a>. I will update you with latest Forum posts.\nYou can also send me queries to search..",
  {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_to_message_id: ctx.message.message_id,
    reply_markup: new InlineKeyboard().url(
      "🌐 Open Forum",
      `https://t4glabs.discourse.group`,
      )
  });

  //add new users to DB
  if(ctx.message.chat.type === 'private'){
    await addChat(ctx.message.from.id, ctx.message.from.first_name)
  }
});

bot.command("search", async(ctx) =>{
  if(ctx.message.chat.type === 'private'){
    await ctx.reply(`Yeah! Please send me the keyword to Search 🔍`,
    {
      parse_mode: "HTML",
      reply_to_message_id: ctx.message.message_id,
    })
  }else{
    await ctx.reply(`You can search only in our Private chat.`,
    {
      parse_mode: "HTML",
      reply_to_message_id: ctx.message.message_id,
      reply_markup: new InlineKeyboard().url(
        "Chat Private",
        `https://t.me/${bot.botInfo.username}`,
        )
    })
  }
})

// Check for New Discourse group RSS feeds every 10 mints.
cron.schedule('*/10 * * * *', async () => {
  console.log('running a task every 10 minutes');
  await checkNewDiscourse()
});


// Check for New Course Updates from website every 3 hrs.
//await checkNewWebsite();
//await checkNewLinkedin();

bot.chatType("private").on("message:text", async (ctx)=>{
  if(!ctx.message.via_bot){
    const query = ctx.message.text;
    const res = await getPosts(query);
    if(res.topics){
      await bot.api.sendMessage(ctx.message.chat.id, `🔍 Found <b>${res.topics.length}</b> results.\n<b>Click</b> the below button to show results..`,
      {
      parse_mode: "HTML",
      reply_to_message_id: ctx.message.message_id,
      reply_markup: new InlineKeyboard().switchInlineCurrent(
        "Show Results 🔍",
        `${query}`,
        )
      })
    }else{
      await bot.api.sendMessage(ctx.message.chat.id, `🥺 No results. Try another query`,
      {
      parse_mode: "HTML",
      reply_to_message_id: ctx.message.message_id
      })
    }
  }
})

// Inline Mode
// Listen for users typing “@Tech4GoodBot ”

bot.on('inline_query', async(ctx) => {
  const query = ctx.inlineQuery.query;
  if(query.length > 2){
    const res = await getPosts(query)
    if(res.topics){
      let data = res.topics.map((item, index) => {
        return {
          type: "article",
          id: String(index),
          title: item.title,
          input_message_content: {
            message_text: `<b>${item.title}</b>\n\n<i>${res.posts[index].blurb}</i>`,
            parse_mode: "HTML",
            disable_web_page_preview: true
          },
          reply_markup: new InlineKeyboard().url(
            "Read Post",
            `https://t4glabs.discourse.group/t/${item.slug}/${item.id}`,
          ),
          url: `https://t4glabs.discourse.group/t/${item.slug}/${item.id}`,
          description: res.posts[index].blurb,
        }
      })
      await ctx.answerInlineQuery(
        data,
        { cache_time: 3600 }, // 1m seconds
      );
    }
  }
});


// end DB
bot.on("my_chat_member", async ctx =>{
  //console.log(ctx.myChatMember);
  if(ctx.myChatMember.chat.type === 'private'){
    if(ctx.myChatMember.old_chat_member.status === "member" && ctx.myChatMember.new_chat_member.status === "kicked"){
      //remove user from db
      await removeChat(ctx.myChatMember.from.id)
    }
  }else if(ctx.myChatMember.old_chat_member.user.username == bot.botInfo.username){
    // if me then add / remove
    if(ctx.myChatMember.new_chat_member.status === "kicked" || ctx.myChatMember.new_chat_member.status === "left"){
      //remove
      await removeChat(ctx.myChatMember.chat.id);
    }
    else if(ctx.myChatMember.new_chat_member.status == "member" || ctx.myChatMember.new_chat_member.status == "administrator" ){
      //add
      await bot.api.sendMessage(ctx.myChatMember.chat.id, `Thanks for adding me\nNow you will get new Post notifications here...`)
      await addChat(ctx.myChatMember.chat.id, ctx.myChatMember.chat.title);
    }

  }

})


bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("An Unknown error occurred:", e);
  }
});

bot.start()