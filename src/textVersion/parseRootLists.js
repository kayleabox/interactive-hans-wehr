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

// hamzas, tamarbuta, vowels
// /[\u0620-\u0627|\u0629|\u0648-\u064A]/

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
      const vowels = ['ا', 'و', 'ي', 'ى'];
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
    const vowels = ['ا', 'و', 'ي', 'ى', 'آ', 'ة'];
    const hamzas = ['أ', 'إ', 'ئ', 'ء', 'ؤ'];
  
    if(isArabic.test(firstWord)) {
        let firstWordArabic = firstWord.replace(/[^\u0600-\u06FF]|[\u0651]|[\u060C]/g, '');
    
        if(firstWordArabic.length === 1 && line.length === 1) {
          charArray.push(firstWordArabic);
        } else if (firstWordArabic[0] === charArray[charArray.length - 1]) {
          // @TODO need to handle special characters that are the same letter but a different character

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
            // does not end in 'ة'
            && firstWordArabic[3] !== 'ة'
          ) {
            // if (fourLetterRootsArray.includes(firstWordArabic)) {}

            const previousTwoLetterRoot = twoLetterRootsArray.length > 0 ? twoLetterRootsArray[twoLetterRootsArray.length - 1] : '';
            // remove hamzas and vowels
            const previousThreeLetterRoot = threeLetterRootsArray.length > 0 ? threeLetterRootsArray[threeLetterRootsArray.length - 1] : '';
            const includesPreviousThreeLetterRoot = previousThreeLetterRoot.split('').every(char => {
              return firstWordArabic.includes(char) 
              || (vowels.includes(char) && firstWordArabic.split('').some(c => vowels.includes(c))) 
              || (hamzas.includes(char) && firstWordArabic.split('').some(c => hamzas.includes(c)));
            });

            let extraChar = '';
            if(includesPreviousThreeLetterRoot){
              firstWordArabic.split('').forEach((char) => {     
                if (!previousThreeLetterRoot.includes(char)) {          
                  extraChar = char;
                }
              });
            }
            
            const previousFourLetterRoot = fourLetterRootsArray[fourLetterRootsArray.length - 1];
            if(fourLetterRootsArray.length === 0 || previousFourLetterRoot !== firstWordArabic){
              if ([...vowels, ...hamzas].includes(extraChar)) {
                // console.log(`previous: ${previousThreeLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              } else if(
                (firstWordArabic.slice(1) === previousThreeLetterRoot 
                || firstWordArabic.slice(1) === previousTwoLetterRoot + previousTwoLetterRoot[1])
                && firstWordArabic.startsWith('م')) {
                // console.log(`previous: ${previousThreeLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              }  else if (
                vowels.includes(firstWordArabic[1]) 
                && vowels.includes(firstWordArabic[3]) 
                && previousTwoLetterRoot[0] === firstWordArabic[0]
                && previousTwoLetterRoot[1] === firstWordArabic[2]
                && previousTwoLetterRoot > previousThreeLetterRoot
              ) {
                //  console.log(`previous three: ${previousThreeLetterRoot}`);
                //  console.log(`previous two: ${previousTwoLetterRoot}`);
                //  console.log(`current: ${firstWordArabic}`);
              } else if (
                previousTwoLetterRoot 
                && vowels.includes(firstWordArabic[2]) 
                && (previousTwoLetterRoot[0] === firstWordArabic[0]
                || vowels.includes(firstWordArabic[0]) && vowels.includes(previousTwoLetterRoot[0])) 
                && (previousTwoLetterRoot[1] === firstWordArabic[1]
                || vowels.includes(firstWordArabic[1]) && vowels.includes(previousTwoLetterRoot[1]))
                && previousTwoLetterRoot[1] === firstWordArabic[3]
              ) { 
                // console.log(`previous: ${previousTwoLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              } else if (
                previousThreeLetterRoot 
                && vowels.includes(firstWordArabic[2]) 
                && (previousThreeLetterRoot[0] === firstWordArabic[0]
                || vowels.includes(firstWordArabic[0]) && vowels.includes(previousThreeLetterRoot[0])) 
                && (previousThreeLetterRoot[1] === firstWordArabic[1]
                || vowels.includes(firstWordArabic[1]) && vowels.includes(previousThreeLetterRoot[1]))
                && previousThreeLetterRoot[2] === firstWordArabic[3]
              ) { 
                // console.log(`previous: ${previousThreeLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              } else if (
                previousThreeLetterRoot
                && vowels.includes(firstWordArabic[1]) 
                && (previousThreeLetterRoot[0] === firstWordArabic[0]
                || vowels.includes(firstWordArabic[0]) && vowels.includes(previousThreeLetterRoot[0])) 
                && previousThreeLetterRoot[1] === firstWordArabic[2]
                && previousThreeLetterRoot[2] === firstWordArabic[3]
              ) { 
                // console.log(`previous: ${previousThreeLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
              } else {
                  fourLetterRootsArray.push(firstWordArabic);
              }
            }
          }
          
          // super long root!
          if (firstWordArabic.length > 4) {
            const previousLongRoot = longRootsArray.length > 0 ? longRootsArray[longRootsArray.length - 1] : '';

            if (longRootsArray.length === 0 || previousLongRoot !== firstWordArabic){
              const previousTwoLetterRoot = twoLetterRootsArray.length > 0 ? twoLetterRootsArray[twoLetterRootsArray.length - 1] : '';
              const previousThreeLetterRoot = threeLetterRootsArray.length > 0 ? threeLetterRootsArray[threeLetterRootsArray.length - 1] : '';
              const includesPreviousThreeLetterRoot = previousThreeLetterRoot.split('').every(char => {
                return firstWordArabic.includes(char) 
                || (vowels.includes(char) && firstWordArabic.split('').some(c => vowels.includes(c))) 
                || (hamzas.includes(char) && firstWordArabic.split('').some(c => hamzas.includes(c)));
              });
              const previousFourLetterRoot = fourLetterRootsArray.length > 0 ? fourLetterRootsArray[fourLetterRootsArray.length - 1] : '';
              const includesPreviousFourLetterRoot = previousFourLetterRoot.split('').every(char => {
                return firstWordArabic.includes(char) 
                || (vowels.includes(char) && firstWordArabic.split('').some(c => vowels.includes(c))) 
                || (hamzas.includes(char) && firstWordArabic.split('').some(c => hamzas.includes(c)));
              });
              const includesPreviousLongRoot = previousLongRoot.split('').every(char => {
                return firstWordArabic.includes(char) 
                || (vowels.includes(char) && firstWordArabic.split('').some(c => vowels.includes(c))) 
                || (hamzas.includes(char) && firstWordArabic.split('').some(c => hamzas.includes(c)));
              });

              if (includesPreviousLongRoot
                && firstWordArabic.split('').every(char => previousLongRoot.includes(char) || vowels.includes(char) || hamzas.includes(char)))
              {
                // console.log(previousFourLetterRoot);
                // console.log(firstWordArabic.slice(0, 4));
              }               
              else if (includesPreviousFourLetterRoot
                && firstWordArabic.split('').every(char => previousFourLetterRoot.includes(char) || vowels.includes(char) || hamzas.includes(char)))
              {
                // console.log(previousFourLetterRoot);
                // console.log(firstWordArabic.slice(0, 4));
              } 
              else if (includesPreviousThreeLetterRoot
                && firstWordArabic.split('').every(char => previousThreeLetterRoot.includes(char) || vowels.includes(char) || hamzas.includes(char)))
              {
                // console.log(previousThreeLetterRoot);
                // console.log(firstWordArabic);
              } 
              else if (firstWordArabic.startsWith('است') 
                && includesPreviousThreeLetterRoot
                && firstWordArabic.slice(3).split('').every(char => previousThreeLetterRoot.includes(char) || vowels.includes(char) || hamzas.includes(char)))
              {
                // console.log(previousThreeLetterRoot);
                // console.log(firstWordArabic);
              }
              else if (firstWordArabic.endsWith('ان') 
              && includesPreviousFourLetterRoot
              && firstWordArabic.length > 5
              && firstWordArabic.slice(0, firstWordArabic.length - 2).split('').every(char => previousFourLetterRoot.includes(char) || vowels.includes(char) || hamzas.includes(char)))
            {
              // console.log(previousFourLetterRoot);
              // console.log(firstWordArabic.slice(0, firstWordArabic.length - 2));
              // console.log(firstWordArabic);
            } 
              else if (firstWordArabic.endsWith('ان') 
              && includesPreviousThreeLetterRoot
              && firstWordArabic.length > 4
              && firstWordArabic.slice(0, firstWordArabic.length - 2).split('').every(char => previousThreeLetterRoot.includes(char) || vowels.includes(char) || hamzas.includes(char)))
            {
              // console.log(previousThreeLetterRoot);
              // console.log(firstWordArabic.slice(0, firstWordArabic.length - 2));
              // console.log(firstWordArabic);
            } 
            else if (firstWordArabic.endsWith('انى') 
            && includesPreviousThreeLetterRoot
            && firstWordArabic.length > 5
            && firstWordArabic.slice(0, firstWordArabic.length - 3).split('').every(char => previousThreeLetterRoot.includes(char) || vowels.includes(char) || hamzas.includes(char)))
          {
            // console.log(previousThreeLetterRoot);
            // console.log(firstWordArabic.slice(0, firstWordArabic.length - 3));
            // console.log(firstWordArabic);
          } 
              else if (previousTwoLetterRoot.split('').every(char => firstWordArabic.includes(char))
              && firstWordArabic.split('').every(char => previousTwoLetterRoot.includes(char) || vowels.includes(char) || hamzas.includes(char)))
            {
              // console.log(previousThreeLetterRoot);
              // console.log(firstWordArabic);
            } 
              else {
                longRootsArray.push(firstWordArabic);
              }
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