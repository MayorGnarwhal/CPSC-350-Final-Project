import { ajax } from "../../ajax";

const checkBoxPartialPath = "partials/check_box.html";

async function postController() {
    const response = await ajax.sendRequest("POST", "fetch_groups");
    const groups = await response.json();

    const groupsFrame = document.querySelector("#group-select");

    groups.forEach(async group => {
        const checkBox = await ajax.fetchHtmlAndAppend(checkBoxPartialPath, groupsFrame);
        const box = checkBox.querySelector("input");
        const label = checkBox.querySelector("label");

        const boxID = "opt-" + group.group_id;
        box.setAttribute("id", boxID);
        box.setAttribute("name", "groups[]");
        label.setAttribute("for", boxID);
        label.textContent = group.group_name;
    });

    const globalToggles = document.querySelectorAll("#post-global input");
    const groupToggle = document.querySelector("#not-global");
    const groupOptionsFrame = document.querySelector("#group-options");
    globalToggles.forEach(toggle => {
        toggle.addEventListener("click", function() {
            if (groupToggle.checked) {
                groupOptionsFrame.classList.remove("hidden");
            }
            else {
                groupOptionsFrame.classList.add("hidden");
            }
        });
    });
}

export { postController };