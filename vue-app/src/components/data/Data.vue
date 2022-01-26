<template src="./Data.html">

</template>

<script>
import axios from "axios";

export default {
  name: "Data",

  data() {
    return {
      tableData: [], //列表数据
      search: '',
      //-----分页所需-----
      total: 0, //总共多少条数据
      pageNum:1, //起始页
      pageSize:7,
      //--------end-----
    }
  }
  , methods: {
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
    //列表查询方法
  ,btnQuery(){
    let token = localStorage.getItem('token')
    axios.get('api/data/list',{params:{pageNum:this.pageNum,pageSize:this.pageSize},headers:{'Token':token}})
      .then(result=>{
        if (result.data.code==200){
          //拿到消息中的集合
          this.total=result.data.data.total
          this.tableData=result.data.data.list;
        }else {
          this.$message(result.data.msg);
        }
      }).catch(e=>{
      this.$message({type: 'error', message: '服务器正忙..', duration:1500});
    });
    //条件查询
  },
    //删除记录
    delDetail(){

    }
  },created(){
    //进来首先加载
    this.btnQuery();
  }
}
</script>

<style scoped>

</style>
