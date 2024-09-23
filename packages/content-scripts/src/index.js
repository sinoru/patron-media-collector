import browser from 'webextension-polyfill';

import getFanboxMedia from './fanbox.js';
import getPatreonMedia from './patreon.js';
import getSubscribeStarMedia from './subscribe-star.js';

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

function getData() {
    const href = document.location.href;

    let media = null;
    if (/.+:\/\/www\.fanbox\.cc\/@.+\/posts\/.+/.test(href) || /.+:\/\/.+\.fanbox\.cc\/posts\/.+/.test(href)) {
        media = getFanboxMedia();
    } else if (/.+:\/\/www\.patreon\.com\/posts\/.+/.test(href)) {
        media = getPatreonMedia();
    } else if (/.+:\/\/subscribestar\.adult\/posts\/.+/.test(href)) {
        media = getSubscribeStarMedia();
    }

    return {media};
}

function download(download) {
    const { filename, url: _url } = download;
    const url = handleDataURI(_url);

    const element = document.createElement("a");
    element.style.display = 'none';

    element.setAttribute('href', url);
    element.setAttribute('download', filename);

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

browser.runtime.onMessage.addListener((message, _, sendResponse) => {
    const [key, value] = Object.entries(message)[0];

    switch (key) {
        case 'download':
            download(value);
            sendResponse();
        default:
            return false;
    }
});

browser.runtime.onConnect.addListener((port) => {
    switch (port.name) {
        case 'fetch':
            const fetch = () => {
                const data = getData();
                port.postMessage(data);
            };

            const domObserver = new MutationObserver(fetch);
            domObserver.observe(document, { childList: true, subtree: true });
            port.onDisconnect.addListener((port) => {
                if (port.error) {
                    console.error(port.error);
                }

                domObserver.disconnect();
            });

            fetch();
            return;
    }
});
