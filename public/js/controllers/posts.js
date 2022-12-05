import { ajax } from "../ajax";

var posts = {
    fetchPosts : async function(container,user, pageName) {
        const request = {
            filter: user,
            page: pageName
        };
        const response = await ajax.sendRequest("POST", "fetch_posts", request);
        return await response.json();
    },

    populatePost : async function(postInfo, container, pageName) {
        const partialPath = "partials/post_.html";
        const post = await ajax.fetchHtmlAndAppend(partialPath, container);
        if(pageName === "index"){
            post.querySelector("#post-options").style.visibility = "hidden";
            post.querySelector("#algorithm-score").textContent = "Algorithm Score: " + Math.round(postInfo.algorithm_score);
        }
        post.querySelector("#name").textContent = postInfo.first_name + " " + postInfo.last_name;
        post.querySelector("#username").textContent = postInfo.username;
        post.querySelector("#likes-count").textContent = postInfo.reaction_score;
        post.querySelector("#title").textContent = postInfo.post_title;
        post.querySelector("#comment").textContent = postInfo.post_text;
        post.querySelector("#timestamp").textContent = new Date(postInfo.post_created_time).toLocaleString();
        post.querySelector("#post-profile-image").src = await ajax.fetchImage(postInfo.profile_picture);
        post.querySelector("#post-image").src = await ajax.fetchImage(postInfo.post_picture);
    },

    populateAllPosts : async function(pageName, args) {
        var user = await ajax.fetchUser(args.user_id);
        const container = document.querySelector("#post-container"); // assumes only one container per page
        if (container) {
            this.fetchPosts(container, user.user_id, pageName).then(postInfo => {
                if (!postInfo.error) {
                    postInfo.forEach(post => {
                        this.populatePost(post, container, pageName);
                    });
                }
            });
        }
    },
};

export { posts };