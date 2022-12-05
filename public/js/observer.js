const observations = {};

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            for (const [key, info] of Object.entries(observations)) {
                if (node[key] === info.value) {
                    info.callback(node);
                }
                else if (node.querySelector && node.querySelector(info.value)) {
                    info.callback(node.querySelector(info.value));
                }
            }
        });
    });
});
observer.observe(document.querySelector("#content"), {subtree: true, childList: true});

function addMutationObserver(observeKey, observeValue, callback) {
    observations[observeKey] = {
        value: observeValue,
        callback: callback,
    };
}

export { addMutationObserver };