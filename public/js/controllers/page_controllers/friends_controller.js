import { ajax } from "../../ajax";
import { populateUserList } from "./shared/friend_list";

async function populateFriendList(requestArgs, partialName = "friend_actions") {
    const response = await ajax.sendRequest("POST", "fetch_friends", requestArgs);
    const friends = await response.json();
    var friendsList = document.querySelector("#friend-list");
    var noFriendsMessage = document.querySelector("#no-friends-message");


    populateUserList(friends, partialName, friendsList, noFriendsMessage);
}

async function friendsController() {
    populateFriendList();

    const pageButtons = document.querySelectorAll("#friend-page-buttons > button");
    pageButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();

            document.querySelector(".title").textContent = button.textContent.trim();
            
            const request = {
                "friend_status": button.getAttribute("data-status"),
                "is_initiator": button.getAttribute("data-initiator"),
            };
            
            populateFriendList(request, button.getAttribute("data-partial"));
        });
    });
}

export { friendsController };