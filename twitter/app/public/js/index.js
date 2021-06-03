let url = "https://twitter-twin-api.herokuapp.com/tweets";
let nextPageUrl = null;

/**
 * Retrive Twitter Data from API
 */
const getTwitterData = (nextPage=false) => {
    const query = document.getElementById('user-search').value;
    if(!query) return;
    const encode = encodeURIComponent(query);
    let full_url = `https://twitter-twin-api.herokuapp.com/tweets?q=${encode}&count=10`;
    if(nextPage && nextPageUrl) full_url = nextPageUrl;
    fetch(full_url)
    .then((respose)=>respose.json())
    .then((data)=>{
        buildTweets(data.statuses,nextPage)
        saveNextPage(data.search_metadata);
        nextPageButtonVisibility(data.search_metadata);
    })
}

const onEnter = (e) => {
    if(e.key==='Enter') getTwitterData();
}

/**
 * Save the next page data
 */
const saveNextPage = (metadata) => {
    if(metadata.next_results){
        nextPageUrl = `${url}${metadata.next_results}`;
    } else {
        nextPageUrl = null;
    }
}


const callNextPage = () =>{
    if(nextPageUrl){
        getTwitterData(true);
    } 
}


/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => {
    document.getElementById('user-search').value = e.innerText;
    getTwitterData();
}

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (metadata) => {
    if(metadata.next_results)
        document.getElementById('next').style.visibility = "visible"
    else
        document.getElementById('next').style.visibility = "hidden"
}

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPage) => {
    let content = "";
    tweets.map((tweet)=>{
        const created = moment(tweet.created_at).fromNow();
        content += `
            <div class="tweet">
                <div class="user-info">
                    <div class="user-profile" style="background-image: url(${tweet.user.profile_image_url_https})"></div>
                    <div class="user-name">
                        <div class="user-fullname">${tweet.user.name}</div>
                        <div class="user-username">@${tweet.user.screen_name}</div>
                    </div>
                </div>
                `
        if(tweet.extended_entities && tweet.extended_entities.media.length>0){
            content += buildImages(tweet.extended_entities.media);
            content += buildVideo(tweet.extended_entities.media);
        }

        content +=  `
                <div class="tweet-text">${tweet.full_text}</div>
                <div class="tweet-date">${created}</div>
            </div>
        `
    });
    if(nextPage)
        document.querySelector('.list').insertAdjacentHTML('beforeend',content);
    else
        document.querySelector('.list').innerHTML=content;
}

/**
 * Build HTML for Tweets Images
 */
const buildImages = (mediaList) => {
    let imgContent = `<div class="tweet-img">`;
    let imgExist = false;
    mediaList.map((media)=>{
        if(media.type=="photo"){
            imgExist = true;
            imgContent+=`<div class="tweet-pic" style="background-image:url(${media.media_url_https})"></div>`
        }
    });
    imgContent+=`</div>`;
    return imgExist?imgContent:'';
}

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (mediaList) => {
    let vidContent = `<div class="tweet-vid">`;
    let vidExist = false;
    mediaList.map((media)=>{
        if(media.type=="video"){
            vidExist = true;
            const variant = media.video_info.variants.find((variant)=>variant.content_type=='video/mp4');
            // <source src="${media.video_info.variants[0].url}"></source> variant shown for gif
            vidContent+=`
            <video controls>
                <source src="${variant.url}" type="video/mp4">
            </video>
        `
        } else if(media.type=="animated_gif"){
            vidExist = true;
            vidContent+=`
            <video loop autoplay>
                <source src="${media.video_info.variants[0].url}">
            </video>
        `
        }
    });
    vidContent+=`</div>`;
    return vidExist?vidContent:'';
}
