import { partials } from "./controllers/partials.js";
import { ajax } from "./ajax.js";

await partials.populatePartial(document.querySelector("#nav-bar"));
await ajax.initialRequest();
console.log(document.cookie);