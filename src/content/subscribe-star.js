export default function() {
    const postUploads = document.querySelector('.post-body .post-uploads:not(.for-youtube)');

    const uploadsImages = postUploads.querySelector('.uploads-images');
    const uploadsImagesGallery = JSON.parse(uploadsImages.getAttribute("data-gallery"));

    let media = [];

    for (let image of uploadsImagesGallery) {
        media.push({
            'type': image.type,
            'download': image.original_filename,
            'href': image.url
        });
    }

    return media;
};
