import { ajax } from "../ajax";
import { forms } from "./forms";
import { links } from "./links";
import { modals } from "./modals";
import { partials } from "./partials";
import { posts } from "./posts";

var pages = {
    loadPage : async function(pageName) {
        // Populate body with page contents
        const container = document.body.querySelector("#content");
        const pageContent = await ajax.fetchPage(pageName);
        container.innerHTML = pageContent;

        // Load controllers
        await partials.populateAllPartials();
        await posts.populateAllPosts();
        modals.handleAllModalButtons();
        links.handleAllLinks();
        forms.handleAllForms();
    },
}

export { pages };