<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item label="合同编号">
				<el-input placeholder="" v-model="search_info.id"></el-input>
			</el-form-item>
      <el-form-item label="公司名称">
      	<el-input placeholder="" v-model="search_info.company_name"></el-input>
      </el-form-item>
			<el-form-item label="签订人员">
				<el-input placeholder="" v-model="search_info.sign_a_contract_user"></el-input>
			</el-form-item>
			<el-form-item label="合同状态">
				<el-select v-model="search_info.status">
					<el-option label="全部" value=""></el-option>
          <el-option label="有效" value="1"></el-option>
          <el-option label="失效" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
				<el-button type="warning" icon="el-icon-plus" @click="add()">新增合同</el-button>
        <el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="no" label="合同编号"> </el-table-column>
			<el-table-column prop="companyName" label="单位名称"> </el-table-column>
			<el-table-column prop="companyContacts" label="联系人"> </el-table-column>
      <el-table-column prop="companyMobile" label="手机号"> </el-table-column>
      <el-table-column prop="signAContractTime" label="签订时间"> </el-table-column>
      <el-table-column prop="expirationTime" label="到期时间">
        <template slot-scope="scope">
          <el-link type="danger" v-if="is_expire(scope.row.expirationTime)">{{ scope.row.expirationTime }}</el-link>
          <el-link v-if="!is_expire(scope.row.expirationTime)">{{ scope.row.expirationTime }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="签订单价">
        <template slot-scope="scope">{{ scope.row.price/100 + (scope.row.clearingForm == 1?' 元/kg':scope.row.clearingForm == 2?' 元/月':' 元/年') }}</template>
      </el-table-column>
      <el-table-column prop="signAContractUser" label="签订人员"> </el-table-column>
			<el-table-column prop="status" label="合同状态"><template slot-scope="scope">{{ is_past(scope.row.expirationTime)==true?'失效':'有效' }}</template></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
import {baseURL} from '../../config/index.js'
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
            expirationTime:'',
            price:'',
            signAContractUser:'',
            status:''
          }
        ],
        total:1,
				search_info:{
					page:1,
					limit:10,
					id:'',
					company_name:'',
					sign_a_contract_user:'',
          status:''
				}
			}
		},
		mounted() {
			var _self = this
      _self.search_info.id = _self.$store.state.admin.state_search_info.rub_contract_id
      _self.search_info.sign_a_contract_user = _self.$store.state.admin.state_search_info.rub_contract_sign
      _self.search_info.company_name = _self.$store.state.admin.state_search_info.rub_contract_company_name
      _self.search(1)
		},
		methods:{
			// 导出
      leadingOut() {
        window.open(baseURL+'/api/admin/rubbish_contract/export?'+'token='+ this.$store.state.token+'&id='+this.search_info.id+'&company_name='+this.search_info.company_name+'&sign_a_contract_user='+this.search_info.sign_a_contract_user+'&status='+this.search_info.status);
      },
			search:function(currentPage){
			  var _self = this

        _self.$store.commit('set_admin_search_info',{
          rub_contract_id:_self.search_info.id,
          rub_contract_sign:_self.search_info.sign_a_contract_user,
          rub_contract_company_name:_self.search_info.company_name
        })

			  if(currentPage){
			    _self.search_info.page = currentPage
			  }
			  axios_get('api/admin/rubbish_contract',_self.search_info).then(res => {
			    if(res){
			      _self.list = res.list
			      _self.total = res.totalCount
			    }
			  })
			},
			handleEdit:function(_id){
        this.$store.commit('admin_rub_contract',{_id:_id})
				this.$router.push("/admin/rub/contractDetail")
			},
      add:function(){
        this.$router.push("/admin/rub/addContract")
      },
			handleDelete:function(_id){
				var _self = this
				_self.$prompt('确认删除该账号?','提示',{
          inputPlaceholder:'请填写删除理由',
          inputPattern:/\S{2,40}/,
          inputErrorMessage:'字数在2-40之间'
        }).then(({value})=> {
						axios_delete('api/admin/rubbish_contract/'+_id,{deleteReason:value}).then(res => {
						  if(res===null) _self.search(1)
						})
					})
					.catch(()=> {});
			},
      //合同是否过期
      is_past:function(str){
        var now = (new Date()).valueOf();
        var date = new Date(str);
        var expire_time = date.valueOf();
        if(expire_time > now){
          return false
        }
        else{
          return true
        }
      },
      //合同是否临期 30天
      is_expire:function(str){
        var now = (new Date()).valueOf();
        var date = new Date(str);
        var expire_time = date.valueOf();
        if((expire_time-now)>30*86400*1000){
          return false
        }
        else{
          return true
        }
      }
		}
	}
</script>

<style>

</style>
