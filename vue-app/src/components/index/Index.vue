<template>
  <div>
  <div>
    <el-carousel :interval="3000" type="card" arrow="always">
      <el-carousel-item v-for="(item,index) in list_img" :key="index">
        <img :src="item.url" alt/>
      </el-carousel-item>
    </el-carousel>
  </div>
    <div>
      <div style="margin-right: 780px">
        <video    :preload="preload"
                  :poster="videoImg" :height="height" :width="width" align="center" :controls="controls"  :autoplay="autoplay">
          <source :src="videoSrc" type="video/mp4">
        </video>
      </div>

<!--      <div style="width: 600px;margin-left: 500px;margin-top: -205px">-->
<!--        <aplayer-->
<!--          :music="{-->
<!--                  title: 'k15',-->
<!--                  artist: 'A-Lin',-->
<!--                  src: 'http://music.163.com/song/media/outer/url?id=25640799.mp3',-->
<!--                  pic: 'http://p2.music.126.net/0POVOSSjqgVoOUGc5haWBQ==/109951163392311918.jpg'-->
<!--              }"-->
<!--          :list="musicList"-->
<!--        ></aplayer>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import aplayer from "vue-aplayer";
export default {
  name: "Index",
  components: { aplayer },
  data(){
    return{
      list_img: [
        { url: require('../../assets/lb4.jpg') },
        { url: require('../../assets/lb2.jpg') },
        { url: require('../../assets/lb3.jpg') },
        { url: require('../../assets/lb1.jpg') },
      ],
      videoSrc: '../../../../static/one.mp4',
      videoImg: '../../../../static/lg.png',
      playStatus: '',
      muteStatus: '',
      isMute: true,
      isPlay: false,
      width: '1100', // 设置视频播放器的显示宽度（以像素为单位）
      height: '240', // 设置视频播放器的显示高度（以像素为单位）
      preload: 'auto', //  建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
      controls: true, // 确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
      autoplay: false,

      // 音频列表
      xData: [],
      yData: [],
      myData: [],
      value: new Date(),
      userInfo: {},
      tableInfo: [],
      musicList:[{
        title: '真的爱你',
        artist: 'Beyond',
        src: 'http://music.163.com/song/media/outer/url?id=1857483755.mp3',
        pic: 'https://p1.music.126.net/EUGOuFR1BbTPvf-JWiUnSA==/109951166134261800.jpg'
      },{
        "artist": "Beyond",
        "lrc": "",
        "title": "海阔天空",
        "src": "http://music.163.com/song/media/outer/url?id=346089.mp3",
        "pic": "https://p2.music.126.net/zZtUDuWk6qIe3ezMt4UMjg==/109951165796417308.jpg?"
      },
        {
          title: 'MOM',
          artist: '蜡笔小心',
          src: 'http://music.163.com/song/media/outer/url?id=1387581250.mp3',
          pic: 'https://p2.music.126.net/ZOkr1NI-WGGRuc5-G_7-CA==/109951164332837488.jpg'
        }
        ,{
        "artist": "程佳佳",
        "lrc": "",
        "title": "山楂树之恋",
        "src": "http://music.163.com/song/media/outer/url?id=1381755293.mp3",
        "pic": "http://p2.music.126.net/G00sAe86sPi5gFQyuJHU7A==/109951164260611202.jpg"
      }]
    }
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
}

.el-carousel__item:nth-child(2n+1) {
}
</style>
