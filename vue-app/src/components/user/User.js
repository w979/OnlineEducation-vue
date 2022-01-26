import axios from 'axios';
import th from "element-ui/src/locale/lang/th";
import fa from "element-ui/src/locale/lang/fa";
export default {
  name: "User",
  data(){
    //校验两次密码是否输入一致
    var checkPwd = (add, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addform.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      name:'',
      tableData:[], //列表数据

      //-----分页所需-----
      total: 0, //总共多少条数据
      pageNum:1, //起始页
      pageSize:5,
      //--------end-----

      //-----添加所需-------
      dialogFormVisible: false,
      addform: {
        username: '', //用户名
        email: '', //邮箱
        status:'',//状态
        password:'', //密码
        rpassword:'' //确认密码
      },
      formLabelWidth: '120px',
      //表单校验规则
      rules:{
        username:[
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 2,max:10, message: '用户名长度2~6位'}
        ],
        password:[
          { required: true,message: '密码不能为空', trigger: 'blur'},
          {min: 3, message: '密码长度至少3位'}
        ],
        rpassword:[
          {required: true,validator:checkPwd, trigger: 'blur'},
          {min: 3, message: '密码长度至少3位'}
        ],
        email:[
          { required: true,type:'email', message: '邮箱格式有误', trigger: 'blur'},
        ],
      },
      //-------end---------
      delstatus:'',
      msg:'',

      //--------修改所需--------
      UpdialogFormVisible:false,
      currentUser:{}, //当前要修改讲师的信息
      //-------end---------

      //--------权限分配所需---------
      permsDialogVisible:false,
      userid:'',//当前用户的id
      permsData: [],//权限树中的数据
      userPerms:[],//当前用户的权限
      checkedKey: [],//默认被选中节点的值
      defaultProps: {
        children: 'childrensList', //子节点的权限名称
        label: 'name'  //父节点的权限名称
      }
    //-----------end---------
    }
  },methods:{
    //改变页码
    handleSizeChange(pageSize) {
      this.pageSize=pageSize
      this.btnQuery();
    },
    //翻页
    handleCurrentChange(pageNum) {
      this.pageNum=pageNum;
      this.btnQuery();
    }
    //列表+多条件查询方法
    ,btnQuery(){
      let token = localStorage.getItem('token')
      axios.get('api/user/list',{params:{name:this.name,pageNum:this.pageNum,pageSize:this.pageSize},headers:{'Token':token}})
        .then(result=>{
          if (result.data.code==200){
            //拿到消息中的集合
            this.total=result.data.data.total
            this.tableData=result.data.data.list;
          }else {
            this.$message(result.data.msg);
            this.name='';
          }
        }).catch(e=>{
        this.$message({type: 'error', message: '服务器正忙..', duration:1500});
      });
      //条件查询
    },selectQuery(){
      this.pageNum=1;
      this.btnQuery()
    }
    //跳转添加页面  并判断此用户是否拥有该权限
    ,showAdd(){
      let Token = localStorage.getItem('token');
      axios.get('api/user/showAdd',{params:{},headers:{'Token':Token}}).then(result=>{
        console.log(result.data)
        if (result.data.code==200){
          //有权限
          this.dialogFormVisible=true; //开启添加弹框
        }else {
          //无权限
          this.$message({type: 'warning', message: result.data.msg, duration: 1500});
        }
      }).catch(e=>{
        this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
      })
    }
    //添加用户
    ,addUser(addform){
      this.$refs[addform].validate((valid) => {
        if (valid) {
          let users = {
            username: this.addform.username,
            email: this.addform.email,
            password: this.addform.password,
            status: 'y'//状态默认正常
          };
          let Token = localStorage.getItem('token');
          axios.post('api/user/add', users, {headers: {'Token': Token}}).then(result => {
            console.log(result.data)
            if (result.data.code == 200) {
              //添加成功
              this.addform={}  //清空表单中数据
              //关闭添加框
              this.dialogFormVisible = false;
              this.$message({showClose: true, message: result.data.msg, type: 'success'});
              this.btnQuery();
            } else {
              //添加失败
              this.$message({showClose: true, message: result.data.msg, type: 'error'});
            }
          }).catch(e => {
            this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
          })
        }else {
          //表单校验失败
          return false;
        }
      });
    } //添加框取消
    ,adddialogFormVisible(addform){
      this.$refs[addform].resetFields();
      this.dialogFormVisible=false;
    }
    //跳转到修改页面并显示当前用户的信息
    ,showUpdate(row){
      let Token = localStorage.getItem('token');
      axios.get('api/teacher/showUpdate',{params:{},headers:{'Token':Token}}).then(result=>{
        if (result.data.code==200){
          //有权限
          //开启修改对话框
          this.UpdialogFormVisible=true;
          //获得当前行用户的信息
          this.currentUser=row
          this.addform.rpassword=row.password
        }else {
          //无权限
          this.$message({type: 'warning', message: result.data.msg, duration: 1500});
        }
      }).catch(e=>{
        this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
      });
    }
    //修改
    ,updateUser(updateform){
      this.$refs[updateform].validate((valid) => {
        if (valid) {
          let users = {};
          users = this.currentUser;
          let Token = localStorage.getItem('token');
          axios.post('api/user/update',users,{headers:{'Token':Token}}).then(result=>{
            if (result.data.code==200){
              //修改成功
              this.UpdialogFormVisible = false;
              this.$message({showClose: true, message: result.data.msg, type: 'success'});
            }else {
              //修改失败
              this.$message({showClose: true, message: result.data.msg, type: 'error'});
            }
          }).catch(e=>{
            this.$message({type: 'error', message: '服务器正忙..', duration: 1500
            });
          })
        }else {
          //表单校验失败
          return false;
        }
      });
    },
    //修改框取消按钮
    updateDialogConcel(updateform){
      this.addform={};
      this.currentUser={};
      this.$refs[updateform].resetFields();
      this.UpdialogFormVisible=false;
    },
    saveDetails(){
      let username = localStorage.getItem('username');
      let ip = localStorage.getItem('ip');
      let details={
        name:username,
        msg:this.msg,
        status:this.delstatus,
        ip:ip
      }
      axios.post('api/data/add',details).then(result=>{
        console.log(result.data.msg);
      }).catch(e=>{
        console.log(e);
      });
    },
    //删除用户
    delTeacher(id,index){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let Token = localStorage.getItem('token');
        axios.get('api/user/delete',{params:{id:id},headers:{'Token':Token}}).then(result=>{
          //有权限/删除成功
          if (result.data.code==200){
            this.msg = '删除用户'
            this.delstatus='y';
            this.saveDetails();
            //在数组中删除该元素，不调用查询方法
            this.tableData.splice(index,1);
            //删除成功
            this.$message({type: 'success', message: '删除用户成功!'});
          }else {
            this.msg = '删除用户'
            this.delstatus='n';
            this.saveDetails();
            //删除失败/无权限
            this.$message({showClose: true, message: result.data.msg, type: 'warning'});
          }
        }).catch(e=>{
          this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
        });
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    }
    //跳转权限分配页面，加载当前用户权限，并判断此用户是否拥有此操作权限
    ,showPerms(id){
      this.$nextTick(() => { //解决权限树第一次不加载问题
      axios.get('api/perms/showPerms',{params:{userid:id}}).then(result=>{
        console.log(result.data)
        if (result.data.code==200){
          this.userid = id; //保存用户id
          //有权限 且获取成功
          this.permsDialogVisible = true;
          //存入集合
          this.permsData=result.data.data.permsList; //权限树
          this.userPerms=result.data.data.userPermsList; //用户权限
        }else {
          //无权限或获取失败
          this.$message({showClose: true, message: result.data.msg, type: 'warning',duration: 1500});
        }
      }).catch(e=>{
        this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
      });
      })
    }
    //权限框取消
    ,permExit(){
      //清空
      this.userid ='';
      this.permsData=[];
      this.userPerms =[];
      //显示权限层
      this.permsDialogVisible = false;
    }
    //修改权限
    ,updatePerm(){
      //获得被选中的节点
      let parentKey  = this.$refs.permsTree.getCheckedKeys(); //父节点
      let childKey = this.$refs.permsTree.getHalfCheckedKeys(); //子节点
      //拼接成字符串发到后台
      let key =parentKey.concat(childKey).join(",");
      axios.get('api/perms/update',{params:{key:key,userid:this.userid}}).then(result=>{
        if (result.data.code==200){
          this.delstatus='y';
          this.msg='修改用户权限';
          this.saveDetails();
          //修改用户权限成功
          this.$message({type: 'success', message: '修改用户权限成功!'});
        }else {
          this.delstatus='n';
          this.msg='修改用户权限';
          this.saveDetails();
          //无权限或修改失败
          this.$message({showClose: true, message: result.data.msg, type: 'warning',duration: 1500});
        }
      }).catch(e=>{
        this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
      });
      this.permsDialogVisible = false;
    }
  }
  ,created(){
    //进来首先加载
    this.btnQuery();
  }
}
