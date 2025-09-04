// Utility to copy a string to clipboard
export function copyToClipboard(text: string) {
    if (navigator && navigator.clipboard) {
        navigator.clipboard.writeText(text);
    }
}
