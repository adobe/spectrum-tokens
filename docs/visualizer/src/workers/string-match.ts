// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

export interface StringMatchDictionaryItem {
  value: string;
  type: string;
  metadata: string;
}

export interface StringMatchSearchResult {
  value: string;
  type: string;
  matchMarkup: string;
}

import { ValuePathSplitter, ValuesListSplitter } from "../models/graph-model";

let dictionary: StringMatchDictionaryItem[] = [];

function findMatches(query: string) {
  const _results: StringMatchSearchResult[] = [];

  dictionary.forEach((item) => {
    // this metadata string is the structured
    // syntax used to persist token values in
    // our data model..  here we destructure it
    // and make a match string that is a list
    // of the raw values so that they can be searched for
    let metadataStr = item.metadata;
    if (metadataStr) {
      const valuePaths = metadataStr.split(ValuesListSplitter);
      let justValues: string[] = [];
      if (valuePaths.length === 1 && valuePaths[0] === "") {
        justValues = [];
      } else {
        justValues = valuePaths.map((value) => {
          const parts = value.split(ValuePathSplitter);
          return parts[0] || "";
        });
      }
      metadataStr = justValues.join(",");
    }

    if (query === "") {
      _results.push({
        value: item.value,
        matchMarkup: item.value,
        type: item.type,
      });
    } else if (item.value.indexOf(query) >= 0) {
      _results.push({
        value: item.value,
        type: item.type,
        matchMarkup: item.value.replaceAll(query, `<span>${query}</span>`),
      });
    } else if (metadataStr.indexOf(query) >= 0) {
      // const [beforeQuery, ...rest] = metadataStr.split(query);
      // const afterQuery = rest.join(query);
      // const displayStr = `${beforeQuery}<span>${query}</span>${afterQuery}`;
      const displayStr = metadataStr.replaceAll(query, `<span>${query}</span>`);
      _results.push({
        value: item.value,
        type: item.type,
        matchMarkup: `${item.value} ${displayStr}`,
      });
    }
  });

  _results.sort((a, b) => {
    if (a.value === b.value) {
      return 0;
    }
    return a.value > b.value ? 1 : -1;
  });

  self.postMessage(_results);
}

self.addEventListener("message", (event) => {
  const rawData = event.data;
  const eventName = rawData.name || "default";
  const eventValue = rawData.value || "";
  switch (eventName) {
    case "set-dictionary":
      dictionary = eventValue as StringMatchDictionaryItem[];
      break;
    case "find-matches":
      findMatches(eventValue as string);
      break;
    default:
      break;
  }
});
