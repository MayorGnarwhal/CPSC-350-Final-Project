/*
    Finds all items with data-toggle="partial" and fills innerHTML
    with ../partials/[data-target]
*/

async function fetchHtmlAsText(url) {
    const response = await fetch(url);
    return await response.text();
}

async function insertFileIntoContainer(container, filePath) {
    container.innerHTML = await fetchHtmlAsText(filePath);
}


const containers = document.querySelectorAll("[data-toggle=partial]");

containers.forEach(container => {
    const partialPath = "../partials/" + container.getAttribute("data-target");
    insertFileIntoContainer(container, partialPath);
});