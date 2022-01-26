import axios from "axios";
import Vcode from "vue-puzzle-vcode";
export default {
  name: "Login",
  components:{
    Vcode
  },
  data(){
    return{
      isShow: false, // 验证码模态框是否出现
      imgCode: undefined,
      status: '',//状态
      ip:'',
      address:[],//地址数组

      country:'',//国
      regionName:'',//省
      city:'',//市
      area:'',//区

      users:{
        username:'wry',
        password:'123'
      },
      //表单校验
      rules:{
        username:[
          {required: true, message: '账号不能为空', trigger: 'blur'},
          {min: 3,max:6, message: '账号长度3~6位'}
          ],
        password:[
          { required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 3,max:6, message: '密码长度3~6位'}
          ]
      }
    }
  },methods:{
    //获取当前登录人的位置信息
    getAddress(){
      axios.get('https://api.ip138.com/ip/?ip=&datatype=jsonp&token=3091bbb35074ef6822209a7d1e052413',{params:{}}).then(result=>{
        console.log(result.data)
        this.address=result.data.data;
        this.regionName=this.address[1];
        this.city=this.address[2];
        this.area=this.address[3];
        this.ip=this.regionName+'-'+this.city+'-'+this.area
      }).catch(e=>{
      console.log(e);
      })
    },
  //添加登录记录
    saveDetails(){
      let details={
        name:this.users.username,
        msg:'登录',
        status:this.status,
        ip:this.ip
      }
      console.log(details)
      axios.post('api/data/add',details).then(result=>{
        console.log(result.data.msg);
      }).catch(e=>{
        console.log(e);
      });
  }
   , async success(){
     //表单验证成功
     let formdata=new URLSearchParams({
       'username':this.users.username,
       'password':this.users.password
     });
     //异步登录
     axios.post('/api/login',formdata.toString(),{contentType:'application/x-www-form-urlencoded'}).then(result => {
       if (result.data.code == 456){
         this.$message({
           message: '表单校验失败',
           type: 'warning',
           duration:1500
         });
       }else if(result.data.code == 200) {
         this.isShow=false;
         //登录成功
         this.status='y'
         this.saveDetails();
         //将当前用户位置信息存储
         localStorage.setItem('ip',this.ip);
         //将token和用户信息存储带本地消息
         localStorage.setItem('token',result.data.data.token)
         localStorage.setItem('username',result.data.data.users.username)
         this.$notify({title: '登录成功', message: '欢迎您：'+result.data.data.users.username, type: 'success'});
         //跳转首页组件
         this.$router.push('/home')
       } else {
         this.$message.error(result.data.msg);
         this.status='n';
         this.saveDetails();
         this.isShow=false;
       }
     }).catch(e => {
       this.$message.error('服务器正忙...');
     });
    },
    btnLogin(userFrom){
      this.$refs[userFrom].validate((valid) => {
        if (!valid) {
          return ;
        } else {
          this.isShow = true
        //表单验证失败
          return false;
        }
      });
    },btnReset(userFrom){
      this.$refs[userFrom].resetFields();
    }
  },created() {
    this.getAddress()
  }
}
