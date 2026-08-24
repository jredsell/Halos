const rawText = "[1] This is the genealogy of Jesus the Messiah the son of David, the son of Abraham: [2] Abraham was the father of Isaac, Isaac the father of Jacob, Jacob the father of Judah and his brothers, [3] Judah the father of Perez and Zerah, whose mother was Tamar, Perez the father of Hezron, Hezron the father of Ram, [4] Ram the father of Amminadab, Amminadab the father of Nahshon, Nahshon the father of Salmon, [5] Salmon the father of Boaz, whose mother was Rahab, Boaz the father of Obed, whose mother was Ruth, [6] Obed the father of Jesse, and Jesse the father of King David.";

const rawLines = rawText
  .replace(/(\s*)(?=\[\d+[a-z]?\]\s)/g, "\n")
  .replace(/([.?!;”"’'])\s+(?=[A-Z0-9\[“‘"'])/g, "$1\n")
  .split('\n')
  .map(l => l.trim())
  .filter(l => l !== '');

console.log(rawLines);
