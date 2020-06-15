<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
						<el-form-item label="单位名称:" prop="name">
              <el-input v-model.trim="info.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="联系人:" prop="contacts">
							<el-input v-model.trim="info.contacts"></el-input>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:" prop="mobile">
          		<el-input v-model.trim="info.mobile"></el-input>
          	</el-form-item>
          </el-col>
				</el-row>
        <hr>
        <el-row>
        	<el-col :span="24">
        		<el-form-item label="地区:">
              <el-select v-model="other_info.cityId" @change="changeCity">
              	<el-option v-for="n in city_list" :label="n.bname" :value="n.bcode"></el-option>
              </el-select> &nbsp;
              <el-select v-model="info.areaId">
              	<el-option v-for="n in area_list" :label="n.name" :value="n.code"></el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
        </el-row>
        <el-row>
        	<el-col :span="16">
        		<el-form-item label="详细地址:" prop="address">
              <el-input v-model.trim="info.address"></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>
				<el-form-item>
          <el-button type="primary" icon="el-icon-finished" @click="handleAdd">确认新增</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_post  } from '@/api/main'
	import { checkNull,checkPhone } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
					name:'',
					contacts:'',
					mobile:'',
					areaId:'',
					address:''
				},
        other_info:{
          cityId:510100000//市级编码
        },
        city_list:[],//市列表
        area_list:[], //区域列表
				rules:{
					name:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
          contacts:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          address:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          mobile:[
          	{ required: true,validator: checkPhone, trigger: 'blur' }
          ]
				}
			}
		},
    mounted() {
      var _self = this
      //获取四川城市列表
      axios_get('api/admin/tip_login/area').then(res => {
        if(res){
          res.forEach(value => {
            if(value.acode==510000000){ //抓取四川
              _self.city_list = value.children
            }
          })
          _self.changeCity() //初始化成都
        }
      })
    },
		methods:{
			handleAdd:function(){
				var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
        	if(valid){
            _self.$confirm('确认提交新增信息？').then(()=> {
              axios_post('api/admin/grease_company',_self.info).then( res => {
                if(res){
                  _self.$router.push("/admin/gre/companyList")
                }
              })
            })
        	}else{
        
        	}
        })
        
			},
			//返回
			back:function(){
				var _self = this
				_self.$confirm('确认放弃新增并返回？').then(() => {
          _self.$router.push("/admin/gre/companyList")
        })
			},
      //切换市
      changeCity:function(){
        var _self = this
        _self.city_list.forEach(value => {
          if(_self.other_info.cityId==value.bcode){
            _self.area_list = value.children
            _self.info.areaId = _self.area_list[0].code
          }
        })
      }

		}
	}
</script>

<style scoped>
	.out_info_box{
		margin-left: 5%;
		width: 90%;
		box-shadow: 0 0 5px #ccc;
		padding: 30px 20px;
	}
  .el-table>>>.cell {
    text-align: center;
  }
  .el-table>>> th{
    padding: 4px 0;
  }
</style>
