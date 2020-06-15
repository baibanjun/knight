<template>
  <div>
    <p style="padding:5px 10%;border-bottom: 1px solid #ccc;text-align: center;">餐厨单位:{{title}}</p>
    <p style="width: 100%;">
      <el-row>
        <el-col :span="24">
          <el-date-picker v-model="search_month" type="month" placeholder="选择月份" value-format="yyyy-MM"></el-date-picker>&nbsp;
          <el-button type="success" icon="el-icon-search" @click="search()">查询</el-button>
        </el-col>
      </el-row>
    </p>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="日期" width="110">
        <template slot-scope="scope">{{ time_format(scope.row.created_at) }}</template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="plate_number" label="运输人"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { axios_get  } from '@/api/main'
  import { time_format } from '@/lib/tools'
  export default{
    data(){
      return {
        list:[],
        id:'',
        title:'',
        search_month:''
      }
    },
    mounted() {
      var _self = this
      _self.$store.commit('to_records')
      _self.id = _self.$route.query.id //获取路由参数，query结构为对象
      _self.title = _self.$route.query.name
      _self.search_month = time_format({format:'YY-MM',time:null})
      _self.search()
    },
    methods:{
      search:function(){
        var _self = this
        axios_get('http://knight-api.sichuanjqs.com/api/admin/rubbish_company/records',{company_id:_self.id,month:_self.search_month,page:1,limit:1000}).then(res => {
          if(res){
            _self.list = res.list
          }
        })
      },
      // 时间戳格式化
      time_format: function (req) {
        return time_format({time:req,format:'YY-MM-DD'})
      },
    }
  }
</script>

<style scoped>

</style>
