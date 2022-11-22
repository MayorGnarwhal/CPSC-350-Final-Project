import { ajax } from "../ajax";
import { pages } from "./pages";

var links = {
    queryAllLinks : function() {
        return document.querySelectorAll("a:not([listener='true'])");
    },

    handleLinkPress : function(link) {
        link.setAttribute("listener", true);
        link.addEventListener("click", async function(event) {
            event.preventDefault();
            const href = link.getAttribute("href");

            if (link.getAttribute("data-target") === "page") {
                pages.loadPage(href);
            } 
            else {
                ajax.sendRequestAndHandle("POST", href);
            }
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