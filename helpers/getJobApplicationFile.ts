import { App, TFile } from 'obsidian';
import { ResultI } from './Modal';
import { statusToFormattedMarkDown } from './constants';

export const getJobApplicationFile = (
	app: App,
	settings: string
): TFile[] | null => {
	return app.vault.getMarkdownFiles().filter(file => {
		return file.path === `${settings}.md`;
	});
};

export const getApplicationId = async (file: TFile, app: App) => {
	const fileContent = await app.vault.read(file);
	const lines = fileContent.trim().split('\n');
	let lastLine = lines[lines.length - 1];
	if (lastLine === '') {
		lastLine = lines[lines.length - 2];
	}
	const id = lastLine.trim().split('|')[1].split('<br>')[0];
	return (+id + 1).toString().trim();
};

export const getFullDate = () => {
	return (
		new Date().getDate().toString() +
		'.' +
		new Date().getMonth().toString() +
		'.' +
		new Date().getFullYear().toString().slice(-2)
	);
};

export const isLastLineEmpty = async (file: TFile, app: App) => {
	const fileContent = await app.vault.read(file);
	const lines = fileContent.trim().split('\n');
	const lastLine = lines[lines.length - 1];
	const lastLineSplited = lastLine.split('|');
	if (lastLine === '' || lastLineSplited[lastLineSplited.length - 1] === '') {
		return true;
	}
	return false;
};

export const formatObjectToTableMDString = (application: ResultI): string => {
	const status =
		statusToFormattedMarkDown[
			application.status as keyof typeof statusToFormattedMarkDown
		];
	console.log(status);
	return `|${status} |${application.companyName}|${application.positionName}|[URL](${application.jobUrl})|${application.salary}|`;
};

export const getFinalString = async (
	file: TFile,
	app: App,
	result: ResultI
): Promise<string> => {
	const stringToAppend = formatObjectToTableMDString(result);
	const nextId = await getApplicationId(file, app);
	const isLastLineEmptyFile = await isLastLineEmpty(file, app);
	const date = getFullDate();
	const finalString = `|${nextId}<br><br>${date}${stringToAppend}`;
	if (isLastLineEmptyFile) {
		return finalString;
	} else {
		return `\n${finalString}`;
	}
};
