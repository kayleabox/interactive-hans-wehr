const fs = require('fs');

const hansWehrText = fs.readFileSync('src/textVersion/hansWehr.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  return data;
});

const isArabic = /[\u0600-\u06FF]/;
const isNumberic = /^\d+$/; 

const linesArray = hansWehrText.split('\n');

const { charArray, entryWordsArray, entriesArray } = parseDictionaryEntries(linesArray);

console.log(`line count: ${linesArray.length}`);

fs.writeFileSync('src/textVersion/parsedFiles/char.txt', charArray.join('\n'), 'utf-8');
fs.writeFileSync('src/textVersion/parsedFiles/word.txt', entryWordsArray.join('\n'), 'utf-8');
fs.writeFileSync('src/textVersion/parsedFiles/entry.txt', entriesArray.join('\n\n'), 'utf-8');

// build out entries list:
function parseDictionaryEntries (lines) {
  const charArray = [];
  const entryWordsArray = [];
  const entriesArray = [];

  lines.forEach(line => {
    const lineWordsArray = line.split(' ');
    const firstWord = lineWordsArray[0];
    
    if(isArabic.test(firstWord)) {
        let firstWordArabic = firstWord.replace(/[^\u0600-\u06FF]/g, '');
    
        if(firstWordArabic.length === 1 && line.length === 1) {
          charArray.push(firstWordArabic);
          entriesArray.push(line+'\n');
        } else if (!entryWordsArray.includes(firstWordArabic) && firstWordArabic[0] === charArray[charArray.length - 1]) {
          // need to handle special characters that are the same letter but a different character

          entryWordsArray.push(firstWordArabic); 
          entriesArray.push(line+'\n');
        } else {
          entriesArray[entriesArray.length - 1] += line+'\n';
        }
    } else if (lineWordsArray.length > 1 && isNumberic.test(firstWord) && firstWord.length === 1){
      if (
        isArabic.test(lineWordsArray[1]) 
        && !entryWordsArray.includes(lineWordsArray[1]) 
        && lineWordsArray[1][0] === charArray[charArray.length - 1]
      ) {
        entryWordsArray.push(lineWordsArray[1]);
        entriesArray.push(line+'\n');
      } else {
        entriesArray[entriesArray.length - 1] += line+'\n';
      }
    } else {
      entriesArray[entriesArray.length - 1] += line+'\n';
    }
  });
  return { charArray, entryWordsArray, entriesArray };
}