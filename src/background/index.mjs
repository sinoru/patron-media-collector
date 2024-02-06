import * as Store from '../common/store.mjs';

function dataURLFromBlob(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

function timeout(delay) {
    return new Promise((resolve, reject) => {
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
        let downloads = request.media.map((x, i) => {
            return {
                download: `${String(i + 1).padStart(2, '0')} - ${x.download}`,
                href: x.href,
            }
        });

        if (browser.download) {
            for (let download of downloads) {
                await browser.downloads.download({
                    filename: download.download,
                    url: download.href
                });
            }
        } else {
            let preparedDownloads = await Promise.all(
                downloads.map(async (download) => {
                    let downloadURL = new URL(download.href);
                    let originURL = new URL(request.url);

                    if (downloadURL.host != originURL.host) {
                        let response = await fetch(
                            download.href,
                            {
                                method: 'GET',
                                credentials: 'include',
                                referrerPolicy: 'no-referrer',
                            }
                        )
                        let blob = await response.blob()
                        let dataURL = await dataURLFromBlob(blob);
    
                        return {
                            'download': download.download,
                            href: dataURL,
                        };
                    } else {
                        return {
                            'download': download.download,
                            href: download.href,
                        };
                    }
                })
            );

            for (let preparedDownload of preparedDownloads) {
                let tabs = await browser.tabs.query({
                    currentWindow: true,
                    active: true,
                });
    
                await browser.tabs.sendMessage(
                    tabs[0].id,
                    preparedDownload
                );

                await timeout(100);
            }
        }
    }
});
