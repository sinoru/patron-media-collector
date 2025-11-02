import browser from 'webextension-polyfill';

export default browser;

export const fetchCurrentTab = async (options) => {
    return (await browser.tabs.query({
        active: true,
        currentWindow: true,
        ...options
    }))[0];
};