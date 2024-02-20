import browser from 'webextension-polyfill';

/**
 * 
 * @param {browser.Tabs.QueryQueryInfoType} queryInfo 
 * @param {*} message 
 * @param {browser.Tabs.SendMessageOptionsType} options 
 */
export const sendMessage = async (queryInfo, message, options) => {
    const tabs = await browser.tabs.query(queryInfo);

    return await Promise.all(
        tabs.map(async (tab) => {
            return await browser.tabs.sendMessage(tab.id, message, options);
        })
    );
};
