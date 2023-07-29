import * as cronJob from "node-cron";
import dotenv from "dotenv";
import * as hackerNews from "./hackerNews";
import * as discordNotifier from "./discordNotifier";

dotenv.config();

export type ResultType = {
	id: number;
	text: string,
	time: number
};

let globalResults: ResultType[] = [];

export const initScheduledJobs = () => {
	const scheduledJobFunction = cronJob.schedule("*/1 * * * *", async () => {

		const userName = process.env.HN_USERNAME as string;
		const selectedPostId = process.env.HN_POST_ID as string;

		console.log("Starting check HackerNews -> Discord");

		const currentResults = await grabContentFromHN(userName, selectedPostId);
		// console.log(JSON.stringify(currentResults));

		// Compare the latest results with the previous run, 
		// if there is a change, then there are updates to this post.
		const updateAvailable = compareWithLastRun(currentResults);

		if (updateAvailable) {
			console.log("New updates available!");
			// notify Discord!
			await discordNotifier.notifyDiscord("New comments(s) available!", selectedPostId, currentResults[0].text, currentResults.length - 1);
		}

		// update the global state
		globalResults = [...currentResults];

	});

	scheduledJobFunction.start();
}


const grabContentFromHN = async (userName: string, selectedPostId: string) : Promise<ResultType[]> => {
	const userData = await hackerNews.getUser(userName);

	const selectedPost = (userData.submitted as number[]).filter(x => x === Number(selectedPostId))[0];
	const submissionData = await hackerNews.getSubmission(selectedPost);

	const latestResults: ResultType[] = [];
	latestResults.push({ id: submissionData.id, text: submissionData.text, time: submissionData.time });
	const kids = submissionData.kids as number[];
	if (kids.length > 0) {
		for (let x = 0; x < kids.length; x++) {
			const childNode = {
				id: kids[x],
				text: submissionData.text,
				time: submissionData.time
			};
			await callRecursively(childNode, latestResults);
		}
	}

	return latestResults;
};

const callRecursively = async (node: ResultType, results: ResultType[]): Promise<void> => {
	let curr = await hackerNews.getSubmission(node.id);
	// console.log(curr);
	const kids = curr.kids as number[];
	results.push({ id: node.id, text: node.text, time: node.time });

	if (kids && kids.length > 0) {
		for (let x = 0; x < kids.length; x++) {
			const childNode = {
				id: kids[x],
				text: curr.text,
				time: curr.time
			};
			await callRecursively(childNode, results);
		}
	}
};

const compareWithLastRun = (currentResults: ResultType[]) : boolean => {
	if (globalResults.length < currentResults.length) {
		return true;
	}

	if (JSON.stringify(globalResults) !== JSON.stringify(currentResults)) {
		return true;
	}

	return false;
}
