import browser from 'webextension-polyfill';

import * as Store from '../common/store.js';
import _catch from '../common/catch.js';

import './popup.css';
import download from './download.js';

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

async function downloadAll() {
    let tabs = await browser.tabs.query({ 
        active: true,
        currentWindow: true
    });

    let originURL = tabs[0].url;

    const data = await Store.get(originURL) ?? {};
    const media = data['media'] ?? [];

    const downloads = media.map((media) => {
        return {
            filename: media.download,
            url: media.href
        }
    });

    await download(
        downloads,
        originURL
    );
}

async function updateBody() {
    let tabs = await browser.tabs.query({ 
        active: true,
        currentWindow: true
    });

    let originURL = tabs[0].url;

    const data = await Store.get(originURL) ?? {};
    const media = data['media'] ?? [];
    
    const downloadAllButton = document.getElementById('download-all-button');

    setDisabled(downloadAllButton, !(media.length > 0));

    const donwloadAllButtonDescription = downloadAllButton.getElementsByClassName('description')[0];
    donwloadAllButtonDescription.textContent = `Total ${media.length} ${media.length == 1 ? 'file' : 'files'}`;
}

const downloadAllButton = document.getElementById('download-all-button');
downloadAllButton.onclick = _catch(async () => {
    const disabled = downloadAllButton.hasAttribute('disabled');

    setDisabled(downloadAllButton, true);

    await downloadAll();

    setDisabled(downloadAllButton, disabled);
});

Store.onChanged.addListener(() => updateBody);
updateBody();
