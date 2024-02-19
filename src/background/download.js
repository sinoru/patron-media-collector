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
export default async function download(downloads, originURL) {
    const _originURL = url(originURL);

    const preparedDownloads = await Promise.all(
        downloads.map(async (download) => {
            if (browser.downloads && browser.downloads.download) {
                return download;
            }

            let downloadURL = new URL(download.url);
            if (downloadURL.host == _originURL.host) {
                return download;
            }

            let response = await fetch(
                download.url,
                {
                    method: 'GET',
                    credentials: 'include',
                    referrerPolicy: 'no-referrer',
                }
            )
            let blob = await response.blob()

            return {
                ...download,
                blob: blob,
            }
        })
    );

    for (let preparedDownload of preparedDownloads) {
        if (browser.downloads && browser.downloads.download) {
            await browser.downloads.download(preparedDownload);
        } else {
            let href = preparedDownload.url;
            if (preparedDownload.blob) {
                href = await dataURLFromBlob(preparedDownload.blob);
            }

            let tabs = await browser.tabs.query({
                active: true,
                url: _originURL.href,
            });

            await browser.tabs.sendMessage(
                tabs[0].id,
                {
                    'download': preparedDownload.filename,
                    href,
                }
            );

            // https://stackoverflow.com/questions/61961488/allow-multiple-file-downloads-in-safari
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                await timeout(50);
            }
        }
    }
}
