'use strict';

// Constants
const PORT = 9000;
const HOST = '0.0.0.0';
const REQUEST_ID_HEADER = 'x-fc-request-id'

var execSync = require("child_process").execSync;
const OSS = require('ali-oss');
const express = require('express');
const app = express();
app.use(express.raw());

// invocation
app.post('/invoke', (req, res) => {
  // console.log(JSON.stringify(req.headers));
  var rid = req.headers[REQUEST_ID_HEADER]
  console.log(`FC Invoke Start RequestId: ${rid}`)
  try {
    // get body to do your things
    var bodyStr = req.body.toString();
    console.log(bodyStr);
    var evt = JSON.parse(bodyStr);
    var recordTime = evt["record_time"];
    var videoUrl = evt["video_url"];
    var outputFile = evt["output_file"];
    var width = evt["width"];
    var height = evt["height"];
    var cmdStr = `/code/record.sh ${recordTime} ${videoUrl} ${width}x${height}x24 ${width},${height} ${width}x${height}`;
    console.log(`cmd is ${cmdStr} \n`);
    execSync(cmdStr, {stdio: 'inherit', shell: "/bin/bash"});
    console.log("start upload video to oss ...");
    const store = new OSS({
      accessKeyId: process.env.OSS_AK_ID,
      accessKeySecret: process.env.OSS_AK_SECRET,
      bucket: process.env.OSS_BUCKET,
      endpoint: process.env.OSS_ENDPOINT,
    });
    store.put(outputFile, '/var/output/test.mp4').then((result) => {
      console.log("finish to upload video to oss");
      execSync("rm -rf /var/output/test.mp4", {stdio: 'inherit'});
      res.send('OK');
      console.log(`FC Invoke End RequestId: ${rid}`)
    }).catch(function (e) {
      console.log("fail to upload video to oss: " + e.toString())
      res.status(404).send(e.stack || e);
      console.log(`FC Invoke End RequestId: ${rid}, Error: Unhandled function error`);
    });
  } catch (e) {
    console.error(e.stack || e);
    res.status(404).send(e.stack || e);
    console.log(`FC Invoke End RequestId: ${rid}, Error: Unhandled function error`)
  }
});

var server = app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

server.timeout = 0; // never timeout
server.keepAliveTimeout = 0; // keepalive, never timeout
