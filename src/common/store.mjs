export default class Store {
    static get #store() {
        return browser.storage.session;
    }

    /**
     * @param {string} urlString
     * 
     * @returns {Promise<{}>}
     */
    static async get(urlString) {
        let key = this.#url(urlString).toString();

        return (await this.#store.get(key))[key];
    }

    /**
     * @param {string} urlString
     * @param {any} value
     */
    static async set(urlString, value) {
        return await this.#store.set({
            [this.#url(urlString)]: value
        });
    }

    /**
     * @param {string} string
     */
    static #url(urlString) {
        let url = new URL(urlString);
        url.protocol = "";
        url.hash = "";
        url.search = "";
        
        return url;
    }

    static get onChanged() {
        return browser.storage.onChanged
    }
}
