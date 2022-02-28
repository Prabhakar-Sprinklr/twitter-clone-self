import model from './data.js';

let view = {
    init(){
        this.tweet_list_container = document.querySelector(".tweet-feed");
        this.new_tweet_form = document.forms.newtweet;
        this.image_input = this.new_tweet_form.elements.imageuploadinput;
        this.image_text_show = this.new_tweet_form.elements.imagenamedisplay;
        this.tweet_feed = document.querySelector(".tweet-feed");
        let profile_pic = document.querySelector(".profile-dp");

        profile_pic.src = controller.getCurrentUserProfilePic();

        this.new_tweet_form.addEventListener("submit",function(event){
            event.preventDefault();
            let tweet_text = view.new_tweet_form.elements.tweettext.value;

            //Image Saving is handled here as it is done here in this case 
            //ideally should just be some fetch call.
            let image = (view.image_input.files.length>0)?view.image_input.files[0].name:"batman-dp.jpeg";
            image = "./resources/"+image;
            //Image Name with local repo path is good working.

            let userhandle = "userhandle";
            controller.addNewTweet(userhandle,tweet_text,image);
            view.image_text_show.value="";
            view.image_text_show.style.display="none";
            view.new_tweet_form.elements.tweettext.value="";
        })

        this.image_input.addEventListener("change",function(){
            view.image_text_show.value=view.image_input.files[0].name;
            view.image_text_show.style.display="block";
        })

        this.tweet_feed.addEventListener("click",function(event){
            // console.log("ANY TWEET CLICKED");
            console.log(event.target.dataset.task);
            console.log(event.target.dataset.tweetid);
            controller.takeTweetAction(event.target.dataset.task,event.target.dataset.tweetid);
            //console.log(event.currentTarget);
        })

        this.renderTweets();
        console.log("View Init Done");
    },

    renderTweets(){
        //Add tweets as the articles
        let tweets = controller.getTweets();
        console.log(tweets);
        this.tweet_list_container.innerHTML="";
        tweets.map(function(tweet){
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
                            <button class="tweet-option-button" data-task="edit" data-tweetid="${tweet.id}"><span class="material-icons" data-task="edit" data-tweetid="${tweet.id}">drive_file_rename_outline</span></button>
                            <button class="tweet-option-button" data-task="delete" data-tweetid="${tweet.id}"><span class="material-icons" data-task="delete" data-tweetid="${tweet.id}">delete</span></button>
                        </aside>

                    </div>

                </article>`
            this.tweet_list_container.innerHTML+=tweet_content;
        },this);
    },

    fillNewTweetForm(text){
        this.new_tweet_form.elements.tweettext.value=text;
    },
}

let controller = {
    init(){
        model.init();
        view.init();
    },

    getTweets(){
        return model.getAllTweet();
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

    addNewTweet(userhandle,tweet_text,image){
        this.addTweet(userhandle,tweet_text,image);
        view.renderTweets();
    },

    takeTweetAction(task,id){
        console.log("Here");
        if(task==="delete"){
            console.log("Here1");
            model.deleteTweet(id);
        }
        else if(task==="edit"){
            //See if getting file also works?
            let text=model.getTweetText(id);
            view.fillNewTweetForm(text);
            model.deleteTweet(id);
        }
        view.renderTweets();
    },

    getCurrentUserProfilePic(){
        let user_entity = model.getUserEntity("userhandle");
        return user_entity.profilepic;
    },
}

controller.init();