const excelToJson = require("convert-excel-to-json");
const hexToRgba = require("hex-to-rgba");
const fs = require("fs");
const slugify = require("slugify");

const NAME = "name";
const VALUE = "value";
const nameMap = {
  "Spectrum Express": "express",
  Spectrum: "spectrum",
};
const rgbaRegEx =
  /rgba\(((?:(?:[01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5]) *, *){3}(?:([0-9]*[.])?[0-9]+)) *\)/;
const refRegEx = /^[A-z]+(?:-\w+)*$/;
const dimensionRegEx = /^([0-9]+(?:\.[0-9]+)?) *(dp|px)?$/;
const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const hexAlphaColorRegex =
  /^(#(?:[0-9a-fA-F]{3}){1,2}), *([1-9]|[1-9][0-9]|100)%$/;
const multilineRegEx = /\r\n/;
const setRegEx = /\s*\(((?:\w|\s)+)\)/;
const doubleSetRegEx = /\s*\(((?:\w|\s)+) +\/ +(\w+)\)/;

const tester = (regex, value) => {
  return regex.test(value.toString().trim());
};

const hexToRgb = (rgbaValue) => {
  const result = hexToRgba(rgbaValue);
  const match = result.match(rgbaRegEx);
  if (result.match(rgbaRegEx)) {
    const matchAr = match[1].split(",").map((e) => parseInt(e.trim()));
    if (matchAr[3] === 1)
      return `rgb(${matchAr[0]}, ${matchAr[1]}, ${matchAr[2]})`;
  }
  return result;
};

const formatSetName = (name) => {
  if (nameMap.hasOwnProperty(name)) {
    return nameMap[name];
  }
  return name.toLowerCase();
};

const formatToken = (token) => {
  for (const formatter of Object.values(formatters)) {
    const formattedToken = formatter(token);
    if (formattedToken) {
      return formattedToken;
      break;
    }
  }
};

const formatters = {
  reference: (token) => {
    return tester(refRegEx, token.value)
      ? { value: `{${token.value}}` }
      : false;
  },
  dimension: (token) => {
    return tester(dimensionRegEx, token.value)
      ? { value: token.value.toString().split(" ").join("") }
      : false;
  },
  hexColor: (token) => {
    return tester(hexColorRegex, token.value)
      ? { value: hexToRgb(token.value) }
      : false;
  },
  hexAlphaColor: (token) => {
    const regexMatch = token.value.match(hexAlphaColorRegex);
    return regexMatch
      ? { value: hexToRgba(regexMatch[1], regexMatch[2] / 100) }
      : false;
  },
  sets: (token) => {
    if (tester(multilineRegEx, token.value)) {
      const setItems = token.value.split("\r\n");
      const result = { sets: {} };
      setItems.forEach((item) => {
        const match = item.match(setRegEx);
        const doubleMatch = item.match(doubleSetRegEx);
        if (match) {
          match[1] = formatSetName(match[1]);
          result.sets[match[1]] = formatToken({
            name: match[1],
            value: item.substr(0, match.index),
          });
        } else if (doubleMatch) {
          doubleMatch[1] = formatSetName(doubleMatch[1]);
          doubleMatch[2] = formatSetName(doubleMatch[2]);
          if (!result.sets.hasOwnProperty(doubleMatch[1]))
            result.sets[doubleMatch[1]] = { sets: {} };
          if (!result.sets[doubleMatch[1]].sets.hasOwnProperty(doubleMatch[2]))
            result.sets[doubleMatch[1]].sets[doubleMatch[2]] = formatToken({
              name: `${doubleMatch[1]} / ${doubleMatch[2]}`,
              value: item.substr(0, doubleMatch.index),
            });
        }
      });
      return result;
    } else {
      return false;
    }
  },
  unmatchedTokens: (token) => {
    unmatchedTokens[token.name] = token.value;
    return null;
  },
};

const result = excelToJson({
  sourceFile: "Spectrum core tokens.xlsx",
  columnToKey: {
    A: NAME,
    B: VALUE,
  },
  header: {
    rows: 1,
  },
});

const formattedResult = {};
const unmatchedTokens = {};

Object.keys(result).forEach((sheet) => {
  formattedResult[sheet] = result[sheet].reduce((formattedTokens, token) => {
    if (token.hasOwnProperty(VALUE)) {
      // for single line sets i.e. `red-100 (Spectrum)`
      if (
        !tester(multilineRegEx, token.value) &&
        tester(setRegEx, token.value)
      ) {
        const valueMatch = token.value.match(setRegEx);
        token.value = token.value.substr(0, valueMatch.index);
      }
      const formattedValue = formatToken(token);
      if (formattedValue) {
        formattedTokens[token.name] = formattedValue;
      }
    }
    return formattedTokens;
  }, {});
});
Object.keys(formattedResult).forEach((sheet, i) => {
  const fileName = slugify(sheet, { lower: true, strict: true });
  fs.writeFileSync(
    `tokens/${fileName}.json`,
    JSON.stringify(formattedResult[sheet], "", 2)
  );
  console.log(`tokens/${fileName}.json created with ${Object.keys(formattedResult[sheet]).length} tokens` )
});
console.log('');
if(Object.keys(unmatchedTokens).length > 0) {
  console.log("The following tokens didn't match any known formatting and were not included:");
  console.log(unmatchedTokens);
}
// console.log(formattedResult);
