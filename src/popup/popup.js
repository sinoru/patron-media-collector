import browser from 'webextension-polyfill';

import './popup.css';
import * as Store from '../common/store.js';

async function updateBody() {
    let tabs = await browser.tabs.query({ 
        active: true,
        currentWindow: true
    });

    let originURL = tabs[0].url;

    const data = await Store.get(originURL);
    if (!data) {
        return;
    }

    const media = data['media'];
    if (!media) {
        return;
    }

    const totalString = `Total ${media.length} ${media.length == 1 ? 'file' : 'files'}`;

    let downloadAllButton = document.createElement('button');
    downloadAllButton.textContent = 'Download All Media';
    downloadAllButton.appendChild(document.createElement('br'));
    downloadAllButton.appendChild(document.createTextNode(`(${totalString})`));
    downloadAllButton.addEventListener('click', () => {
        browser.runtime.sendMessage({'media': media, 'url': originURL});
        window.close();
    });
    downloadAllButton.disabled = media.length == 0;

    document.body.replaceChildren(downloadAllButton);
}

Store.onChanged.addListener(() => updateBody);
updateBody();
