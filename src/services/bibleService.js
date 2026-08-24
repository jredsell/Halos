import { balanceLines } from '../utils/songParser';

const YOUVERSION_BASE_URL = 'https://api.youversion.com/v1';

/**
 * Fetches the list of available Bible versions from YouVersion API.
 */
export async function fetchBibleVersions(apiKey) {
  if (!apiKey) throw new Error("Missing YouVersion API Key");
  
  const res = await fetch(`${YOUVERSION_BASE_URL}/bibles?language_ranges[]=eng`, {
    headers: {
      'X-YVP-App-Key': apiKey,
      'Accept': 'application/json'
    }
  });
  
  if (!res.ok) throw new Error("Failed to fetch Bible versions");
  const data = await res.json();
  return data.data; // Array of bibles
}

/**
 * Fetches the list of books for a given Bible version.
 */
export async function fetchBibleBooks(apiKey, bibleId) {
  if (!apiKey) throw new Error("Missing YouVersion API Key");
  
  const res = await fetch(`${YOUVERSION_BASE_URL}/bibles/${bibleId}/books`, {
    headers: {
      'X-YVP-App-Key': apiKey,
      'Accept': 'application/json'
    }
  });
  
  if (!res.ok) throw new Error("Failed to fetch Bible books");
  const data = await res.json();
  return data.data; // Array of books
}

/**
 * Fetches the list of chapters for a given Book in a Bible version.
 */
export async function fetchBibleChapters(apiKey, bibleId, bookId) {
  if (!apiKey) throw new Error("Missing YouVersion API Key");
  
  const res = await fetch(`${YOUVERSION_BASE_URL}/bibles/${bibleId}/books/${bookId}/chapters`, {
    headers: {
      'X-YVP-App-Key': apiKey,
      'Accept': 'application/json'
    }
  });
  
  if (!res.ok) throw new Error("Failed to fetch Bible chapters");
  const data = await res.json();
  return data.data; // Array of chapters
}

/**
 * Fetches a specific passage (chapter or verse range) from YouVersion API
 * and formats it into HALOS slide structure.
 * 
 * Example passageReference: "JHN.3.16" or "JHN.3"
 */
