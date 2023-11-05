import React from 'react';
import styled from 'styled-components';
import { palette } from 'common/styles';
import { Footer, NextHead } from 'components';
import { useRouter } from 'next/router';

const Import = () => {
	const router = useRouter();
	const [isVisible, setIsVisible] = React.useState(false);

	return (
		<>
			<NextHead />
			<Div>
				<Title>내 페르소나 챗봇 만들기</Title>
				<FilledButton onClick={() => setIsVisible((v) => !v)} color={'#0F9D58'}>
					백문백답 구글시트 연동하기
				</FilledButton>
				{isVisible && (
					<InputContainer>
						<Input type="text" placeholder="구글 시트 ID" />
						<InputButton onClick={() => setIsVisible(false)}>생성</InputButton>
					</InputContainer>
				)}
				<br />
				<br />
				<br />
				<p>Coming Soon...</p>
				<FilledButton
					onClick={() => alert('커밍 쑨')}
					color={'#ffe812'}
					textColor={'#000000'}
				>
					카카오톡 나와의 채팅 연동하기
				</FilledButton>
				<FilledButton onClick={() => alert('커밍 쑨')}>
					브런치 연동하기
				</FilledButton>
				<FilledButton onClick={() => alert('커밍 쑨')} color={'#3b5998'}>
					페이스북 연동하기
				</FilledButton>
				<FilledButton onClick={() => alert('커밍 쑨')} color={'#bc2a8d'}>
					인스타 연동하기
				</FilledButton>
			</Div>
			<Footer />
		</>
	);
};

export default Import;

const Div = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 50rem;
	justify-content: center;
	align-items: center;
	margin: 0 auto 20rem auto;

	@media (max-width: 800px) {
		width: calc(100% - 2rem);
		padding: 1rem;
	}
`;

const Title = styled.p`
	font-size: 2rem;
	font-weight: 700;
	line-height: 1.43;
	letter-spacing: -0.3px;
	color: ${palette.grey[900]};
	margin: 20rem auto 2rem auto;

	@media (max-width: 800px) {
		font-size: 1.5rem;
		width: 100%;
		text-align: center;
	}
`;

const FilledButton = styled.button<{ color?: string; textColor?: string }>`
	display: flex;
	flex-direction: column;
	width: calc(100% - 8rem);
	justify-content: center;
	align-items: center;

	background-color: ${(props) =>
		props.color ? props.color : palette.brand.dark};
	color: ${(props) => (props.textColor ? props.textColor : palette.white)};
	font-size: 1rem;
	font-weight: 600;
	padding: 1rem 0;

	outline: none;
	border: none;
	border-radius: 0.5rem;
	cursor: pointer;
	margin: 1rem auto 1rem auto;

	&:hover {
		transform: scale(1.1);
		transition: ease-in 0.5s;
	}

	@media (max-width: 800px) {
		width: 100%;
		font-size: 1rem;
	}
`;
const InputContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: calc(100% - 8rem);
	margin: 0 auto;
`;
const Input = styled.input`
	width: calc(100% - 7rem);
	height: 3rem;
	padding: 1rem 1rem;
	background-color: white;
	font-size: 1rem;
	color: ${palette.blueGrey[800]};
	word-break: break-word;

	outline: none;
	border-radius: 0.5rem;
	border: 1px solid ${palette.blueGrey[800]};
	margin-right: 1rem;

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
const InputButton = styled.button`
	display: flex;
	flex-direction: column;
	width: 6rem;
	padding: 1rem 1rem;
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
`;
