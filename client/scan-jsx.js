// scan-jsx.js
import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("./src");

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else {
      callback(filepath);
    }
  });
}

function scanForJSX(filepath) {
  if (!filepath.endsWith(".js")) return;

  const content = fs.readFileSync(filepath, "utf8");

  // Look for a JSX tag like <App> or <div>
  if (/<[A-Za-z]/.test(content)) {
    console.log("⚠️  JSX found in:", filepath);
  }
}

walk(SRC_DIR, scanForJSX);
