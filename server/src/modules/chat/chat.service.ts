export default async function ChatService(req, res) {
	// do something
	const { data } = req.body;

	// res.writeHead(200, {
	// 		'Content-Type': 'text/event-stream',
	// 		'Cache-Control': 'no-cache, no-transform',
	// 		Connection: 'keep-alive',
	// });

	res.send('ok');
}
