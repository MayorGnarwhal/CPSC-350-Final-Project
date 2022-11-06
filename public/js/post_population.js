function createPost(postInfo, postPartial, container) {
    const post = document.createElement("div");
    post.innerHTML = postPartial;

    post.querySelector("#title").innerHTML = postInfo.title;
    post.querySelector("#body").innerHTML = postInfo.body;

    container.appendChild(post);
}

async function fetchPostPartial() {
    const response = await fetch("../partials/post.html");
    return await response.text();
}

async function populatePostContainer() {
    const container = document.querySelector("#post-container");
    const postPartial = await fetchPostPartial();

    // TODO: Find way to filter posts
    fetch("../json/example-post-list.json").then(response => {
        return response.json();
    }).then(data => {
        data.posts.forEach(post => {
            createPost(post, postPartial, container);
        });
    });
}

populatePostContainer();