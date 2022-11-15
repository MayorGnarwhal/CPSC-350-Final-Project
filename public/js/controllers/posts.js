import { ajax } from "../ajax";

var posts = {
    fetchPosts : async function() {
        // How else to get posts? Also filtering!
        // This info might need to be sent to client from server on page load
        return await ajax.fetchJsonAndParse("json/example-post-list.json");
    },

    populatePost : async function(postInfo, container) {
        const partialPath = "partials/post.html";
        const post = await ajax.fetchHtmlAndAppend(partialPath, container);

        post.querySelector("#title").innerHTML = postInfo.title;
        post.querySelector("#body").innerHTML = postInfo.body;
    },

    populateAllPosts : async function() {
        const container = document.querySelector("#post-container"); // assumes only one container per page

        if (!container) {
            return;
        }

        this.fetchPosts().then(postInfo => {
            postInfo.posts.forEach(post => {
                this.populatePost(post, container, ajax);
            });
        });
    },
}

export { posts };