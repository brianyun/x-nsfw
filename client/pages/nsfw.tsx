import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { messagesState } from 'recoil/atoms';
import { ThumbnailImage, palette } from 'common/styles';
import { Message } from 'common/models';
import { AIMessage, UserMessage, NextHead } from 'components';
import { useRouter } from 'next/router';
import { ControlView } from 'components/chat/ControlView';
import { API_URL } from 'environment';

export const nsfw = () => {
	const router = useRouter();

	const [input, setInput] = useState<string>('');
	const [messages, setMessages] = useRecoilState<Array<Message>>(messagesState);
	const containerRef = useRef(null);
	const [disableInput, setDisableInput] = useState<boolean>(false);
	const thumbnailImage = require('../common/assets/tf_logo_black.png');

	// scroll to bottom when new message is added
	useEffect(() => {
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
	}, [messages]);

	useEffect(() => {
		// 마지막 메세지가 user 이면 streamResponse 호출
		if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
			const input = messages[messages.length - 1].content;
			streamResponse(input, messages);
		}
	}, [messages]);

	const handleInputChange = (event: any) => {
		setInput(event.target.value);
	};

	// when new message is submitted, add it to messages array, and call api for another message
	const handleSubmit = async (event: any) => {
		event.preventDefault();
		addInputMessage(input);
	};

	const streamResponse = async (input: string, messages: Array<Message>) => {
		try {
			// 첫 질문은 히스토리에 포함시키지 않는다.
			// 마지막 유저 질문은 히스토리에 포함시키지 않는다 (어차피 prompt로 포함되어 들어간다).
			// id, confidence 는 전달하지 않는다.
			const trimmedMessages = messages
				.slice(0, -1)
				// .filter((m) => m.id !== 0)
				// .filter((m) => m.id !== 1)
				.map(({ id, confidence, role, content }) => ({ role, content }));

			const response = await fetch(`${API_URL}/nsfw`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					persona: formData,
					gptVersion: formData.gptVersion,
					question: input,
					messages: JSON.stringify(trimmedMessages),
				}),
			});

			if (!response.body) {
				throw new Error();
			}

			const reader = response.body
				.pipeThrough(new TextDecoderStream())
				.getReader();

			const { value, done } = await reader.read();
			const newAIMessage = {
				role: 'assistant',
				content: value,
			} as Message;
			setMessages([...messages, newAIMessage]);
			setDisableInput(false);

			// const newAIMessages: Message[] = [];
			// var generatedText = '';

			// while (true) {
			// 	const { value, done } = await reader.read();

			// 	if (done) {
			// 		setDisableInput(false);
			// 		break;
			// 	}

			// 	var data = value.split('MESSAGE: ').splice(1, 1)[0];
			// 	if (!data) continue;

			// 	generatedText = data;
			// 	newAIMessages[0] = {
			// 		role: 'assistant',
			// 		content: generatedText,
			// 	} as Message;

			// 	setMessages([...messages, ...newAIMessages]);
			// }

			// return generatedText;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const addInputMessage = (text) => {
		setInput('');
		setDisableInput(true);

		const newUserMessage = {
			role: 'user',
			content: text,
		} as Message;
		setMessages((msgs) => [...msgs, newUserMessage]);
	};

	const [formData, setFormData] = useState<Persona>(EMPTY_PERSONA);
	useEffect(() => {
		if (!!localStorage.getItem('formData'))
			setFormData(JSON.parse(localStorage.getItem('formData')));
	}, []);

	return (
		<>
			<NextHead />
			<Div>
				<ControlView formData={formData} setFormData={setFormData} />
				<ChatView>
					<HeaderContainer>
						<Title onClick={() => router.reload()}>Lover</Title>
						<ThumbnailImage
							onClick={() => router.reload()}
							src={thumbnailImage}
							alt="AI"
						/>
					</HeaderContainer>
					<MessageContainer ref={containerRef}>
						{messages.map((msg, index) =>
							msg.role === 'assistant' ? (
								<AIMessage
									key={'message' + msg.content}
									text={msg.content}
									confidence={null}
									loadingFollowup={false}
									thumbnailImage={thumbnailImage}
								/>
							) : (
								<UserMessage key={msg.content} text={msg.content} />
							)
						)}
					</MessageContainer>
					<Form onSubmit={handleSubmit}>
						<input
							type="text"
							value={input}
							onChange={handleInputChange}
							placeholder="무엇이든 물어보세요"
							style={{ width: '100%' }}
						/>
						<button type="submit" disabled={disableInput}>
							질문하기
						</button>
					</Form>
				</ChatView>
			</Div>
		</>
	);
};

