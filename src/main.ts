import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import NoteItView, { VIEW_TYPE } from './NoteItView';

// Remember to rename these classes and interfaces!

interface NoteItSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: NoteItSettings = {
  mySetting: 'default'
}

export default class NoteItPlugin extends Plugin {
  settings: NoteItSettings;

  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE, (leaf) => new NoteItView(leaf, this));
    this.registerExtensions(["note"], VIEW_TYPE);

    this.addSettingTab(new NoteItSettingTab(this.app, this));

    this.addRibbonIcon('create-new', '新建小记', () => {
      const defaultValue = {
        editing: {
          content: "",
          preview: "",
          tags: [],
        },
        notes: []
      }
      this.app.vault.create(`${Date.now()}.note`, JSON.stringify(defaultValue, undefined, 2));
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

    containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc('It\'s a secret')
      .addText(text => text
        .setPlaceholder('Enter your secret')
        .setValue(this.plugin.settings.mySetting)
        .onChange(async (value) => {
          console.log('Secret: ' + value);
          this.plugin.settings.mySetting = value;
          await this.plugin.saveSettings();
        }));
  }
}
