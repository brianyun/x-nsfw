import axios from 'axios';
import { palette } from 'common/styles';
import { API_URL } from 'environment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const ProfilePage = () => {
	const router = useRouter();
	const [botId, setBotId] = useState<string>('');
	const [botName, setBotName] = useState<string>('');
	const [greeting, setGreeting] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		var data = {
			botId: botId,
			botName: botName,
			greeting: greeting,
			persona: JSON.stringify(localStorage.getItem('persona')),
			tone: JSON.stringify(localStorage.getItem('tone')),
		};

		console.log(JSON.stringify(data));

		await axios.post(`${API_URL}/character/create`, data, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		setLoading(false);
		router.push(`/character/${botId}`);
	};

	return (
		<Div>
			<TitleText>챗봇 프로필 생성</TitleText>
			<InputContainer>
				<GuideText>챗봇의 영문 ID를 정해주세요</GuideText>
				<Input
					type="text"
					placeholder="예시: bangbang"
					value={botId}
					onChange={(e) => setBotId(e.target.value)}
				/>
			</InputContainer>
			<InputContainer>
				<GuideText>챗봇 이름을 정해주세요</GuideText>
				<Input
					type="text"
					placeholder="예시: 빵빵이봇"
					value={botName}
					onChange={(e) => setBotName(e.target.value)}
				/>
			</InputContainer>
			<InputContainer>
				<GuideText>첫 인삿말을 정해주세요</GuideText>
				<Input
					type="text"
					placeholder="예시: 안녕? 나는 지구에서 온 빵빵이라고 해"
					value={greeting}
					onChange={(e) => setGreeting(e.target.value)}
				/>
			</InputContainer>
			<Button
				disabled={botId == '' || botName == '' || greeting == ''}
				onClick={handleUpload}
			>
				생성하기
			</Button>
			{loading && (
				<Overlay>
					<CloseButton onClick={() => setLoading(false)} />
					<SpinnerContainer>
						<Spinner />
					</SpinnerContainer>
				</Overlay>
			)}
		</Div>
	);
};

export default ProfilePage;

const Div = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;
	padding: 2rem;
	justify-content: flex-start;
	align-items: center;
	overflow-y: scroll;
`;
const TitleText = styled.h1`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	width: 100%;
	font-size: 2rem;
	font-weight: 600;
	word-break: break-word;
	white-space: pre-wrap;
	line-height: 1.5rem;

	padding: 0.75rem;
	background-color: ${palette.white};
	color: ${palette.black};

	margin-bottom: 3rem;

	@media (max-width: 800px) {
		font-size: 14px;
	}
`;
const InputContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 2rem;
	margin: 1rem auto;
`;
const GuideText = styled.p`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	width: 15rem;
	height: 100%;
	font-size: 1rem;
	font-weight: 400;
	word-break: break-word;
	white-space: pre-wrap;
	line-height: 1.5rem;

	padding: 0.75rem;
	background-color: ${palette.white};
	color: ${palette.black};
	margin-right: 1rem;

	@media (max-width: 800px) {
		font-size: 14px;
	}
`;
const Input = styled.input`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: 'flex-start';

	width: calc(100% - 15rem - 1rem);
	height: 100%;
	padding: 0.25rem;
	background-color: white;
	font-size: 1rem;
	color: ${palette.black};
	word-break: break-word;
	white-space: pre-wrap;

	outline: none;
	border: none;
	border-bottom: 2px solid ${palette.black};

	font-family: 'Pretendard';
	font-size: 1rem;
	font-weight: 400;
	word-break: break-word;
	white-space: pre-wrap;
	line-height: 1.5rem;

	&::placeholder {
		color: ${palette.grey[500]};
	}
	&:-ms-input-placeholder {
		color: ${palette.grey[500]};
	}
	&::-ms-input-placeholder {
		color: ${palette.grey[500]};
	}
`;
const Button = styled.button`
	display: flex;
	flex-direction: column;
	width: 6rem;
	padding: 1rem 1rem;
	margin: 0 2rem;
	height: 3rem;
	background-color: ${palette.brand.dark};
	color: ${palette.white};
	border-radius: 0.5rem;
	justify-content: center;
	align-items: center;
	border: none;
	outline: none;
	cursor: pointer;
	font-size: 1rem;
	font-weight: 600;

	margin-top: 2rem;

	&:disabled {
		background-color: ${palette.grey[300]};
	}
`;
const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	pointer-events: none;
`;
const SpinnerContainer = styled.div`
	pointer-events: all;
`;
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;
const Spinner = styled.div`
	border: 4px solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	border-top: 4px solid black;
	width: 40px;
	height: 40px;
	animation: ${spin} 1s linear infinite;
`;
const CloseButton = styled.button`
	position: absolute;
	top: 10px;
	right: 10px;
	background: #ffffff;
	border: none;
	border-radius: 50%;
	width: 24px;
	height: 24px;
	font-size: 16px;
	line-height: 24px;
	text-align: center;
	cursor: pointer;
	box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
	pointer-events: all;

	&:before {
		content: '×'; // Unicode multiplication sign which looks like a close button
	}

	&:focus {
		outline: none;
	}
`;
