// Utility to mask game names in the question/review
export function maskGameNames(text: string, options: { name: string }[]): string {
    if (!text || !options) return text;
    let masked = text;
    options.forEach(option => {
        if (option && option.name) {
            // Mask the full name
            const fullNameRegex = new RegExp(option.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            masked = masked.replace(fullNameRegex, '*****');
            // Mask each word in the name (ignore very short/common words)
            option.name.split(/\s|\//).forEach(word => {
                if (word.length > 2 && !['the','and','for','but','nor','yet','so','with','in','on','at','to','of','a','an'].includes(word.toLowerCase())) {
                    const wordRegex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                    masked = masked.replace(wordRegex, '*****');
                }
            });
        }
    });
    return masked;
}
