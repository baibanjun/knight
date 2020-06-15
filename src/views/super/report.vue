<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="时间">
        <el-date-picker
          v-model="search_info.time"
          type="monthrange"
          value-format="yyyy-MM"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份">
        </el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
				<!-- <el-button type="success" icon="el-icon-download" @click="handleDelete()">导出数据</el-button> -->
			</el-form-item>
		</el-form>
    <div class="report_box">
      <chart ref="chart1" :options="orgOptions" :auto-resize="false"></chart>
    </div>

    <el-table :data="list" border>
    	<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column label="时间"><template slot-scope="scope">{{scope.row.time}}</template> </el-table-column>
      <el-table-column label="入账总额">
        <template slot-scope="scope">{{scope.row.inAmount/100}}</template>
      </el-table-column>
      <el-table-column label="出账总额">
        <template slot-scope="scope">{{scope.row.outAmount/100}}</template>
      </el-table-column>
      <el-table-column label="利润">
        <template slot-scope="scope">{{scope.row.profit/100}}</template>
      </el-table-column>
      <el-table-column label="餐厨垃圾处置费(元)">
        <template slot-scope="scope">{{scope.row.rubAmount/100}}</template>
      </el-table-column>
      <el-table-column label="油脂购入(元)">
        <template slot-scope="scope">{{scope.row.oilBuyAmount/100}}</template>
      </el-table-column>
      <el-table-column label="油脂售出(元)">
        <template slot-scope="scope">{{scope.row.oilSellAmount/100}}</template>
      </el-table-column>
    </el-table>
	</div>
</template>

<script>
	import { axios_post } from '@/api/main'
  import { time_format } from '@/lib/tools.js'
	export default {
		data(){
			return {
        list:[],
        total:1,
        search_info:{
        	time:[]
        },
        orgOptions: {}
			}
		},
		mounted() {
			var _self = this
      _self.search_info.time.push(time_format({time:null,format:'YY'}) + '-01',time_format({time:null,format:'YY-MM'}) ) //初始化今年月份
      _self.search()
      this.orgOptions = {
        title:{
          text: '财务统计报表'
        },
        legend: { //显示项
          data: ['入账总额','出账总额','利润','餐厨垃圾处置费','油脂购入','油脂售出']
        },
        tooltip:{ //详情框
           trigger: 'axis' //触发模式
        },
        xAxis: { //横坐标显示项
            type: 'category',
            data: ['2019-01','2019-02','2019-03','2019-04','2019-05','2019-06']
        },
        yAxis: {
            type: 'value'
        },
        series: [
          {
            name:'入账总额',type: 'line',smooth: true,
            data: []
          },
          {
            name:'出账总额',type: 'line',smooth: true,
            data: []
          },
          {
            name:'利润', type: 'line',smooth: true,
            data: []
          },
          {
            name:'餐厨垃圾处置费',type: 'line',smooth: true,
            data: []
          },
          {
            name:'油脂购入', type: 'line',smooth: true,
            data: []
          },
          {
            name:'油脂售出',type: 'line',smooth: true,
            data: []
          }
        ]
      }
		},
		methods:{
			search:function(currentPage){
				var _self = this
        let [start,end] = _self.search_info.time
        start = new Date(start).getTime()
        end = new Date(end).getTime()
				axios_post('/api/sa/addup',{start,end}).then(res => {
					if(res){
            _self.orgOptions.xAxis.data = []
            _self.orgOptions.series.forEach(val =>{
              val.data = []
            })
            res.forEach(val => {
              _self.orgOptions.xAxis.data.push(val.time)
              _self.orgOptions.series[0].data.push(val.inAmount/100)
              _self.orgOptions.series[1].data.push(val.outAmount/100)
              _self.orgOptions.series[2].data.push(val.profit/100)
              _self.orgOptions.series[3].data.push(val.rubAmount/100)
              _self.orgOptions.series[4].data.push(val.oilBuyAmount/100)
              _self.orgOptions.series[5].data.push(val.oilSellAmount/100)
            })
					  _self.list = res
					}
				})
			},
			handleEdit:function(_id){
			  var _self = this
				_self.$store.commit('super_statement',{_id:_id})
				_self.$router.push("/super/statementDetail")
			},
      handleDelete:function(){

      },
      //时间戳格式化
      time_format:function(req){
        var time = time_format(req).split('-')
        time.pop()
        time = time.join('-')
        return time
      }
		}
	}
</script>

<style scoped>
  .report_box{
    width: 90%;
    margin-left: 5%;
    margin-bottom: 20px;
    height: 600px;
    border: 1px solid #ccc;
  }
  .echarts {
    width: 100%;
    height: 100%;
  }
</style>
