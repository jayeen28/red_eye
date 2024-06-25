# Webcam 24-Hour Recording and Saving Script

This project contains two scripts to record camera footage continuously for 24 hours and save the recordings. The `index.js` file starts the gstreamer tcp stream and the `gst_tcp_rcv.js` file receives the tcp stream and saves the recording using ffmpeg.
So you need to have `Gstreamer` and `FFmpeg` installed in your system.

## Usage

### Start the Webcam Server
Use `pm2` to manage seperate process.
1. Start the index.js file `pm2 start "node index.js" --name "gst_streamer"`
1. Then start the tcp receiver. `pm2 start "node gst_tcp_rcv.js" --name "gst_stream_saver" --cron-restart="01 01 * * * *"`

The `--cron-restart` option is for restarting the process on every hour. Thus the recording will be saved for every hour. Don't forget to use after everything `pm2 save`.
