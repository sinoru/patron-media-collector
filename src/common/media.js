/**
 * @typedef {Object} Media
 * @property {string} type
 * @property {string} filename
 * @property {URL} url
 * @property {number} [estimatedFileSize]
 */

/**
 * @param {Media[]} media 
 * @returns {Media[]}
 */
export async function updateFileSize(media) {
    return await Promise.all(
        media.map(
            async (media) => {
                const response = await fetch(
                    media.url,
                    {
                        method: 'HEAD',
                        mode: 'cors',
                        credentials: 'include',
                        cache: 'force-cache',
                        referrerPolicy: 'no-referrer',
                    }
                );

                const estimatedFileSize = Number(response.headers.get('Content-Length'));

                if (estimatedFileSize > 0) {
                    return {
                        ...media,
                        estimatedFileSize
                    }
                } else {
                    return media
                }
            }
        )
    )
}
