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
import nixt from "nixt";
import fs from "fs";
import { access, readFile } from "fs/promises";
import fileImport from "../src/lib/file-import.js";

const path = fs.realpathSync("./") + "/test/";
const schemaPath = "test-schemas/";
const outputPath = "test-cli-outputs/";

test("checking file import for two branches (both main)", async (t) => {
  t.plan(1);
  return new Promise((resolve, reject) => {
    try {
      nixt()
        .expect(async () => {
          try {
            const expectedFileName = `${path}${outputPath}expected-main-branch.txt`;
            await access(expectedFileName);
            const expected = await readFile(expectedFileName, {
              encoding: "utf8",
            });
            t.snapshot(expected.trim());
          } catch (error) {
            reject(error);
          }
        })
        .run("pnpm tdiff report -otb main -ntb main")
        .end(resolve);
    } catch (error) {
      reject(error);
    }
  });
});
