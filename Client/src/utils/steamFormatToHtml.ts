// Utility to convert Steam BBCode-like formatting to HTML
export function steamFormatToHtml(text: string): string {
  if (!text) return '';
  const bbcodeToHtmlMap: Record<string, string> = {
    '[b]': '<strong>',
    '[/b]': '</strong>',
    '[i]': '<em>',
    '[/i]': '</em>',
    '[u]': '<u>',
    '[/u]': '</u>',
    '[strike]': '<s>',
    '[/strike]': '</s>',
    '[spoiler]': '<span class="spoiler">',
    '[/spoiler]': '</span>',
    '[img]': '<img src="',
    '[/img]': '" alt="Steam image" />',
    '[url=': '<a href="',
    '[/url]': '</a>',
    '[h1]': '<h1>',
    '[/h1]': '</h1>',
    '[h2]': '<h2>',
    '[/h2]': '</h2>',
    '[h3]': '<h3>',
    '[/h3]': '</h3>',
    '[h4]': '<h4>',
    '[/h4]': '</h4>',
    '[h5]': '<h5>',
    '[/h5]': '</h5>',
    '[h6]': '<h6>',
    '[/h6]': '</h6>',
    '[tr]': '<tr>',
    '[/tr]': '</tr>',
    '[th]': '<th>',
    '[/th]': '</th>',
    '[quote]': '<blockquote>',
    '[/quote]': '</blockquote>',
    '[*]': '<li>',
    '[/*]': '</li>',
  };

  return text.replace(/\[.*?\]/g, (tag) => {
    const isUrlTag = tag.startsWith('[url=');
    if (isUrlTag) {
      const urlContent = tag.slice(5, -1); // Extract URL content
      return `<a href="${urlContent}" target="_blank" rel="noopener noreferrer">`;
    }
    return bbcodeToHtmlMap[tag] || tag;
  });
}

// Optionally, you can add more tag conversions as needed.
