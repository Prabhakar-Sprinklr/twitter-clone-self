model = {
    tweet_collection:new Map(),
    user_data:new Map(),
    
    init(){
        this.user_data.set("userhandle",{
            userhandle:"userhandle",
            username:"Username",
            profilepic:"./resources/batman-dp.jpeg"
        });
        for(let i=0;i<5;i++){
            controller.addTweet(
                "userhandle",
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                "./resources/batman-dp.jpeg",
                i
            );
        }
        console.log(this.user_data,this.user_data.size);
        console.log(this.tweet_collection,this.tweet_collection.size);
    },

    getAllUsers(){
        return this.user_data;
    },

    getAllTweet(){
        return this.tweet_collection;
    },

    addTweet({unique_id,content}){
        this.tweet_collection.set(unique_id,content);
    },

    getUserEntity(userid){
        return this.user_data.get(userid);
    },

}

view = {
    init(){
        this.tweet_list_container = document.querySelector(".tweet-feed");
        this.new_tweet_form = document.forms.newtweet;
        this.new_tweet_form.elements.tweettext.addEventListener("click",function(){
            this.value="";
        })

        this.new_tweet_form.addEventListener("submit",function(event){
            event.preventDefault();
            controller.addNewTweet();
            let clickevent = new Event("click");
            view.new_tweet_form.elements.tweettext.dispatchEvent(clickevent);
        })

        this.renderTweets();
        console.log("View Init Done");
    },

    renderTweets(){
        //Add tweets as the articles
        let tweets = controller.getTweets();
        console.log(tweets);
        this.tweet_list_container.innerHTML="";

        for(let tweet of tweets){
            let tweet_content = 
                `<article class='tweet'>
                    <div>
                        <img class="tweet-profile-dp" src="${tweet.profilepic}" alt="./resources/default-dp.jpeg">
                    </div>
                    <div class="tweet-content">
                        <div>
                            <address> <span class="username-text">${tweet.username}</span> <span class="userhandle-text">@${tweet.userid}</span></address>
                            <div>${tweet.text}</div>
                        </div>
                        <image class="tweet-image-container">
                            <img class="tweet-image" src="${tweet.image}" alt="./resources/default-dp.jpeg">
                        </image>

                        <aside class="tweet-option-button-container">
                            <button class="tweet-option-button"><span class="material-icons">thumb_up</span></button>
                            <button class="tweet-option-button"><span class="material-icons">share</span></button>
                            <button class="tweet-option-button"><span class="material-icons">chat</span></button>
                            <button class="tweet-option-button"><span class="material-icons">upload</span></button>
                        </aside>

                    </div>

                </article>`
            this.tweet_list_container.innerHTML+=tweet_content;
        }
    },

    getNewTweetData(){
        let tweet_text = this.new_tweet_form.elements.tweettext.value;
        let userhandle = "userhandle";
        return {
            userhandle:userhandle,
            tweet_text:tweet_text,
        };
    }
}

controller = {
    init(){
        model.init();
        view.init();
    },

    getTweets(){
        let user_data=model.getAllUsers();
        let tweet_list=model.getAllTweet();
        let return_collection =[];
        for(let [key,value] of tweet_list.entries()){
            let userid=value.userhandle;
            let user_entity=user_data.get(userid);
            let username=user_entity.username;
            let profilepic=user_entity.profilepic;
            let text=value.text;
            let image=value.image;
            let timestamp=value.timestamp;
            return_collection.push({
                username:username,
                userid:userid,
                profilepic:profilepic,
                text:text,
                image:image,
                timestamp:timestamp,
            });
        }
        return_collection.sort(function(a, b) { 
            return b.timestamp - a.timestamp;
        });
        return return_collection;
    },

    addTweet(userhandle,tweet_text,tweet_image="./resources/batman2.jpeg",index=0){
        let user = model.getUserEntity(userhandle);
        if(user===undefined) return;
        let timestamp=Date.now();
        let unique_id=userhandle+"-"+timestamp+"-"+index;
        model.addTweet({
                unique_id:unique_id,
                content:{
                    userhandle:userhandle,
                    text:tweet_text,
                    image:tweet_image,
                    timestamp:timestamp,
                },
            });
    },

    addNewTweet(){
        //Get data from view form
        let {userhandle,tweet_text}=view.getNewTweetData();
        //Form the new tweet and call model add tweet
        this.addTweet(userhandle,tweet_text);
        view.renderTweets();
    }
}

controller.init();