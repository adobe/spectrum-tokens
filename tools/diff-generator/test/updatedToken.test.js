/*
Copyright {{ now() | date(format="%Y") }} Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import test from "ava";
import detectUpdatedTokens from "../src/lib/updated-token-detection.js";
import detectRenamedTokens from "../src/lib/renamed-token-detection.js";
import detectNewTokens from "../src/lib/added-token-detection.js";
import detectDeprecatedTokens from "../src/lib/deprecated-token-detection.js";
import { detailedDiff } from "deep-object-diff";
import original from "./test-schemas/basic-original-token.json" with { type: "json" };
import updatedToken from "./test-schemas/basic-updated-token.json" with { type: "json" };
import updatedSeveralProperties from "./test-schemas/basic-multiple-updated-token.json" with { type: "json" };
import tokenWithSet from "./test-schemas/basic-set-token.json" with { type: "json" };
import tokenWithUpdatedSet from "./test-schemas/basic-updated-set-token.json" with { type: "json" };
import severalSetTokens from "./test-schemas/several-set-tokens.json" with { type: "json" };
import severalUpdatedSetTokens from "./test-schemas/several-updated-set-tokens.json" with { type: "json" };
import severalRenamedUpdatedSetTokens from "./test-schemas/several-renamed-updated-set-tokens.json" with { type: "json" };
import basicSetTokenProperty from "./test-schemas/basic-set-token-property.json" with { type: "json" };
import addedPropertySetToken from "./test-schemas/added-property-set-token.json" with { type: "json" };

const expected = {
  added: {},
  deleted: {},
  updated: {
    "swatch-border-color": {
      value: {
        "new-value": "{blue-200}",
        path: "value",
        "original-value": "{gray-900}",
      },
    },
  },
};

const expectedUpdatedSeveralProperties = {
  added: {},
  deleted: {},
  updated: {
    "swatch-border-color": {
      $schema: {
        "new-value":
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/color.json",
        path: "$schema",
        "original-value":
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
      },
      value: {
        "new-value": "{blue-200}",
        path: "value",
        "original-value": "{gray-900}",
      },
    },
  },
};

const expectedUpdatedSet = {
  added: {},
  deleted: {},
  updated: {
    "overlay-opacity": {
      sets: {
        darkest: {
          value: {
            "new-value": "0.8",
            "original-value": "0.6",
            path: "sets.darkest.value",
          },
        },
        light: {
          $schema: {
            "new-value":
              "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/color.json",
            "original-value":
              "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/opacity.json",
            path: "sets.light.$schema",
          },
        },
        wireframe: {
          $schema: {
            "new-value":
              "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/wireframe.json",
            "original-value":
              "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/opacity.json",
            path: "sets.wireframe.$schema",
          },
          value: {
            "new-value": "0",
            "original-value": "0.4",
            path: "sets.wireframe.value",
          },
        },
      },
    },
  },
};

const expectedSeveralUpdatedSet = {
  added: {},
  deleted: {},
  updated: {
    "help-text-top-to-workflow-icon-medium": {
      $schema: {
        "new-value":
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/token-set.json",
        path: "$schema",
        "original-value":
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/scale-set.json",
      },
      sets: {
        desktop: {
          $schema: {
            "new-value":
              "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/changing-two-schemas.json",
            "original-value":
              "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/dimension.json",
            path: "sets.desktop.$schema",
          },
        },
        mobile: {
          value: {
            "new-value": "9px",
            "original-value": "4px",
            path: "sets.mobile.value",
          },
        },
      },
    },
    "status-light-top-to-dot-large": {
      sets: {
        desktop: {
          value: {
            "new-value": "20px",
            "original-value": "15px",
            path: "sets.desktop.value",
          },
        },
      },
    },
  },
};

const expectedUpdatedSetWithRename = {
  added: {},
  deleted: {},
  updated: {
    "help-text-top-to-workflow-icon-medium": {
      sets: {
        desktop: {
          value: {
            "new-value": "7px",
            "original-value": "3px",
            path: "sets.desktop.value",
          },
        },
      },
    },
    "i-like-fish-tacos": {
      $schema: {
        "new-value":
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/scaly-fish.json",
        "original-value":
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/scale-set.json",
        path: "$schema",
      },
      sets: {
        mobile: {
          value: {
            "new-value": "15px",
            "original-value": "12px",
            path: "sets.mobile.value",
          },
        },
      },
    },
  },
};

const expectedAddedProperty = {
  added: {
    "celery-background-color-default": {
      sets: {
        "random-property": {
          $schema:
            "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
          value: "{spinach-100}",
          uuid: "1234",
        },
      },
    },
  },
  deleted: {},
  updated: {},
};

const expectedDeletedProperty = {
  added: {},
  deleted: {
    "celery-background-color-default": {
      sets: {
        "random-property": {
          $schema:
            "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
          value: "{spinach-100}",
          uuid: "1234",
        },
      },
    },
  },
  updated: {},
};

test("basic test to check if updated token is detected", (t) => {
  const diff = detailedDiff(original, updatedToken);
  const renamed = detectRenamedTokens(original, updatedToken);
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(renamed, deprecated, diff.added, original);

  t.deepEqual(
    detectUpdatedTokens(renamed, original, diff, added, deprecated),
    expected,
  );
});

test("updated more than one property of a token", (t) => {
  const diff = detailedDiff(original, updatedSeveralProperties);
  const renamed = detectRenamedTokens(original, updatedSeveralProperties);
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(renamed, deprecated, diff.added, original);

  t.deepEqual(
    detectUpdatedTokens(renamed, original, diff, added, deprecated),
    expectedUpdatedSeveralProperties,
  );
});

test("testing basic token with updates to its set property", (t) => {
  const diff = detailedDiff(tokenWithSet, tokenWithUpdatedSet);
  const renamed = detectRenamedTokens(tokenWithSet, tokenWithUpdatedSet);
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(renamed, deprecated, diff.added, tokenWithSet);

  t.deepEqual(
    detectUpdatedTokens(renamed, tokenWithSet, diff, added, deprecated),
    expectedUpdatedSet,
  );
});

test("testing several tokens with updates to its set property", (t) => {
  const diff = detailedDiff(severalSetTokens, severalUpdatedSetTokens);
  const renamed = detectRenamedTokens(
    severalSetTokens,
    severalUpdatedSetTokens,
  );
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(
    renamed,
    deprecated,
    diff.added,
    severalSetTokens,
  );

  t.deepEqual(
    detectUpdatedTokens(renamed, severalSetTokens, diff, added, deprecated),
    expectedSeveralUpdatedSet,
  );
});

test("testing several tokens with updates to its set property and renames", (t) => {
  const diff = detailedDiff(severalSetTokens, severalRenamedUpdatedSetTokens);
  const renamed = detectRenamedTokens(
    severalSetTokens,
    severalRenamedUpdatedSetTokens,
  );
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(
    renamed,
    deprecated,
    diff.added,
    severalSetTokens,
  );

  t.deepEqual(
    detectUpdatedTokens(renamed, severalSetTokens, diff, added, deprecated),
    expectedUpdatedSetWithRename,
  );
});

test("testing adding a property to a token with sets", (t) => {
  const diff = detailedDiff(basicSetTokenProperty, addedPropertySetToken);
  const renamed = detectRenamedTokens(
    basicSetTokenProperty,
    addedPropertySetToken,
  );
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(
    renamed,
    deprecated,
    diff.added,
    basicSetTokenProperty,
  );

  t.deepEqual(
    detectUpdatedTokens(
      renamed,
      basicSetTokenProperty,
      diff,
      added,
      deprecated,
    ),
    expectedAddedProperty,
  );
});

test("testing deleting a property to a token with sets", (t) => {
  const diff = detailedDiff(addedPropertySetToken, basicSetTokenProperty);
  const renamed = detectRenamedTokens(
    addedPropertySetToken,
    basicSetTokenProperty,
  );
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(
    renamed,
    deprecated,
    diff.added,
    addedPropertySetToken,
  );
  t.deepEqual(
    detectUpdatedTokens(
      renamed,
      addedPropertySetToken,
      diff,
      added,
      deprecated,
    ),
    expectedDeletedProperty,
  );
});
