let model = {
    
    init(){

        // TO BE DONE WHEN THE APP IS RUNNED THE VERY FIRST TIME
        if(localStorage.tweet_data === undefined){
            this.tweet_collection=new Map();
            this.user_data=new Map();
            console.log("Here");
            this.user_data.set("userhandle",{
                userhandle:"userhandle",
                username:"Username",
                profilepic:"./resources/batman-dp.jpeg",
                followers:[],
                following:[],
            });
            for(let i=0;i<30;i++){
                this.user_data.set("userhandle"+i,{
                    userhandle:"userhandle"+i,
                    username:"Username"+i,
                    profilepic:"./resources/batman-dp.jpeg",
                    followers:[],
                    following:[],
                });
                if(i%4==0)
                    this.addFollower("userhandle","userhandle"+i);
                if(i%3==0)
                    this.addFollower("userhandle"+i,"userhandle");
            }
            for(let i=0;i<5;i++){
                let tweet_text="Updated Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
                let tweet_image="./resources/batman-dp.jpeg";
                let userhandle = "userhandle"
                let user = model.getUserEntity(userhandle);
                if(user===undefined) continue;
                let timestamp=Date.now();
                let unique_id=userhandle+"-"+timestamp+"-"+i;
                let content = {
                    userhandle:userhandle,
                    text:tweet_text,
                    image:tweet_image,
                    timestamp:timestamp,
                };
                this.tweet_collection.set(unique_id,content);
            }
            this.saveToLocal();
            return;
        }

        //Once the local storage is set up the above code doesnt run, and all reading is done from here.
        this.tweet_collection=new Map(JSON.parse(localStorage.tweet_data));
        this.user_data=new Map(JSON.parse(localStorage.user_data));
    },

    getAllUsers(){
        return this.user_data;
    },

    getAllTweet(){
        if(this.tweet_collection_list!==undefined) return this.tweet_collection_list;
        this.tweet_collection_list=[];
        for(let [key,value] of this.tweet_collection.entries()){
            let userid=value.userhandle,
                id=key,
                user_entity=this.user_data.get(userid),
                username=user_entity.username,
                profilepic=user_entity.profilepic,
                text=value.text,
                image=value.image,
                timestamp=value.timestamp;
            this.tweet_collection_list.push({
                id:id,
                username:username,
                userid:userid,
                profilepic:profilepic,
                text:text,
                image:image,
                timestamp:timestamp,
            });
        }
        console.log("Sort called");
        this.tweet_collection_list.sort(function(a, b) {return b.timestamp - a.timestamp;
        });


        return this.tweet_collection_list;
    },

    addTweet({unique_id,content}){
        this.tweet_collection.set(unique_id,content);
        let user_entity=this.getUserEntity(content.userhandle);
        this.tweet_collection_list.unshift({
            id:unique_id,
            username:user_entity.username,
            userid:content.userhandle,
            profilepic:user_entity.profilepic,
            text:content.text,
            image:content.image,
            timestamp:content.timestamp,
        })
        this.saveToLocal();
    },

    getUserEntity(userid){
        return this.user_data.get(userid);
    },

    getUserEntityShort(userid){
        let full_entity=this.user_data.get(userid);;
        let short_entity={
            userhandle:full_entity.userhandle,
            username:full_entity.username,
            profilepic:full_entity.profilepic,
        }
        return short_entity;
    },

    saveToLocal(){
        localStorage.tweet_data = JSON.stringify(Array.from(this.tweet_collection.entries()));
        this.saveUserDataToLocal();
    },

    deleteTweet(id){
        this.tweet_collection.delete(id);
        this.tweet_collection_list=this.tweet_collection_list.filter(function(tweet_item){
            return tweet_item.id!==id;
        });
        this.saveToLocal();
        console.log("Deletion Successful!")
    },

    getTweetText(id){
        return this.tweet_collection.get(id).text;
    },

    getTweetImage(id){
        return this.tweet_collection.get(id).image;
    },

    changeUserProfilePic(userhandle,filename){
        console.log(this.user_data);
        this.user_data.get(userhandle).profilepic=filename;
        this.saveToLocal();
    },

    editTweet(id,text,image){
        let tweet = this.tweet_collection.get(id);
        tweet.text=text;
        tweet.image=image;
        let temp_tweet;
        for(temp_tweet of this.tweet_collection_list){
            if(temp_tweet.id===id)
                break;
        }
        temp_tweet.text=text;
        temp_tweet.image=image;
        this.saveToLocal();
    },

    addFollower(user1,user2){
        let user_entity1=this.user_data.get(user1);
        let user_entity2=this.user_data.get(user2);
        user_entity1.following.push(user2);
        user_entity2.followers.push(user1);
    },

    removeFollower(user1,user2){
        let user_entity1=this.user_data.get(user1);
        let user_entity2=this.user_data.get(user2);
        user_entity1.following = user_entity1.following.filter(function(userid){
            return userid!==user2;
        });
        user_entity2.followers = user_entity2.followers.filter(function(userid){
            return userid!==user1;
        })
    },

    getFollowerList(user1){
        return this.getUserEntity(user1).following;
    },

    saveUserDataToLocal(){
        localStorage.user_data = JSON.stringify(Array.from(this.user_data.entries()));
    }


}

export default model;