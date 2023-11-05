import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { messagesState } from 'recoil/atoms';
import { ThumbnailImage, palette } from 'common/styles';
import { Message } from 'common/models';
import { API_URL } from '../environment';
import { AIMessage, UserMessage, NextHead } from 'components';
import axios from 'axios';
import { useRouter } from 'next/router';
import useBeforeUnload from 'hooks/useBeforeUnload';

export const Character = () => {
	const router = useRouter();

	const [input, setInput] = useState<string>('');
	const [messages, setMessages] = useRecoilState<Array<Message>>(messagesState);
	const containerRef = useRef(null);
	const [disableInput, setDisableInput] = useState<boolean>(false);
	const thumbnailImage = require('../common/assets/huisang.jpg');
	const [userId, setUserId] = useState<string>('');

	useEffect(() => {
		getGreetingAndUserId();
	}, []);

	const getGreetingAndUserId = async () => {
		const isNewUser = !localStorage.getItem('userId');

		const response = await axios.get(`${API_URL}/character/greeting`, {
			params: {
				isNewUser: isNewUser,
			},
		});

		if (isNewUser) {
			console.log(response.data.userId);
			localStorage.setItem('userId', response.data.userId);
			setUserId(response.data.userId);
		} else {
			setUserId(localStorage.getItem('userId'));
		}

		console.log(response.data.message);
		setMessages([
			{
				id: 0,
				role: 'assistant',
				content: response.data.message,
			} as Message,
		]);
	};

	const handleUnload = async () => {
		try {
			// Your API call using fetch or any other method
			const trimmedMessages = messages
				.slice(0, -1)
				.filter((m) => m.id !== 0)
				.filter((m) => m.id !== 1)
				.map(({ id, confidence, role, content }) => ({ role, content }));

			const response = await fetch(`${API_URL}/reflection`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					characterId: 'huisang',
					userId: userId,
					messages: JSON.stringify(trimmedMessages),
				}),
			});

			if (response.ok) {
				console.log('API call successful before unloading.');
			} else {
				console.log('API call failed before unloading.');
			}
		} catch (error) {
			console.error('Error occurred during API call before unloading:', error);
		}
	};

	useBeforeUnload(handleUnload);

	// scroll to bottom when new message is added
	useEffect(() => {
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
	}, [messages]);

	useEffect(() => {
		// 마지막 메세지가 user 이면 streamResponse 호출
		if (messages.length > 1 && messages[messages.length - 1].role === 'user') {
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
				.filter((m) => m.id !== 0)
				.filter((m) => m.id !== 1)
				.map(({ id, confidence, role, content }) => ({ role, content }));

			const response = await fetch(`${API_URL}/character/chat`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question: input,
					id: 'huisang',
					userId: userId,
					messages: JSON.stringify(trimmedMessages),
				}),
			});

			if (!response.body) {
				throw new Error();
			}

			const reader = response.body
				.pipeThrough(new TextDecoderStream())
				.getReader();
			const newAIMessages: Message[] = [];

			var generatedText = '';

			while (true) {
				const { value, done } = await reader.read();

				if (done) {
					setDisableInput(false);
					break;
				}

				var data = value.split('MESSAGE: ').splice(1, 1)[0];
				if (!data) continue;

				generatedText = data;
				newAIMessages[0] = {
					role: 'assistant',
					content: generatedText,
				} as Message;

				setMessages([...messages, ...newAIMessages]);
			}

			return generatedText;
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

	return (
		<>
			<NextHead />
			<Div>
				<HeaderContainer>
					<Title onClick={() => router.push('/')}>희상 백문백답 챗봇</Title>
					<ThumbnailImage
						onClick={() => router.push('/')}
						src={thumbnailImage}
						alt="AI"
					/>
				</HeaderContainer>
				<MessageContainer ref={containerRef}>
					{messages.map((msg, index) =>
						msg.role === 'assistant' ? (
							<>
								<AIMessage
									key={'message' + msg.content}
									text={msg.content}
									confidence={null}
									loadingFollowup={false}
									thumbnailImage={thumbnailImage}
								/>
							</>
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
			</Div>
		</>
	);
};

export default Character;

const Div = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 800px;
	height: 100vh;
	margin: 0 auto;
	background-color: ${palette.white};
	padding: 1rem;
	position: relative;

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
	width: 100%;
	justify-content: center;
	align-items: center;
	height: 3rem;
	margin-bottom: 0.5rem;
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
