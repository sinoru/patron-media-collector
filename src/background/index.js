import browser from 'webextension-polyfill';

import * as Store from '../common/store.js';
import _catch from '../common/catch.js';

browser.runtime.onMessage.addListener(_catch((message, sender, sendResponse) => {
    console.log("Received request: ", message, sender);

    const [key, value] = Object.entries(message)[0];

    switch (key) {
        case 'store':
            Store.set(
                sender.url,
                value
            )
            .then(() => {
                sendResponse();
            })
            .catch((reason) => {
                sendResponse(new Error(reason));
            });

            return true;
        default:
            return false;
    }
}));
