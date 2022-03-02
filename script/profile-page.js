import model from "./data.js";

let view={
    init(){
        this.button_element = document.getElementById("view-toggle-button");
        this.button_icon_element = document.querySelector("#view-toggle-button-icon");
        this.image_change_button = document.querySelector('input[name="imagechangeinput"]');
        this.profile_pic = document.querySelector(".profile-dp-main");
        this.grid_view_followers_list = document.querySelector("#grid-view-container");
        this.list_view_followers_list = document.querySelector("#list-view-container");
        
        let follow_button_list = document.querySelectorAll(".follow-button");
        
        this.list_view_followers_list.style.display = "none";

        this.grid_view_followers_list.addEventListener("click",function(event){
            let user2 = event.target.dataset.userhandle;
            let task = event.target.dataset.task;
            if(user2===undefined) return;
            let user1 = "userhandle";
            controller.takeAction(user1,user2,task);
            view.render();
        });

        this.list_view_followers_list.addEventListener("click",function(event){
            let user2 = event.target.dataset.userhandle;
            let task = event.target.dataset.task;
            if(user2===undefined) return;
            let user1 = "userhandle";
            controller.takeAction(user1,user2,task);
            view.render();
        });


        this.button_element.addEventListener("click",function(){
            controller.toggleView(view.button_element.value);
        });

        this.image_change_button.addEventListener("change",function(){
            let filename = "./resources/"+view.image_change_button.files[0].name;
            view.profile_pic.src = "."+filename;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if(confirm("Do you wanna proceed with picture change ?")==true)
                        controller.changeProfilePic(filename);
                    else
                        view.render();
                });
            });
        })

        follow_button_list.forEach(function(button){
            button.addEventListener("click",function(){
                this.classList.add("disabled-follow-button");
            })
        })

        view.render();
    },

    render(){
        this.profile_pic.src = "."+model.getUserEntity("userhandle").profilepic;

        //Render the list of followers
        let followers_list = controller.getFollowers("userhandle");
        this.grid_view_followers_list.innerHTML="";
        this.list_view_followers_list.innerHTML="";
        followers_list.forEach(function(follower){
            
            let is_following = controller.doFollow(follower.userhandle);
            let grid_entity = `
                <li class="list-item list-item-grid-view">
                    <article class="friend-entity-grid-view">
                        <div class="profile-pic-container">
                            <img class="tweet-profile-dp" src=".${follower.profilepic}" alt="../resources/default-dp.jpeg">
                        </div>
                        <div class="friend-details-container friend-details-container-grid-view">
                            <address class="username username-grid-view">
                                ${follower.username}
                            </address>
                            <address class="userid userid-grid-view">@${follower.userhandle}</address>
                        </div>
                        <div class="friend-follow-button-container">
                            <button type="button" class="follow-button ${(is_following)?'disabled-follow-button':''}" data-task="${(is_following)?'unfollow':'follow'}" data-userhandle="${follower.userhandle}"> ${(is_following)?'Unfollow':'Follow'} </button>
                        </div>
                    </article>
                </li>
            `;
            let list_entity = `
                <li class="list-item">
                    <article class="friend-entity">
                        <div class="profile-pic-container">
                            <img class="tweet-profile-dp" src=".${follower.profilepic}" alt="../resources/default-dp.jpeg">
                        </div>
                        <div class="friend-details-container">
                            <address class="username">
                                ${follower.username}
                            </address>
                            <address class="userid">@${follower.userhandle}</address>
                        </div>
                        <div class="friend-follow-button-container">
                            <button type="button" class="follow-button ${(is_following)?'disabled-follow-button':''}" data-task="${(is_following)?'unfollow':'follow'}" data-userhandle="${follower.userhandle}"> ${(is_following)?'Unfollow':'Follow'} </button>
                        </div>
                    </article>
                </li>
            `;

            this.grid_view_followers_list.innerHTML+=grid_entity;
            this.list_view_followers_list.innerHTML+=list_entity;
        },this);
    },

    setViewValues(a,b,c,d){
        this.button_element.value=a;
        this.button_icon_element.innerHTML=b;
        this.grid_view_followers_list.style.display=c;
        this.list_view_followers_list.style.display=d;
    }
}

let controller={
    init(){
        model.init();
        view.init();
    },

    getFollowers(userhandle){
        let followers_list = [];
        for(let user of model.getUserEntity(userhandle).followers){
            let follower_entity=model.getUserEntityShort(user);
            followers_list.push(follower_entity);
        }
        return followers_list;
    },

    toggleView(value){
        if(value=="grid")
            view.setViewValues("list","list_alt","","none");
        else
            view.setViewValues("grid","apps","none","");
    },

    changeProfilePic(filename){
        model.changeUserProfilePic("userhandle",filename);
        view.render();
    },

    takeAction(user1,user2,task){
        if(task==="follow")
            model.addFollower(user1,user2);
        else if(task==="unfollow")
            model.removeFollower(user1,user2);
        else return;
        model.saveUserDataToLocal();

    },

    doFollow(user2){
        let user1="userhandle";
        let follower_list = model.getFollowerList(user1);
        for(let follower of follower_list){
            if(follower===user2) return true;
        }
        return false;
    },
}

controller.init();