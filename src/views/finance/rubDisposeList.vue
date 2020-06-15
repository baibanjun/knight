<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="日期">
        <el-date-picker v-model="search_info.month" type="month" placeholder="选择日期" value-format="yyyy-MM"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="dateStr" label="日期"> </el-table-column>
      <el-table-column prop="netWeightTotal" label="总净重(kg)"> </el-table-column>
      <el-table-column prop="solidRubbishAmount" label="废弃固渣(车)"> </el-table-column>
      <el-table-column prop="netWeightOil" label="加工油净重(kg)"> </el-table-column>
      <el-table-column prop="netWeightWithoutImpurity" label="去杂净重(kg)"> </el-table-column>
      <el-table-column prop="price" label="废物处置费(元)">
        <template slot-scope="scope">{{scope.row.price/100}}</template>
      </el-table-column>
			<el-table-column prop="xx" label="操作">
        <template slot="header" slot-scope="scope">
          操作 &nbsp;<el-button size="mini" type="primary" @click="handleSummaryEdit()">合计详情</el-button>
        </template>
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
    <div class="page">
      <el-pagination
        :total="total"
        background
        :current-page="search_info.page"
        @current-change="search"
        >
      </el-pagination>
    </div>
	</div>
</template>

<script>
	import { axios_get } from '@/api/main'
  import { time_format } from '@/lib/tools'
	export default {
		data(){
			return {
        list:[
          {
            id:1,
            dateStr:'',
            netWeightTotal:'',
            solidRubbishAmount:'',
            netWeightWithoutImpurity:'',
            netWeightOil:'',
            price:''
          }
        ],
        total:1,
        sums_data:{},
				search_info:{
					page:1,
					limit:10,
					month:''
				}
			}
		},
		mounted() {
			var _self = this
      //获取当前月
      _self.search_info.month = time_format({time:null,format:'YY-MM'})
      _self.search(1)
		},
		methods:{
      		 // 导出
    leadingOut() {
		var xxx={
					page:1,
					limit:this.total,
					month:this.search_info.month
				}
		axios_get('/api/fi/rubbish_day_auto',xxx).then(res => {
				  if(res){
					require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['日期','总净重(kg)','废弃固渣(车)','加工油净重(kg)','去杂净重(kg)','废物处置费(元)'] // 对应表格输出的title
          const filterVal = ['dateStr','netWeightTotal','solidRubbishAmount','netWeightOil','netWeightWithoutImpurity','price'] // 对应表格输出的数据
		  var list = JSON.parse(JSON.stringify(this.list))
					list = res.list
		  
          list.forEach(item => {
			item.price=item.price/100
		  });
		  console.log(list)
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '餐厨垃圾处理') // 对应下载文件的名字
        })
				  }
				})
       
    },
    formatJson: function(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
      search:function(currentPage){
        var _self = this
        if(currentPage){
          _self.search_info.page = currentPage
        }
        //删除月份时
        if(_self.search_info.month===null){
          _self.search_info.month = ''
        }
        axios_get('/api/fi/rubbish_day_auto',_self.search_info).then(res => {
          if(res){
            _self.list = res.list
            _self.sums_data = res.sum
            _self.total = res.totalCount
          }
        })
      },
			handleEdit:function(_id){
				this.$store.commit('finance_rub_dispose',{_id:_id})
				this.$router.push("/finance/rub/disposeDetail")
			},
      handleSummaryEdit:function(){
        var _self = this
        var _info = {
          time:_self.search_info.month,
          pureWeight:_self.sums_data.net_weight_total,
          carNum:_self.sums_data.solid_rubbish_amount,
          oilPureWeight:_self.sums_data.net_weight_oil,
          finalPureWeight:_self.sums_data.net_weight_without_impurity,
          totalAmount:0,
          stocks:[]
        }
        _self.list.forEach(val => {
          _info.totalAmount+= val.price/100
          _info.stocks.push(val.id)
        })
      	_self.$store.commit('set_finance_info',_info)
      	_self.$router.push("/finance/rub/disposeSummary")
      },
      getSummaries:function(param){
        var _self = this
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          switch(column.property) {
            case "netWeightTotal":
            sums[index] = _self.sums_data.net_weight_total
            break;
            case "solidRubbishAmount":
            sums[index] = _self.sums_data.solid_rubbish_amount
            break;
            case "netWeightOil":
            sums[index] = _self.sums_data.net_weight_oil
            break;
            case "netWeightWithoutImpurity":
            sums[index] = _self.sums_data.net_weight_without_impurity
            break;
            case "price":
            var _total = 0
            data.forEach(val => {
              _total+= val.price/100
            })
            sums[index] = _total
            break;
            default:
            break;
          }
        });
        return sums;
      }
		}
	}
</script>

<style scoped>

</style>
