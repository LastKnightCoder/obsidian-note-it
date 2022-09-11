import { MarkdownRenderer } from 'obsidian';

export const renderMarkdown = async (source) => {
  const tempEl = createDiv();
  await MarkdownRenderer.renderMarkdown(source, tempEl, '.', null);
  return tempEl.innerHTML;
};

export const sleep = async time => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time);
  });
}
