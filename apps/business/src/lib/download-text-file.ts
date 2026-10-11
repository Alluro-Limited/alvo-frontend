/** Triggers a browser download for generated text content (CSV templates, labels, receipts). */
export function downloadTextFile(fileName: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], {type: "text/plain"}));
  const anchor = Object.assign(document.createElement("a"), {href: url, download: fileName});
  anchor.click();
  URL.revokeObjectURL(url);
}
