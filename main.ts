import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import AddJobModal, { ResultI } from "./helpers/Modal";
import {
	getJobApplicationFile,
	formatObjectToTableMDString,
} from "./helpers/getJobApplicationFile";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		const jobFile =
			getJobApplicationFile(this.app, this.settings.mySetting) || [];
		console.log(jobFile);
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		this.addCommand({
			id: "add-new-job",
			name: "Add new job application",
			callback: () => {
				new AddJobModal(this.app, (result: ResultI) => {
					const stringToAppend = formatObjectToTableMDString(result);
					if (jobFile?.length !== 0) {
						this.app.vault.append(
							jobFile[0],
							"\n" + stringToAppend
						);
					}
				}).open();
			},
		});
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Path to Job application file ")
			.addText((text) =>
				text
					.setPlaceholder("Enter your path without first /")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
