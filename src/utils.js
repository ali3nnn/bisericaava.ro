export function convertStringToHTML(htmlString) {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}