export default nsfw;

const Div = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100vh;
	margin: 0 auto;
	background-color: ${palette.grey[100]};
	position: relative;
`;
const ChatView = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 800px;
	height: 100vh;
	background-color: ${palette.white};
	padding: 1rem;
	position: relative;
	margin: 0 auto;

	@media (max-width: 800px) {
		padding: 0.5rem;
		overflow: hidden !important;
		height: calc(100vh - 100px) !important;
		margin-bottom: 0 !important;
	}
`;
const HeaderContainer = styled.div`
	display: flex;
	flex-direction: row;
	max-width: 800px;
	justify-content: center;
	align-items: center;
	height: 3rem;
	margin: 0 auto 0.5rem auto;
	z-index: 1000;

	@media (max-width: 800px) {
		height: 2rem;

		img {
			display: none;
		}
	}
`;

const Title = styled.h2<{ color?: string }>`
	margin: auto 0.5rem;
	text-align: center;
	font-size: 1.5rem;
	letter-spacing: -0.23px;
	font-weight: bold;
	color: ${(props) => props.color || 'black'};
	cursor: pointer;

	@media (max-width: 800px) {
		font-size: 1rem;
	}
`;

const MessageContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: calc(100% - 3.5rem - 3rem);
	justify-content: top;
	align-items: center;
	overflow-y: scroll;

	@media (max-width: 800px) {
		height: calc(100% - 2.5rem - 2rem);
	}
`;
const Form = styled.form`
	display: flex;
	flex-direction: row;
	width: calc(100% - 2rem);
	height: 3rem;
	margin: 0.5rem auto 0 auto;

	input {
		outline: none;
		cursor: pointer;
		height: 100%;
		padding: 0.5rem 1rem;
		width: calc(100% - 5rem);
		border: 1px solid ${palette.grey[300]};
		border-radius: 0.5rem;
		font-size: 1rem;

		&:disabled {
			cursor: not-allowed;
			background-color: ${palette.grey[300]};
			color: ${palette.grey[500]};
		}
	}

	button {
		outline: none;
		border: 1px solid ${palette.grey[300]};
		cursor: pointer;
		border-radius: 0.5rem;
		height: 100%;
		padding: 0.5rem;
		margin-left: 1rem;
		width: 6rem;
		color: black;
		background-color: ${palette.grey[300]};
		transition: background-color 0.5s ease-in;
		font-size: 1rem;

		&:disabled {
			cursor: not-allowed;
			background-color: ${palette.grey[300]};
			color: ${palette.grey[500]};
		}
		&:hover {
			background-color: ${palette.brand.dark};
			color: ${palette.white};
		}
	}

	@media (max-width: 800px) {
		width: calc(100% - 1rem);
		height: 2.5rem;
		margin-bottom: 0.5rem;

		input {
			font-size: 14px;
		}
		button {
			font-size: 14px;
		}
	}
`;

export const EMPTY_PERSONA: Persona = {
	name: '',
	chrName: '',
	demographic: '',
	personality: [],
	MBTI: '',
	OCEAN: {
		Openness: 0,
		Conscientiousness: 0,
		Extraversion: 0,
		Agreeableness: 0,
		Neuroticism: 0,
	},
	tendency: '',
	toneOfSpeech: '',
	oneLineDescription: '',
	similarFamousPerson: '',
	exampleSentence: '',
	gptVersion: 'gpt-4',
};

export type Persona = {
	name: string;
	chrName: string;
	demographic: string;
	personality: Array<string>;
	MBTI: string;
	OCEAN: {
		Openness: number;
		Conscientiousness: number;
		Extraversion: number;
		Agreeableness: number;
		Neuroticism: number;
	};
	tendency: string;
	toneOfSpeech: string;
	oneLineDescription: string;
	similarFamousPerson: string;
	exampleSentence: string;
	gptVersion?: string;
};
