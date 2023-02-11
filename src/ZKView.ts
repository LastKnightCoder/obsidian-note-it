import { ItemView, WorkspaceLeaf } from 'obsidian';
import NoteItPlugin from './main';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
// @ts-ignore
import ZKEditor from './components/ZKEditor';

export default class ZKView extends ItemView {
  plugin: NoteItPlugin;
  root: ReactDOM.Root;
  constructor(leaf: WorkspaceLeaf, plugin: NoteItPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return ZK_VIEW_TYPE;
  }

  getDisplayText() {
    return "ZK卡片记录";
  }

  getIcon() {
    return "carrot";
  }

  onload(): void {
    this.contentEl.empty();
    let initData: any = localStorage.getItem('zk-data') || '{}';
    if (initData) {
      try {
        initData = JSON.parse(initData || '{}');
      } catch(e) {
        console.error('解析zk-data失败');
        initData = {
          content: "",
          preview: "",
          tags: [],
          createTime: Date.now()
        }
      }
    } else {
      initData = {
        content: "",
        preview: "",
        tags: [],
        createTime: Date.now()
      }
    }
    if (this.root) {
      this.root.unmount();
    }
    this.root = ReactDOM.createRoot(this.contentEl);
    this.root.render(React.createElement(ZKEditor, { 
      note: initData,
      saveToLocalStorage: this.saveToLocalStorage.bind(this),
      saveToFile: this.saveToFile.bind(this),
    }));
  }

  saveToLocalStorage(data: Record<string, unknown>) {
    localStorage.setItem('zk-data', JSON.stringify(data));
  }

  saveToFile(fileName: string, content: string) {
    this.plugin.createOrAppend(this.plugin.settings.zkFolder, fileName + '.md', content);
  }
}

export const ZK_VIEW_TYPE = "zk-view";