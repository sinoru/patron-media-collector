export default (block) => {
    if (block.then && block.catch) {
        return async (...args) => {
            try {
                await block(...args);
            } catch (e) {
                console.error(e);
            }
        };
    } else {
        return (...args) => {
            try {
                block(...args);
            } catch (e) {
                console.error(e);
            }
        }
    }
}
