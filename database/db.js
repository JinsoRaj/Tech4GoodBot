import { MongoClient } from 'mongodb';
import * as dotenv from "dotenv"
dotenv.config()
//var db;

//Connect to MongoDB using srv Url.
async function main(){
  const mongo_uri = process.env.MONGO_URL
  const client = new MongoClient(mongo_uri);
  try{
    await client.connect();
    console.log("Connected to DB");
    const database = client.db("t4gdb");
    return database;
  }catch(error){
    console.error(`Error in connecting to MongoDB: ${error}`);
  }
}

export const db = await main()

// export async function getDb(){
//   const db = await main().catch(console.error)
//   return db;
// }


// /* Collections:-
//     RSS- For Rss data storage
//     Users- For bot starting users
//     Chats- For bot added groups/channels.
// */
export const rss = db.collection("rss");
// /* rss: {
//     _id: "rsssettings"
//     lastBuildDate: String,
//     latestEntryGUID: String,
//     latestEntryLink: String,
//     latestEntryTitle: String
//     }
// */
export const users = db.collection("users");
// /* users: {
//     _id:,
//     first_name:,
//     username:,
// }
// */
export const chats = db.collection("chats")
// /* chats: {
//     _id:,
//     name:,
//     username:
// }
// */
