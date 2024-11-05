import { Modal } from "obsidian";
import { App, Setting } from "obsidian";

export interface ResultI {
	status: StatusI;
	companyName: string;
	positionName: string;
	jobUrl: string;
	salary: string;
}

type StatusI = "Answered" | "No Answer" | "Interview" | "Offer";

export default class JobApplicationModal extends Modal {
	result: ResultI;
	dropdownOptions: Record<string, StatusI>;
	onSubmit: (result: ResultI) => void;

	constructor(app: App, onSubmit: (result: ResultI) => void) {
		super(app);
		this.result = {
			status: "No Answer",
			companyName: "",
			positionName: "",
			jobUrl: "",
			salary: "",
		};
		this.dropdownOptions = {
			ANS: "Answered",
			NOAn: "No Answer",
			Int: "Interview",
			Off: "Offer",
		};
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "Job application" });

		new Setting(contentEl).setName("Status").addDropdown((component) => {
			return component
				.addOptions(this.dropdownOptions)
				.setValue(this.result.status)
				.onChange(
					(value) =>
						(this.result.status = this.dropdownOptions[value]),
				);
		});

		new Setting(contentEl).setName("Company Name").addText((text) =>
			text.onChange((value) => {
				this.result.companyName = value;
			}),
		);

		new Setting(contentEl).setName("Position Name").addText((text) =>
			text.onChange((value) => {
				this.result.positionName = value;
			}),
		);
		new Setting(contentEl).setName("Url ").addText((text) =>
			text.onChange((value) => {
				this.result.jobUrl = value;
			}),
		);
		new Setting(contentEl).setName("Salary").addText((text) =>
			text.onChange((value) => {
				this.result.salary = value;
			}),
		);
		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.result);
				}),
		);
	}
}
