import browser from 'webextension-polyfill';

import url from '../common/url.js';

/**
 * @param {Blob} blob
 * 
 * @returns {Promise<string, DOMException>}
 */
const dataURLFromBlob = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

/**
 * @param {number} delay
 * 
 * @returns {Promise<void>}
 */
const timeout = (delay) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

/**
 * @typedef {Object} Download
 * @property {string} filename 
 * @property {string} url
 */

/**
 * @param {Download[]} downloads
 * @param {string} originURL
 */
export async function prepareDownloadForBackground(downloads, originURL) {
    const _originURL = url(originURL);

    const preparedDownloads = await Promise.all(
        downloads.map(async (download) => {
            if (browser.downloads && browser.downloads.download) {
                return download;
            }

            const downloadURL = new URL(download.url);
            if (downloadURL.host == _originURL.host) {
                return download;
            }

            const response = await fetch(
                download.url,
                {
                    method: 'GET',
                    credentials: 'include',
                    mode: 'cors',
                    referrerPolicy: 'no-referrer',
                }
            );
            const blob = await response.blob();

            return {
                ...download,
                'blobObjectURL': URL.createObjectURL(blob),
            }
        })
    );

    return {
        'downloads': preparedDownloads,
        originURL,
    }
}

/**
 * @param {Download[]} downloads
 * @param {string} originURL
 */
export default async function download(downloads, originURL) {
    const _originURL = url(originURL);

    const preparedDownloads = await Promise.all(
        downloads.map(async (download) => {
            const {blobObjectURL, ..._download} = download;
            
            if (blobObjectURL) {
                const response = await fetch(blobObjectURL);
                const blob = await response.blob();
                const dataURL = await dataURLFromBlob(blob);

                return {
                    ..._download,
                    url: dataURL,
                };
            } else {
                return _download;
            }
        })
    );

    const currentTab = (await browser.tabs.query({
        active: true,
        currentWindow: true,
        url: _originURL.href,
    }))[0];

    for (const preparedDownload of preparedDownloads) {
        if (browser.downloads && browser.downloads.download) {
            await browser.downloads.download(preparedDownload);
        } else {
            await browser.tabs.sendMessage(
                currentTab.id,
                {
                    'download': {
                        'download': preparedDownload.filename,
                        'href': preparedDownload.url
                    }
                }
            )

            // https://stackoverflow.com/questions/61961488/allow-multiple-file-downloads-in-safari
            await timeout(50);
        }
    }
}
