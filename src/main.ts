import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import NoteItView, { VIEW_TYPE } from './NoteItView';
import '../node_modules/antd/dist/antd.css';

interface NoteItSettings {
  folder: string;
  cardMaxHeight: string;
  widthToTwoColumn: string;
}

const DEFAULT_SETTINGS: NoteItSettings = {
  folder: '',
  cardMaxHeight: '400',
  widthToTwoColumn: '1200',
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

  async getAllDirectory() {
    // @ts-ignore
    const dirs = await this.getDirectory(this.app.vault.adapter.basePath);
    dirs[0] = dirs[0] + '\\'
    // @ts-ignore
    return dirs.map(dir => dir.replace(this.app.vault.adapter.basePath, ''));
  }

  async getDirectory(basePath: string) {
    let dirs: string[] = [basePath];
    // @ts-ignore
    const fs = this.app.vault.adapter.fsPromises;
    // @ts-ignore
    const path = this.app.vault.adapter.path;
    // @ts-ignore
    const files = await fs.readdir(basePath);
    for (let file of files) {
      // @ts-ignore
      const filePath = path.join(basePath, file);
      if (filePath.indexOf('.obsidian') !== -1) {
        continue;
      }
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        dirs = dirs.concat(await this.getDirectory(filePath));
      }
    }

    return dirs;
  }

  createOrAppend(pathName: string, fileName: string, content: string) {
    // @ts-ignore
    const fs = this.app.vault.adapter.fs;
    // @ts-ignore
    const path = this.app.vault.adapter.path;
    // @ts-ignore
    const fullPath = path.join(this.app.vault.adapter.basePath, pathName, fileName);
    if (fs.existsSync(fullPath)) {
      fs.appendFileSync(fullPath, '\n\n' + content, 'utf8')
    } else {
      fs.writeFileSync(fullPath, content, 'utf8')
    }
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
    
    new Setting(containerEl)
    .setName('widthToTwoColumn')
    .setDesc('当宽度大于多少时变为双列')
    .addText(text => text
      .setPlaceholder('1200')
      .setValue(this.plugin.settings.widthToTwoColumn)
      .onChange(async (value) => {
        this.plugin.settings.widthToTwoColumn = value;
        await this.plugin.saveSettings();
      }));
  }
}