export async function fetchYouVersionPassage(apiKey, bibleId, passageReference) {
  if (!apiKey) throw new Error("Missing YouVersion API Key");

  const res = await fetch(`${YOUVERSION_BASE_URL}/bibles/${bibleId}/passages/${passageReference}`, {
    headers: {
      'X-YVP-App-Key': apiKey,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    console.error(`YouVersion API Error: ${res.status} ${res.statusText} on ${res.url}. Response:`, errorText);
    throw new Error(`Passage not found or unauthorized (${res.status})`);
  }
  const data = await res.json();
  
  return processYouVersionPassage(data, bibleId);
}

/**
 * Converts YouVersion passage payload into HALOS Slides array.
 */
function processYouVersionPassage(passageData, bibleId) {
  // YouVersion API returns 'content' as USX HTML or plain text depending on params.
  // By default, it returns HTML. We need to parse the HTML to extract verse numbers and text,
  // OR we can just rely on the plain text if they provide it. But the default /passages often returns HTML string in `content`.
  
  if (!passageData) {
    throw new Error("YouVersion API returned an empty or invalid passage response.");
  }

  // Let's create a temporary DOM element to parse the HTML and extract text gracefully.
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = passageData.content || "";
  
  // Extract text, ignoring headers, chapter numbers, etc. if possible.
  // The YouVersion API usually wraps verses in <span class="v {verse_number}">...</span>
  // or similar.
  const verses = tempDiv.querySelectorAll('.v');
  let extractedText = "";

  if (verses.length > 0) {
     extractedText = Array.from(verses).map(v => {
       const usfm = v.getAttribute('data-usfm') || "";
       let vNum = usfm.split('.').pop();
       
       const label = v.querySelector('.label');
       if (!vNum && label) {
         vNum = label.textContent.trim();
       }
       
       if (vNum) {
          if (label) label.remove();
          return `[${vNum}] ${v.textContent.trim()}`;
       }
       return v.textContent.trim();
     }).join(' ');
  } else {
     extractedText = tempDiv.textContent || tempDiv.innerText || "";
  }
  
  // Clean up excessive whitespace
  extractedText = extractedText.replace(/\s+/g, ' ').trim();

  const slides = parseBibleText(extractedText, passageData.reference, 4); // Default to 4 on initial fetch

  return {
    reference: passageData.reference, // Human readable reference
    translation: passageData.version_abbreviation || bibleId, // e.g., "NIV"
    rawText: extractedText,
    slides
  };
}

export function parseBibleText(rawText, reference, linesPerSlide = 4) {
  const slides = [];
  let slideIndex = 1;

  // Split into manageable chunks (by sentences)
  // Ensure we also split when the next word starts with a number (like a verse number)
  const rawLines = rawText
    .replace(/([.?!;”"’'])\s+(?=[A-Z0-9\[“‘"'])/g, "$1\n")
    .split('\n')
    .map(l => l.trim())
    .filter(l => l !== '');
  let currentVerseMatch = "";

  const chunks = balanceLines(rawLines, linesPerSlide);
  chunks.forEach(chunk => {
    let firstLine = chunk[0];
    const verseMatch = firstLine.match(/^\[?(\d+[a-z]?)\]?\s/i);
    
    if (verseMatch) {
       currentVerseMatch = `[${verseMatch[1]}]`;
       // Normalize the verse number in the string to have brackets for consistency
       chunk[0] = firstLine.replace(/^\[?(\d+[a-z]?)\]?\s/i, `[${verseMatch[1]}] `);
    } else if (currentVerseMatch) {
       chunk[0] = `${currentVerseMatch} ${firstLine}`;
    }

    slides.push({
      type: reference, // e.g., "John 3:16"
      content: chunk,
      index: slideIndex++
    });
  });

  return slides;
}

/**
 * Parses a local book-based JSON structure (e.g. Genesis.json in /Bible/NIV/)
 */
export async function fetchLocalBiblePassage(libraryHandle, folderName, reference) {
  const bibleFolder = await libraryHandle.getDirectoryHandle('Bible');
  const transFolder = await bibleFolder.getDirectoryHandle(folderName);

  const parsed = parseReference(reference);
  if (!parsed) throw new Error("Invalid reference format. Try: Genesis 1, Genesis 1-2, Genesis 1:5-10, or Genesis 1:13-2:10");

  const { bookName } = parsed;

  let fileHandle;
  for await (const entry of transFolder.values()) {
    if (entry.kind === 'file' && entry.name.toLowerCase().includes(bookName.toLowerCase())) {
      fileHandle = entry;
      break;
    }
  }

  if (!fileHandle) throw new Error(`Book "${bookName}" not found in local ${folderName} folder`);

  const file = await fileHandle.getFile();
  const data = JSON.parse(await file.text());

  let allVerses = [];

  if (parsed.type === 'whole_chapter') {
    const chapter = data.chapters.find(c => c.chapter.toString() === parsed.startChapter.toString());
    if (!chapter) throw new Error(`Chapter ${parsed.startChapter} not found in ${bookName}`);
    allVerses = chapter.verses;
  } else if (parsed.type === 'chapter_range') {
    const startCh = parseInt(parsed.startChapter);
    const endCh = parseInt(parsed.endChapter);
    for (let ch = startCh; ch <= endCh; ch++) {
      const chapter = data.chapters.find(c => parseInt(c.chapter) === ch);
      if (chapter) allVerses.push(...chapter.verses);
    }
  } else if (parsed.type === 'verse_range_same') {
    const chapter = data.chapters.find(c => c.chapter.toString() === parsed.startChapter.toString());
    if (!chapter) throw new Error(`Chapter ${parsed.startChapter} not found in ${bookName}`);
    const start = parseInt(parsed.startVerse);
    const end = parsed.endVerse ? parseInt(parsed.endVerse) : start;
    allVerses = chapter.verses.filter(v => {
      const vn = parseInt(v.verse);
      return vn >= start && vn <= end;
    });
  } else if (parsed.type === 'cross_chapter') {
    const startCh = parseInt(parsed.startChapter);
    const endCh = parseInt(parsed.endChapter);
    const startV = parseInt(parsed.startVerse);
    const endV = parseInt(parsed.endVerse);

    for (let ch = startCh; ch <= endCh; ch++) {
      const chapter = data.chapters.find(c => parseInt(c.chapter) === ch);
      if (!chapter) continue;
      
      let verses = chapter.verses;
      if (ch === startCh) {
        verses = verses.filter(v => parseInt(v.verse) >= startV);
      } else if (ch === endCh) {
        verses = verses.filter(v => parseInt(v.verse) <= endV);
      }
      allVerses.push(...verses);
    }
  }

  if (allVerses.length === 0) throw new Error("No verses found for this range");

  return processBibleJson({
    reference: reference,
    translation_id: folderName.toUpperCase(),
    verses: allVerses
  });
}

/**
 * Parses a Bible reference string into structured components.
 * Returns null if the format is not recognized.
 */
function parseReference(ref) {
  ref = ref.trim();
  let m = ref.match(/^(.+?)\s+(\d+):(\d+)\s*-\s*(\d+):(\d+)$/);
  if (m) return { bookName: m[1], type: 'cross_chapter', startChapter: m[2], startVerse: m[3], endChapter: m[4], endVerse: m[5] };

  m = ref.match(/^(.+?)\s+(\d+):(\d+)\s*-\s*(\d+)$/);
  if (m) return { bookName: m[1], type: 'verse_range_same', startChapter: m[2], startVerse: m[3], endVerse: m[4] };

  m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (m) return { bookName: m[1], type: 'verse_range_same', startChapter: m[2], startVerse: m[3], endVerse: null };

  m = ref.match(/^(.+?)\s+(\d+)\s*-\s*(\d+)$/);
  if (m) return { bookName: m[1], type: 'chapter_range', startChapter: m[2], endChapter: m[3] };

  m = ref.match(/^(.+?)\s+(\d+)$/);
  if (m) return { bookName: m[1], type: 'whole_chapter', startChapter: m[2] };

  return null;
}

export function processBibleJson(data) {
  let combinedRawText = "";

  for (const v of data.verses) {
     combinedRawText += `[${v.verse}] ${v.text} `;
  }
  
  combinedRawText = combinedRawText.replace(/\s+/g, ' ').trim();
  const slides = parseBibleText(combinedRawText, data.reference, 4); // Default to 4

  return {
    reference: data.reference,
    translation: data.translation_id || 'KJV',
    rawText: combinedRawText,
    slides
  };
}
