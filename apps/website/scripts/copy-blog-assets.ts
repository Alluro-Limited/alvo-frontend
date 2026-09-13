import {cpSync, existsSync, mkdirSync, readdirSync, rmSync} from "node:fs";
import {resolve} from "node:path";

const src = resolve(import.meta.dirname, "../../blog-posts/images");
const dest = resolve(import.meta.dirname, "../public/blog/articles");

if (!existsSync(src)) {
  process.exit(0);
}

if (existsSync(dest)) {
  rmSync(dest, {recursive: true, force: true});
}

mkdirSync(dest, {recursive: true});

for (const entry of readdirSync(src)) {
  cpSync(resolve(src, entry), resolve(dest, entry), {recursive: true});
}
