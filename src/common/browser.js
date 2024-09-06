import browser from 'webextension-polyfill';


export const fetchCurrentTab = async (url) => {
    return (await browser.tabs.query({
        active: true,
        currentWindow: true,
        url: url,
    }))[0];
};