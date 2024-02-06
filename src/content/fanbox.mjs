export default function() {
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