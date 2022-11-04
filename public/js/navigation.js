const links = document.querySelectorAll("li>a");

links.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        console.log("click", link.textContent);
    });
});