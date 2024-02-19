/**
 * @param {string} urlString
 */
export default (urlString) => {
    let url = new URL(urlString);
    url.protocol = "";
    url.hash = "";
    url.search = "";
    
    return url;
}
