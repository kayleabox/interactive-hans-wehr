const fs = require('fs');

const hansWehrText = fs.readFileSync('src/newTextVersion/hansWehr.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  return data;
});

const awzAnf3lText = fs.readFileSync('src/newTextVersion/patterns.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  return data;
});

const awzAnf3lArray = awzAnf3lText.split('\n');

const isArabic = /[\u0600-\u06FF]/;
const isNumberic = /^\d+$/;

// hamzas, tamarbuta, vowels
// /[\u0620-\u0627|\u0629|\u0648-\u064A]/

const linesArray = hansWehrText.split('\n');

const { twoLetterRootsArray,  threeLetterRootsArray, fourLetterRootsArray, longRootsArray } = parseRootLists(linesArray);

console.log(`line count: ${linesArray.length}`);

fs.writeFileSync('src/newTextVersion/parsedFiles/twoLetterRoots.txt', twoLetterRootsArray.join('\n'), 'utf-8');
fs.writeFileSync('src/newTextVersion/parsedFiles/threeLetterRoots.txt', threeLetterRootsArray.join('\n'), 'utf-8');
fs.writeFileSync('src/newTextVersion/parsedFiles/fourLetterRoots.txt', fourLetterRootsArray.join('\n'), 'utf-8');
fs.writeFileSync('src/newTextVersion/parsedFiles/longRoots.txt', longRootsArray.join('\n'), 'utf-8');

function getRootsWithLongVowels(rootArray){
    const rootsWithLongVowels = [];
    rootArray.forEach(root => {
      const vowels = ['ا', 'و', 'ي', 'ى'];
      if(vowels.includes(root[1] || root[2])){
            rootsWithLongVowels.push(root);
        }
    })
    return rootsWithLongVowels;
}

function getRootsWithHamzas(rootArray){
  const rootsWithHamzas = [];
  rootArray.forEach(root => {
    const hamzas = ['أ', 'إ', 'ئ', 'ء', 'ؤ'];
    if(hamzas.includes(root[1] || root[2])){
      rootsWithHamzas.push(root);
      }
  })
  return rootsWithHamzas;
}

function isVariantOf(currentRoot, previousRoot){
  const vowels = ['ا', 'و', 'ي', 'ى', 'آ', 'ة'];
  const hamzas = ['أ', 'إ', 'ئ', 'ء', 'ؤ'];
  return [...currentRoot].every(char => [...previousRoot, ...vowels, ...hamzas].includes(char))
}

function includesWord(currentRoot, previousRoot){
  const vowels = ['ا', 'و', 'ي', 'ى', 'آ', 'ة'];
  const hamzas = ['أ', 'إ', 'ئ', 'ء', 'ؤ'];
  const currentRootChars = [...currentRoot];
  const previousRootChars = [...previousRoot];

  return previousRootChars.every(char => {
    return currentRoot.includes(char) 
    || (vowels.includes(char) && currentRootChars.some(c => vowels.includes(c))) 
    || (hamzas.includes(char) && currentRootChars.some(c => hamzas.includes(c)));
  });
}

function isPattern(word, root) {
  const char0 = root[0];
  const char1 = root[1];
  const char2 = root[2];
  const matchingWazan = awzAnf3lArray.find(wazan => word === wazan.replace('ف', char0).replace('ع', char1).replace('ل', char2));

  return matchingWazan ? true : false;
}

// might need to handle more nuances than this
function hasSameRoot(currentWord, previousWord){
  const vowels = ['ا', 'و', 'ي', 'ى', 'آ', 'ة'];
  const hamzas = ['أ', 'إ', 'ئ', 'ء', 'ؤ'];

  const currentWordConsonants = [];
  const currentWordNotConsonants = [];
  [...currentWord.replace('ھ', 'ه')].forEach(char => {
    [...hamzas, ...vowels].includes(char) 
    ? currentWordNotConsonants.push(char) 
    : currentWordConsonants.push(char);
  });
  const previousWordConsonants = [];
  const previousWordNotConsonants = [];
  [...previousWord.replace('ھ', 'ه')].forEach(char => {
    [...hamzas, ...vowels].includes(char) 
    ? previousWordNotConsonants.push(char) 
    : previousWordConsonants.push(char);
  });

  return ((
    previousWordConsonants.length === currentWordConsonants.length 
    && [...previousWordConsonants].every((char, i) => char === currentWordConsonants[i]))
    || (previousWordConsonants.length === currentWordConsonants.length - 1 
    && currentWordConsonants[0] === 'م' 
    && currentWordConsonants.slice(1).join('') === previousWordConsonants.join('')))
  && previousWordNotConsonants.length <= currentWordNotConsonants.length;
}

