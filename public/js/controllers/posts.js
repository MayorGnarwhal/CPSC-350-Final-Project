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
        // console.log(postInfo);
        const partialPath = "partials/post.html";
        const post = await ajax.fetchHtmlAndAppend(partialPath, container);

        const likesCount = post.querySelector("#likes-count");
        likesCount.textContent = postInfo.reaction_score
        if(pageName === "index"){
            likesCount.textContent += ", self: " + postInfo.user_reaction_score;
            post.querySelector("#post-options").classList.add("hidden");
            post.querySelector("#algorithm-score").textContent = "Algorithm Score: " + Math.round(postInfo.algorithm_score);
        }
        post.querySelector("#name").textContent = postInfo.first_name + " " + postInfo.last_name;
        post.querySelector("#username").textContent = "@" + postInfo.username;
        post.querySelector("#title").textContent = postInfo.post_title;
        post.querySelector("#comment").textContent = postInfo.post_text;
        post.querySelector("#timestamp").textContent = new Date(postInfo.post_created_time).toLocaleString();
        post.querySelector("#post-profile-image").src = await ajax.fetchImage(postInfo.profile_picture);
        post.querySelector("#post-image").src = await ajax.fetchImage(postInfo.post_picture);

        post.querySelectorAll("input[name='post_id']").forEach(input => {
            input.value = postInfo.post_id;
        });

        post.querySelector("#upvote").addEventListener("click", function() {
            if(postInfo.user_reaction_score === 0){ 
            likesCount.textContent = parseInt(likesCount.textContent) + 1 + ", self: " + "1";
            }
            else if(postInfo.user_reaction_score === -1){ 
                likesCount.textContent = parseInt(likesCount.textContent) + 2 + ", self: " + "1";
            }
        });
        post.querySelector("#downvote").addEventListener("click", function() {
            if(postInfo.user_reaction_score === 0){ 
                likesCount.textContent = parseInt(likesCount.textContent) - 1 + ", self: " + "-1";
            }
            else if(postInfo.user_reaction_score === 1){ 
                likesCount.textContent = parseInt(likesCount.textContent) - 2 + ", self: " + "-1";
            }
        });

        const postVisibility = post.querySelector("#post-visibility");
        if (!postInfo.is_visible) {
            postVisibility.querySelector("input").value = "true";
            postVisibility.querySelector("button").innerHTML = `<span class="fas fa-eye"></span> Show`
        }

        post.setAttribute("data-filter", postInfo.first_name + " " + postInfo.last_name + " " + postInfo.post_title + " " + postInfo.post_text);
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