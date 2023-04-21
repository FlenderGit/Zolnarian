function createCSSFile(data){
    var styleElement = document.createElement('style')
    styleElement.type = 'text/css'
    styleElement.appendChild(document.createTextNode(data))
    var linkElement = document.createElement('link')
    linkElement.rel = 'stylesheet'
    linkElement.href = 'style.css'
    var cssBlob = new Blob([data], {type: 'text/css'})
    var cssUrl = URL.createObjectURL(cssBlob)
    linkElement.href = cssUrl
    document.head.appendChild(linkElement)
}

function generate_uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function replaceValues(str, values) {
    const regex = /{{\s*([^{}\s]*)\s*}}/g;
    return str.replace(regex, (match, key) => values[key.trim()] || "" );
}