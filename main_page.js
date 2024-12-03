// main.js

import {loadHeader, initializeHeader} from "/blocks/header/header.js";
document.addEventListener('DOMContentLoaded', async () => {

    await loadHeader();
    initializeHeader();

});