/** @var {typeof import("webextension-polyfill")} browser */

import getFanboxMedia from './fanbox.js';
import getPatreonMedia from './patreon.js';

/**
 * @param {string} uriString
 * 
 * @returns {string}
 */
const handleDataURI = (uriString) => {
    const dataURIMatch = uriString.match(/^data:(?<mime>.*);base64,(?<data>.*)$/);

    if (dataURIMatch) {
        const mime = dataURIMatch.groups.mime;
        const base64 = dataURIMatch.groups.data;

        const byteString = atob(base64);

        const arrayBuffer = new ArrayBuffer(byteString.length);
        const array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], {type: mime});

        return URL.createObjectURL(blob);
    } else {
        return uriString
    }
}

async function fetch() {
    const href = document.location.href;

    let media = null;
    if (/.+:\/\/www\.fanbox\.cc\/@.+\/posts\/.+/.test(href) || /.+:\/\/.+\.fanbox\.cc\/posts\/.+/.test(href)) {
        media = getFanboxMedia();
    } else if (/.+:\/\/www\.patreon\.com\/posts\/.+/.test(href)) {
        media = getPatreonMedia();
    }

    await browser.runtime.sendMessage({
        'data': {'media': media}
    });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received request: ", message, sender);

    const [key, value] = Object.entries(message)[0];

    switch (key) {
        case 'download':
            /** @type {string} */
            const href = handleDataURI(value.href);
            /** @type {string} */
            const download = value.download;

            const element = document.createElement("a");
            element.setAttribute('href', href);
            element.setAttribute('download', download);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            return;
        case 'fetch':
            fetch()
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
});
