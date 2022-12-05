import { ajax } from "../../ajax";
// import { populateUserList } from "./shared/friend_list";

const userFramePartialPath = "partials/user_preview.html";

async function groupController(args) {
    const groupInfo = args.group;

    const response = await ajax.sendRequest("POST", "fetch_group_members", {group_id: groupInfo.group_id});
    const members = await response.json();

    document.querySelector(".title").innerHTML = "Group &ndash; " + groupInfo.group_name;

    const memberList = document.querySelector("#member-list");
    const noMemberMessage = document.querySelector("#no-member-message");

    memberList.innerHTML = "";

    if (Object.keys(members).length > 0) {
        noMemberMessage.classList.add("hidden");
        memberList.classList.remove("hidden");

        const optionPartialPath = `partials/options/group_member_actions.html`;

        members.forEach(async user => {
            const fullName = user.first_name + " " + user.last_name;

            const frame = await ajax.fetchHtmlAndAppend(userFramePartialPath, memberList);
            const optionsFrame = frame.querySelector(".preview-options");
            await ajax.fetchHtmlAndInsert(optionPartialPath, optionsFrame);
            optionsFrame.querySelector("input[name='target_user_id']").value = user.user_id;
            optionsFrame.querySelector("input[name='group_id']").value = groupInfo.group_id;
    
            frame.querySelector("#name").textContent = fullName;
            frame.querySelector("#username").textContent = "@" + user.username;
            frame.querySelector("#profile-picture").src = await ajax.fetchImage(user.profile_picture);

            frame.setAttribute("data-filter", fullName.toLowerCase());
        });
    }
    else {
        noMemberMessage.classList.remove("hidden");
        memberList.classList.add("hidden");
    }

    document.querySelector("#hidden-group-field").value = groupInfo.group_id;
}

export { groupController };