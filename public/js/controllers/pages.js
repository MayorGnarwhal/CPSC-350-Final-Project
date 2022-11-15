import { links } from "./links";
import { modals } from "./modals";
import { partials } from "./partials";
import { posts } from "./posts";

var page_controller = {
    loadPage : async function(pageName) {
        // TODO: Fix this being called expoentially per navigation
        console.log("LOAD PAGE: " + pageName);
        // Populate body with page contents
        const container = document.body.querySelector("#content");
        const pagePath = `views/${pageName}.html`;
        await partials.populatePartialByPath(container, pagePath);

        // Load controllers
        await partials.populateAllPartials();
        await posts.populateAllPosts();
        modals.handleAllModalButtons();
        links.handleAllLinks();
    },
}

export { page_controller };