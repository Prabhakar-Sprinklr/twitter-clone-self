import model from "./data.js";

let view={
    init(){
        this.button_element = document.getElementById("view-toggle-button");
        this.list_view_container = document.getElementById("list-view-container");
        this.grid_view_container = document.getElementById("grid-view-container");
        this.button_icon_element = document.querySelector("#view-toggle-button-icon");
        this.image_change_button = document.querySelector('input[name="imagechangeinput"]');
        this.profile_pic = document.querySelector(".profile-dp-main");
        this.list_view_container.style.display = "none";

        this.button_element.addEventListener("click",function(){
            controller.toggleView(view.button_element.value);
        });

        this.image_change_button.addEventListener("change",function(){
            let filename = "./resources/"+view.image_change_button.files[0].name;
            controller.changeProfilePic(filename);
        })

        view.render();
    },

    render(){
        this.profile_pic.src = "."+model.getUserEntity("userhandle").profilepic;
    },

    setViewValues(a,b,c,d){
        this.button_element.value=a;
        this.button_icon_element.innerHTML=b;
        this.grid_view_container.style.display=c;
        this.list_view_container.style.display=d;
    }
}

let controller={
    init(){
        model.init();
        view.init();
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
}

controller.init();