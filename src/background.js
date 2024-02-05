function dataURLFromBlob(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

browser.runtime.onMessage.addListener(async (request, sender) => {
    console.log("Received request: ", request, sender);

    if (/^https?:/.test(sender.url)) {
        let url = new URL(sender.url);
        url.protocol = "";
        url.hash = "";
        url.search = "";

        await browser.storage.session.set({
            [url.toString()]: {
                'media': request.media
            },
        });

        console.log(await browser.storage.session.get());
    } else {
        try {
            let tabID;
            if (!browser.downloads) {
                let tabs = await browser.tabs.query({
                    currentWindow: true,
                    url: request.url
                });

                tabID = tabs[0].id;
            }

            for (const [index, value] of request.media.entries()) {
                const download = `${String(index + 1).padStart(2, '0')} - ${value.download}`;
                const href = value.href;

                if (tabID) {
                    let response = await fetch(href)
                    let blob = await response.blob()
                    let dataURL = await dataURLFromBlob(blob);

                    await browser.tabs.sendMessage(
                        tabID,
                        {
                            download,
                            'href': dataURL,
                        }
                    )
                } else {
                    await browser.downloads.download({
                        filename: download,
                        url: href
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
});
