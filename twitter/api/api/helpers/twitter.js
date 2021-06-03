const axios = require('axios');
const url = "https://api.twitter.com/1.1/search/tweets.json";

class Twitter{

    get(q,count,maxId){
        return axios.get(url,{
            params:{
                q:q,
                count:count,
                max_id:maxId,
                tweet_mode:"extended",
                lang:"en"
            },
            headers:{
                Authorization:`Bearer ${process.env.TWITTER_API_TOKEN}`
            }
        })
    }

}

module.exports = Twitter;