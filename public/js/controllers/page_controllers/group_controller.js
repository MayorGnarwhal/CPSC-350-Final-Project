import { ajax } from "../../ajax";

async function groupController(args) {
    const groupInfo = args.group;

    const response = await ajax.sendRequest("POST", "fetch_group_members", {group_id: groupInfo.group_id});
    const members = await response.json();

    console.log(members);

    document.querySelector("#hidden-group-field").value = args.group_id;
}

export { groupController };