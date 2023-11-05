import React from 'react';
import styled from 'styled-components';
import { ThumbnailImage, palette } from '../common/styles';
import { RandomProgressBar } from './RandomProgressBar';

export const AIMessage = ({
	text,
	thumbnailImage,
	confidence,
	loadingFollowup,
}: {
	text: string;
	thumbnailImage: any;
	confidence?: number;
	loadingFollowup: boolean;
}) => {
	return (
		<Div>
			<ThumbnailImage src={thumbnailImage} alt="AI" />
			<MessageContainer>
				<MessageText isLeft={true}>{text}</MessageText>
				{confidence && (
					<ConfidenceText confidence={confidence}>
						위 AI 답변의 신뢰도 점수:&nbsp;
						<ColoredText confidence={confidence}>{confidence}점</ColoredText>
					</ConfidenceText>
				)}
				{loadingFollowup && (
					<VerticalContainer>
						<GuideText>AI 답변을 스스로 평가하는 중입니다...</GuideText>
						<RandomProgressBar />
					</VerticalContainer>
				)}
			</MessageContainer>
		</Div>
	);
};

const Div = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: flex-start;
	align-items: flex-start;
`;
const VerticalContainer = styled.div`
	display: flex;
	flex-direction: column;
`;
const MessageContainer = styled.div`
	display: flex;
	max-width: calc(100% - 3rem - 8rem);
	flex-direction: column;

	@media (max-width: 800px) {
		max-width: calc(100% - 3rem - 3rem);
	}
`;
const ConfidenceText = styled.p<{ confidence: number }>`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
	border: 2px solid
		${(props) =>
			props.confidence > 70 ? palette.brand.green : palette.brand.main};

	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5rem;
	margin: 0.5rem 0;

	padding: 0.75rem;
	width: fit-content;
	border-radius: 0.5rem;
	background-color: ${palette.white};
	color: ${palette.black};

	@media (max-width: 800px) {
		font-size: 14px;
	}
`;
const ColoredText = styled.span<{ confidence: number }>`
	color: ${(props) =>
		props.confidence > 70 ? palette.brand.green : palette.brand.main};
	font-weight: 600;
	white-space: nowrap;

	@media (max-width: 800px) {
		font-size: 14px;
	}
`;
const MessageText = styled.p<{ isLeft: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: ${(props) => (props.isLeft ? 'flex-start' : 'flex-end')};

	max-width: 100%;
	font-size: 1rem;
	font-weight: 400;
	word-break: break-word;
	white-space: pre-wrap;
	line-height: 1.5rem;
	margin: 0.5rem 0;

	padding: 0.75rem;
	border-radius: 0.5rem;
	background-color: ${(props) =>
		props.isLeft ? palette.brand.lightgray : palette.brand.dark};
	color: ${(props) => (props.isLeft ? palette.black : palette.white)};

	@media (max-width: 800px) {
		font-size: 14px;
	}
`;
const GuideText = styled.p`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: flex-start;
	align-items: center;

	font-size: 1rem;
	font-weight: 600;
	word-break: break-word;
	white-space: pre-wrap;
	line-height: 1.5rem;
	margin: 0.5rem auto;

	@media (max-width: 800px) {
		font-size: 14px;
	}
`;
