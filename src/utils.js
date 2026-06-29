export function convertStringToHTML(htmlString) {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}

// Normalize a CMS/data image path for absolute serving under Next. Relative
// paths like "img/foo.webp" only resolved correctly from "/" under CRA; from
// "/despre-noi" they'd 404. Leave absolute URLs, root paths and data URIs alone.
export function assetUrl(path) {
    if (!path) return path;
    if (/^(https?:)?\/\//.test(path) || path.startsWith("/") || path.startsWith("data:")) {
        return path;
    }
    return "/" + path;
}