
import axios from 'axios';

const baseUrl = `https://t4glabs.discourse.group/search.json`;


export async function getPosts(inlineQuery){
  const query = inlineQuery;
  const options = {
    q: `${query}`
  }
  const res = await axios.get(baseUrl,{
    headers: {'Accept': 'application/json'},
    params: options
  })
   //console.log(res.data);
   return res.data;
}
