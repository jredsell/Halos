/**
 * Parses a liturgy markdown file into slide objects.
 *
 * Format in the .md file:
 *   [/speaker]
 *   Lord have mercy upon us.
 *
 *   [/response]
 *   Lord have mercy.
 *
 * Each [/speaker] or [/response] block becomes one slide.
 * Un-tagged text at the start is treated as 'speaker' type.
 *
 * @param {string} rawText
 * @returns {{ title: string, slides: Array<{type: 'speaker'|'response', content: string[], index: number}> }}
 */
export function parseLiturgyMarkdown(rawText) {
  let text = rawText || '';
  const metadata = { title: 'Untitled Liturgy' };

  // Extract optional YAML frontmatter
  const yamlMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (yamlMatch) {
    const lines = yamlMatch[1].split('\n');
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) {
        const val = rest.join(':').trim();
        if (key.trim().toLowerCase() === 'title') metadata.title = val;
      }
    });
    text = text.replace(yamlMatch[0], '').trim();
  }

  // Split by [/speaker] and [/response] tags
  const blockRegex = /^\[\/(?:speaker|response)\]$/gm;
  const tagMatches = [...text.matchAll(/^\[\/(?:speaker|response)\]$/gm)];

  const slides = [];
  let slideIndex = 1;

  if (tagMatches.length === 0) {
    // No tags — treat entire doc as one speaker slide
    const content = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (content.length > 0) {
      slides.push({ type: 'speaker', content, index: slideIndex++ });
    }
    return { metadata, slides };
  }

  // Check for content before the first tag
  const firstTagStart = tagMatches[0].index;
  if (firstTagStart > 0) {
    const before = text.slice(0, firstTagStart).trim();
    if (before) {
      const content = before.split('\n').map(l => l.trim()).filter(Boolean);
      if (content.length > 0) {
        slides.push({ type: 'speaker', content, index: slideIndex++ });
      }
    }
  }

  // Process each tagged block
  tagMatches.forEach((match, i) => {
    const tagLine = match[0]; // e.g. '[/speaker]'
    const type = tagLine.includes('speaker') ? 'speaker' : 'response';
    const blockStart = match.index + tagLine.length;
    const blockEnd = i + 1 < tagMatches.length ? tagMatches[i + 1].index : text.length;
    const blockText = text.slice(blockStart, blockEnd).trim();

    if (!blockText) return;

    const content = blockText.split('\n').map(l => l.trim()).filter(Boolean);
    if (content.length > 0) {
      slides.push({ type, content, index: slideIndex++ });
    }
  });

  return { metadata, slides };
}

/**
 * Converts slides back to raw markdown text for saving.
 * Inverse of parseLiturgyMarkdown (for the section body only).
 *
 * @param {string} title
 * @param {string} body  — the raw editor text (already has [/speaker]/[/response] tags)
 * @returns {string}
 */
export function buildLiturgyMarkdown(title, body) {
  const frontmatter = `---\ntitle: ${title}\n---`;
  return `${frontmatter}\n\n${body.trim()}\n`;
}
