export default function() {
    const aElements = document.querySelectorAll('article a[target="_blank"]');

    let media = [];

    let imgCounter = 1;

    for (let aElement of aElements) {
        if (aElement.querySelectorAll('img').length > 0) {
            media.push({
                'type': 'image',
                'filename': `${String(imgCounter).padStart(2, '0')} - ${aElement.href.substring(aElement.href.lastIndexOf('/')+1)}`,
                'url': URL.parse(aElement.href, location.href).toString()
            });
            imgCounter++;
        } else if (aElement.download) {
            media.push({
                'type': 'application',
                'filename': aElement.download,
                'url': URL.parse(aElement.href, location.href).toString()
            });
        }
    }

    return media;
};
