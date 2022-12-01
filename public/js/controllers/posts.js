import { ajax } from "../ajax";

var posts = {
    fetchPosts : async function(container) {
        const filter = container.getAttribute("data-filter");

        const request = {
            filter: filter
        };

        const response = await ajax.sendRequest("POST", "fetch_posts", request);
        return await response.json();
    },

    populatePost : async function(postInfo, container) {
        const partialPath = "partials/post.html";
        const post = await ajax.fetchHtmlAndAppend(partialPath, container);

        post.querySelector("#title").innerHTML = postInfo.post_title;
        post.querySelector("#comment").innerHTML = postInfo.post_text;
        post.querySelector("#timestamp").innerHTML = new Date(postInfo.post_created_time).toLocaleString();
    },

    populateAllPosts : async function() {
        const container = document.querySelector("#post-container"); // assumes only one container per page
        if (container) {
            this.fetchPosts(container).then(postInfo => {
                if (!postInfo.error) {
                    postInfo.forEach(post => {
                        this.populatePost(post, container);
                    });
                }
            });
        }
    },
};

export { posts };