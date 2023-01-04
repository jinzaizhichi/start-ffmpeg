'use strict';

// Constants
const PORT = 9000;
const HOST = '0.0.0.0';
const REQUEST_ID_HEADER = 'x-fc-request-id'
const ACCESS_KEY_ID = 'x-fc-access-key-id'
const ACCESS_KEY_SECRET = 'x-fc-access-key-secret'
const SECURITY_TOKEN = 'x-fc-security-token'

var execSync = require("child_process").execSync;
var ffmpeg = require('fluent-ffmpeg');
const OSS = require('ali-oss');
const express = require('express');
const app = express();
app.use(express.json())

// invocation
app.post('/', async (req, res) => {
    var rid = req.headers[REQUEST_ID_HEADER]
    console.log(`FC Invoke Start RequestId: ${rid}`)
    try {
        // Prior to get process parameters from request body to do your things
        console.log(JSON.stringify(req.body));
        var processParams = req.body
        // Make input_file parameter as the inidcator
        if (!processParams["input_file"]) {
            console.log("Miss mandotary video processing parameters in request body, try to get the parameters from query")
            // Fallback: Try to get recording parameters from query to do your things
            console.log(JSON.stringify(req.query));
            processParams = req.query
        }

        // Compatible with old event mode
        // var processParams = processParams
        if (!processParams["input_file"]) {
            res.status(400).send("Miss mandotary video processing parameters");
            console.log(`FC Invoke End RequestId: ${rid}`)
            return
        }

        //  连接OSS
        const client = new OSS({
            accessKeyId: req.headers[ACCESS_KEY_ID],
            accessKeySecret: req.headers[ACCESS_KEY_SECRET],
            stsToken: req.headers[SECURITY_TOKEN],
            bucket: process.env.OSS_BUCKET,
            endpoint: process.env.OSS_ENDPOINT,
        });


        await downloadFile(client, processParams["input_file"], 'origin.mp4')
        let video = ffmpeg('origin.mp4')
        await processFile(video, processParams)
        await uploadFile(client, 'result.mp4', processParams["output_file"])
        res.send('OK')

    } catch (e) {
        res.status(404).send(e.stack || e);
        console.log(`FC Invoke End RequestId: ${rid}, Error: Unhandled function error`)
    }
});

var server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

server.timeout = 0; // never timeout
server.keepAliveTimeout = 0; // keepalive, never timeout

async function processFile(video, processParams) {
    console.log("尝试处理视频--v25")
    return new Promise((resolve, reject) => {

        try {
            processVideo(video, processParams)
        } catch (e) {
            console.log("保存参数出错")
        }

        video
            .on('start', function () {
                console.log('转换任务开始~')
            })
            .on('progress', function (progress) {
                console.log('进行中，完成' + progress.percent + '%')
            })
            .on('error', function (err, stdout, stderr) {
                console.log('Cannot process video: ' + err.message)
                reject(err)
            })
            .on('end', function (str) {
                console.log('转换任务完成!')
                resolve()
            })
            .save('result.mp4')
    });
}

async function downloadFile(client, ossFilePath, savePath) {
    console.log("尝试下载文件：" + ossFilePath)

    try {
        const result = await client.get(ossFilePath, savePath);
        await execSync("ls  -lht", {stdio: 'inherit'});
    } catch (e) {
        console.log("下载视频失败")
        console.log(e)
    }

}

async function uploadFile(client, localPath, ossFilePath) {
    console.log("尝试上传文件为：" + ossFilePath)

    try {
        const result = await client.put(ossFilePath, localPath)
        console.log(result)
    } catch (e) {
        console.log("上传视频失败")
        console.log(e)
    }
}


function processVideo(video, processParams) {
    if (processParams["video_format"] != null) {
        video.format(processParams["video_format"])
    } else {
        video.format('mp4')
    }
    if (processParams["codec"] != null) {
        video.videoCodec(processParams["codec"])
    }
    if (processParams["video_bit_rate"] != null) {
        video.videoBitrate(processParams["video_bit_rate"])
    }
    if (processParams["audio_bit_rate"] != null) {
        video.audioBitrate(processParams["audio_bit_rate"])
    }
    if (processParams["video_frame_rate"] != null) {
        video.fps(processParams["video_frame_rate"])
    }
    if (processParams["duration"] != null) {
        video.duration(processParams["duration"])
    }
    if (processParams["video_aspect_ratio"] != null) {
        video.aspect(processParams["video_aspect_ratio"])
    }
    if (processParams["start_time"] != null) {
        video.setStartTime(processParams["start_time"])
    }
    if (processParams["video_size"] != null) {
        video.videoSize(processParams["video_size"])
    }
    if (processParams["audio_codec"] != null) {
        video.audioCodec(processParams["audio_codec"])
    }
    if (processParams["audio_frequency"] != null) {
        video.audioFrequency(processParams["audio_frequency"])
    }

    if (processParams["audio_quality"] != null) {
        video.audioQuality(processParams["audio_quality"])
    }

    if (processParams["commands"] != null) {
        let additionalCommands = processParams["commands"]
        console.log(additionalCommands)
        for (let i in additionalCommands) {
            video.addOption(additionalCommands[i])
        }
    }

}