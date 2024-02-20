import 'webextension-polyfill';
/** @var {typeof import("webextension-polyfill")} browser */

import _catch from '../common/catch.js';
import download from '../common/download.js';

browser.runtime.onMessage.addListener(_catch((message, sender, sendResponse) => {
    console.log("Received request: ", message, sender);

    const [key, value] = Object.entries(message)[0];

    switch (key) {
        case 'download':
            const downloads = value.downloads;
            const originURL = value.originURL;
            
            download(downloads, originURL)
                .then(() => {
                    sendResponse();
                })
                .catch((reason) => {
                    sendResponse(new Error(reason));
                });

            return true;
        case 'data':
            browser.runtime.sendMessage({
                'data': {
                    ...value,
                    senderURL : sender.url
                }
            })
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
