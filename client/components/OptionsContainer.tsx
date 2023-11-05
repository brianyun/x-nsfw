import React from 'react';
import styled from 'styled-components';
import { palette } from '../common/styles';

export const OptionsContainer = ({
	options,
	handleClickOption,
}: {
	options: Array<string>;
	handleClickOption: (option: string) => void;
}) => {
	return options.length > 0 ? (
		<Div>
			<GuideText>추천 질문 🤔</GuideText>
			{options.map((option) => (
				<OptionMessage key={option} onClick={() => handleClickOption(option)}>
					{option}
				</OptionMessage>
			))}
		</Div>
	) : (
		<></>
	);
};

const Div = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;

	max-width: calc(100% - 4rem - 9rem);
	margin: 0.5rem auto 0.5rem 4rem;
	padding: 0.5rem 1rem;

	border-radius: 0.5rem;
	background-color: ${palette.brand.lightgray};

	@media (max-width: 800px) {
		max-width: calc(100% - 3rem - 3rem);
		margin-left: 3.5rem;
	}
`;
const OptionMessage = styled.p`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: flex-start;
	align-items: center;

	margin: 0.5rem auto;
	padding: 0.5rem;
	border-radius: 0.5rem;
	background-color: ${palette.white};
	color: black;

	font-size: 1rem;
	font-weight: 400;
	word-break: break-word;
	white-space: pre-wrap;
	line-height: 1.5rem;
	cursor: pointer !important;

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
