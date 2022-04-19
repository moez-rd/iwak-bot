const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const client = new Client({
	authStrategy: new LocalAuth()
});

client.on('qr', qr => {
	qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
	console.log('Client is ready!');
});

client.on('message', message => {
	if (message.body === '!ping') {
		message.reply('pong');
	}
});

client.on('message', message => {
	if (message.body === '!hi') {
		message.reply('Hi juga');
	}
});

client.on('message', async (msg) => {
	const chat = await msg.getChat();
	const mentions = await msg.getMentions();

	for (let contact of mentions) {
		chat.sendMessage(`@${contact.id.user}, dirimu dipanggil`, {
			mentions: [contact]
		});
	}
});

client.on('message', async (msg) => {
	if (msg.body === '!everyone') {
		const chat = await msg.getChat();

		let text = "";
		let mentions = [];

		for (let participant of chat.participants) {
			const contact = await client.getContactById(participant.id._serialized);

			mentions.push(contact);
			text += `@${participant.id.user} `;
		}

		await chat.sendMessage(text, { mentions });
	}
});

client.on('message', async (msg) => {
	if (msg.body === '!pagy') {
		const chat = await msg.getChat();
		const media = MessageMedia.fromFilePath('./assets/pagy.jpg');
		chat.sendMessage(media);
	}
})

client.initialize();