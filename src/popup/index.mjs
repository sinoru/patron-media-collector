import Store from '../common/store.mjs';

async function updateBody() {
    let tabs = await browser.tabs.query({ 
        active: true,
        currentWindow: true
    });

    const data = await Store.get(url.toString());
    const media = data[url.toString()]['media'];

    let downloadAllButton = document.createElement('button');
    downloadAllButton.textContent = `Download all media ${media.length}`;
    downloadAllButton.addEventListener('click', () => {
        browser.runtime.sendMessage({'media': media, url: url.toString()});
        window.close();
    });

    document.body.replaceChildren(downloadAllButton);
}

Store.onChanged.addListener(() => updateBody);
updateBody();