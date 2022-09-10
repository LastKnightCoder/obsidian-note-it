import { TextFileView, WorkspaceLeaf } from 'obsidian'
import NoteItPlugin from './main'
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
// @ts-ignore
import NoteIt from './components/NoteIt';

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
  constructor(leaf: WorkspaceLeaf, plugin: NoteItPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.state = {
      editing: {
        content: ""
      },
      notes: []
    };
  }

  getViewData(): string {
    const data = JSON.stringify(this.state, undefined, 2);
    return data;
  }

  setViewData(data: string, clear: boolean): void {
    this.state = JSON.parse(data);
    
    this.root = ReactDOM.createRoot(this.containerEl.lastChild as HTMLDivElement);
    this.root.render(React.createElement(NoteIt, {
      state: this.state,
      save: this.handleSave.bind(this)
    }));
  }

  handleSave(state: IState) {
    this.state = state;
    this.requestSave();
  }

  clear(): void {
    this.state = {};
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return this.file?.basename + '.' +  this.file?.extension
  }

  // protected async onOpen(): Promise<void> {
  //   console.log('Opened');
  // }

  protected async onClose(): Promise<void> {
    this.root.unmount()
  }
}

export const VIEW_TYPE = 'note-it-view'