import axios from 'axios';

export async function getSubscriberCount(
	subredditTitle: string
): Promise<number> {
	try {
		const url = `https://www.reddit.com/r/${subredditTitle}/about.json`;
		const response = await axios.get(url);
		return response.data.data.subscribers;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(
				`Failed to get subscriber count for subreddit "${subredditTitle}": ${error.message}`
			);
			throw new Error(
				`Failed to get subscriber count for subreddit "${subredditTitle}": ${error.message}`
			);
		} else {
			console.error(`An unexpected error occurred: ${error}`);
			throw new Error(`An unexpected error occurred: ${error}`);
		}
	}
}
