import { Message } from 'common/models';
import { atom } from 'recoil';

export const messagesState = atom<Array<Message>>({
	key: 'messagesState',
	default: [],
	// default: [
	// 	{
	// 		id: 0,
	// 		role: 'assistant',
	// 		content:
	// 			'안녕하세요! 저는 이장우 교수 챗봇입니다.\n궁금하신 점이 있으면 언제든지 질문해 주세요! 그럼, 어디서부터 시작할까요?',
	// 	} as Message,
	// ],
});

export const isBottomsheetVisibleState = atom<boolean>({
	key: 'isBottomsheetVisibleState',
	default: false,
});

export const isModalVisibleState = atom<boolean>({
	key: 'isModalVisibleState',
	default: false,
});
