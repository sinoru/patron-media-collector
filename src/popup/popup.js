import browser from 'webextension-polyfill';

import _catch from '../common/catch.js';

import './popup.css';
import { prepareDownloadForBackground } from '../common/download.js';

/**
 * 
 * @param {HTMLElement} element 
 * @param {boolean} disabled 
 */
const setDisabled = (element, disabled) => {
    if (disabled) {
        element.setAttribute('disabled', '');
    } else {
        element.removeAttribute('disabled');
    }
}

async function downloadAll(media, originURL) {
    const downloads = media.map((media) => {
        return {
            filename: media.download,
            url: media.href
        }
    });

    const preparedDownloads = await prepareDownloadForBackground(downloads, originURL);

    await browser.runtime.sendMessage({
        'download': preparedDownloads
    });
}

async function updateBody(media, senderURL) {
    const downloadAllButton = document.getElementById('download-all-button');

    setDisabled(downloadAllButton, !(media.length > 0));
    downloadAllButton.onclick = _catch(async () => {
        const disabled = downloadAllButton.hasAttribute('disabled');
    
        setDisabled(downloadAllButton, true);
    
        await downloadAll(media, senderURL);
    
        setDisabled(downloadAllButton, disabled);
    });

    const donwloadAllButtonDescription = downloadAllButton.getElementsByClassName('description')[0];
    donwloadAllButtonDescription.textContent = `Total ${media.length} ${media.length == 1 ? 'file' : 'files'}`;
}

browser.runtime.onMessage.addListener(_catch((message, sender, sendResponse) => {
    console.log("Received request: ", message, sender);

    const [key, value] = Object.entries(message)[0];

    switch (key) {
        case 'data':
            updateBody(value.media, value.senderURL)
                .then(() => {
                    sendResponse();
                })
                .catch((reason) => {
                    sendResponse(new Error(reason));
                });

            return true;
        default:
            return false;
    }
}));

_catch(async () => {
    const currentTab = (await browser.tabs.query({
        active: true,
        currentWindow: true
    }))[0];

    await browser.tabs.sendMessage(
        currentTab.id,
        {
            'fetch': null
        }
    );
})();
