let button_element = document.getElementById("view-toggle-button");
let list_view_container = document.getElementById("list-view-container");
let grid_view_container = document.getElementById("grid-view-container");
let button_icon_element = document.querySelector("#view-toggle-button-icon");
list_view_container.style.display = "none";

button_element.addEventListener("click",toggleView);

function toggleView(){
    let value=button_element.value;
    if(value=="grid"){
        button_element.value="list";
        button_icon_element.innerHTML="list_alt";
        grid_view_container.style.display="";
        list_view_container.style.display="none";
    }
    else{
        button_element.value="grid";
        button_icon_element.innerHTML="apps";
        grid_view_container.style.display="none";
        list_view_container.style.display="";
    }
}


