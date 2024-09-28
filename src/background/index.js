import _catch from '../common/catch.js';
import download from '../common/download.js';

browser.runtime.onMessage.addListener(_catch((message, sender) => {
    console.log("Received request: ", message, sender);

    const [key, value] = Object.entries(message)[0];

    switch (key) {
        case 'download':
            const downloads = value.downloads;
            const originURL = value.originURL;
            
            return download(downloads, originURL)
                .catch((e) => {
                    console.error(e);
                    throw e
                });
        default:
            return false;
    }
}));
