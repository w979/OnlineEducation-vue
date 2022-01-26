import axios from "axios";
import th from "element-ui/src/locale/lang/th";
export default {
  name: "Home",
  data(){
    return{
      username:'',
      menuitem:[] //菜单列表
    }
  },methods:{
    //获取本地存储的信息
    getLocalStorage(){
       this.username = localStorage.getItem('username');
    },
    //加载菜单列表
    loadMenu(){
      let Token = localStorage.getItem('token');
      axios.get('api/perms/menu',{params:{},headers:{'Token':Token}}).then(result=>{
        console.log("菜单列表")
        console.log(result.data.data)
        if (result.data.code==200){
          this.menuitem=result.data.data;
        }else {
          this.$message({
            type: 'info',
            message: result.data.msg,
            duration:1500
          });
        }

      }).catch(e=>{
        this.$message.error('服务器正忙...');
      });
    }
    ,goHome(){
      this.$router.push('/home');
    }
    //个人中心
   ,btnMe(){
      this.$message({
        message: '努力建设中..',
        duration:1500
      });
    }
    //退出
    ,logout(){
      this.$confirm('您真的要离开吗?', '温馨提示', {
        confirmButtonText: '果断离开',
        cancelButtonText: '我再想想',
        type: 'warning',
      }).then(() => {
        axios.get('api/logout',{params:{}}).then(result=>{
          if(result.data.code==200){
            //删除浏览器中保存的数据
            localStorage.clear();
            //回到登录页面
            this.$router.back();//回到上一级导航
            this.$message({message: '请您重新登录'});
          }
        }).catch(e=>{
          this.$message({
            type: 'error',
            message: '服务器正忙..',
            duration:1500
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消',
          duration:1500
        });
      });
    }
  },created() {
    this.getLocalStorage();
    this.loadMenu();
  }
}
