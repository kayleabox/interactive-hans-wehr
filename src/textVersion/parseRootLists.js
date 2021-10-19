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

const { twoLetterRootsArray,  threeLetterRootsArray, fourLetterRootsArray, longRootsArray } = parseRootLists(linesArray);
// const threeLetterRootsWithLongVowels = getThreeLetterRootsWithLongVowels(threeLetterRootsArray);

const sortedThreeLetterRootSet = new Set([...threeLetterRootsArray].sort());

console.log(`line count: ${linesArray.length}`);

fs.writeFileSync('src/textVersion/parsedFiles/twoLetterRoots.txt', twoLetterRootsArray.join('\n'), 'utf-8');
fs.writeFileSync('src/textVersion/parsedFiles/threeLetterRoots.txt', threeLetterRootsArray.join('\n'), 'utf-8');
fs.writeFileSync('src/textVersion/parsedFiles/fourLetterRoots.txt', fourLetterRootsArray.join('\n'), 'utf-8');
fs.writeFileSync('src/textVersion/parsedFiles/longRoots.txt', longRootsArray.join('\n'), 'utf-8');

fs.writeFileSync('src/textVersion/parsedFiles/sortedThreeLetterRootSet.txt', [...sortedThreeLetterRootSet].join('\n'), 'utf-8');
// fs.writeFileSync('src/textVersion/parsedFiles/threeLetterRootsWithLongVowels.txt', threeLetterRootsWithLongVowels.join('\n'), 'utf-8');

function getThreeLetterRootsWithLongVowels(rootArray){
    const rootsWithLongVowels = [];
    rootArray.forEach(root => {
        const vowels = ['ا', 'و', 'ي'];
        if(vowels.includes(root[1] || root[2])){
            rootsWithLongVowels.push(root);
        }
    })
    return rootsWithLongVowels;
}

