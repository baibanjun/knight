<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="日期">
        <el-date-picker v-model="search_info.day" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
			</el-form-item>
			<el-form-item label="公司名称">
				<el-input placeholder="" v-model="search_info.company_name"></el-input>
			</el-form-item>
      <el-form-item label="油脂类别">
      	<el-select v-model="search_info.recycle_type">
      		<el-option label="全部" value=""></el-option>
          <el-option label="红油" value="2"></el-option>
          <el-option label="地沟油" value="3"></el-option>
      	</el-select>
      </el-form-item>
      <el-form-item label="交易方式">
      	<el-select v-model="search_info.type">
      		<el-option label="全部" value=""></el-option>
          <el-option label="送货" value="1"></el-option>
          <el-option label="自提" value="2"></el-option>
      	</el-select>
      </el-form-item>
			<el-form-item label="核对状态">
				<el-select v-model="search_info.settle_status">
          <el-option label="未核对" value="0"></el-option>
          <el-option label="已核对" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
			<el-table-column prop="company_name" label="公司名称"> </el-table-column>
      <el-table-column prop="contacts" label="联系人"> </el-table-column>
      <el-table-column prop="mobile" label="手机号"> </el-table-column>
      <el-table-column prop="sn" label="出入库编号"> </el-table-column>
      <el-table-column label="结算去杂净重(kg)" width="140">
        <template slot-scope="scope">{{ (scope.row.settle_oil_content*scope.row.net_weight).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="油脂类别">
        <template slot-scope="scope">{{ scope.row.recycle_type==2?'红油':scope.row.recycle_type==3?'地沟油':'固渣' }}</template>
      </el-table-column>
      <el-table-column label="单价(元)"><template slot-scope="scope">{{ scope.row.trash_price/100 }}</template></el-table-column>
      <el-table-column label="发生额(元)"><template slot-scope="scope">{{ (scope.row.settle_oil_content*scope.row.net_weight*scope.row.trash_price/100).toFixed(2) }}</template></el-table-column>
      <el-table-column label="交易方式"><template slot-scope="scope">{{ scope.row.type==1?'送货':'自提' }}</template></el-table-column>
      <el-table-column label="拉运费用(元)"><template slot-scope="scope">{{ scope.row.pull_amount/100 }}</template></el-table-column>
			<el-table-column label="核对状态"><template slot-scope="scope">{{ scope.row.settle_status==1?'已核对':'未核对' }}</template></el-table-column>
			<el-table-column label="操作" width="120">
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
	import { axios_get,axios_delete  } from '@/api/main'
	export default {
		data(){
			return {
        list:[
          {
            "create_time": '',
            "rough_weight": '',
            "mobile": "",
            "contacts":'',
            "settle_status": '',
            "type": '',
            "recycle_type": '',
            "net_weight_without_impurity": '',
            "company_name": "公司A",
            "settle_oil_content": '',
            "id": '',
            "sn": "1562904948504"
          }
        ],
        total:0,
        search_info:{
        	page:1,
        	limit:10,
          day:'',
        	company_name:'',
        	recycle_type:'',
        	type:'',
          settle_status:'0'//结算状态
        }
			}
		},
		mounted() {
			var _self = this
      _self.search_info.company_name = _self.$store.state.finance.fin_search_info.gre_export_company_name
		  _self.search(1)
		},
		methods:{
	 // 导出
    leadingOut() {
		var xxx={
        	page:1,
        	limit:this.total,
          day:this.search_info.day,
        	company_name:this.search_info.company_name,
        	recycle_type:this.search_info.recycle_type,
        	type:this.search_info.type,
          settle_status:this.search_info.settle_status//结算状态
        }
		axios_get('/api/fi/grease_ex_warehouse',xxx).then(res => {
				  if(res){
					require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['公司名称','联系人','手机号','出入库编号','结算去杂净重(kg)','油脂类别','单价(元)','发生额(元)','交易方式','核对状态'] // 对应表格输出的title
          const filterVal = ['company_name','contacts','mobile','sn','net_weight_without_impurity','recycle_type','trash_price','settle_oil_content','type','settle_status'] // 对应表格输出的数据
		  var list = JSON.parse(JSON.stringify(this.list))
					list = res.list

          list.forEach(item => {
			  item.net_weight_without_impurity=(item.settle_oil_content*item.net_weight).toFixed(2)
			  item.settle_oil_content=(item.settle_oil_content*item.net_weight*item.trash_price/100).toFixed(2)
            item.recycle_type = item.recycle_type==2?'红油':item.recycle_type==3?'地沟油':'固渣'
			item.trash_price=item.trash_price/100
			item.type=item.type==1?'送货':'自提'
			item.settle_status=item.settle_status==1?'已核对':'未核对'
		  });
		  console.log(list)
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '餐厨油脂出库') // 对应下载文件的名字
        })
				  }
				})

    },
    formatJson: function(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
			search:function(currentPage){
				var _self = this

        _self.$store.commit('set_fin_search_info',{
          gre_export_company_name:_self.search_info.company_name
        })

			  if(currentPage){
			    _self.search_info.page = currentPage
			  }
			  axios_get('/api/fi/grease_ex_warehouse',_self.search_info).then(res => {
				  if(res){
				    _self.list = res.list
			      _self.total = res.totalCount
				  }
				})
			},
			handleEdit:function(_id){
			  this.$store.commit('finance_gre_export',{_id:_id})
				this.$router.push("/finance/gre/exportDetail")
			}
		}
	}
</script>

<style>

</style>
