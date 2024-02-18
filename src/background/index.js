import browser from 'webextension-polyfill';

import * as Store from '../common/store.js';
import _catch from '../common/catch.js';
import download from './download.js';

function timeout(delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

browser.runtime.onMessage.addListener(_catch((message, sender, sendResponse) => {
    console.log("Received request: ", message, sender);

    const [key, value] = Object.entries(request)[0];

    switch (key) {
        case 'store':
            return _catch(async () => {
                await Store.set(
                    sender.url,
                    value
                )
            })();
        case 'download':
            return _catch(async () => {
                const media = value.media;

                for (let mediaElement of media) {
                    await download(
                        {
                            filename: mediaElement.download,
                            url: mediaElement.href
                        },
                        new URL(value.url)
                    );
        
                    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                        await timeout(100);
                    }
                }
            })();
        default:
            return false;
    }
}));
