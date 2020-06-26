<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
            
						<el-form-item label="车牌号:" prop="plate_number">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="info.plate_number"
                :fetch-suggestions="searchDriver"
                placeholder="请输入车牌号"
                @select="handleSelectDriver"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.license_plate_number }}</div>
                  <span class="label">{{ item.name }}( {{ item.mobile}} )</span>
                </template>
              </el-autocomplete>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="运输人:" prop="driver">
							<el-input v-model.trim="info.driver"></el-input>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:" prop="phone">
          		<el-input v-model.trim="info.phone"></el-input>
          	</el-form-item>
          </el-col>
				</el-row>
        <hr>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="油脂类型:">
              <el-select v-model="info.recycle_type">
              	<el-option label="红油" value="2"></el-option>
              	<el-option label="地沟油" value="3"></el-option>
              </el-select>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="出入库时间:" prop="create_time">
        			<el-date-picker v-model="info.create_time" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="交易方式:">
          		<el-radio v-model="info.type" label="1">送货</el-radio>
          		<el-radio v-model="info.type" label="2">自提</el-radio>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="毛重(kg):" prop="rough_weight">
              <el-input v-model.trim="info.rough_weight"></el-input>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="皮重(kg):" prop="tare_weight">
        			<el-input v-model.trim="info.tare_weight"></el-input>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="净重(kg):">
          		<el-tag type="info">{{info.rough_weight-info.tare_weight}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="出库含油率(%):" prop="out_oil_content">
              <el-input v-model.trim="info.out_oil_content"></el-input>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="到货含油率(%):">
        			<el-input v-model.trim="info.delivery_oil_content"></el-input>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="结算含油率(%):">
          		<el-input v-model.trim="info.settle_oil_content"></el-input>
          	</el-form-item>
          </el-col>
        </el-row>
        <hr>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="公司名称:">
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="info.company_name"
                :fetch-suggestions="searchCompany"
                placeholder="请输入公司名称"
                @select="handleSelectCompany"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.name }}</div>
                  <span class="label">{{ item.contacts }}( {{ item.mobile}} )</span>
                </template>
              </el-autocomplete>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="联系人:">
        			<el-input v-model.trim="info.contacts"></el-input>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:">
          		<el-input v-model.trim="info.mobile"></el-input>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
        	<el-col :span="24">
        		<el-form-item label="公司地址:">
              <el-input v-model.trim="info.address"></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>
        <el-row>
        	<el-col :span="24">
        		<el-form-item label="备注:">
              <el-input v-model.trim="info.update_reason"></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>
				<el-form-item>
          <el-button type="primary" icon="el-icon-finished" @click="handleAdd">保存</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_post } from '@/api/main'
	import { checkNull,checkPhone,checkFlexd } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
          "plate_number":"",
          "driver":"",
          "phone":"",
          "recycle_type":'2', //回收类别：\n 1：餐厨垃圾\n 2：红油\n 3：地沟油\n 4：固渣\n
          "create_time":"",
          "rough_weight":"",
          "tare_weight":"",
          "update_reason":"",
          "type":'1', //交易方式 1:送货 2:自提
          "out_oil_content":'', //出库含油率
          "delivery_oil_content":'', //到货含油率
          "settle_oil_content":'', //结算含油率
          "company_name":"",
          "contacts":"",
          "mobile":"",
          "address":""
				},
        rules:{
        	plate_number:[
        		{ required: true,validator: checkNull, trigger: 'blur' }
        	],
          driver:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          phone:[
          	{ required: true,validator: checkPhone, trigger: 'blur' }
          ],
          create_time:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          rough_weight:[
            { required: true,validator: checkFlexd, trigger: 'blur' }
          ],
          tare_weight:[
          	{ required: true,validator: checkFlexd, trigger: 'blur' }
          ],
          out_oil_content:[
          	{ required: true,validator: checkFlexd, trigger: 'blur' }
          ]
        }
			}
		},
		methods:{
			handleAdd:function(){
				var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          if(valid){
            _self.$confirm('确认新增记录信息?', '提示').then(()=> {
              let _info = JSON.parse(JSON.stringify(_self.info))
              _info.out_oil_content/=100
              _info.delivery_oil_content/=100
              _info.settle_oil_content/=100
              axios_post('api/stock/add_out',_info).then( res => {
                if(res===null){
                  _self.$router.push("/warehousing/stock")
                }
              })
            })
          }
        })
			},
			//返回
			back:function(){
				this.$router.push("/warehousing/stock")
			},
      searchDriver:function(queryString, cb){
        let _self = this
        if(queryString){
          axios_post('api/stock/search_driver',{license_plate_number:queryString,name:'',mobile:''}).then( res => {
            cb(res)
          })
        }
      },
      handleSelectDriver:function(value){
        let _self = this
        _self.info.plate_number = value.license_plate_number
        _self.info.driver = value.name
        _self.info.phone = value.mobile
      },
      searchCompany:function(queryString, cb){
        let _self = this
        if(queryString){
          axios_post('api/stock/search_company',{name:queryString , mobile:'',contact:'',address:''}).then( res => {
            cb(res)
          })
        }
      },
      handleSelectCompany:function(value){
        let _self = this
        _self.info.company_name = value.name
        _self.info.contacts = value.contacts
        _self.info.mobile = value.mobile
        _self.info.address = value.address
      }
		}
	}
</script>

<style scoped lang="less">
  hr{
    margin-bottom:25px ;
  }
	.out_info_box{
		margin-left: 5%;
		width: 90%;
		box-shadow: 0 0 5px #ccc;
		padding: 30px 20px;
	}
  .my-autocomplete li{
      padding: 7px;
      line-height: 25px !important;
  }
  .my-autocomplete li .name{
      text-overflow: ellipsis;
      overflow: hidden;
  }
  .my-autocomplete li .label{
      font-size: 12px;
      color: #b4b4b4;
  }
</style>
