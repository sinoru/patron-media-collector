/**
 * @template T
 * @param {T} block
 * 
 * @returns {T}
 */
export default (block) => {
    if (block.then && block.catch) {
        return async (...args) => {
            try {
                return await block(...args);
            } catch (e) {
                console.error(e);
                throw e;
            }
        };
    } else {
        return (...args) => {
            try {
                return block(...args);
            } catch (e) {
                console.error(e);
                throw e;
            }
        }
    }
}
