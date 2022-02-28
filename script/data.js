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
            this.saveToLocal();
            return;
        }

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

    saveToLocal(){
        localStorage.tweet_data = JSON.stringify(Array.from(this.tweet_collection.entries()));
        localStorage.user_data = JSON.stringify(Array.from(this.user_data.entries()));
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

    changeUserProfilePic(userhandle,filename){
        console.log(this.user_data);
        this.user_data.get(userhandle).profilepic=filename;
        this.saveToLocal();
    },

}

export default model;