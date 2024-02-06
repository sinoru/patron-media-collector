export default class Store {
    static get #store() {
        return browser.storage.session;
    }

    /**
     * @param {string} urlString
     * 
     * @returns {Promise<{}>}
     */
    static get(urlString) {
        return this.#store.get(this.#url(urlString).toString());
    }

    /**
     * @param {string} urlString
     * @param {any} value
     * 
     * @returns {Promise<void>}
     */
    static set(urlString, value) {
        return this.#store.set({
            [urlString]: value
        });
    }

    /**
     * @param {string} string
     * 
     * @returns {URL}
     */
    static #url(string) {
        let url = new URL(url);
        url.protocol = "";
        url.hash = "";
        url.search = "";
        
        return url;
    }

    static get onChanged() {
        return browser.storage.onChanged
    }
}
