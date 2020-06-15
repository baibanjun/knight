<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="合同编号">
				<el-input placeholder="" v-model="search_info.no"></el-input>
			</el-form-item>
      <el-form-item label="公司名称">
      	<el-input placeholder="" v-model="search_info.company_name"></el-input>
      </el-form-item>
			<el-form-item label="签订人员">
				<el-input placeholder="" v-model="search_info.sign_a_contract_user"></el-input>
			</el-form-item>
			<el-form-item label="合同类别">
				<el-select v-model="search_info.type">
					<el-option label="全部" value=""></el-option>
          <el-option label="购入-红油" value="1"></el-option>
          <el-option label="购入-地沟油" value="2"></el-option>
          <el-option label="售卖-红油" value="3"></el-option>
          <el-option label="售卖-地沟油" value="3"></el-option>
          <el-option label="临时合同" value="5"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
				<!-- <el-button type="warning" icon="el-icon-plus" @click="add()">新增合同</el-button> -->
        <el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
			<el-table-column prop="no" label="合同编号"> </el-table-column>
			<el-table-column prop="companyName" label="公司名称"> </el-table-column>
      <el-table-column prop="companyContacts" label="联系人"> </el-table-column>
      <el-table-column prop="companyMobile" label="手机号"> </el-table-column>
      <el-table-column prop="signAContractTime" label="签订时间"> </el-table-column>
      <el-table-column label="合同总价"><template slot-scope="scope"> {{ scope.row.totalPrices/100 }} </template> </el-table-column>
      <el-table-column prop="signAContractUser" label="签订人员"> </el-table-column>
			<el-table-column label="合同类型">
        <template slot-scope="scope">
          {{ scope.row.type==1?'购入-红油':scope.row.type==2?'购入-地沟油':scope.row.type==3?'售卖-红油':scope.row.type==4?'售卖-地沟油':'临时合同' }}
        </template>
      </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
					<!-- <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button> -->
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
            id:1,
            companyName:'',
            companyContacts:'',
            companyMobile:'',
            signAContractTime:'',
            totalPrices:'',
            no:'',
            signAContractUser:'',
            type:''
          }
        ],
        total:1,
        search_info:{
        	page:1,
        	limit:10,
        	no:'',
        	company_name:'',
        	sign_a_contract_user:'',
          type:''
        }
			}
		},
		mounted() {
			var _self = this
      _self.search_info.no = _self.$store.state.finance.fin_search_info.gre_contract_no
      _self.search_info.sign_a_contract_user = _self.$store.state.finance.fin_search_info.gre_contract_sign
      _self.search_info.company_name = _self.$store.state.finance.fin_search_info.gre_contract_company_name
		  _self.search(1)
		},
		methods:{
	// 导出
    leadingOut() {
		var xxx={
        	page:1,
        	limit:this.total,
        	no:this.search_info.no,
        	company_name:this.search_info.company_name,
        	sign_a_contract_user:this.search_info.sign_a_contract_user,
          type:this.search_info.type
        }
		axios_get('/api/fi/grease_contract',xxx).then(res => {
			    if(res){
				   require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['合同编号', '公司名称','联系人','手机号','签订时间','合同总价','签订人员','合同类型'] // 对应表格输出的title
          const filterVal = ['no','companyName','companyContacts','companyMobile','signAContractTime','totalPrices','signAContractUser','type'] // 对应表格输出的数据
		  var list = JSON.parse(JSON.stringify(this.list))
				  list = res.list
          list.forEach(item => {
            item.type = item.type==1?'购入-红油':item.type==2?'购入-地沟油':item.type==3?'售卖-红油':item.type==4?'售卖-地沟油':'临时合同'
            item.totalPrices=item.totalPrices/100
          });
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '合同管理') // 对应下载文件的名字
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
          gre_contract_no:_self.search_info.no,
          gre_contract_sign:_self.search_info.sign_a_contract_user,
          gre_contract_company_name:_self.search_info.company_name
        })

			  if(currentPage){
			    _self.search_info.page = currentPage
			  }
			  axios_get('/api/fi/grease_contract',_self.search_info).then(res => {
			    if(res){
			      _self.list = res.list
			      _self.total = res.totalCount
			    }
			  })
			},
			handleEdit:function(_id){
			  this.$store.commit('finance_gre_contract',{_id:_id})
				this.$router.push("/finance/gre/contractDetail")
			},
			add:function(){
			  this.$router.push("/finance/gre/addContract")
			},
			handleDelete:function(_id){
				var _self = this
				_self.$prompt('确认删除该合同?','提示',{
			    inputPlaceholder:'请填写删除理由',
			    inputPattern:/\S{2,40}/,
			    inputErrorMessage:'字数在2-40之间'
			  }).then(({value})=> {
						axios_delete('/api/fi/grease_contract/'+_id,{remark:value}).then(res => {
						  if(res===null){
						    _self.search(1)
						  }
						})
					})
			}
		}
	}
</script>

<style>

</style>
