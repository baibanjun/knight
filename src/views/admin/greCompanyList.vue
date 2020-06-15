<template>
	<div>
		<el-form :inline="true" class="demo-form-inline">
      <el-form-item label="地区">
      	<el-select v-model="cityId" @change="changeCity">
          <el-option label="全部" value=""></el-option>
      		<el-option v-for="n in city_list" :label="n.bname" :value="n.bcode"></el-option>
      	</el-select>
      	<el-select v-model="search_info.area_id">
          <el-option label="全部" value=""></el-option>
      		<el-option v-for="n in area_list" :label="n.name" :value="n.code"></el-option>
      	</el-select>
      </el-form-item>
      <el-form-item label="单位名">
      	<el-input placeholder="" v-model="search_info.name"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
      	<el-input placeholder="" v-model="search_info.contacts"></el-input>
      </el-form-item>
      <el-form-item label="电话">
      	<el-input placeholder="" v-model="search_info.mobile"></el-input>
      </el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="warning" icon="el-icon-plus" @click="add_company()">新增单位</el-button>
				<el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
			</el-form-item>
		</el-form>

		<el-table :data="list" border style="width: 100%">
			<el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="name" label="单位名称"> </el-table-column>
      <el-table-column prop="contacts" label="联系人"> </el-table-column>
      <el-table-column prop="mobile" label="手机号"> </el-table-column>
      <el-table-column label="地区">
        <template slot-scope="scope"><span v-for="n in scope.row.areas">{{n.name}}</span></template>
      </el-table-column>
      <el-table-column prop="address" label="详细地址"> </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelect(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
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
            id:'',
            name:'',
            mobile:'',
            contacts:'',
            areas:'',
            address:'',
            rubbishDriver:{name:''},
            prepaidMoeny:''
          }
        ],
        total:1,
        city_list:[],
        area_list:[], //区域列表
        cityId:'',
        search_info:{
        	page:1,
        	limit:10,
          name:'',
          contacts:'',
          mobile:'',
          area_id:''
        }
			}
		},
		mounted() {
			var _self = this
      _self.search_info.name = _self.$store.state.admin.state_search_info.gre_company_name
      _self.search_info.contacts = _self.$store.state.admin.state_search_info.gre_company_contacts
      _self.search_info.mobile = _self.$store.state.admin.state_search_info.gre_company_mobile
		  _self.search(1)
      //获取四川城市列表
      axios_get('api/admin/tip_login/area').then(res => {
        if(res){
          res.forEach(value => {
            if(value.acode==510000000){ //抓取四川
              _self.city_list = value.children
            }
          })
        }
      })
		},
		methods:{
      // 导出
    leadingOut() {
      window.open(baseURL+'/api/admin/grease_company/export?'+'token='+ this.$store.state.token+'&name='+this.search_info.name+'&contacts='+this.search_info.contacts+'&mobile='+this.search_info.mobile+'&area_id='+this.search_info.area_id);
    },
			search:function(currentPage){
			  var _self = this

        _self.$store.commit('set_admin_search_info',{
          gre_company_name:_self.search_info.name,
          gre_company_mobile:_self.search_info.mobile,
          gre_company_contacts:_self.search_info.contacts,
        })

			  if(currentPage){
			    _self.search_info.page = currentPage
			  }
			  axios_get('api/admin/grease_company',_self.search_info).then(res => {
			    if(res){
			      _self.list = res.list
			      _self.total = res.totalCount
			    }
			  })
			},
			handleEdit:function(_id){
				this.$store.commit('admin_gre_company',{_id:_id})
				this.$router.push("/admin/gre/companyDetail")
			},
			handleDelect:function(_id){
        var _self = this
        _self.$confirm('确认删除该单位？').then(() => {
          axios_delete('api/admin/grease_company/'+_id).then(res => {
            if(res===null) _self.search(1)
          })
        })
			},
			add_company:function(){
			  this.$router.push("/admin/gre/addCompany")
			},
			out:function(){

			},
      //切换市
      changeCity:function(){
        var _self = this
        if(_self.cityId==''){
          _self.area_list = []
          _self.search_info.area_id = ''
          return false
        }
        _self.city_list.forEach(value => {
          if(_self.cityId==value.bcode){
            _self.area_list = value.children
            _self.search_info.area_id = _self.area_list[0].code
          }
        })
      }
		}
	}
</script>

<style>

</style>
