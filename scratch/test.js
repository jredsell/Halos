const rawText = "[1] Hello [2-3] World [4a] Yes [5-6b] No [7,8] comma";
const regex = /(\s*)(?=\[\d+[a-z]?(?:-\d+[a-z]?)?(?:,\d+[a-z]?)?\]\s)/gi;

const rawLines = rawText
  .replace(regex, "\n")
  .split('\n')
  .map(l => l.trim())
  .filter(l => l !== '');

console.log(rawLines);
