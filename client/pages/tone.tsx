import { TONE_QUESTIONS } from 'common/assets/constants';
import { PaginatedForm } from '../components/form/PaginatedForm';
import styled from 'styled-components';
import { palette } from 'common/styles';
import { useRouter } from 'next/router';

const TonePage = () => {
	const router = useRouter();

	const handleSubmit = (answers: any) => {
		// Process the answers, e.g., send to a server
		console.log(answers);
		router.push('/profile');
	};

	return (
		<Div>
			<TitleText>말투 학습시키기</TitleText>
			<PaginatedForm
				questions={TONE_QUESTIONS}
				onSubmit={handleSubmit}
				storageKey={'tone'}
			/>
		</Div>
	);
};

export default TonePage;

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
