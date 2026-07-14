function isValidRenderRequest(value) {
    return Boolean(
        value &&
        typeof value === 'object' &&
        value.template &&
        Array.isArray(value.template.pages) &&
        typeof value.fileName === 'string' &&
        value.render &&
        Number.isFinite(value.render.width) &&
        Number.isFinite(value.render.height)
    );
}

function sanitizeFileName(value) {
    return String(value || 'report.pdf').replace(/[<>:"/\\|?*]+/g, '_');
}

module.exports = {
    isValidRenderRequest,
    sanitizeFileName
};