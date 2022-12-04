import { ajax } from "../../ajax";

const groupPreviewPath = "partials/group_preview.html";

async function groupsController() {
    const response = await ajax.sendRequest("POST", "fetch_groups");
    const groups = await response.json();

    const groupList = document.querySelector("#group-list");

    groups.forEach(async group => {
        const frame = await ajax.fetchHtmlAndAppend(groupPreviewPath, groupList);

        frame.querySelector("#name").textContent = group.group_name;
        frame.querySelector("#stats").textContent = "2 friends, 40 posts";
    });
}

export { groupsController };