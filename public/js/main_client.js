import { ajax } from "../js/ajax.js";
import { modal } from "../js/helpers/modal.js";
import { partials } from "./helpers/partials.js"
import { posts } from "./helpers/posts.js"

// Is there a way to avoid passing helper classes to other helper class functions?
// Possible to implicitly define class from this parent script?
// Want to avoid declaring in each controller, which creates duplicates
//      Unless theres some fancy pointer stuff in JS I dont know about

partials.populateAllPartials(ajax);
posts.populateAllPosts(ajax, partials);
modal.handleAllModalButtons();