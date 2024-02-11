export default function() {
    const aElements = document.querySelectorAll("article a[target='_blank']");

    let media = [];

    let imgCounter = 1;

    for (let aElement of aElements) {
        if (aElement.querySelectorAll('img').length > 0) {
            media.push({
                'type': 'image',
                'download': `${String(imgCounter).padStart(2, '0')} - ${aElement.href.substring(aElement.href.lastIndexOf('/')+1)}`,
                'href': aElement.href
            });
            imgCounter++;
        } else if (aElement.download) {
            media.push({
                'type': 'application',
                'download': aElement.download,
                'href': aElement.href
            });
        }
    }

    return media;
};
