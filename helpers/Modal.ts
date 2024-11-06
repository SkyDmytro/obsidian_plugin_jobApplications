import { Modal } from 'obsidian';
import { App, Setting } from 'obsidian';
import { statusToFormattedMarkDown } from './constants';

export interface ResultI {
	status: StatusID;
	companyName: string;
	positionName: string;
	jobUrl: string;
	salary: string;
}

type StatusI = 'Answered' | 'No Answer' | 'Interview' | 'Offer';
type StatusID = keyof typeof statusToFormattedMarkDown;

export default class JobApplicationModal extends Modal {
	result: ResultI;
	dropdownOptions: Record<StatusID, StatusI>;
	onSubmit: (result: ResultI) => void;

	constructor(app: App, onSubmit: (result: ResultI) => void) {
		super(app);
		this.result = {
			status: 'NO_ANSWER',
			companyName: '',
			positionName: '',
			jobUrl: '',
			salary: '',
		};
		this.dropdownOptions = {
			NO_ANSWER: 'No Answer',
			ANSWERED: 'Answered',
			INTERVIEW: 'Interview',
			OFFER: 'Offer',
		};
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl('h1', { text: 'Job application' });

		new Setting(contentEl).setName('Status').addDropdown(component => {
			return component
				.addOptions(this.dropdownOptions)
				.setValue(this.result.status)
				.onChange((value: StatusID) => (this.result.status = value));
		});

		new Setting(contentEl).setName('Company Name').addText(text =>
			text.onChange(value => {
				this.result.companyName = value;
			})
		);

		new Setting(contentEl).setName('Position Name').addText(text =>
			text.onChange(value => {
				this.result.positionName = value;
			})
		);
		new Setting(contentEl).setName('Url ').addText(text =>
			text.onChange(value => {
				this.result.jobUrl = value;
			})
		);
		new Setting(contentEl).setName('Salary').addText(text =>
			text.onChange(value => {
				this.result.salary = value;
			})
		);
		new Setting(contentEl).addButton(btn =>
			btn
				.setButtonText('Submit')
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.result);
				})
		);
	}
}
