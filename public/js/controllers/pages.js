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

        this.applyPageSettings(container);

        // Load controllers
        await partials.populateAllPartials();
        await posts.populateAllPosts();
        modals.handleAllModals();
        links.handleAllLinks();
        forms.handleAllForms();
    },

    // not a huge fan of this
    applyPageSettings(container) {
        const settings = container.querySelector("input[name='page-settings']");
        const hideNavigation = (settings !== null && settings.getAttribute("data-hide-navigation"));

        if (hideNavigation) {
            document.querySelector(".nav-bar").setAttribute("hidden", true);
        }
        else {
            document.querySelector(".nav-bar").removeAttribute("hidden");
        }
    },
}

export { pages };