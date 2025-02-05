const { Worker } = require('bullmq');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createClient } = require('ioredis');

const redisConnection = createClient({ host: 'redis', port: 6379, maxRetriesPerRequest: null });
redisConnection.on('error', (err) => console.error('Redis Connection Error:', err));
redisConnection.on('connect', () => console.log('Connected to Redis'));

const worker = new Worker('convertQueue', async (job) => {
    const inputFile = job.data.filePath;
    const outputFile = path.join(__dirname, 'output', `${job.id}.gif`);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });

    return new Promise((resolve, reject) => {
        exec(`ffmpeg -i ${inputFile} -vf "scale=-1:400" -r 5 ${outputFile}`, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}, { connection: redisConnection });

worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.log(`Job ${job.id} failed:`, err));