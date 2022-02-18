let button_element = document.querySelector("#view-toggle-button");
let button_icon_element = document.querySelector("#view-toggle-button-icon");
let list_element = document.querySelector("#sidebar-option-list");
let list_item_list = document.querySelectorAll(".list-item");
let friend_article_list = document.querySelectorAll(".friend-entity-grid-view");
let details_container_list = document.querySelectorAll(".friend-details-container");
let username_list = document.querySelectorAll(".username");
let userid_list = document.querySelectorAll(".userid");


button_element.addEventListener("click",toggleView);

function toggleView(){
    let value=button_element.value;
    if(value=="grid"){
        button_element.value="list";
        button_icon_element.innerHTML="apps";
    }
    else{
        button_element.value="grid";
        button_icon_element.innerHTML="list_alt";
    }
    list_element.classList.toggle('list-grid-view');
    list_item_list.forEach((item)=>{
        item.classList.toggle('list-item-grid-view');
    })
    friend_article_list.forEach((item)=>{
        item.classList.toggle('friend-entity');
        item.classList.toggle('friend-entity-grid-view');
    })
    details_container_list.forEach((item)=>{
        item.classList.toggle('friend-details-container-grid-view');
    });
    username_list.forEach((item)=>{
        item.classList.toggle('username-grid-view');
    });
    userid_list.forEach((item)=>{
        item.classList.toggle('userid-grid-view');
    });

}