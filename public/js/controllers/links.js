import { partials } from "./partials";
import { page_controller } from "./pages";

var links = {
    queryAllLinks : function() {
        return document.querySelectorAll(".href-replace");
    },

    handleLinkPress : function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            page_controller.loadPage(link.getAttribute("href"));
        });
    },

    handleAllLinks : function() {
        const links = this.queryAllLinks();
        links.forEach(link => {
            this.handleLinkPress(link);
        });
    },
};

export { links };