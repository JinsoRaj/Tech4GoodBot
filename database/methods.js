import { rss, chats } from "./db.js";

// Get stored guid from rss db
export async function getDbGUID(){
    const rsssettings = await rss.findOne({ _id: "rsssettings" });
    return rsssettings.latestEntryGUID;
}

// Update rss db with latest entry details
export async function updateRss(fullEntry){

    // for first time add, next time update.
    const lastDate = fullEntry.lastBuildDate;
    const firstEntry = fullEntry.entries[0];

    await rss.updateOne(
        { _id: "rsssettings" },
        { $set: {
            lastBuildDate: lastDate,
            latestEntryGUID: firstEntry.guid,
            latestEntryLink: firstEntry.link,
            latestEntryTitle: firstEntry.title
        } })
}

export async function getChats(){
    const allChatsArray = await chats.find({ _id: { $ne: null } }).toArray();
    return allChatsArray;
}
