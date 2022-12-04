import { friendsController } from "./friends_controller";
import { profileController } from "./profile_controller";

const controllerMap = {
    "profile": profileController,
    "friends": friendsController,
};

function bindPageController(pageName) {
    const controllerFunc = controllerMap[pageName];
    if (controllerFunc) {
        controllerFunc();
    }
}

export { bindPageController } ;