var posts = {
    fetchPosts : async function(ajax) {
        // How else to get posts? Also filtering!
        // This info might need to be sent to client from server on page load
        return await ajax.fetchJsonAndParse("../json/example-post-list.json");
    },

    populatePost : async function(post, container, ajax, partials) {
        const partialPath = "../partials/post.html";
        await ajax.fetchHtmlAndAppend(partialPath, container);

        container.querySelector("#title").innerHTML = post.title;
        container.querySelector("#body").innerHTML = post.body;
    },

    populateAllPosts : async function(ajax, partials) {
        const container = document.querySelector("#post-container"); // assumes only one container per page

        if (!container) {
            return;
        }

        posts.fetchPosts(ajax).then(postInfo => {
            postInfo.posts.forEach(post => {
                posts.populatePost(post, container, ajax, partials);
            });
        })
    },
}

export { posts };