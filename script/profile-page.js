let button_element = document.querySelector("#view-toggle-button");
let button_icon_element = document.querySelector("#view-toggle-button-icon");
let list_element = document.querySelector("#sidebar-option-list");
let list_item_list = document.querySelectorAll(".list-item");
//Change the below line to make list view the normal
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
    for (let item of list_item_list){
        item.classList.toggle('list-item-grid-view');
    }
    for(let item of friend_article_list){
        item.classList.toggle('friend-entity');
        item.classList.toggle('friend-entity-grid-view');
    }
    for(let item of details_container_list){
        item.classList.toggle('friend-details-container-grid-view');
    }
    for(let item of username_list){
        item.classList.toggle('username-grid-view');
    }
    for(let item of userid_list){
        item.classList.toggle('userid-grid-view');
    }

}