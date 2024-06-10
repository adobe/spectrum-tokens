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
import { detailedDiff } from "deep-object-diff";
import original from "./test-schemas/basic-original-token.json" with { type: "json" };
import updatedToken from "./test-schemas/basic-updated-token.json" with { type: "json" };
import updatedSeveralProperties from "./test-schemas/basic-multiple-updated-token.json" with { type: "json" };
import tokenWithSet from "./test-schemas/basic-set-token.json" with { type: "json" };
import tokenWithUpdatedSet from "./test-schemas/basic-updated-set-token.json" with { type: "json" };
import severalSetTokens from "./test-schemas/several-set-tokens.json" with { type: "json" };
import severalUpdatedSetTokens from "./test-schemas/several-updated-set-tokens.json" with { type: "json" };
import severalRenamedUpdatedSetTokens from "./test-schemas/several-renamed-updated-set-tokens.json" with { type: "json" };

const expected = {
  "swatch-border-color": { value: "{blue-200}" },
};

const expectedUpdatedSeveralProperties = {
  "swatch-border-color": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/color.json",
    value: "{blue-200}",
  },
};

const expectedUpdatedSet = {
  "overlay-opacity": {
    sets: {
      darkest: {
        value: "0.8",
      },
      light: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/color.json",
      },
      wireframe: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/wireframe.json",
        value: "0",
      },
    },
  },
};

const expectedSeveralUpdatedSet = {
  "help-text-top-to-workflow-icon-medium": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/token-set.json",
    sets: {
      desktop: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/changing-two-schemas.json",
      },
      mobile: {
        value: "9px",
      },
    },
  },
  "status-light-top-to-dot-large": {
    sets: {
      desktop: {
        value: "20px",
      },
    },
  },
};

const expectedUpdatedSetWithRename = {
  "help-text-top-to-workflow-icon-medium": {
    sets: {
      desktop: {
        value: "7px",
      },
    },
  },
  "i-like-fish-tacos": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/scaly-fish.json",
    sets: {
      mobile: {
        value: "15px",
      },
    },
  },
};

test("basic test to check if updated token is detected", (t) => {
  t.deepEqual(
    detectUpdatedTokens(
      detectRenamedTokens(original, updatedToken),
      original,
      detailedDiff(original, updatedToken),
    ),
    expected,
  );
});

test("updated more than one property of a token", (t) => {
  t.deepEqual(
    detectUpdatedTokens(
      detectRenamedTokens(original, updatedSeveralProperties),
      original,
      detailedDiff(original, updatedSeveralProperties),
    ),
    expectedUpdatedSeveralProperties,
  );
});

test("testing basic token with updates to its set property", (t) => {
  t.deepEqual(
    detectUpdatedTokens(
      detectRenamedTokens(tokenWithSet, tokenWithUpdatedSet),
      tokenWithSet,
      detailedDiff(tokenWithSet, tokenWithUpdatedSet),
    ),
    expectedUpdatedSet,
  );
});

test("testing several tokens with updates to its set property", (t) => {
  t.deepEqual(
    detectUpdatedTokens(
      detectRenamedTokens(severalSetTokens, severalUpdatedSetTokens),
      severalSetTokens,
      detailedDiff(severalSetTokens, severalUpdatedSetTokens),
    ),
    expectedSeveralUpdatedSet,
  );
});

test("testing several tokens with updates to its set property and renames", (t) => {
  t.deepEqual(
    detectUpdatedTokens(
      detectRenamedTokens(severalSetTokens, severalRenamedUpdatedSetTokens),
      severalSetTokens,
      detailedDiff(severalSetTokens, severalRenamedUpdatedSetTokens),
    ),
    expectedUpdatedSetWithRename,
  );
});
