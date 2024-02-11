import browser from 'webextension-polyfill';

import * as Store from '../common/store.js';
import download from './download.js';

function timeout(delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

browser.runtime.onMessage.addListener(async (request, sender) => {
    console.log("Received request: ", request, sender);

    if (/^https?:/.test(sender.url)) {
        await Store.set(
            sender.url,
            {
                'media': request.media
            }
        )
    } else {
        let media = request.media;

        for (let mediaElement of media) {
            await download(
                {
                    filename: mediaElement.download,
                    url: mediaElement.href
                },
                new URL(request.url)
            );

            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                await timeout(100);
            }
        }
    }
});
