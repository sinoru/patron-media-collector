import browser from 'webextension-polyfill';

function dataURLFromBlob(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

export default async function download(options, originURL) {
    if (browser.downloads && browser.downloads.download) {
        return await browser.downloads.download(options);
    }

    async function download(options) {
        let tabs = await browser.tabs.query({
            currentWindow: true,
            active: true,
        });

        await browser.tabs.sendMessage(
            tabs[0].id,
            {
                'download': options.filename,
                href: options.url,
            }
        );
    }

    let downloadURL = new URL(options.url);
    if (downloadURL.host != originURL.host) {
        let response = await fetch(
            downloadURL.href,
            {
                method: 'GET',
                credentials: 'include',
                referrerPolicy: 'no-referrer',
            }
        )
        let blob = await response.blob()
        let dataURL = await dataURLFromBlob(blob);

        await download({
            ...options,
            url: dataURL
        });
    } else {
        await download(options);
    }
}
