const fs = require('fs');

const hansWehrText = fs.readFileSync('src/textVersion/hansWehr.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  return data;
});

const isArabic = /[\u0600-\u06FF]/;

// TODO need logic to clean alif lam
// TODO need logic to clean endings
// TODO need maps to indicate letters that are interchangable
// TODO need root maps for two chars, three chars, four chars, +
const wordsArray = hansWehrText.split(/[\s]/);
const allArabicWordsArray = [];
const arabicWordCountDict = {};
console.log(`word count: ${wordsArray.length}`);

wordsArray.forEach(word => {
  const strippedWord = word.replace(/[.,،؛\/#!$%\^&\*;:{}=\-_`~()]|[\u0660-\u0669]/g, '');
  if (isArabic.test(strippedWord)) {
    const count = arabicWordCountDict[strippedWord];
    arabicWordCountDict[strippedWord] = count ? count + 1 : 1;
    allArabicWordsArray.push(strippedWord);
  }
}); 

const linesArray = hansWehrText.split('\n');

console.log(`line count: ${linesArray.length}`);

fs.writeFileSync('src/textVersion/parsedFiles/allArabicWords.txt', allArabicWordsArray.join('\n'), 'utf-8');
fs.writeFileSync('src/textVersion/parsedFiles/arabicWordsDict.json', JSON.stringify(arabicWordCountDict), 'utf-8');
