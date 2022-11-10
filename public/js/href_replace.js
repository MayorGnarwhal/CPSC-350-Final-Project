const links = document.querySelectorAll(".href-replace");
links.forEach(link => {
    link.setAttribute("href", env.host + link.getAttribute("href"));
});