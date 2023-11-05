import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { palette } from 'common/styles';

type ControlProps = {
	formData: any;
	setFormData: any;
};

export const ControlView: React.FC<any> = ({
	formData,
	setFormData,
}: ControlProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsDropdownOpen(false);
		}
	};

	React.useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const gptVersions = ['gpt-3.5-turbo', 'gpt-4'];
	const thingsflowCharacters = ['윤희상', 'ENTP남 도진', '김민준'];
	const personalityTraits = [
		'친절한',
		'활발한',
		'창의적인',
		'성실한',
		'솔직한',
		'참을성있는',
		'유머러스한',
		'책임감있는',
		'도덕적인',
		'자신감있는',
		'적극적인',
		'오픈마인드인',
		'대담한',
		'무뚝뚝한',
		'애정적인',
		'조용한',
		'고집스러운',
		'센스있는',
		'호기심 많은',
		'용감한',
		'존경스러운',
		'털털한',
		'예민한',
		'정직한',
		'배려심 많은',
		'개방적인',
		'항상 밝은',
		'냉정한',
		'이해심 많은',
		'겸손한',
	];

	const handleCheckboxChange = (e) => {
		const { value, checked } = e.target;
		setFormData({
			...formData,
			personality: checked
				? [...formData.personality, value]
				: formData.personality.filter((trait) => trait !== value),
		});
	};

	const handleOceanChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			OCEAN: {
				...formData.OCEAN,
				[name]: parseFloat(value),
			},
		});
	};

	const handleSave = () => {
		localStorage.setItem('formData', JSON.stringify(formData));
	};

	return (
		<Div>
			<form onSubmit={handleSave} className="profile-form">
				<ControlItem>
					GPT 버전:
					<NameSelect
						name="gptVersion"
						value={formData.gptVersion}
						onChange={(e) =>
							setFormData({
								...formData,
								gptVersion: e.target.value,
							})
						}
					>
						{gptVersions.map((name) => (
							<option key={name} value={name}>
								{name}
							</option>
						))}
					</NameSelect>
				</ControlItem>
				<ControlItem>
					챗봇 이름:
					<input
						type="text"
						name="Name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					/>
				</ControlItem>
				<ControlItem>
					띵플 캐릭터 연결 (선택):
					<NameSelect
						name="Name"
						value={formData.chrName}
						onChange={(e) =>
							setFormData({
								...formData,
								chrName: e.target.value,
							})
						}
					>
						<option value="">없음 (기본)</option>
						{thingsflowCharacters.map((name) => (
							<option key={name} value={name}>
								{name}
							</option>
						))}
					</NameSelect>
				</ControlItem>
				<ControlItem>
					Demographic:
					<input
						type="text"
						name="Demographic"
						value={formData.demographic}
						onChange={(e) =>
							setFormData({ ...formData, demographic: e.target.value })
						}
					/>
				</ControlItem>
				<ControlItem>
					Personality:
					<PersonalityContainer ref={dropdownRef}>
						<input
							type="text"
							value={formData.personality.join(', ')}
							readOnly
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						/>
						{isDropdownOpen && (
							<DropdownContainer>
								{personalityTraits.map((trait) => (
									<DropdownItem key={trait}>
										<label htmlFor={trait}>{trait}</label>
										<input
											type="checkbox"
											id={trait}
											value={trait}
											checked={formData.personality.includes(trait)}
											onChange={handleCheckboxChange}
										/>
									</DropdownItem>
								))}
							</DropdownContainer>
						)}
					</PersonalityContainer>
				</ControlItem>
				<ControlItem>
					MBTI:
					<input
						type="text"
						name="MBTI"
						value={formData.MBTI}
						onChange={(e) => setFormData({ ...formData, MBTI: e.target.value })}
					/>
				</ControlItem>
				<FieldSet>
					<legend>OCEAN:</legend>
					{Object.keys(formData.OCEAN).map((trait) => (
						<SliderRow key={trait}>
							<label>{trait}</label>
							<input
								type="range"
								name={trait}
								value={formData.OCEAN[trait]}
								min="0"
								max="1"
								step="0.1"
								onChange={handleOceanChange}
							/>
							<output>{formData.OCEAN[trait]}</output>
						</SliderRow>
					))}
				</FieldSet>
				<ControlItem>
					Tendency:
					<textarea
						name="Tendency"
						value={formData.tendency}
						onChange={(e) =>
							setFormData({ ...formData, tendency: e.target.value })
						}
					></textarea>
				</ControlItem>
				<ControlItem>
					Tone of Speech:
					<textarea
						name="ToneOfSpeech"
						value={formData.toneOfSpeech}
						onChange={(e) =>
							setFormData({ ...formData, toneOfSpeech: e.target.value })
						}
					></textarea>
				</ControlItem>
				<ControlItem>
					One-line Description:
					<textarea
						name="OneLineDescription"
						value={formData.oneLineDescription}
						onChange={(e) =>
							setFormData({ ...formData, oneLineDescription: e.target.value })
						}
					></textarea>
				</ControlItem>
				<ControlItem>
					Similar Famous Person:
					<input
						type="text"
						name="SimilarFamousPerson"
						value={formData.similarFamousPerson}
						onChange={(e) =>
							setFormData({ ...formData, similarFamousPerson: e.target.value })
						}
					/>
				</ControlItem>
				<ControlItem>
					Example Sentence:
					<textarea
						name="ExampleSentence"
						value={formData.exampleSentence}
						onChange={(e) =>
							setFormData({ ...formData, exampleSentence: e.target.value })
						}
					></textarea>
				</ControlItem>
				<button type="submit">Save</button>
			</form>
		</Div>
	);
};

