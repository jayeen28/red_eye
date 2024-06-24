const net = require('net');
const path = require('path');
const get_bd_date_parts = require('./get_bd_date_parts');
const script_path = path.resolve();
const [year, month, date, hour] = get_bd_date_parts();
const VID_DIR = 'videos';
const vid_path = `${year}-${month}-${date}-${hour}.mp4`;
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
    .save(path.join(script_path, VID_DIR, vid_path));

// target.on('data', (data) => {
//     write_stream.write(data.toString(''), () => { })
// });

// Event listener for the target connection ending
target.on('end', () => {
    console.log('disconnected from target');
    // write_stream.end();
    ffmpegProcess.kill('SIGINT');
});

process.on('SIGTERM', () => target.end());
process.on('SIGINT', () => target.end());