// -- Insert into div
const partialPath = "../partials/navigation.html";

async function fetchHtmlAsText(url) {
    const response = await fetch(url);
    return await response.text();
}

async function insertFileIntoDiv(div, filePath) {
    div.innerHTML = await fetchHtmlAsText(filePath);
}

const navBarDiv = document.querySelector(".nav-bar");
if (!navBarDiv) {
    console.log("Navigation bar not found");
} 
else {
    insertFileIntoDiv(navBarDiv, partialPath).then(function() {
        // Handle links
        const links = document.querySelectorAll(".nav-bar a");
        
        links.forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();
                console.log("click", link.textContent);
            });
        });
    });
}