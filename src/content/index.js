import getFanboxMedia from './fanbox.js';
import getPatreonMedia from './patreon.js';

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received request: ", message, sender);

    /** @type {string} */
    const href = message.href;
    /** @type {string} */
    const download = message.download;

    const element = document.createElement("a");
    element.setAttribute('href', href);
    element.setAttribute('download', download);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    sendResponse();
});

async function main() {
    const href = document.location.href;

    let media = null;
    if (/.+:\/\/www\.fanbox\.cc\/@.+\/posts\/.+/.test(href) || /.+:\/\/.+\.fanbox\.cc\/posts\/.+/.test(href)) {
        if (!window.domObserver) {
            window.domObserver = new MutationObserver(main);
            domObserver.observe(document, { childList: true, subtree: true });
        }

        media = getFanboxMedia();
    } else if (/.+:\/\/www\.patreon\.com\/posts\/.+/.test(href)) {
        media = getPatreonMedia();
    }

    await browser.runtime.sendMessage({
        'store': {'media': media}
    });
}

main();
