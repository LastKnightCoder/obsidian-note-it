import { TextFileView, WorkspaceLeaf } from 'obsidian'
import NoteItPlugin from './main'
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
// @ts-ignore
import NoteIt from './components/NoteIt';
import { message } from 'antd'

interface IData {
  name?: string,
  content?: string,
  preview?: string,
  createTime?: number,
  updateTime?: number,
  uuid?: string,
  isDeleted?: boolean,
  isCreated?: boolean,
  tags?: string[],
  description?: string
}

interface IState {
  editing?: IData,
  notes?: IData[]
}

export default class NoteItView extends TextFileView {
  plugin: NoteItPlugin;
  state: IState;
  root: ReactDOM.Root;
  parseError: boolean;
  oldData: string;
  constructor(leaf: WorkspaceLeaf, plugin: NoteItPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.state = {
      editing: {
        content: "",
        preview: "",
        tags: []
      },
      notes: []
    };
  }

  getViewData(): string {
    if (this.parseError) {
      return this.oldData;
    }
    const data = JSON.stringify(this.state, undefined, 2);
    return data;
  }

  setViewData(data: string, clear: boolean): void {
    try {
      this.state = JSON.parse(data || '{}');
      this.parseError = false;
    } catch (e) {
      message.error('数据解析错误');
      this.oldData = data;
      this.parseError = true;
      this.state = {
        editing: {
          content: "",
          preview: "",
          tags: []
        },
        notes: []
      };
    }

    if (this.root) {
      this.root.unmount();
    }
    this.root = ReactDOM.createRoot(this.containerEl.lastChild as HTMLDivElement);
    this.root.render(React.createElement(NoteIt, {
      state: this.state,
      plugin: this.plugin,
      save: this.handleSave.bind(this)
    }));
  }

  handleSave(state: IState) {
    this.state = state;
    this.requestSave();
  }

  clear(): void {
    if (this.root) {
      this.root.unmount();
    }
    this.state = {};
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return this.file?.basename
  }

  protected async onClose(): Promise<void> {
    if (this.root) {
      this.root.unmount();
    }
  }
}

export const VIEW_TYPE = 'note-it-view'