import { ajax } from "../../ajax";

const userFramePartialPath = "partials/user_preview.html";
const friendOptionsPartialPath = "partials/options/friend_actions.html";

async function friendsController() {
    const response = await ajax.sendRequest("POST", "fetch_friends");
    const friends = await response.json();

    const friendsList = document.querySelector("#friend-list");

    if (Object.keys(friends).length > 0) {
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
}

export { friendsController };