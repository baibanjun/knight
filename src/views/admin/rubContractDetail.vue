<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="130px" ref="ruleForm" :rules="rules" :model="info">
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="合同编号:" prop="no">
              <el-input v-model.trim="info.no"></el-input>
        		</el-form-item>
        	</el-col>
					<el-col :span="8">
						<el-form-item label="单位名称:" prop="companyName">
				      <el-input v-model.trim="info.companyName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="联系人:" prop="companyContacts">
							<el-input v-model.trim="info.companyContacts"></el-input>
						</el-form-item>
					</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
				  	<el-form-item label="手机号:" prop="companyMobile">
				  		<el-input v-model.trim="info.companyMobile"></el-input>
				  	</el-form-item>
				  </el-col>
					<el-col :span="8">
						<el-form-item label="公司地址:" prop="companyAddress">
				      <el-input v-model.trim="info.companyAddress"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="卫生许可证号:">
							<el-input v-model.trim="info.hygienicLicense"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <hr> -->
				<el-row>
					<el-col :span="7">
						<el-form-item label="签订时间:" prop="signAContractTime">
				      <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="info.signAContractTime"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="到期时间:" prop="expirationTime">
							<el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="info.expirationTime"></el-date-picker>
						</el-form-item>
					</el-col>
				  <el-col :span="4">
				  	<el-form-item label="是否预付金额:">
				  		<el-switch
				  			v-model="info.isPrepaid"
				  			active-color="#13ce66"
				  			inactive-color="#ff4949"
				  			active-text="是"
				  			active-value="1"
				  			inactive-text="否"
				  			inactive-value="0"
				  			>
				  		</el-switch>
				  	</el-form-item>
				  </el-col>
				  <el-col :span="5" v-if="info.isPrepaid=='1'">
				  	<el-form-item prop="prepaidMoeny">
				  		<el-input v-model.trim="info.prepaidMoeny" placeholder="请输入预付金额"></el-input>
				  	</el-form-item>
				  </el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="日预估量(kg):" prop="dayEstimate">
				      <el-input v-model.trim="info.dayEstimate"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="结算模式:" prop="clearingForm">
							<el-select v-model="info.clearingForm">
								<el-option label="按单位重量" value="1"></el-option>
							  <el-option label="包月付费" value="2"></el-option>
							  <el-option label="包年付费" value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				  <el-col :span="8">
				  	<el-form-item label="单价:" prop="price">
				  		<el-input v-model.trim="info.price"></el-input>
				  	</el-form-item>
				  </el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
						<el-form-item label="开票:">
				      <el-switch
				        v-model="info.isInvoice"
				        active-color="#13ce66"
				        inactive-color="#ff4949"
				        active-text="是"
				        active-value="1"
				        inactive-text="否"
				        inactive-value="0"
				        >
				      </el-switch>
						</el-form-item>
					</el-col>
				  <el-col :span="8" v-if="info.isInvoice=='1'">
				  	<el-form-item label="发票抬头:" prop="invoiceName">
				      <el-input v-model.trim="info.invoiceName"></el-input>
				  	</el-form-item>
				  </el-col>
				  <el-col :span="8" v-if="info.isInvoice=='1'">
				  	<el-form-item label="发票账号:" prop="invoiceAccount">
				  		<el-input v-model.trim="info.invoiceAccount"></el-input>
				  	</el-form-item>
				  </el-col>
				</el-row>
				<!-- <hr /> -->
				<el-row>
					<el-col :span="8">
						<el-form-item label="签订人员:" prop="signAContractUser">
				      <el-input v-model.trim="info.signAContractUser"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="手机号:" prop="signAContractMobile">
							<el-input v-model.trim="info.signAContractMobile"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
				  <el-col :span="8">
				  	<el-form-item label="运输人员:" prop="transportationUser">
				      <el-input v-model.trim="info.transportationUser"></el-input>
				  	</el-form-item>
				  </el-col>
					<el-col :span="8">
						<el-form-item label="手机号:" prop="transportationMobile">
							<el-input v-model.trim="info.transportationMobile"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <hr /> -->
				<el-row>
					<el-col :span="8">
						<el-form-item label="地沟油收运:">
				      <el-switch
				        v-model="info.isGutterOil"
				        active-color="#13ce66"
				        inactive-color="#ff4949"
				        active-text="是"
				        active-value="1"
				        inactive-text="否"
				        inactive-value="0"
				        >
				      </el-switch>
						</el-form-item>
					</el-col>
				  <el-col :span="8" v-if="info.isGutterOil=='1'">
				  	<el-form-item label="收运人员:" prop="gutterOilUser">
				      <el-input v-model.trim="info.gutterOilUser"></el-input>
				  	</el-form-item>
				  </el-col>
				  <el-col :span="8" v-if="info.isGutterOil=='1'">
				  	<el-form-item label="手机号:" prop="gutterOilMobile">
				  		<el-input v-model.trim="info.gutterOilMobile"></el-input>
				  	</el-form-item>
				  </el-col>
				</el-row>

        <el-form-item label="修改备注:" prop="remark">
        	<el-input type="textarea" v-model="info.remark"></el-input>
        </el-form-item>

        <el-form-item>
          <el-row>
            <el-col :span="6">
              <el-button type="primary" icon="el-icon-finished" @click="handleEdit">保存</el-button>
              <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="success" icon="el-icon-tickets" @click="handleDown()">导出数据</el-button>
            </el-col>
          </el-row>
				</el-form-item>
      </el-form>

		</div>
	</div>
</template>

