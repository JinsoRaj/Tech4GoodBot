import { read } from '@extractus/feed-extractor'
import * as dotenv from "dotenv"
dotenv.config()

const discourseRssUrl = process.env.DISCOURSE_RSS_URL
// Each RSS entries have unique guid.
export async function discourseRSS(){
  try{
    const result = await read(discourseRssUrl,{
      getExtraFeedFields: (feedData) => {
        return {
          lastBuildDate: feedData.lastBuildDate || ''
        }
      },
      getExtraEntryFields: (feedEntry) => {
          const {
            pubDate,
            guid
          } = feedEntry
          return {
            pubDate: pubDate,
            guid: Number(guid["#text"].split('-')[2])
          }
        }
      })
      return result;

  }catch(error){
    console.log(`Error in fetching Discourse group Rss: ${error}`);
  }
    
}

// Todo
// export async function websiteRSS(){

// }

// export async function linkedinRSS(){

// }