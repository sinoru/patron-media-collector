import browser from 'webextension-polyfill';

import url from './url.js';

const store = browser.storage.session;

/**
 * @param {string} urlString
 * 
 * @returns {Promise<{}>}
 */
export async function get(urlString) {
    let key = url(urlString).toString();

    return (await store.get(key))[key];
}

/**
 * @param {string} urlString
 * @param {any} value
 */
export async function set(urlString, value) {
    return await store.set({
        [url(urlString)]: value
    });
}

export const onChanged = browser.storage.onChanged;
