const fs = require("fs");

const data = fs.readFileSync("rawData.txt", "utf8");

const dataArray = data.split("\n");

const finalSum = dataArray.reduce((acc, curr) => {
  acc = acc + parseInt(curr);
  return acc;
}, 0);

console.log(finalSum);