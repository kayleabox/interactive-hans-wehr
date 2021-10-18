const fs = require('fs'); 

const hansWehrPDF = fs.readFileSync('src/pdfVersion/hans-wehr.pdf', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  return data;
});

// const isArabic = /[\u0600-\u06FF]/;
// const isNumberic = /^\d+$/;

// const linesArray = hansWehrText.split('\n');
// const charArray = [];
// const wordsArray = [];
// const entriesArray = [];

// console.log(linesArray.length);
// linesArray.forEach(line => {
//     const lineWordsArray = line.split(' ');
//     const firstWord = lineWordsArray[0];
//     if(isArabic.test(firstWord)) {
//         if(firstWord.length === 1 && line.length === 1){
//           charArray.push(firstWord);
//         } else if(!wordsArray.includes(firstWord) && firstWord[0] === charArray[charArray.length -1]){
//           wordsArray.push(firstWord); 
//         }
//     } else if (line.length > 1 && isNumberic.test(firstWord) && firstWord.length === 1){
//       if(!wordsArray.includes(line[1])){
//         wordsArray.push(line[1]);
//       }const pdfjs = require('pdfjs-dist');

//     }
// });pdfjs

// fs.writeFileSync('src/pdfVersion/char.txt', charArray.join('\n'), 'utf-8');
// fs.writeFileSync('src/pdfVersion/word.txt', wordsArray.join('\n'), 'utf-8');
