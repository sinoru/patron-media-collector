import browser from 'webextension-polyfill';

import './popup.css';
import * as Store from '../common/store.js';

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

    downloadAllButton.disabled = !(media.length > 0);
    downloadAllButton.onclick = () => {
        browser.runtime.sendMessage({'media': media, 'url': originURL});
        window.close();
    };

    const donwloadAllButtonDescription = downloadAllButton.getElementsByClassName('description')[0];
    donwloadAllButtonDescription.textContent = `Total ${media.length} ${media.length == 1 ? 'file' : 'files'}`;
}

Store.onChanged.addListener(() => updateBody);
updateBody();
