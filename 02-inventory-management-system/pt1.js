const fs = require('fs')

const data = fs.readFileSync('taraData.txt', 'utf8')

const dataArray = data.split('\n')

// abcdef contains no letters that appear exactly two or three times.
// bababc contains two a and three b, so it counts for both.
// abbcde contains two b, but no letter appears exactly three times.
// abcccd contains three c, but no letter appears exactly two times.
// aabcdd contains two a and two d, but it only counts once.
// abcdee contains two e.
// ababab contains three a and three b, but it only counts once.

let twoCounter = 0;
let threeCounter = 0;

function searchString(str) {
  const letters = str.split("");

  const frequencyMap = letters.reduce((acc, letter) => {
    acc[letter] = acc[letter] ? acc[letter]+1 : 1;
    return acc;
  }, {});

  const frequencyArr = Object.keys(frequencyMap);

  const hasTwo = !!frequencyArr.find((letter) => {
    return frequencyMap[letter] === 2;
  });

  const hasThree = !!frequencyArr.find((letter) => {
    return frequencyMap[letter] === 3;
  });
  
  if(hasTwo){twoCounter++};
  if(hasThree){threeCounter++};
}

dataArray.forEach((str) => {
  searchString(str);
})

console.log(twoCounter);
console.log(threeCounter);

const checksum = twoCounter * threeCounter;

console.log({ checksum });
