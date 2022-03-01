import model from './data.js';
import homepage_state from './homepage_state.js';

let view = {
    init(){
        this.tweet_list_container = document.querySelector(".tweet-feed");
        this.new_tweet_form = document.forms.newtweet;
        this.image_input = this.new_tweet_form.elements.imageuploadinput;
        this.image_text_show = this.new_tweet_form.elements.imagenamedisplay;
        this.preview_image = document.querySelector(".preview-image");
        this.remove_tweet_picture = document.querySelector(".remove-tweet-picture");
        this.main_content_div = document.querySelector(".feed-container");

        let tweet_feed = document.querySelector(".tweet-feed"),
            profile_pic = document.querySelector(".profile-dp");

        this.remove_tweet_picture.style.display="none";


        profile_pic.src = controller.getCurrentUserProfilePic();

        this.new_tweet_form.addEventListener("submit",function(event){
            event.preventDefault();
            let tweet_text = view.new_tweet_form.elements.tweettext.value;

            //Image Saving is handled here as it is done here in this case 
            //ideally should just be some fetch call.

            let image = (homepage_state.image===undefined)?"./resources/batman-dp.jpeg":homepage_state.image;

            //Image Name with local repo path is working.

            let userhandle = "userhandle";

            if(controller.addNewTweet(userhandle,tweet_text,image)===false){
                console.log("Here clicked");
                return;
            }

            homepage_state.image=undefined;
            homepage_state.image_name=undefined;
            view.new_tweet_form.elements.tweettext.value="";
            view.image_text_show.style.display="none";
            view.preview_image.style.display="none";
            view.remove_tweet_picture.style.display="none";
        })

        this.image_input.addEventListener("change",function(){
            homepage_state.image_name=view.image_input.files[0].name;
            view.image_text_show.value=homepage_state.image_name;
            view.image_text_show.style.display="block";
            homepage_state.image="./resources/"+view.image_input.files[0].name;
            view.preview_image.src = homepage_state.image;
            view.preview_image.style.display="block";
            view.remove_tweet_picture.style.display="";
        })

        tweet_feed.addEventListener("click",function(event){
            controller.takeTweetAction(event.target.dataset.task,event.target.dataset.tweetid);
        })

        this.remove_tweet_picture.addEventListener("click",function(){
            view.image_input.value="";
            homepage_state.image=undefined;
            homepage_state.image_name=undefined;
            view.image_text_show.style.display="none";
            view.preview_image.style.display="none";
            view.remove_tweet_picture.style.display="none";
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
        if(homepage_state.image===undefined) return;
        this.image_text_show.value=homepage_state.image_name;
        this.image_text_show.style.display="block";
        this.preview_image.src = homepage_state.image;
        this.preview_image.style.display="block";
        this.remove_tweet_picture.style.display="";
},
}

let controller = {
    init(){
        model.init();
        homepage_state.init();
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
        let tweet_length = tweet_text.length;
        if(tweet_length<=5){
            alert("Tweet Text too short !");
            return false;
        }
        else if(tweet_length>100){
            alert("Too large a tweet !");
            return false;
        }
        console.log(image);
        if(homepage_state.tweet_id===undefined)
            this.addTweet(userhandle,tweet_text,image);
        else{
            model.editTweet(homepage_state.tweet_id,tweet_text,image);
            homepage_state.tweet_id=undefined;
        }
        view.renderTweets();
        return true;
    },

    takeTweetAction(task,id){
        console.log("Here");
        if(task==="delete"){
            console.log("Here1");
            if (confirm("Do you want to delete the tweet ?") == true)
                model.deleteTweet(id);
        }
        else if(task==="edit"){
            //See if getting file also works?
            homepage_state.tweet_id=id;
            let text=model.getTweetText(id);
            homepage_state.image=model.getTweetImage(id);
            homepage_state.image_name=homepage_state.image.slice(homepage_state.image.lastIndexOf('/')+1);
            console.log(homepage_state.image,homepage_state.image_name);
            view.fillNewTweetForm(text);
            view.main_content_div.scrollTop=0;
            //model.deleteTweet(id);
        }
        view.renderTweets();
    },

    getCurrentUserProfilePic(){
        let user_entity = model.getUserEntity("userhandle");
        return user_entity.profilepic;
    },
}

controller.init();