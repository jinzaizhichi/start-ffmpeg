# https://hub.docker.com/r/aliyunfc/headless-ffmpeg
FROM aliyunfc/headless-ffmpeg

# set time zone (current is Shanghai, China)
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

ENV LANG zh_CN.UTF-8
ENV LANGUAGE zh_CN:zh
ENV LC_ALL zh_CN.UTF-8
# set Xvfb auth file
ENV XAUTHORITY=/tmp/Xauthority

WORKDIR /code

ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm install express \
  ali-oss \
  fluent-ffmpeg \
  --registry http://registry.npm.taobao.org

COPY ./control.js ./control.js

RUN mkdir -p /var/output

EXPOSE 9000

ENTRYPOINT ["node", "control.js"]