// build out root lists:
function parseRootLists(lines) {
  const charArray = [];

  const twoLetterRootsArray = [];
  const fullVersionTwoLetterRootsArray = [];
  const threeLetterRootsArray = [];
  const fourLetterRootsArray = [];
  const longRootsArray = [];
  
  lines.forEach(line => {
    const lineWordsArray = line.split(' ');
    const firstWord = lineWordsArray[0];
  
    if(isArabic.test(firstWord)) {
        let firstWordArabic = firstWord.replace(/[^\u0600-\u06FF]|[\u0651]|[\u060C]/g, '');
    
        if(firstWordArabic.length === 1 && line.length === 1) {
          charArray.push(firstWordArabic);
        } else if (firstWordArabic[0] === charArray[charArray.length - 1]) {
          // @TODO need to handle special characters that are the same letter but a different character

          // set const for the previous entries in each char array
          const previousTwoLetterRoot = twoLetterRootsArray.length > 0 ? twoLetterRootsArray[twoLetterRootsArray.length - 1] : '';
          const previousFullVersionTwoLetterRoot = fullVersionTwoLetterRootsArray.length > 0 ? fullVersionTwoLetterRootsArray[fullVersionTwoLetterRootsArray.length - 1] : '';
          const previousThreeLetterRoot = threeLetterRootsArray.length > 0 ? threeLetterRootsArray[threeLetterRootsArray.length - 1] : '';
          const previousFourLetterRoot = fourLetterRootsArray.length > 0 ? fourLetterRootsArray[fourLetterRootsArray.length - 1] : '';
          
          const matchesPreviousThreeLetterRoot = hasSameRoot(firstWordArabic, previousThreeLetterRoot);
          const matchesPreviousFullTwoLetterRoot = hasSameRoot(firstWordArabic, previousFullVersionTwoLetterRoot);
          const matchesPreviousTwoLetterRoot = hasSameRoot(firstWordArabic, previousTwoLetterRoot);
          
          // build root arrays
          
          // two letter root
          // a two letter root can only have two charaters
          // or it can have a repeated character
          // to find these roots, check that the length of the word is 2
          // check that last entry in twoLetterRootsArray is not the 
          // same as the current word to avoid duplicate  entries
          if (
            firstWordArabic.length === 2
            && (twoLetterRootsArray.length === 0 || previousTwoLetterRoot !== firstWordArabic)
            && firstWordArabic > previousTwoLetterRoot
          ) {
            twoLetterRootsArray.push(firstWordArabic);
            // add the expanded version of two letter roots to a new array for easy comparison
            fullVersionTwoLetterRootsArray.push(firstWordArabic + firstWordArabic[1]);
          }

          // three letter root
          // to find these roots, check that the length of the word is 3
          if (firstWordArabic.length === 3) {
            // check that last entry in threeLetterRootsArray is not
            // same as the current word to avoid duplicate entries
            if (threeLetterRootsArray.length === 0 || previousThreeLetterRoot !== firstWordArabic){
              if (
                firstWordArabic === previousFullVersionTwoLetterRoot
                || matchesPreviousThreeLetterRoot
                || (
                  matchesPreviousTwoLetterRoot
                  && previousTwoLetterRoot > previousThreeLetterRoot
                  && firstWordArabic < previousThreeLetterRoot
                ) 
                || (firstWordArabic === 'الى' && previousThreeLetterRoot.substr(0, 2) !== 'ال')) {
              } else if(firstWordArabic[2] === 'ة' && !matchesPreviousTwoLetterRoot) {
                const word = firstWordArabic.slice(0, 2);
                twoLetterRootsArray.push(word);
                fullVersionTwoLetterRootsArray.push(word + word[1]);
              } else {
                threeLetterRootsArray.push(firstWordArabic);
              }
            }
          }

          // four letter root
          // check that it does not contain the last four letter root
          if (firstWordArabic.length === 4) {
            // check to see if the four letter root contains the 
            // previous three letter root and only has vowels          

            if(fourLetterRootsArray.length === 0 || previousFourLetterRoot !== firstWordArabic){
              if (
                matchesPreviousThreeLetterRoot
                || matchesPreviousFullTwoLetterRoot
                || (
                  matchesPreviousTwoLetterRoot
                  && previousTwoLetterRoot > previousFourLetterRoot
                  && firstWordArabic > previousFourLetterRoot
                )
              ) {

              } else if(firstWordArabic[3] === 'ة' && !matchesPreviousThreeLetterRoot) {
                // console.log(`previous: ${previousTwoLetterRoot}`);
                // console.log(`current: ${firstWordArabic}`);
                threeLetterRootsArray.push(firstWordArabic.slice(0, 3));
              } else {
                fourLetterRootsArray.push(firstWordArabic);
              }
            }
          }
          
          // super long root!
          if (firstWordArabic.length > 4) {
            const previousLongRoot = longRootsArray.length > 0 ? longRootsArray[longRootsArray.length - 1] : '';

            if (longRootsArray.length === 0 || previousLongRoot !== firstWordArabic){
              const matchesPreviousFourLetterRoot = hasSameRoot(firstWordArabic, previousFourLetterRoot);
              const matchesPreviousLongRoot = hasSameRoot(firstWordArabic, previousLongRoot);

              const twoLetterEnd = ['ان' ,'ئذ' ,'ات'];
              const threeLetterEnd = ['انى' ,'تئذ' ,'اني', 'ذاك'];
              const hasEnding = [...twoLetterEnd, ...threeLetterEnd].find(ending => {
                const testWord = firstWordArabic.slice(0, firstWordArabic.length - ending.length);
                return firstWordArabic.endsWith(ending) && (
                  hasSameRoot(testWord, previousLongRoot)
                  || hasSameRoot(testWord, previousFourLetterRoot)
                  || hasSameRoot(testWord, previousThreeLetterRoot)
                );
              });

              if (
                matchesPreviousLongRoot 
                || matchesPreviousFourLetterRoot 
                || matchesPreviousThreeLetterRoot
                || matchesPreviousFullTwoLetterRoot
                || matchesPreviousTwoLetterRoot
                || hasEnding
              ) {
                // console.log(previousThreeLetterRoot);
                // console.log(firstWordArabic);
              } else if (firstWordArabic.startsWith('است') 
                && hasSameRoot(firstWordArabic.slice(3), previousThreeLetterRoot))
              {
                // console.log(previousThreeLetterRoot);
                // console.log(firstWordArabic);
              } else {
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