const Div = styled.div`
	min-width: 30rem;
	padding: 1rem;
	overflow-y: scroll;
	margin: 0 auto;
	position: relative;

	label {
		display: block;
	}

	input {
		flex: 1;
		padding: 0.25rem;
		border-radius: 0.25rem;
		border: 1px solid #ccc;
		font-size: 1rem;
		margin-left: 0.5rem;
	}

	textarea {
		width: 100%;
		height: 3.5rem;
		padding: 0.25rem;
		border-radius: 0.25rem;
		border: 1px solid #ccc;
		font-family: 'SUIT', 'Pretendard', sans-serif;
		font-size: 1rem;
		resize: none;
	}

	button {
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		background-color: #008cba;
		color: white;
		cursor: pointer;

		&:hover {
			background-color: #005f5f;
		}
	}
`;
const ControlItem = styled.label`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 1rem;
	font-weight: 800;
`;
const FieldSet = styled.fieldset`
	display: flex;
	flex-direction: column;
	border: none;
	padding-top: 10px;
	margin-bottom: 1rem;

	legend {
		font-weight: 800;
	}
`;
const NameSelect = styled.select`
	font-size: 1rem;
	margin-left: 1rem;
	padding: 0.25rem;
	border-radius: 0.25rem;

	option {
		font-size: 1rem;
	}
`;
const PersonalityContainer = styled.div`
	position: relative;
	width: 100%;

	input {
		width: 100%;
		margin-left: 0;
	}
`;
const DropdownContainer = styled.div`
	display: flex;
	position: absolute;
	width: 100%;
	z-index: 1000;
	flex-direction: column;
	background-color: ${palette.grey[100]};
	border: 1px solid black;
	padding: 1rem;
	max-height: 20rem;
	overflow-y: scroll;
`;
const DropdownItem = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 0.5rem;

	label {
		width: calc(100% - 1rem);
		font-weight: normal;
	}
	input {
		height: 1rem;
		width: 1rem;
	}
`;
const SliderRow = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 2rem;
	align-items: center;
	justify-content: center;

	label {
		width: 9rem;
		height: 100%;
	}
	input {
		width: calc(100% - 12.5rem);
		height: 100%;
		background: transparent;
		outline: none;
		margin: 0 0.5rem 0 0;
	}
	output {
		width: 3rem;
		height: 100%;
	}
`;
