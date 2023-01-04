# Ffmpeg online 帮助文档

<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=headless-ffmpeg&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=headless-ffmpeg" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=headless-ffmpeg&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=headless-ffmpeg" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=headless-ffmpeg&type=packageDownload">
  </a>
</p>

<description>

> ***快速部署一个在线ffmpeg应用到阿里云函数计算***

</description>

<table>

</table>

<codepre id="codepre">

</codepre>

<deploy>

## 部署 & 体验

<appcenter>

- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=PanoramicPageRecording) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=PanoramicPageRecording)
  该应用。

</appcenter>

- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
    - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install)
      ，并进行[授权信息配置](https://www.serverless-devs.com/fc/config) ；
    - 初始化项目：`s init PanoramicPageRecording -d PanoramicPageRecording`
    - 进入项目，并进行项目部署：`cd PanoramicPageRecording && s deploy -y`

</deploy>

<appdetail id="flushContent">

# 调用函数

``` bash
# deploy
$ s deploy -y --use-local
# Invoke
$ s invoke -e '{"input_file":"record/test.mp4","video_format":"mp4","start_time":"10","duration":"16","output_file":"record/result.mp4","commands":["-r 30","-f avi"]}'
```

调用成功后， 会在对应的 bucket 下， 产生 record/result.mp4 大约 16 秒的每秒 30 帧的处理后的视频。

# 入参示例

```JSON
{
  "input_file": "path/to/your/video.mp4",
  "output_file": "path/to/save/processed.mp4",
  "video_format": "mp4",
  "start_time": "10",
  "duration": "16",
  
  "commands": [
    "-r 25",
    "-f mp4"
  ]
}

```

## 参数说明 
参数分为两部分，一部分是应用支持到参数，具体包括:
- video_format
- codec
- video_bit_rate
- audio_bit_rate
- video_frame_rate
- duration
- video_aspect_ratio
- start_time
- video_size
- audio_codec
- audio_frequency
- audio_quality
如果上述参数不能满足您的视频处理需求，可自行在commands中传入
处理字符传，范式为'-option param',示例如同'-r 30'







```bash
# 如果有镜像有代码更新, 重新build 镜像
$ docker build -t ffmpeg-online -f ./code/Dockerfile ./code
```

# 原理

将欲处理的视频下载到custom container载通过底层调用ffmpeg进行处理，最后上传到OSS

[PushObjectCache](https://next.api.aliyun.com/api/Cdn/2018-05-10/PushObjectCache?lang=NODEJS&sdkStyle=old&params={})



</appdetail>

<devgroup>

## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues)
中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
|--- | --- | --- |
| <center>微信公众号：\`serverless\`</center> | <center>微信小助手：\`xiaojiangwh\`</center> | <center>钉钉交流群：\`33947367\`</center> | 

</p>

</devgroup>