export default function() {
    const nextData = JSON.parse(document.getElementById('__NEXT_DATA__').text);

    const post = nextData.props.pageProps.bootstrapEnvelope.bootstrap.post;
    const postIncluded = post.included.filter((value) => value.type == "media" || value.type == "attachment");
    const postData = post.data;

    const images = postData.relationships.images.data;
    const attachments = postData.relationships.attachments.data;

    let media = [];

    for (let image of images) {
        let imageAttributes = postIncluded.find((value) => value.type == image.type && value.id == image.id).attributes;

        media.push({'type': 'image', 'download': imageAttributes.file_name, 'href': imageAttributes.download_url});
    }

    for (let attachment of attachments) {
        let attachmentAttributes = postIncluded.find((value) => value.type == attachment.type && value.id == attachment.id).attributes;

        media.push({'type': 'application', 'download': attachmentAttributes.name, 'href': attachmentAttributes.url});
    }

    return media;
}