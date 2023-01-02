// Checking for New entries in RSS Feeds, If new entries, Broadcast it to all subscribed Chats.
// Currently only broadcasting for Selected Ids.

import { discourseRSS} from "./rssFeed.js";
import { getDbGUID, updateRss, getChats } from "../database/methods.js";
import { bot } from "../bot.js";


export async function checkNewDiscourse(){
    const rssFeed = await discourseRSS();
    // get guid of latest post.
    const firstGUID = rssFeed.entries[0].guid;
    // get old guid from database
    const dbGUID = await getDbGUID();
    //get all chats to broadcast new feed.
    const chatsArray = await getChats();

    // Compare guids
    if(firstGUID > dbGUID){
        // Get the Index of Item which is linked with DB-GUID
        const dbpostIndex = rssFeed.entries.map(entry => entry.guid).indexOf(dbGUID);
        // Loop all posts above that Index.
        for(let i=dbpostIndex-1; i>=0; i--){
            for(const chat of chatsArray){
                bot.api.sendMessage(chat._id,`<u><b>New post from Discourse</b></u>\n\n<b>${rssFeed.entries[i].title}</b>\n<i>${rssFeed.entries[i].description}..</i>\n<a href="${rssFeed.entries[i].link}"><i>Read More...</i></a>`,
                {
                    parse_mode: "HTML",
                    disable_web_page_preview: true,
                    reply_markup:{
                        inline_keyboard: [
                            [
                                {
                                    text: `Read or Reply post`,
                                    url: rssFeed.entries[i].link
                                }
                            ]
                        ]
                    } 
                })
            } 
        }
        // update new entry to DB
        await updateRss(rssFeed);

    }
}