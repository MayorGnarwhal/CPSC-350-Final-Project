/*
    Define routes (method and URI) and handle routing functions and middleware

    Each middleware is a psuedo-class with two attributes:
        args (key, value pair object)
        func (routing func)
    middleware.args is used to easily validate that all required args exist
*/

// Middleware
const { force_login } = require("../middleware/force_login");
const { force_admin } = require("../middleware/force_admin");

// Routing functions
const { fetchPage } = require("../controllers/fetch_page");
const { logout } = require("../controllers/logout");
const { signup } = require("../controllers/signup");
const { login } = require("../controllers/login");
const { fetchPosts, storePost, postReaction, deletePost, hidePost, navigateEditPost, updatePost } = require("../controllers/post_methods");
const { fetchUser, fetchAllUsers, updateUser, viewProfile } = require("../controllers/user_methods");
const { init } = require("../controllers/initial_request");
const { fetchImage } = require("../controllers/fetch_image");
const { typeahead } = require("../controllers/typeahead_results");
const { fetchFriends, friendRequest, acceptFriend, blockFriend } = require("../controllers/friend_methods");
const { createGroup, fetchGroups, updateGroup, deleteGroup, fetchGroupMembers, viewGroup, addToGroup, removeFromGroup } = require("../controllers/group_methods");
const { acceptUser, rejectUser } = require("../controllers/admin_methods");


// Routing class
class Routing {
    constructor(routing, middleware = null) {
        this.routing = routing;
        this.middleware = middleware;
        this.args = routing.args || {};
    }

    async validateRequest(...args) {
        if (this.middleware === null) { // no middleware, allow request
            return [true, undefined];
        }
        return await this.middleware(...args); // return middleware success
    }

    routeRequest(...args) {
        this.routing.func(...args);
    }
}

// Defined routes
const routes = {
    "GET": {
    },
    "POST": {
        "/init": new Routing(init, null),
        "/login": new Routing(login, null),
        "/logout": new Routing(logout, force_login),
        "/signup": new Routing(signup, null),
        "/fetch_page": new Routing(fetchPage, null),
        "/fetch_posts": new Routing(fetchPosts, force_login),
        "/fetch_user": new Routing(fetchUser, force_login),
        "/fetch_users": new Routing(fetchAllUsers, force_login),
        "/fetch_image": new Routing(fetchImage, null),
        "/typeahead_results": new Routing(typeahead, force_login),
        "/fetch_friends": new Routing(fetchFriends, force_login),
        "/view_profile": new Routing(viewProfile, force_login),
        "/fetch_groups": new Routing(fetchGroups, force_login),
        "/update_group": new Routing(updateGroup, force_login),
        "/fetch_group_members": new Routing(fetchGroupMembers, force_login),
        "/view_group": new Routing(viewGroup, force_login),
        "/navigate_edit_post": new Routing(navigateEditPost, force_login),
    },
    "PUT": {
        "/store_post": new Routing(storePost, force_login),
        "/update_post": new Routing(updatePost, force_login),
        "/update_user": new Routing(updateUser, force_login),
        "/friend_request": new Routing(friendRequest, force_login),
        "/accept_friend": new Routing(acceptFriend, force_login),
        "/create_group": new Routing(createGroup, force_login),
        "/add_group_member": new Routing(addToGroup, force_login),
        "/post_reaction": new Routing(postReaction, force_login),
        "/hide_post": new Routing(hidePost, force_login),
        "/accept_user": new Routing(acceptUser, force_admin),
    },
    "DELETE": {
        "/remove_friend": new Routing(blockFriend, force_login),
        "/delete_group": new Routing(deleteGroup, force_login),
        "/remove_group_member": new Routing(removeFromGroup, force_login),
        "/delete_post": new Routing(deletePost, force_login),
        "/reject_user": new Routing(rejectUser, force_admin),
    },
};

module.exports = { routes };