export function splitCamelCase(text) {
    return text
        // Add a space before each uppercase letter
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Capitalize the first letter of the text (optional, depending on your use case)
        .replace(/^./, function (str) { return str.toUpperCase(); });
}