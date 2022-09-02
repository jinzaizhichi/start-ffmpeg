# headless-ffmpeg 帮助文档

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

> ***快速部署一个全景录制的应用到阿里云函数计算***

</description>

<table>

</table>

<codepre id="codepre">

</codepre>

<deploy>

## 部署 & 体验

<appcenter>

- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=headless-ffmpeg) ，
[![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=headless-ffmpeg)  该应用。 

</appcenter>

- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
    - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://www.serverless-devs.com/fc/config) ；
    - 初始化项目：`s init headless-ffmpeg -d headless-ffmpeg`   
    - 进入项目，并进行项目部署：`cd headless-ffmpeg && s deploy -y`

</deploy>

<appdetail id="flushContent">

# 调用函数

``` bash
$ s invoke -e '{"record_time":"70","video_url":"https://tv.cctv.com/live/cctv1/","output_file":"record2/test9.mp4", "width":"1920", "height":"1080"}'
```

调用成功后， 会在对应的 bucket 下， 产生 record/test.mp4 大约 70 秒 1920x1080 的全景录制视频。

# 原理

Chrome 渲染到虚拟 X-server，并通过 FFmpeg 抓取系统桌⾯，通过启动 xvfb 启动虚拟 X-server，Chrome 进⾏全屏显示渲染到到虚拟 X-server 上，并通过 FFmpeg 抓取系统屏幕以及采集系统声⾳并进⾏编码写⽂件。这种⽅式的适配性⾮常好， 不仅可以录制 Chrome，理论上也可以录制其他的应⽤。缺点是占⽤的内存和 CPU 较多。

**server.js**

custom container http server 逻辑

**record.sh**

核心录屏逻辑， 启动 xvfb， 在虚拟 X-server 中使用 `record.js` 中的 puppeteer 启动浏览器， 最后 FFmpeg 完成 X-server 屏幕的视频和音频抓取工作， 生成全屏录制后的视频

# 其他
如果您想将生成的视频直接预热的 CDN， 以阿里云 CDN 为例， 只需要在 server.js 上传完 OSS bucket 后的逻辑中增加如下代码：

[PushObjectCache](https://next.api.aliyun.com/api/Cdn/2018-05-10/PushObjectCache?lang=NODEJS&sdkStyle=old&params={})

> Tips 前提需要配置好 CDN


</appdetail>

<devgroup>

## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
|--- | --- | --- |
| <center>微信公众号：\`serverless\`</center> | <center>微信小助手：\`xiaojiangwh\`</center> | <center>钉钉交流群：\`33947367\`</center> | 

</p>

</devgroup>