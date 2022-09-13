import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import NoteItView, { VIEW_TYPE } from './NoteItView';
import '../node_modules/antd/dist/antd.css';

// Remember to rename these classes and interfaces!

interface NoteItSettings {
  folder: string;
  cardMaxHeight: string;
}

const DEFAULT_SETTINGS: NoteItSettings = {
  folder: '',
  cardMaxHeight: '400'
}

export default class NoteItPlugin extends Plugin {
  settings: NoteItSettings;

  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE, (leaf) => new NoteItView(leaf, this));
    this.registerExtensions(["note"], VIEW_TYPE);

    this.addSettingTab(new NoteItSettingTab(this.app, this));

    this.addRibbonIcon('create-new', '新建小记', async () => {
      const defaultValue = {
        editing: {
          content: "",
          preview: "",
          tags: [],
        },
        notes: []
      }
      try {
        await this.app.vault.createFolder(this.settings.folder);
      } catch (e) {
        if (e.message !== 'Folder already exists.') {
          console.error(e);
        }
      }
      this.app.vault.create(`${this.settings.folder}/${Date.now()}.note`, JSON.stringify(defaultValue, undefined, 2));
    })
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class NoteItSettingTab extends PluginSettingTab {
  plugin: NoteItPlugin;

  constructor(app: App, plugin: NoteItPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;

    containerEl.empty();

    containerEl.createEl('h2', {text: '小记的设置'});

    new Setting(containerEl)
      .setName('folder')
      .setDesc('新建文件所在目录（支持嵌套）')
      .addText(text => text
        .setPlaceholder('日常/小记')
        .setValue(this.plugin.settings.folder)
        .onChange(async (value) => {
          this.plugin.settings.folder = value;
          await this.plugin.saveSettings();
        }));
    
    new Setting(containerEl)
    .setName('cardMaxHeight')
    .setDesc('卡片最大高度')
    .addText(text => text
      .setPlaceholder('400')
      .setValue(this.plugin.settings.cardMaxHeight)
      .onChange(async (value) => {
        this.plugin.settings.cardMaxHeight = value;
        await this.plugin.saveSettings();
      }));
  }
}
