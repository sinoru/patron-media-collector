/**
 * @param {Blob} blob
 * 
 * @returns {Promise<URL, DOMException>}
 */
export const dataURLFromBlob = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    })
    .then((str) => {new URL(str)});
}

/**
 * @param {number} delay
 * 
 * @returns {Promise<void>}
 */
export const timeout = (delay) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
