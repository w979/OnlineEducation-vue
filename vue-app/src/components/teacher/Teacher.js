import axios from 'axios';
import th from "element-ui/src/locale/lang/th";
import fa from "element-ui/src/locale/lang/fa";
export default {
  name: "Teacher",
  data(){
    return {
      tachername:'',
      tableData:[], //列表数据

      //-----分页所需-----
      total: 0, //总共多少条数据
      pageNum:1, //起始页
      pageSize:5,
      //--------end-----

      //-----添加所需-------
      dialogFormVisible: false,
      addform: {
       name: '', //讲师名称
       education: '', //教育背景
       career:'', //教育描述
       isfamous:'',//级别
       subjectid:'', // 所教科目
       status:'y' //状态 默认在职
      },
      formLabelWidth: '120px',
      subjectItem:[], //科目集合
      //添加时表单校验
      rules:{
        name:[
          {required: true, message: '讲师姓名不能为空', trigger: 'blur'},
          {min: 2,max:10, message: '姓名长度2~6位'}
        ],
        education:[
          { required: true, message: '教育背景不能为空', trigger: 'blur'},
          {min: 1,max:30, message: '教育背景长度1~30位'}
        ],
        career:[
          { required: true, message: '教育描述不能为空', trigger: 'blur'},
          {min: 1,max:100, message: '字数1~100个'}
        ],
        subjectid:[
          { required: true, message: '请选择所教科目', trigger: 'blur'},
        ],
        isfamous:[
          { required: true, message: '请选择级别', trigger: 'blur'},
        ]
      },
      //-------end---------

      //--------修改所需--------
      UpdialogFormVisible:false,
      currentTeacher:{}, //当前要修改讲师的信息
      subjectid:'',
      //-------end---------
      delstatus:'',
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
      let Token = localStorage.getItem("token");
      axios.get('api/teacher/query',{params:{name:this.tachername,pageNum:this.pageNum,pageSize:this.pageSize},headers:{'Token':Token}})
        .then(result=>{
          if (result.data.code==200){
            //拿到消息中的集合
            this.total=result.data.data.total
            this.tableData=result.data.data.list;
          }else {
            this.$message(result.data.msg);
            this.tachername='';
          }
        }).catch(e=>{
        this.$message({
          type: 'error',
          message: '服务器正忙..',
          duration:1500
        });
      });
      //条件查询
    },selectQuery(){
      this.pageNum=1;
      this.btnQuery()
    }
    //查询科目列表
    ,querySubject(){
      axios.get('api/teacher/subject',{params:{}}).then(result=>{
        if (result.data.code==200){
          this.subjectItem=result.data.data;
        }else {
          this.$message(result.data.msg);
        }
      }).catch(e=>{
        this.$message({
          type: 'error',
          message: '服务器正忙..',
          duration:1500
        });
      })
    }
    //跳转添加页面  并判断此用户是否拥有该权限
    ,showAdd(){
      axios.get('api/teacher/showAdd',{params:{}}).then(result=>{
        console.log(result.data)
        if (result.data.code==200){
          //有权限
          this.dialogFormVisible=true; //开启添加弹框
          this.querySubject(); //加载科目列表
        }else {
          //无权限
          this.$message({type: 'warning', message: result.data.msg, duration: 1500});
        }
      }).catch(e=>{
        this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
      })
    }
    //添加讲师
    ,addTeacher(addform){
      this.$refs[addform].validate((valid) => {
        if (valid) {
          let teacher = this.addform;
          axios.post('api/teacher/add', teacher).then(result => {
            console.log(result.data)
            if (result.data.code == 200) {
              //添加成功
              this.addform={}  //清空表单中数据
              this.dialogFormVisible = false;
              this.$message({
                showClose: true,
                message: result.data.msg,
                type: 'success'
              });
            } else {
              //添加失败
              this.$message({
                showClose: true,
                message: result.data.msg,
                type: 'error'
              });
            }
          }).catch(e => {
            this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
          })
        }else {
          //表单校验失败
          return false;
        }
      });
    }
    //添加框取消
    ,adddialogFormVisible(addform){
      this.$refs[addform].resetFields();
      this.dialogFormVisible=false;
    }
    //跳转到修改页面并显示当前讲师的信息
    ,showUpdate(index,subjectid){
      axios.get('api/teacher/showUpdate',{params:{}}).then(result=>{
        if (result.data.code==200){
          //有权限
          //开启修改对话框
          this.UpdialogFormVisible=true;
          //根据索引获取当前要修改的讲师的信息
          this.currentTeacher=this.tableData[index];
          //获取所教科目
          this.currentTeacher.subjectid=subjectid;
          this.querySubject();
        }else {
          //无权限
          this.$message({type: 'warning', message: result.data.msg, duration: 1500});
        }
      }).catch(e=>{
        this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
      });
    }
    //修改
    ,updateTeacher(updateform){
      this.$refs[updateform].validate((valid) => {
          if (valid) {
            let teacher = {};
            teacher = this.currentTeacher;
            axios.post('api/teacher/update',teacher).then(result=>{
              if (result.data.code==200){
                //修改成功
                this.UpdialogFormVisible = false;
                this.$message({
                  showClose: true,
                  message: result.data.msg,
                  type: 'success'
                });

              }else {
                //修改失败
                this.$message({
                  showClose: true,
                  message: result.data.msg,
                  type: 'error'
                });
              }
            }).catch(e=>{
              this.$message({
                type: 'error',
                message: '服务器正忙..',
                duration: 1500
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
      this.$refs[updateform].resetFields();
      this.UpdialogFormVisible=false;
    },
    saveDetails(){
      let username = localStorage.getItem('username');
      let ip = localStorage.getItem('ip');
      let details={
        name:username,
        msg:'删除讲师信息',
        status:this.delstatus,
        ip:ip
      }
      axios.post('api/data/add',details).then(result=>{
        console.log(result.data.msg);
      }).catch(e=>{
        console.log(e);
      });
    },
    //删除讲师
    delTeacher(id,index){
      this.$confirm('此操作将永久删除该讲师, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('api/teacher/delete',{params:{id:id}}).then(result=>{
            //有权限/删除成功
            if (result.data.code==200){
              this.delstatus='y';
              this.saveDetails();
              //在数组中删除该元素，不调用查询方法
              this.tableData.splice(index,1);
              //删除成功
              this.$message({type: 'success', message: '删除成功!'});
            }else {
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
  }
  ,created(){
    //进来首先加载
    this.btnQuery();
  }
}
