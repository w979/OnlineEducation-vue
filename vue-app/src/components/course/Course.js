import axios from 'axios';
import th from "element-ui/src/locale/lang/th";
import fa from "element-ui/src/locale/lang/fa";
export default {
  name: "course",
  data(){
    return {
      name:'',
      tableData:[], //列表数据
      courseStatus:[
        {value: '', label: '全部'},
        {value: 'y', label: '可选课程'},
        {value: 'n', label: '不可选课程'}
      ],
      status:'',
      delstatus:'',

      //-----分页所需-----
      total: 0, //总共多少条数据
      pageNum:1, //起始页
      pageSize:5,
      //--------end-----

      //-----添加所需-------
      dialogFormVisible: false,
      subjectItem:[], //所有课程
      teacherItem:[], //所有讲师
      addform: {
        subjectid: '', //课程名称
        describes: '', //课程简介
        teacherid:'',//教师
        electivedate:'', //开选时间
        pnum:0,//人数
        status:'y' //状态默认y
      },
      formLabelWidth: '120px',
      //表单校验规则
      rules:{
        subjectid:[
          {required: true, message: '请选择课程', trigger: 'blur'},
        ],
        teacherid:[
          {required: true, message: '请选择讲师', trigger: 'blur'},
        ],
        describes:[
          {required: true, message: '请输入课程简介', trigger: 'blur'},
          {min: 1,max:30, message: '课程简介1~30个字数'}
        ],
        electivedate:[
          { required: true, message: '请选择开选时间', trigger: 'blur'},
        ],
      },
      //-------end---------


      //--------修改所需--------
      UpdialogFormVisible:false,
      currentCourse:{}, //当前要修改讲师的信息
      //-------end---------

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
    //列表+条件查询方法
    ,btnQuery(){
      let token = localStorage.getItem('token')
      axios.get('api/course/list',{params:{status:this.status,pageNum:this.pageNum,pageSize:this.pageSize},headers:{'Token':token}})
        .then(result=>{
          if (result.data.code==200){
            //拿到消息中的集合
            this.total=result.data.data.total
            this.tableData=result.data.data.list;
            console.log(this.tableData)
          }else {
            this.$message(result.data.msg);
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
      axios.get('api/course/showAdd',{params:{},headers:{'Token':Token}}).then(result=>{
        console.log(result.data)
        if (result.data.code==200){
          this.subjectItem=result.data.data.subjectList;
          this.teacherItem=result.data.data.teacherList;
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
    //添加选课信息
    ,addCourse(addform){
      this.$refs[addform].validate((valid) => {
        if (valid) {
          let course = this.addform;
          let Token = localStorage.getItem('token');
          axios.post('api/course/add', course, {headers: {'Token': Token}}).then(result => {
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
    //跳转到修改页面并显示当前选课的信息
    ,showUpdate(row,subjectid,teacherid){
      let Token = localStorage.getItem('token');
      axios.get('api/course/showUpdate',{params:{},headers:{'Token':Token}}).then(result=>{
        if (result.data.code==200){
          //有权限
          //开启修改对话框
          this.UpdialogFormVisible=true;
          //获得当前行的信息
          this.currentCourse=row;
          this.currentCourse.subjectid=subjectid; //课程
          this.currentCourse.teacherid=teacherid; //老师
          this.subjectItem=result.data.data.subjectList;
          this.teacherItem=result.data.data.teacherList;
        }else {
          //无权限
          this.$message({type: 'warning', message: result.data.msg, duration: 1500});
        }
      }).catch(e=>{
        this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
      });
    }
    //修改
    ,updateCourse(updateform){
      this.$refs[updateform].validate((valid) => {
        if (valid) {
          let course = {};
          course = this.currentCourse;
          axios.post('api/course/update',course).then(result=>{
            if (result.data.code==200){
              //修改成功
              this.UpdialogFormVisible = false;
              this.$message({showClose: true, message: result.data.msg, type: 'success'});
              this.btnQuery();
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
        msg:'删除课程信息',
        status:this.delstatus,
        ip:ip
      }
      axios.post('api/data/add',details).then(result=>{
        console.log(result.data.msg);
      }).catch(e=>{
        console.log(result.data.msg);
      });
    },
    //删除选课信息
    delCourse(id,index){
      this.$confirm('此操作将永久删除该条选课信息, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('api/course/delete',{params:{id:id}}).then(result=>{
          //有权限/删除成功
          if (result.data.code==200){
            this.delstatus='y'
            this.saveDetails();
            //在数组中删除该元素，不调用查询方法
            this.tableData.splice(index,1);
            //删除成功
            this.$message({type: 'success', message: '删除选课信息成功!'});
          }else {
            this.delstatus='n'
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
