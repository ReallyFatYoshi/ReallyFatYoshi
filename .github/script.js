#!/env/bin node
import * as fs from "node:fs";
import * as path from "node:path";

import pkg from "js-beautify";
import axios from "axios";

const url = `https://api.github.com/users/ReallyFatYoshi/events`;
const { html_beautify } = pkg;

/**
 * Create HTML Element.
 *
 * @param {string} tag
 * @param {object} attr
 * @param {any} value
 * @returns {string}
 */
function createElement(tag, attr = {}, value = "") {
  return `<${tag} ${Object.entries(attr)
    .map((item) => `${item[0]}="${item[1]}"`)
    .join(" ")}>${value}</${tag}>`;
}

const TEMPLATE_PATH = path.join(process.cwd(), ".github/template.md");

async function main() {
  const response = await axios.get(url);
  const latestCommit = response.data.filter((v) => v.type != "WatchEvent")[0];
  const commitElement = createElement(
    "a",
    {
      target: "_blank",
      href: `https://github.com/${latestCommit.repo.name}`,
    },
    "~ View latest commit ~"
  );

  let content = fs.readFileSync(TEMPLATE_PATH, "utf8");
  content = content.replace(/\<\!\-\-\#LATEST_COMMIT\-\-\>/g, commitElement);

  fs.writeFileSync(
    path.join(process.cwd(), "README.md"),
    html_beautify(content, { indent_size: 4 })
  );
}

main();
