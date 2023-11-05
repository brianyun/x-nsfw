import { Question } from 'common/models';
import { palette } from 'common/styles';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
	questions: Question[];
	onSubmit: (answers: any) => void;
	storageKey: string;
}
interface Answer {
	[id: number]: string;
}

export const PaginatedForm: React.FC<Props> = ({
	questions,
	onSubmit,
	storageKey,
}) => {
	const chunkSize = 10;
	const [currentPage, setCurrentPage] = useState(0);
	const [answers, setAnswers] = useState<Answer>({});
	const [showErrors, setShowErrors] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);

	// Check if all questions in the current chunk have been answered
	const allAnsweredInCurrentChunk = questions
		.slice(currentPage * chunkSize, (currentPage + 1) * chunkSize)
		.every((q) => answers[q.id] && answers[q.id].trim() !== '');

	const handleNext = () => {
		if (allAnsweredInCurrentChunk) {
			if (currentPage < Math.ceil(questions.length / chunkSize) - 1) {
				setCurrentPage(currentPage + 1);
				setShowErrors(false); // Reset the error state on successful navigation
			} else {
				onSubmit(answers);
			}
		} else {
			setShowErrors(true); // Show errors if any questions in the current chunk are unanswered
		}
	};

	const handlePrev = () => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1);
			setShowErrors(false); // Reset the error state on successful navigation
		}
	};

	const handleAnswerChange = (id: string, answer: string) => {
		setAnswers({
			...answers,
			[id]: answer,
		});
	};

	const handlePaste = (e: React.ClipboardEvent, startIndex: number) => {
		e.preventDefault(); // Prevent the default paste action

		// Get clipboard data
		const clipboardData = e.clipboardData.getData('Text');

		// Split data into rows and then columns
		const rows = clipboardData
			.trim()
			.split('\n')
			.map((row) => row.split('\t'));

		let newAnswers = { ...answers };
		let index = startIndex;

		for (let i = 0; i < rows.length; i++) {
			for (let j = 0; j < rows[i].length && index < questions.length; j++) {
				newAnswers[questions[index].id] = rows[i][j];
				index++;
			}
		}

		setAnswers(newAnswers);
	};

	useEffect(() => {
		// Calculate the progress
		const answeredCount = Object.values(answers).filter(
			(answer: string) => answer.trim() !== ''
		).length;
		setProgress((answeredCount / questions.length) * 100);

		// update localStorage
		if (answeredCount > 0)
			localStorage.setItem(storageKey, JSON.stringify(answers));
	}, [JSON.stringify(answers)]);

	useEffect(() => {
		// load from localStorage, if exists
		const answersFromLocalStorage = localStorage.getItem(storageKey);
		if (answersFromLocalStorage) {
			setAnswers(JSON.parse(answersFromLocalStorage));
		}
	}, []);

	return (
		<Div>
			<p>
				{
					Object.values(answers).filter(
						(answer: string) => answer.trim() !== ''
					).length
				}
				/ {questions.length}
			</p>
			<div
				style={{
					background: '#dedede',
					height: '20px',
					borderRadius: '5px',
					margin: '20px 0',
					width: '100%',
				}}
			>
				<div
					style={{
						background: '#4caf50',
						height: '100%',
						width: `${progress}%`,
						borderRadius: '5px',
					}}
				></div>
			</div>
			{questions
				.slice(currentPage * chunkSize, (currentPage + 1) * chunkSize)
				.map((question, idx) => (
					<QuestionContainer key={question.id}>
						<Text>{question.questionText}</Text>
						<InputContainer>
							<Input
								value={answers[question.id] || ''}
								onChange={(e) =>
									handleAnswerChange(question.id, e.target.value)
								}
								onPaste={(e) => handlePaste(e, idx + currentPage * chunkSize)}
							/>
							{showErrors &&
								(!answers[question.id] ||
									answers[question.id].trim() === '') && (
									<small style={{ color: 'red' }}>
										Please answer this question before proceeding.
									</small>
								)}
						</InputContainer>
					</QuestionContainer>
				))}
			<ButtonsContainer>
				{currentPage > 0 && <Button onClick={handlePrev}>Prev</Button>}
				<Button onClick={handleNext}>Next</Button>
			</ButtonsContainer>
		</Div>
	);
};

const Div = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	justify-content: flex-start;
	align-items: center;
	overflow-y: scroll;
`;
const QuestionContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: calc(100% - 4rem);
	margin: 0.25rem auto;
`;
const Text = styled.p`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: 'flex-start';

	max-width: 100%;
	width: 20rem;
	font-size: 1rem;
	font-weight: 400;
	word-break: break-word;
	white-space: pre-wrap;
	line-height: 1.5rem;

	padding: 0.75rem;
	background-color: ${palette.white};
	color: ${palette.black};

	@media (max-width: 800px) {
		font-size: 14px;
	}
`;
const Input = styled.textarea`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: 'flex-start';

	width: 100%;
	height: 2rem;
	padding: 0.25rem;
	background-color: white;
	font-size: 1rem;
	color: ${palette.black};
	word-break: break-word;
	white-space: pre-wrap;
	resize: none;

	outline: none;
	border: none;
	border-bottom: 2px solid ${palette.black};

	font-family: 'Pretendard';
	font-size: 1rem;
	font-weight: 400;
	word-break: break-word;
	white-space: pre-wrap;
	line-height: 1.5rem;
	margin-bottom: 0.25rem;

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
const InputContainer = styled.div`
	display: flex;
	width: calc(100% - 21rem);
	margin-left: 1rem;

	flex-direction: column;
	justify-content: center;
	align-items: 'flex-start';
`;
const ButtonsContainer = styled.div`
	display: flex;
	margin-top: 3rem;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;
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
`;
