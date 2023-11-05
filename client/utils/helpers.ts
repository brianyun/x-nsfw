export function shuffleAndPick(array) {
	const shuffledArray = array.sort(() => Math.random() - 0.5);
	return shuffledArray.slice(0, 3);
}
