import { pages } from "./pages";

var links = {
    queryAllLinks : function() {
        return document.querySelectorAll(".href-replace:not([listener='true'])");
    },

    handleLinkPress : function(link) {
        link.setAttribute("listener", true);
        link.addEventListener("click", function(event) {
            event.preventDefault();
            pages.loadPage(link.getAttribute("href"));
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