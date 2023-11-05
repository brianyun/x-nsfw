import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import ChatService from '@/chat/chat.service';
import { getSubscriberCount } from '@/reddit';

const app = express();

app.use(bodyParser.json());
app.use(cors());

dotenv.config();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

app.get('/check', function (req, res) {
	console.log('DEBUG: check');
	res.send('alive');
});

app.post('/chat', function (req, res) {
	ChatService(req, res);
});

server.listen(port, () => {
	console.log(`Express API server listening on port ${port}`);
});

// Usage example:
getSubscriberCount('nsfw2')
	.then((subscriberCount) =>
		console.log(`Subreddit has ${subscriberCount} subscribers.`)
	)
	.catch((error) => console.error(error));
