import { ajax } from "../../ajax";

const checkBoxPartialPath = "partials/check_box.html";

async function postController(args) {
    args = Object.keys(args).length > 0 ? args : undefined;

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

        if (args && args.visibilies.find(x => x.group_id === group.group_id)) {
            box.checked = true;
        }
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

    if (args) {
        const postInfo = args.post;

        if (postInfo.is_global) {
            document.querySelector("#global").checked = true;
        }
        else {
            groupToggle.checked = true;
            groupOptionsFrame.classList.remove("hidden");
        }

        document.querySelector("#form-title").value = postInfo.post_title;
        document.querySelector("#post-caption").value = postInfo.post_text;
        document.querySelector("form").setAttribute("action", "/update_post");
        document.querySelector("input[name='post_id']").value = postInfo.post_id;

        document.querySelector(".title").textContent = "Update Post"
    }
}

export { postController };