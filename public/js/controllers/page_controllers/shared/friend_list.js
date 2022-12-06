import { ajax } from "../../../ajax";

const userFramePartialPath = "partials/user_preview.html";


async function populateUserList(users, optionsPartial, usersList, noUsersMessage) {
    usersList.innerHTML = "";

    if (Object.keys(users).length > 0) {
        noUsersMessage.classList.add("hidden");
        usersList.classList.remove("hidden");

        const optionPartialPath = `partials/options/${optionsPartial}.html`;

        users.forEach(async user => {
            const fullName = user.first_name + " " + user.last_name;

            const frame = await ajax.fetchHtmlAndAppend(userFramePartialPath, usersList);
            const optionsFrame = frame.querySelector(".preview-options");
            await ajax.fetchHtmlAndInsert(optionPartialPath, optionsFrame);
            optionsFrame.querySelector("input[type='hidden']").value = user.user_id;
    
            frame.querySelector("#name").textContent = fullName;
            frame.querySelector("#username").textContent = "@" + user.username;
            frame.querySelector("#profile-picture").src = await ajax.fetchImage(user.profile_picture);

            frame.setAttribute("data-filter", fullName.toLowerCase());
        });
    }
    else {
        noUsersMessage.classList.remove("hidden");
        usersList.classList.add("hidden");
    }
}

export { populateUserList };