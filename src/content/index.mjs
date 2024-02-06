import getFanboxMedia from './fanbox.mjs'

browser.runtime.onMessage.addListener(async (request, sender) => {
    console.log("Received request: ", request, sender);

    let download = request.download;
    let href = request.href;

    let link = document.createElement("a");
    link.download = download;
    link.href = href;
    link.style = 'display: none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

function main() {
    const url = new URL(document.location.href);

    let media = null;
    if (/.+\.fanbox\.cc/.test(url.host)) {
        media = getFanboxMedia();
    }

    browser.runtime.sendMessage({
        'media': media,
    });
}

const domObserver = new MutationObserver(main);
domObserver.observe(document, { childList: true, subtree: true });
main();
