const express = require('express');
const multer = require('multer');
const { Queue } = require('bullmq');
const cors = require('cors');
const path = require('path');
const Redis = require('ioredis');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const redisConnection = new Redis({
    host: 'redis',  // <--- Use the service name from docker-compose.yml
    port: 6379,
    maxRetriesPerRequest: null
});
const queue = new Queue('convertQueue', { connection: redisConnection });
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/convert', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const job = await queue.add('convert', { filePath: req.file.path });
    res.json({ jobId: job.id });
});

app.get('/status/:jobId', async (req, res) => {
    const job = await queue.getJob(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const state = await job.getState();
    if (state === 'completed') {
        return res.json({ status: 'done', url: `/output/${req.params.jobId}.gif` });
    }
    res.json({ status: state });
});

app.use('/output', express.static('output'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
