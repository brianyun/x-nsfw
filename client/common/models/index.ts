export type Message = {
	id?: number;
	role: 'assistant' | 'user';
	content: string;
	confidence?: number;
};

export type Question = {
	id: string;
	questionText: string;
};
