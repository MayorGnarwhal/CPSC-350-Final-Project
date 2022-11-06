fetch("../json/app-data.json").then(response => {
    return response.json();
}).then(data => {
    const links = document.querySelectorAll(".href-replace");
    links.forEach(link => {
        link.setAttribute("href", data.url_root + link.getAttribute("href"));
    });
});
