const net = require('net');
const path = require('path');
const fs = require('fs');
const get_bd_date_parts = require('./get_bd_date_parts');


const script_path = path.resolve();
const [year, month, date, hour, min, sec] = get_bd_date_parts();
const VID_DIR = path.join(script_path, 'videos', String(year), String(month), String(date));
const vid_filename = `${year}-${month}-${date}-${hour}-${min}-${sec}.mp4`;
if (!fs.existsSync(VID_DIR)) fs.mkdirSync(VID_DIR, { recursive: true });

const gst_tcp_host = '127.0.0.1';
const gst_tcp_port = 10000;

const ffmpeg = require('fluent-ffmpeg');

const target = net.createConnection({ host: gst_tcp_host, port: gst_tcp_port }, () => {
    console.log('Connected to target');
});

// Set up ffmpeg to process the incoming stream
const ffmpegProcess = ffmpeg(`tcp://${gst_tcp_host}:${gst_tcp_port}`)
    .outputOptions('-r 15')
    .on('end', () => {
        console.log('File saved successfully');
    })
    .on('error', (err) => {
        console.error('Error processing stream: ' + err.message);
    })
    .save(path.join(VID_DIR, vid_filename));

// Event listener for the target connection ending
target.on('end', () => {
    console.log('disconnected from target');
    ffmpegProcess.kill('SIGINT');
});

function cleaner() {
    target.end();
}

process.on('SIGINT', () => cleaner());