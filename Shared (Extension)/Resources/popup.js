async function updateBody() {
    let tabs = await browser.tabs.query({ 
        active: true,
        currentWindow: true
    });

    let url = new URL(tabs[0].url);
    url.protocol = "";
    url.hash = "";
    url.search = "";

    const data = await browser.storage.session.get(url.toString());
    const media = data[url.toString()]['media'];

    let downloadAllButton = document.createElement('button');
    downloadAllButton.textContent = `Download all media ${media.length}`;
    downloadAllButton.addEventListener('click', () => {
        browser.runtime.sendMessage({'media': media, url: url.toString()});
    });

    document.body.replaceChildren(downloadAllButton);
}

browser.storage.onChanged.addListener(() => updateBody);
updateBody();
