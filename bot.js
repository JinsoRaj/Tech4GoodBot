/*
  Project: Tech4Good Telegram Bot - t.me/JinsoRaj
  Langauge: Javascript in Deno + Deno-Deploy
  Framework: grammYjs
  configs: https://t.me/c/1191474847/4711
*/
import { Bot } from"grammy";
import { checkNewDiscourse } from "./helpers/newEntries.js";
import cron from "node-cron";
import * as dotenv from 'dotenv'
dotenv.config()
export const bot = new Bot(process.env.BOT_TOKEN);

// Handle the /start command.
bot.command("start", (ctx) => {
  ctx.reply("Yeah! Online...")
});

// Check for New Discourse group RSS feeds every 10 mints.
cron.schedule('*/15 * * * *', async () => {
  console.log('running a task every 10 minutes');
  await checkNewDiscourse()
});


// Check for New Course Updates from website every 3 hrs.
//await checkNewWebsite();
//await checkNewLinkedin();

// Inline


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