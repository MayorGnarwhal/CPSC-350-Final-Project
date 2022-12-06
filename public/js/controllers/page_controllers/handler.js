import { adminController } from "./admin_controller";
import { friendsController } from "./friends_controller";
import { groupsController } from "./groups_controller";
import { groupController } from "./group_controller";
import { postController } from "./post_controller";
import { profileController } from "./profile_controller";

const controllerMap = {
    "profile": profileController,
    "friends": friendsController,
    "groups": groupsController,
    "group": groupController,
    "edit_post": postController,
    "admin": adminController,
};

function bindPageController(pageName, args) {
    const controllerFunc = controllerMap[pageName];
    if (controllerFunc) {
        controllerFunc(args);
    }
}

export { bindPageController };