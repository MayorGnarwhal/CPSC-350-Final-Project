window.addEventListener('load', function() {
    this.setTimeout(function() {
        const links = document.querySelectorAll(".href-replace");
        console.log(links);

        links.forEach(link => {
            link.setAttribute("href", "http://cpsc.roanoke.edu:3003" + link.getAttribute("href"));
        });

    }, 100); // cannot find better way to make sure that partial_population has loaded
})
