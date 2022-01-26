
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
  name: "Role",
  data(){
    return{
      map:null,
    }
  },methods:{
    initMap(){
      AMapLoader.load({
        key:"eb83c366c398a873cbe0b72252e31a2d",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins:[''],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap)=>{
        this.map = new AMap.Map("container",{  //设置地图容器id
          viewMode:"3D",    //是否为3D地图模式
          zoom:5,           //初始化地图级别
          center:[114.279121,30.572399], //初始化地图中心点位置
        });
      }).catch(e=>{
        console.log(e);
      })
    },
  },mounted(){
    //DOM初始化完成进行地图初始化
    this.initMap();
  }
}
