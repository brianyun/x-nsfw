import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { palette } from '../common/styles';

export const RandomProgressBar = () => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) => {
				// Generate random increment between 1 and 20
				const randomIncrement = Math.floor(Math.random() * 7) + 1;
				const newProgress = prevProgress + randomIncrement;

				// Cap the progress value at 100
				return newProgress <= 100 ? newProgress : 100;
			});
		}, 200); // Adjust the interval as desired

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<Div>
			<Fill
				className="progress-bar-fill"
				style={{ width: `${progress}%` }}
			></Fill>
		</Div>
	);
};

const Div = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 0.5rem;
	background-color: #f2f2f2;
	border-radius: 0.25rem;
	overflow: hidden;
`;

const Fill = styled.div`
	height: 100%;
	background-color: ${palette.brand.primary};
	transition: width 0.5s ease-in;
`;
