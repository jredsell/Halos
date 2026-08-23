import { balanceLines } from '../utils/songParser';

const YOUVERSION_BASE_URL = 'https://api.youversion.com/v1';

/**
 * Fetches the list of available Bible versions from YouVersion API.
 */
export async function fetchBibleVersions(apiKey) {
  if (!apiKey) throw new Error("Missing YouVersion API Key");
  
  const res = await fetch(`${YOUVERSION_BASE_URL}/bibles`, {
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

  if (!res.ok) throw new Error("Passage not found or unauthorized");
  const data = await res.json();
  
  return processYouVersionPassage(data.data, bibleId);
}

/**
 * Converts YouVersion passage payload into HALOS Slides array.
 */
function processYouVersionPassage(passageData, bibleId) {
  // YouVersion API returns 'content' as USX HTML or plain text depending on params.
  // By default, it returns HTML. We need to parse the HTML to extract verse numbers and text,
  // OR we can just rely on the plain text if they provide it. But the default /passages often returns HTML string in `content`.
  
  // Let's create a temporary DOM element to parse the HTML and extract text gracefully.
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = passageData.content;
  
  // Extract text, ignoring headers, chapter numbers, etc. if possible.
  // The YouVersion API usually wraps verses in <span class="v {verse_number}">...</span>
  // or similar.
  const verses = tempDiv.querySelectorAll('.v');
  let extractedText = "";

  if (verses.length > 0) {
     // If they use standard `.v` classes for verses
     extractedText = Array.from(verses).map(v => v.textContent).join(' ');
  } else {
     // Fallback if structure is different
     extractedText = tempDiv.textContent || tempDiv.innerText || "";
  }
  
  // Clean up excessive whitespace
  extractedText = extractedText.replace(/\s+/g, ' ').trim();

  const slides = [];
  let slideIndex = 1;

  // Split into manageable chunks (by sentences)
  const rawLines = extractedText
    .replace(/([.?!;")])\s+(?=[A-Z"'])/g, "$1\n")
    .split('\n')
    .map(l => l.trim())
    .filter(l => l !== '');
  
  const chunks = balanceLines(rawLines);
  chunks.forEach(chunk => {
    slides.push({
      type: passageData.reference, // e.g., "John 3:16"
      content: chunk,
      index: slideIndex++
    });
  });

  return {
    reference: passageData.reference, // Human readable reference
    translation: passageData.version_abbreviation || bibleId, // e.g., "NIV"
    slides
  };
}
