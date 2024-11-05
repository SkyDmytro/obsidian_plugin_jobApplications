import { App, TFile } from "obsidian";
import { ResultI } from "./Modal";

export const getJobApplicationFile = (
	app: App,
	settings: string,
): TFile[] | null => {
	return app.vault.getMarkdownFiles().filter((file) => {
		return file.path === `${settings}.md`;
	});
};

export const formatObjectToTableMDString = (application: ResultI): string => {
	return `|${application.status}|${application.companyName}|${application.positionName}|[URL posting](${application.jobUrl})|${application.salary}|`;
};
