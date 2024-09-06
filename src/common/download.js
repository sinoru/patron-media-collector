import browser from 'webextension-polyfill';
import url from './url.js';
import { dataURLFromBlob, timeout } from './utils.js';
import { fetchCurrentTab } from './browser.js';

const MAX_FILE_SIZE = 38_797_312; // ((4 * n / 3) + 3) & ~3 < 52_428_800

/**
 * @typedef {Object} Download
 * @property {string} filename
 * @property {string} url
 * @property {number?} estimatedFileSize
 */

const fetchEstimatedFileSize = async (url) => {
    const response = await fetch(
        url,
        {
            method: 'HEAD',
            mode: 'cors',
            credentials: 'include',
            referrerPolicy: 'no-referrer',
        }
    );

    return Number(response.headers.get('Content-Length'));
};

const fetchBlob = async (url) => {
    const response = await fetch(
        url,
        {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            referrerPolicy: 'no-referrer',
        }
    );

    return await response.blob();
};

/**
 * @param {Download[]} downloads
 * @param {string} originURL
 */
export async function prepareDownloadForBackground(downloads, originURL) {
    if (browser.downloads && browser.downloads.download) {
        return {
            downloads,
            originURL,
        }
    }

    const _originURL = url(originURL);

    const preparedDownloads = await Promise.all(
        downloads.map(async (download) => {
            try {
                const downloadURL = new URL(download.url);

                if (downloadURL.host == _originURL.host) {
                    return download
                }

                const estimatedFileSize = await fetchEstimatedFileSize(download.url);

                if (estimatedFileSize > MAX_FILE_SIZE) {
                    return download;
                }

                const blob = await fetchBlob(download.url);

                return {
                    ...download,
                    'blobObjectURL': URL.createObjectURL(blob),
                }
            } catch (error) {
                console.error(error);

                return download;
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

    const currentTab = await fetchCurrentTab(_originURL.href);

    for (const preparedDownload of preparedDownloads) {
        try {
            if (browser.downloads && browser.downloads.download) {
                await browser.downloads.download(preparedDownload);
            } else {
                let url = new URL(preparedDownload.url)

                if (
                    (url.host == _originURL.host) ||
                    (/(data|blob):/i.test(url.protocol))
                ) {
                    await browser.tabs.sendMessage(
                        currentTab.id,
                        {
                            'download': preparedDownload
                        }
                    );

                    // https://stackoverflow.com/questions/61961488/allow-multiple-file-downloads-in-safari
                    await timeout(50);
                } else {
                    await browser.tabs.create({
                        active: false,
                        url: url.href
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}
