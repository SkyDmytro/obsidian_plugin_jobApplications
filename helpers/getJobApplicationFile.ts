import { App, TFile } from "obsidian";
import { ResultI } from "./Modal";

export const getJobApplicationFile = (
	app: App,
	settings: string
): TFile[] | null => {
	return app.vault.getMarkdownFiles().filter((file) => {
		return file.path === `${settings}.md`;
	});
};

export const formatObjectToTableMDString = (application: ResultI): string => {
	return `|${application.status}<br>${
		new Date().getDate().toString() +
		"." +
		new Date().getMonth().toString() +
		"." +
		new Date().getFullYear().toString().slice(-2)
	} |${application.companyName}|${application.positionName}|[URL posting](${
		application.jobUrl
	})|${application.salary}|`;
};
