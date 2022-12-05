import { ajax } from "../../ajax";

const groupPreviewPath = "partials/group_preview.html";
const groupActionsPath = "partials/options/group_actions.html";

async function groupsController() {
    const response = await ajax.sendRequest("POST", "fetch_groups");
    const groups = await response.json();

    const groupList = document.querySelector("#group-list");
    const groupModal = document.querySelector("#add-group-modal");

    groups.forEach(async group => {
        const frame = await ajax.fetchHtmlAndAppend(groupPreviewPath, groupList);
        const optionsFrame = frame.querySelector(".preview-options");
        await ajax.fetchHtmlAndInsert(groupActionsPath, optionsFrame);

        frame.querySelector("#name").textContent = group.group_name;
        frame.querySelector("#stats").textContent = "2 friends, 40 posts";

        const modalButton = frame.querySelector("button[data-toggle='modal']");
        modalButton.setAttribute("data-group-name", `value:${group.group_name}`);
        modalButton.setAttribute(`data-priority-${group.group_priority}`, "checked:true");
        modalButton.setAttribute("data-header-title", "textContent:Update Group");
    });
}

export { groupsController };