import { ajax } from "../../ajax";

const userFramePartialPath = "partials/user_preview.html";
const friendOptionsPartialPath = "partials/options/friend_actions.html";

async function populateFriendList(requestArgs) {
    const response = await ajax.sendRequest("POST", "fetch_friends", requestArgs);
    const friends = await response.json();
    const friendsList = document.querySelector("#friend-list");
    const noFriendsMessage = document.querySelector("#no-friends-message");

    friendsList.innerHTML = "";

    if (Object.keys(friends).length > 0) {
        noFriendsMessage.classList.add("hidden");
        friendsList.classList.remove("hidden");

        friends.forEach(async friend => {
            const frame = await ajax.fetchHtmlAndAppend(userFramePartialPath, friendsList);
            const optionsFrame = frame.querySelector(".preview-options");
            await ajax.fetchHtmlAndInsert(friendOptionsPartialPath, optionsFrame);
            optionsFrame.querySelector("input[type='hidden']").value = friend.user_id;
    
            frame.querySelector("#name").textContent = friend.first_name + " " + friend.last_name;
            frame.querySelector("#username").textContent = "@" + friend.username;
            frame.querySelector("#profile-picture").src = await ajax.fetchImage(friend.profile_picture);
        });
    }
    else {
        noFriendsMessage.classList.remove("hidden");
        friendsList.classList.add("hidden");
    }
}

async function friendsController() {
    populateFriendList();

    const pageButtons = document.querySelectorAll("#friend-page-buttons > button");
    pageButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            
            const request = {
                "friend_status": button.getAttribute("data-status"),
                "is_initiator": button.getAttribute("data-initiator"),
            };

            populateFriendList(request);
        });
    });
}

export { friendsController };