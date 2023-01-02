/*
  Project: Tech4Good Telegram Bot - t.me/JinsoRaj
  Langauge: Node.js
  Framework: grammYjs
  configs: https://t.me/c/1191474847/4711
*/
import { Bot, InlineKeyboard, GrammyError, HttpError } from"grammy";
import { checkNewDiscourse } from "./helpers/newEntries.js";
// import { getDiscoursePosts } from "./helpers/searchDiscourse.js"
import cron from "node-cron";
import * as dotenv from 'dotenv'
dotenv.config()
export const bot = new Bot(process.env.BOT_TOKEN);

// Handle the /start command.
bot.command("start", (ctx) => {
  ctx.reply("Hi..\nI will update you with latest post from T4GLabs\nYou can also search the posts via inLine.")
});

// Check for New Discourse group RSS feeds every 10 mints.
cron.schedule('*/10 * * * *', async () => {
  console.log('running a task every 10 minutes');
  await checkNewDiscourse()
});


// Check for New Course Updates from website every 3 hrs.
//await checkNewWebsite();
//await checkNewLinkedin();

// Inline Mode

// Listen for users typing “@Tech4GoodBot ” - Disabled - 2/11/23 meet.
/*
bot.on('inline_query', async(ctx) => {
  const query = ctx.inlineQuery.query;
  const res = await getDiscoursePosts()
  const resarr = res.filter(({ ["title"]: title }) => title && title.includes(query));
  //console.log(resarr);
  let data = resarr.map((item, index) => {
    return {
      type: "article",
      id: String(index),
      title: item.title,
      input_message_content: {
        message_text: `<b>${item.title}</b>\n<i>${item.description}</i>`,
        parse_mode: "HTML",
      },
      reply_markup: new InlineKeyboard().url(
        "Read Post",
        item.link,
      ),
      url: item.link,
      description: item.description,
    }
  })
  await ctx.answerInlineQuery(
    data,
    { cache_time: 30 * 24 * 3600 }, // one month in seconds
  );
});
*/

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