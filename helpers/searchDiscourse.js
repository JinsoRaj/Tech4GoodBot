import { read } from '@extractus/feed-extractor'
import * as dotenv from "dotenv"
dotenv.config()

const discourseUrl = process.env.DISCOURSE_RSS_URL

// Todo: puppeteer?, /search?q=word%20in%3Atitle
export async function getDiscoursePosts(){
   try{
      const result = await read(discourseUrl,{
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
      return result.entries;
  
    }catch(error){
      console.log(`Error in fetching Discourse url: ${error}`);
    }
}
//await getDiscoursePosts()