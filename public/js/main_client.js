import { partials } from "./controllers/partials.js";
import { pages } from "./controllers/pages.js"

await partials.populatePartial(document.querySelector("#nav-bar"));
await pages.loadPage("edit_post");