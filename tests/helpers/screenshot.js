import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Screenshots land in screenshots/<flow>/<case>/NN-label.png, numbered in the
// order they're taken within a test case.
export function createShooter(flow, caseName) {
  const dir = path.join(__dirname, "..", "..", "screenshots", flow, caseName);
  fs.mkdirSync(dir, { recursive: true });
  let counter = 0;

  return async function shoot(page, label) {
    counter += 1;
    const filename = `${String(counter).padStart(2, "0")}-${label}.png`;
    await page.screenshot({ path: path.join(dir, filename), fullPage: true });
  };
}
