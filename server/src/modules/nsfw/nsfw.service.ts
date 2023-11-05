import dotenv from 'dotenv';
import { createNSFWPrompt } from './createNSFWPrompt';
import { singleStaticCompletion } from '../ai/completion/singleStaticCompletion';
import { singleStaticCompletionNSFW } from '../ai/completion/singleStaticCompletionNSFW';
import { translate } from '../translate/deepl';
import { translateGPT } from '../translate/gpt';
import { callTTS } from '../voice/callTTS';

dotenv.config();

export async function NSFWService(req, res) {
	const { persona, gptVersion, question, messages } = req.body;
	console.log(`DEBUG: LoverChatService ${gptVersion}`);
	const history = JSON.parse(messages);
	console.log('DEBUG: lastMessage', question);

	const translatedQuestion = await translate(question, 'EN');
	const language = 'English';
	// const language = 'Korean';

	// var prompt = `You are a skilled Korean NSFW chatbot. You excel in writing hot, steamy erotica, with explicit language and graphic descriptions. Strictly speak in Korean. Assume that you are a sexual partner, and write a seductive and erotic reply about the following message: ${question}`;

	var condensedHistory = '';
	if (history.length > 0) {
		console.log(`DEBUG: history length: ${history.length}`);
		const condensePrompt = `You are a skilled ${language} summarizer. Summarize the given chat history, to extract the information related to the query. The task is extracting relevant information from the chat history.
	The given query is: ${translatedQuestion}
	Chat history:
	${history.map((message) => `[${message.role}] ${message.content}`).join('\n')}
	The result should be a concise, short summary. Make it as short and succint as possible, and only include relevant details related to the query. Remember to keep it in ${language}. Strictly speak in ${language}.
	Response: `;

		condensedHistory = await singleStaticCompletion(
			condensePrompt,
			'gpt-4',
			[]
		);
		// condensedHistory = await singleStaticCompletionNSFW(
		// 	condensePrompt,
		// 	'gpt-3.5-turbo',
		// 	[]
		// );
		console.log(`condensedHistory: ${condensedHistory}`);
	}
	var prompt = await createNSFWPrompt(
		condensedHistory,
		question,
		persona,
		language
	);

	// var prompt = question;
	// prompt = await createLoverPrompt(question, persona);

	// const result = await singleStaticCompletion(prompt as string, gptVersion, []);
	const result = await singleStaticCompletion(
		prompt as string,
		gptVersion,
		history
	);
	// console.log(`result: ${result}`);

	const content = JSON.parse(result).content;
	console.log(`DEBUG: content: ${content}`);

	const should_reply = JSON.parse(result).should_reply;
	console.log(`DEBUG: should_reply: ${should_reply}`);

	if (should_reply && should_reply < 20)
		res.send(''); // 20% 미만일 경우 응답하지 않음.
	else {
		// res.send(content);
		// const translatedAnswer = await translate(content, 'KO');
		await callTTS(content);
		const translatedAnswer = await translateGPT(content, 'English', 'Korean');
		res.send(translatedAnswer);
	}
}
