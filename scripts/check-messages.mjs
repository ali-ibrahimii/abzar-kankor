/**
 * Compares the message bundles. Fails when a locale is missing a key, has an
 * extra key, or when arrays that must stay parallel have different lengths.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "src", "messages");
const base = "fa";
const targets = ["en", "ps"];

const read = (locale) => JSON.parse(readFileSync(join(dir, `${locale}.json`), "utf8"));

function walk(baseValue, value, path, problems) {
  if (Array.isArray(baseValue)) {
    if (!Array.isArray(value)) {
      problems.push(`${path}: expected an array`);
      return;
    }
    if (baseValue.length !== value.length) {
      problems.push(`${path}: array length ${value.length} (expected ${baseValue.length})`);
    }
    baseValue.forEach((item, index) => walk(item, value[index], `${path}[${index}]`, problems));
    return;
  }

  if (baseValue && typeof baseValue === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      problems.push(`${path}: expected an object`);
      return;
    }
    const baseKeys = Object.keys(baseValue);
    const keys = Object.keys(value);
    for (const key of baseKeys) {
      if (!(key in value)) problems.push(`${path}.${key}: missing`);
      else walk(baseValue[key], value[key], `${path}.${key}`, problems);
    }
    for (const key of keys) {
      if (!(key in baseValue)) problems.push(`${path}.${key}: unexpected key`);
    }
    return;
  }

  if (typeof value !== typeof baseValue) {
    problems.push(`${path}: type ${typeof value} (expected ${typeof baseValue})`);
  }
}

const baseMessages = read(base);
let failed = false;

for (const locale of targets) {
  const problems = [];
  walk(baseMessages, read(locale), locale, problems);
  if (problems.length) {
    failed = true;
    console.error(`\n✖ ${locale}.json (${problems.length} problem${problems.length === 1 ? "" : "s"})`);
    for (const problem of problems) console.error("   " + problem);
  } else {
    console.log(`✔ ${locale}.json matches ${base}.json`);
  }
}

if (failed) {
  console.error("\nMessage bundles must have identical keys and array lengths.\n");
  process.exit(1);
}

console.log("✔ All message bundles are in sync.");
