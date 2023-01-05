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

export async function addChat(userId, chatName){
    // check if same User already exists.
    const chat = await chats.findOne({ _id: userId });
    if (chat) return false;

    // if not, add to db.
    await chats.insertOne({
        _id: userId,
        name: chatName
    }).then(() =>{
        //console.log(`Inserted user to DB`);
        return true;
    }).catch((er) =>{
        console.log(`Unable to add chat in DB: ${er}`);
        return false;
    });
}

export async function removeChat(chatId){
    // check if same User already exists.
    const item = await chats.findOne({ _id: chatId });
    if (!item) return false;
  
    // if yes, rem frm db.
    await chats.deleteOne({
      _id: chatId
    }).catch((err) =>{
        console.log(`Unable to remove chat frm DB: ${err}`);
    })
    
  }