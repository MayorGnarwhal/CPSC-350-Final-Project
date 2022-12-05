import { friendsController } from "./friends_controller";
import { groupsController } from "./groups_controller";
import { groupController } from "./group_controller";
import { profileController } from "./profile_controller";

const controllerMap = {
    "profile": profileController,
    "friends": friendsController,
    "groups": groupsController,
    "group": groupController,
};

function bindPageController(pageName, args) {
    const controllerFunc = controllerMap[pageName];
    if (controllerFunc) {
        controllerFunc(args);
    }
}

export { bindPageController };