// build out root lists:
function parseRootLists(lines) {
  const charArray = [];

  const twoLetterRootsArray = [];
  const threeLetterRootsArray = [];
  const fourLetterRootsArray = [];
  const longRootsArray = [];
  
  lines.forEach(line => {
    const lineWordsArray = line.split(' ');
    const firstWord = lineWordsArray[0];
    const vowels = ['ا', 'و', 'ي', 'ى'];
    const hamzas = ['أ', 'ئ', 'ء', 'ؤ'];
  
    if(isArabic.test(firstWord)) {
        let firstWordArabic = firstWord.replace(/[^\u0600-\u06FF]|[\u0651]/g, '');
    
        if(firstWordArabic.length === 1 && line.length === 1) {
          charArray.push(firstWordArabic);
        } else if (firstWordArabic[0] === charArray[charArray.length - 1]) {
          // need to handle special characters that are the same letter but a different character

          // build root arrays
          // two letter root
          if (firstWordArabic.length === 2) {
            // if (twoLetterRootsArray.includes(firstWordArabic)) {}
            const previousTwoLetterRoot = twoLetterRootsArray[twoLetterRootsArray.length - 1];

            if (twoLetterRootsArray.length === 0 || previousTwoLetterRoot !== firstWordArabic){
              twoLetterRootsArray.push(firstWordArabic);
            }
          }

          // three letter root
          if (firstWordArabic.length === 3 && firstWordArabic[2] !== 'ة') {
            // if (threeLetterRootsArray.includes(firstWordArabic)) {}
            const previousTwoLetterRoot = twoLetterRootsArray[twoLetterRootsArray.length - 1];
            const previousThreeLetterRoot = threeLetterRootsArray[threeLetterRootsArray.length - 1];
            if (threeLetterRootsArray.length === 0 || previousThreeLetterRoot !== firstWordArabic){
              if (firstWordArabic[1] === firstWordArabic[2] && firstWordArabic.includes(previousTwoLetterRoot)){
                // console.log(`previous: ${previousTwoLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);                
              } else if (
                previousThreeLetterRoot 
                && vowels.includes(firstWordArabic[1]) 
                && vowels.includes(previousThreeLetterRoot[1])
                && previousThreeLetterRoot[0] === firstWordArabic[0]
                && previousThreeLetterRoot[2] === firstWordArabic[2]
              ) { 
                // console.log(`previous: ${previousThreeLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              } else if (
                previousThreeLetterRoot 
                && vowels.includes(firstWordArabic[2]) 
                && vowels.includes(previousThreeLetterRoot[2])
                && previousThreeLetterRoot[0] === firstWordArabic[0]
                && previousThreeLetterRoot[1] === firstWordArabic[1]
              ) { 
                // console.log(`previous: ${previousThreeLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              } else if (
                previousThreeLetterRoot 
                && vowels.includes(firstWordArabic[1]) 
                && vowels.includes(previousThreeLetterRoot[2])
                && previousThreeLetterRoot[0] === firstWordArabic[0]
                && previousThreeLetterRoot[1].replace('ھ', 'ه') === firstWordArabic[2]               
              ) { 
                // console.log(`previous: ${previousThreeLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              } else if (
                previousThreeLetterRoot 
                && hamzas.includes(firstWordArabic[2]) 
                && hamzas.includes(previousThreeLetterRoot[2])
                && previousThreeLetterRoot[0] === firstWordArabic[0]
                && previousThreeLetterRoot[1] === firstWordArabic[1]
              ) { 
                // console.log(`previous: ${previousThreeLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              } else if (
                previousThreeLetterRoot 
                && hamzas.includes(firstWordArabic[1]) 
                && hamzas.includes(previousThreeLetterRoot[1])
                && previousThreeLetterRoot[0] === firstWordArabic[0]
                && previousThreeLetterRoot[2] === firstWordArabic[2]
              ) { 
                // console.log(`previous: ${previousThreeLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              } else if (firstWordArabic[2] === 'ي' && firstWordArabic.includes()) {

              } else if (
                vowels.includes(firstWordArabic[1]) 
                && previousTwoLetterRoot[0] === firstWordArabic[0]
                && previousTwoLetterRoot[1] === firstWordArabic[2]
                && previousTwoLetterRoot > previousThreeLetterRoot
              ) {

              } 
              // This is a real special hack :/
              else if (firstWordArabic === 'الى' && previousThreeLetterRoot.substr(0, 2) !== 'ال') {
              } else {
                threeLetterRootsArray.push(firstWordArabic);
              }
            }
          }

          // four letter root
          // check that it does not contain the last three letter root with 
          // ا ء و ي ئ ؤ ى ة
          if (
            firstWordArabic.length === 4 
            && /[^\u0629|\u0621]/.test(firstWordArabic[3])
          ) {
            // if (fourLetterRootsArray.includes(firstWordArabic)) {}

            // remove hamzas and vowels
            const previousThreeLetterRoot = threeLetterRootsArray.length > 0 ? threeLetterRootsArray[threeLetterRootsArray.length - 1] : '';
            const includesPreviousThreeLetterRoot = previousThreeLetterRoot.split('').every(char => firstWordArabic.includes(char));
            let extraChar = '';
            firstWordArabic.split('').forEach((char, i) => {     
              if (i < 3 && char !== previousThreeLetterRoot.split('')[i]) {
                if (!previousThreeLetterRoot.includes(char)) {          
                  extraChar = char;
                }
              } else if (!previousThreeLetterRoot.includes(char)) {          
                extraChar = char;
              }
            });
            
            // console.log(`current root: ${firstWordArabic}`);
            // console.log(`previous root: ${previousThreeLetterRoot}`);
            // console.log(`extraChar: ${extraChar}`);
            // console.log(`includes previous root: ${includesPreviousRoot}`);
            // console.log(`regex result: ${/[\u0620-\u0627|\u0629|\u0648-\u064A]/.test(extraChar)}`);

            if (includesPreviousThreeLetterRoot && /[\u0620-\u0627|\u0629|\u0648-\u064A]/.test(extraChar)) {
              const vowelessWord = firstWordArabic.replace(extraChar, '');
              if (previousThreeLetterRoot === vowelessWord) {
                //console.log(vowelessWord);
              } 
            } else {
              const previousFourLetterRoot = fourLetterRootsArray[fourLetterRootsArray.length - 1];
              if(fourLetterRootsArray.length === 0 || previousFourLetterRoot !== firstWordArabic){
                fourLetterRootsArray.push(firstWordArabic);
              }
            }
          }
          
          // super long root!
          if (firstWordArabic.length > 4) {
            const previousLongRoot = longRootsArray[longRootsArray.length - 1];

            if (longRootsArray.length === 0 || previousLongRoot !== firstWordArabic){
              longRootsArray.push(firstWordArabic);
            }
          }

        } 
    } else if (lineWordsArray.length > 1 && isNumberic.test(firstWord) && firstWord.length === 1){
      if (
        isArabic.test(lineWordsArray[1]) 
        && lineWordsArray[1][0] === charArray[charArray.length - 1]
      ) {
        // @TODO apply the correct logic here
        console.log(`my second word is arabic: ${line}`);
      }
    }
  });

  return {twoLetterRootsArray, threeLetterRootsArray, fourLetterRootsArray, longRootsArray};
}

// // @TODO make this function check that the root is between the previous one and the next one
// function cleanThreeLetterRootArray(rootsArray, arabicWord){
//   if (rootsArray.length === 0 || arabicWord > rootsArray[rootsArray.length -1]){
//     console.log(`current is greater than previous.`);
//     // console.log(`current: ${firstWordArabic}`);
//     // console.log(`previous: ${threeLetterRootsArray[threeLetterRootsArray.length -1]}`);
//   } else {
//     console.log(`current is not greater than previous!!!!`);
//     console.log(`current: ${arabicWord}`);
//     console.log(`previous: ${rootsArray[rootsArray.length -1]}`);
//   }
// }