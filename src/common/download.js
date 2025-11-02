import url from './url.js';
import { dataURLFromBlob, timeout } from './utils.js';
import { default as browser, fetchCurrentTab } from './browser.js';
import mime from 'mime-types';

const MAX_FILE_SIZE = 38_797_312; // ((4 * n / 3) + 3) & ~3 < 52_428_800

/**
 * @typedef {Object} Download
 * @property {string} filename
 * @property {string} url
 * @property {string?} type
 */

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
export default async function download(downloads, originURL) {
    const _originURL = url(originURL);

    const preparedDownloads = await Promise.all(
        downloads.map(async (_download) => {
            const download = {
                filename: _download.filename,
                url: URL.parse(_download.url),
            }

            /** @type {Response|null} */
            let response;
            try {
                response = await fetch(
                    download.url,
                    {
                        method: 'HEAD',
                        mode: 'cors',
                        credentials: 'include',
                        referrerPolicy: 'no-referrer',
                    }
                );

                if (response.ok == false) {
                    throw new Error(`Response is not OK! status: ${response.status}`);
                }
            } catch (error) {
                console.error(error);
                response = null;
            }

            try {
                const contentType = response.headers.get('Content-Type');
                const urlFilename = download.url.pathname.split('/').pop();
                const estimatedFilenameType = mime.lookup(urlFilename);
                if (estimatedFilenameType && (estimatedFilenameType != mime.lookup(download.filename))) {
                    const urlDownloadExtension = urlFilename.split('.').pop();
                    download.filename = `${download.filename}.${urlDownloadExtension}`
                }

                const estimatedExtension = mime.extension(contentType);
                if (estimatedExtension && mime.extension(mime.lookup(download.filename)) != estimatedExtension) {
                    download.filename = `${download.filename}.${estimatedExtension}`
                }

                if (
                    (browser.downloads && browser.downloads.download) ||
                    download.url.host == _originURL.host
                ) {
                    return download;
                }

                const estimatedFileSize = Number(response.headers.get('Content-Length'));
                if (estimatedFileSize > MAX_FILE_SIZE) {
                    return download;
                }

                const blob = await fetchBlob(download.url);
                const dataURL = await dataURLFromBlob(blob);

                return {
                    ...download,
                    url: new URL(dataURL),
                }
            } catch (error) {
                console.error(error);

                return download;
            }
        })
    );

    const currentTab = await fetchCurrentTab({url: _originURL.href});

    for (const preparedDownload of preparedDownloads) {
        try {
            if (browser.downloads && browser.downloads.download) {
                await browser.downloads.download({
                    filename: preparedDownload.filename,
                    saveAs: false,
                    url: preparedDownload.url.href,
                });
            } else {
                if (
                    (preparedDownload.url.host == _originURL.host) ||
                    (/(data|blob):/i.test(preparedDownload.url.protocol))
                ) {
                    await browser.tabs.sendMessage(
                        currentTab.id,
                        {
                            'download': preparedDownload,
                        }
                    );

                    // https://stackoverflow.com/questions/61961488/allow-multiple-file-downloads-in-safari
                    await timeout(50);
                } else {
                    await browser.tabs.create({
                        active: false,
                        url: preparedDownload.url.href
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}