<script>
	import { axios_get,axios_put  } from '@/api/main'
	import { checkNull,checkPhone,checkFlexd } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
					"id": 3,
          "no":'',
          "companyName": "",
          "companyContacts": "",
          "companyMobile": "",
          "companyAddress": "",
          "hygienicLicense": "",
          "signAContractTime": "",
          "expirationTime": "",
          "isPrepaid": '1',
          "prepaidMoeny":'',
          "dayEstimate":'',
          "clearingForm": "1",
          "price": '',
          "isInvoice": '1',
          "invoiceAccount":'',//发票账号
          "invoiceName":'', //发票抬头
          "signAContractUser": "",
          "signAContractMobile": "",
          "transportationUser": "",
          "transportationMobile": "",
          "isGutterOil": '1',
          "gutterOilUser": "",
          "gutterOilMobile": "",
          "remark": ""
				},
				rules:{
          no:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
					companyName:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
				  companyContacts:[
				  	{ required: true,validator: checkNull, trigger: 'blur' }
				  ],
				  companyMobile:[
				  	{ required: true,validator: checkPhone, trigger: 'blur' }
				  ],
				  companyAddress:[
				  	{ required: true,validator: checkNull, trigger: 'blur' }
				  ],
				  signAContractTime:[
				  	{ required: true,validator: checkNull, trigger: 'blur' }
				  ],
				  expirationTime:[
				  	{ required: true,validator: checkNull, trigger: 'blur' }
				  ],
				  prepaidMoeny:[
				  	{ required: true,validator: checkFlexd, trigger: 'blur' }
				  ],
				  dayEstimate:[
				  	{ required: true,validator: checkFlexd, trigger: 'blur' }
				  ],
				  price:[
				  	{ required: true,validator: checkFlexd, trigger: 'blur' }
				  ],
				  invoiceAccount:[
				  	{ required: true,validator: checkNull, trigger: 'blur' }
				  ],
				  invoiceName:[
				  	{ required: true,validator: checkNull, trigger: 'blur' }
				  ],
				  signAContractUser:[
				  	{ required: true,validator: checkNull, trigger: 'blur' }
				  ],
				  signAContractMobile:[
				  	{ required: true,validator: checkPhone, trigger: 'blur' }
				  ],
				  transportationUser:[
				  	{ required: true,validator: checkNull, trigger: 'blur' }
				  ],
				  transportationMobile:[
				  	{ required: true,validator: checkPhone, trigger: 'blur' }
				  ],
				  gutterOilUser:[
				    { required: true,validator: checkNull, trigger: 'blur' }
				  ],
				  gutterOilMobile:[
				  	{ required: true,validator: checkPhone, trigger: 'blur' }
				  ],
          remark:[
				    { required: true,validator: checkNull, trigger: 'blur' }
				  ]
				}
			}
		},
		computed:{
			rub_contract_id(){
				return this.$store.state.admin.rub_contract_id
			}
		},
    mounted() {
      var _self = this
      axios_get('api/admin/rubbish_contract/'+_self.rub_contract_id).then(res => {
        if(res){
          _self.info = res
          _self.info.clearingForm+=''
          _self.info.isPrepaid+=''
          _self.info.isInvoice+=''
          _self.info.isGutterOil+='' //字符串化
          _self.info.prepaidMoeny = _self.info.prepaidMoeny/100 //分转元
          _self.info.price = _self.info.price/100
        }
      })
    },
		methods:{
			handleEdit:function(){
				var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          if(valid){
            _self.$confirm('确认修改合同信息？').then(()=> {
              var req = JSON.parse(JSON.stringify(_self.info))
              req.prepaidMoeny*=100//元转分
              req.price*=100
              axios_put('api/admin/rubbish_contract/'+_self.rub_contract_id,req).then(res => {
                if(res){
                  _self.$router.push("/admin/rub/contractList")
                }
              })
            })
          }
        })
			},
			back:function(){
				var _self = this
				_self.$confirm('确认放弃修改并返回？').then(() => {
          _self.$router.push("/admin/rub/contractList")
        })
			},
      handleDown:function(){
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['合同编号', '单位名称','联系人','手机号','公司地址','卫生许可证号','签订时间','到期时间','是否预付金额','预付金额',
          '日预估量','结算模式','单价','是否开票','发票抬头','发票账号','签订人员','手机号','运输人员','手机号',
          '是否地沟油收运','收运人员','手机号','备注'] // 对应表格输出的title
          const filterVal = ["no","companyName","companyContacts","companyMobile","companyAddress","hygienicLicense","signAContractTime","expirationTime",
          "isPrepaid","prepaidMoeny","dayEstimate","clearingForm","price","isInvoice","invoiceAccount","invoiceName","signAContractUser",
          "signAContractMobile","transportationUser","transportationMobile","isGutterOil","gutterOilUser","gutterOilMobile","remark"] // 对应表格输出的数据
          var _info = JSON.parse(JSON.stringify(this.info))
          _info.isPrepaid = _info.isPrepaid==1?'是':'否'
          _info.isInvoice = _info.isInvoice==1?'是':'否'
          _info.isGutterOil = _info.isGutterOil==1?'是':'否'
          _info.clearingForm = _info.clearingForm==1?'按单位重量':_info.clearingForm==2?'按月付费':'按年付费'
          var arr = []
          arr.push(_info)
          const data = this.formatJson(filterVal, arr)
          export_json_to_excel(tHeader, data, '合同详情') // 对应下载文件的名字打印下_info
        })
      },
      formatJson:function(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
		}
	}
</script>

<style scoped>
	.out_info_box{
		margin-left: 2%;
		width: 96%;
		box-shadow: 0 0 5px #ccc;
		padding: 30px 20px;
	}
</style>
