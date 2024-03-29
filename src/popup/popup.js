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

    const _media = media ?? [];

    setDisabled(downloadAllButton, !(_media.length > 0));
    downloadAllButton.onclick = _catch(async () => {
        const disabled = downloadAllButton.hasAttribute('disabled');

        setDisabled(downloadAllButton, true);

        await downloadAll(_media, senderURL);

        setDisabled(downloadAllButton, disabled);
    });

    const donwloadAllButtonDescription = downloadAllButton.getElementsByClassName('description')[0];
    donwloadAllButtonDescription.textContent = `Total ${_media.length} ${_media.length == 1 ? 'file' : 'files'}`;
}

_catch(async () => {
    updateBody();

    const currentTab = (await browser.tabs.query({
        active: true,
        currentWindow: true
    }))[0];

    let fetchPort = browser.tabs.connect(currentTab.id, { name: 'fetch' });
    fetchPort.onDisconnect.addListener((port) => {
        if (port.error) {
            console.error(port.error);
        }
    });
    fetchPort.onMessage.addListener((message) => {
        updateBody(message.media, currentTab.url);
    });
})();
