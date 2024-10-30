import { Kafka, Message, Partitioners } from 'kafkajs';
import { Env } from '../configs/env';

const kafka = new Kafka({
	clientId: Env.kafka.clientId,
	brokers: [Env.kafka.broker],
	sasl: { mechanism: 'plain', username: Env.kafka.username, password: Env.kafka.password },
	ssl: true,
});

const consumer = kafka.consumer({ groupId: 'users' });
const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });

export async function send(messages: { key: string; value: string }) {
	try {
		await producer.connect();
		await producer.send({ topic: 'kafka_irfandi_betest', messages: [messages] });
	} catch (error) {
		console.log('Error connecting the producer: ', error);
	}
}

export async function consume(messageHandler: (msg: Message) => Promise<void>) {
	try {
		await consumer.connect();
		await consumer.subscribe({ topics: ['kafka_irfandi_betest'], fromBeginning: false });
		await consumer.run({ eachMessage: async ({ message }) => await messageHandler(message) });
	} catch (error) {
		console.log('Error connecting the consumer: ', error);
	}
}
