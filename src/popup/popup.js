import browser from 'webextension-polyfill';

import './popup.css';
import * as Store from '../common/store.js';

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

async function updateBody() {
    let tabs = await browser.tabs.query({ 
        active: true,
        currentWindow: true
    });

    let originURL = tabs[0].url;

    const data = await Store.get(originURL) ?? {};
    const media = data['media'] ?? [];
    
    const downloadAllButton = document.getElementById('download-all-button');
    if (!downloadAllButton) {
        return;
    }

    setDisabled(downloadAllButton, !(media.length > 0));
    downloadAllButton.onclick = async () => {
        const disabled = downloadAllButton.hasAttribute('disabled');

        setDisabled(downloadAllButton, true);
        await browser.runtime.sendMessage({
            'download': {'media': media, 'url': originURL}
        });
        setDisabled(downloadAllButton, disabled);
    };

    const donwloadAllButtonDescription = downloadAllButton.getElementsByClassName('description')[0];
    donwloadAllButtonDescription.textContent = `Total ${media.length} ${media.length == 1 ? 'file' : 'files'}`;
}

Store.onChanged.addListener(() => updateBody);
updateBody();
