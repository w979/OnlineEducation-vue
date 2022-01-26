import axios from 'axios';
import th from "element-ui/src/locale/lang/th";
import fa from "element-ui/src/locale/lang/fa";
import SCHOOL_LIST from "../utils/chinas-school";
export default {
  name: "student",
  data(){
    return {
      delstatus:'',
      stuname:'',
      value:[],
      tableData:[], //列表数据
      schoolItem:[
        {
          value: "name",
          label: '1',
          children:[{
            value: 'zhinan',
            label: '2',
            children:[{
                value: 'zhinan',
                label: '3',
              }
              ]
          }]
        }
      ], //全部学校
      //年级列表
      gradeItem:[
        {value: '', label: '入学年份'},
        {value: '2017', label: '2017级'},
        {value: '2018', label: '2018级'},
        {value: '2019', label: '2019级'},
        {value: '2020', label: '2020级'}
      ],
      grade:'',
      //专业列表
      professinolItem:[
        {value: '', label: '所在专业'},
        {value: '软件工程', label: '软件工程'},
        {value: '计算机', label: '计算机'},
        {value: '机械工程', label: '机械工程'},
        {value: '电子信息工程', label: '电子信息工程'}
      ],
      professinol:'',


      //-----详情所需-----
      showdialogFormVisible:false,
      stu_sub_Data:[],
      thisstuname:'',
      //--------end-----

      //-----分页所需-----
      total: 0, //总共多少条数据
      pageNum:1, //起始页
      pageSize:5,
      //--------end-----

      //-----添加所需-------
      dialogFormVisible: false,
      addform: {
        stuname: '', //学生姓名
        stuno: '', //学号
        grade:'',//年级
        professinol:'', //专业
        sex:'',
        gpa:'',
        phone:'' //联系方式
      },
      formLabelWidth: '120px',
      //表单校验规则
      rules:{
        stuname:[
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min:2,max:10,message: '姓名最长度为2~10'}
        ],
        stuno:[
          {required: true, message: '请输入学号', trigger: 'blur'},
          {min:7,max:7,message: '学号长度为7'}
        ],
        grade:[
          {required: true, message: '请选择年级', trigger: 'blur'},
        ],
        professinol:[
          { required: true, message: '请选择专业', trigger: 'blur'},
        ],
        sex:[
          { required: true, message: '请选择性别', trigger: 'blur'},
        ],
        gpa:[
          { required: true, message: '请输入GPA', trigger: 'blur'},
        ],
        phone:[
          { required: true, message: '请输入联系方式', trigger: 'blur'},
          {min:11,max:11,message: '电话号码为11位'}
        ],
      },
      //-------end---------


      //--------修改所需--------
      UpdialogFormVisible:false,
      currentStu:{}, //当前要修改讲师的信息
      //-------end---------

    }
  },methods:{
    handleChange(value){
      console.log(value)
    }
    //改变页码
    ,handleSizeChange(pageSize) {
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
      axios.get('api/student/list',{params:{grade:this.grade,professinol:this.professinol,stuname:this.stuname,pageNum:this.pageNum,pageSize:this.pageSize},headers:{'Token':token}})
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
    //清空查询条件
    ,clearbtn(){
      this.stuname='';
      this.grade='';
      this.professinol='';
      this.btnQuery();
    }
    //查看学生所学课程详情
    ,showPersonal(id,stuname){
      this.thisstuname = stuname;
      let Token = localStorage.getItem('token')
      axios.get('api/student/personal',{params:{id:id},headers:{'Token':Token}}).then(result=>{
        console.log(result.data)
        if (result.data.code==200){
          this.stu_sub_Data=result.data.data;
        }else {
          this.$message({type: 'warning', message: result.data.msg, duration: 1500});
        }
      }).catch(e=>{
        this.$message({type: 'error', message: '服务器正忙..', duration: 1500});
      });
      this.showdialogFormVisible = true;
    }
    //跳转添加页面  并判断此用户是否拥有该权限
    ,showAdd(){
      this.value = SCHOOL_LIST;
      console.log('学校:')
      console.log(this.value)
      let Token = localStorage.getItem('token');
      axios.get('api/student/showAdd',{params:{},headers:{'Token':Token}}).then(result=>{
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
    //添加选课信息
    ,addStu(addform){
      this.$refs[addform].validate((valid) => {
        if (valid) {
          let student = this.addform;
          let Token = localStorage.getItem('token');
          axios.post('api/student/add', student, {headers: {'Token': Token}}).then(result => {
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
    //跳转到修改页面并显示当前学生的信息
    ,showUpdate(row){
      let Token = localStorage.getItem('token');
      axios.get('api/student/showUpdate',{params:{},headers:{'Token':Token}}).then(result=>{
        if (result.data.code==200){
          //有权限
          //开启修改对话框
          this.UpdialogFormVisible=true;
          //获得当前行的信息
          this.currentStu=row;
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
          let student = {};
          student = this.currentStu;
          axios.post('api/student/update',student).then(result=>{
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
      this.currentStu={};
      this.$refs[updateform].resetFields();
      this.UpdialogFormVisible=false;
    },
    saveDetails(){
      let username = localStorage.getItem('username');
      let ip = localStorage.getItem('ip');
      let details={
        name:username,
        msg:'删除学生信息',
        status:this.delstatus,
        ip:ip
      }
      axios.post('api/data/add',details).then(result=>{
        console.log(result.data.msg);
      }).catch(e=>{
        console.log(e);
      });
    },
    //删除学生信息
    delStu(id,index){
      this.$confirm('此操作将永久删除该条选课信息, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('api/student/delete',{params:{id:id}}).then(result=>{
          //有权限/删除成功
          if (result.data.code==200){
            this.delstatus='y';
            this.saveDetails();
            //在数组中删除该元素，不调用查询方法
            this.tableData.splice(index,1);
            //删除成功
            this.$message({type: 'success', message: '删除学生信息成功!'});
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
