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

function getFanboxMedia() {
    const aElements = document.querySelectorAll("article a[target='_blank']");

    let media = [];

    for (let aElement of aElements) {
        if (aElement.querySelectorAll('img').length > 0) {
            media.push({'type': 'image', 'download': aElement.href.substring(aElement.href.lastIndexOf('/')+1), 'href': aElement.href});
        } else if (aElement.download) {
            media.push({'type': 'application', 'download': aElement.download, 'href': aElement.href});
        }
    }

    return media;
}

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
