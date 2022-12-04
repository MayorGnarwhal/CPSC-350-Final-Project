import { friendsController } from "./friends_controller";
import { groupsController } from "./group_controller";
import { profileController } from "./profile_controller";

const controllerMap = {
    "profile": profileController,
    "friends": friendsController,
    "groups": groupsController
};

function bindPageController(pageName, args) {
    const controllerFunc = controllerMap[pageName];
    if (controllerFunc) {
        controllerFunc(args);
    }
}

export { bindPageController };