<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
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
          <el-col :span="8">
          	<el-form-item label="手机号:" prop="companyMobile">
          		<el-input v-model.trim="info.companyMobile"></el-input>
          	</el-form-item>
          </el-col>
				</el-row>
        <el-row>
        	<el-col :span="16">
        		<el-form-item label="公司地址:" prop="companyAddress">
              <el-input v-model.trim="info.companyAddress"></el-input>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="卫生许可证号:" prop="hygienicLicense">
        			<el-input v-model.trim="info.hygienicLicense"></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>
        <hr>
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
          <el-col :span="3">
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
          <el-col :span="6" v-if="info.isPrepaid=='1'">
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
          	<el-form-item label="单价(元/kg):" prop="price">
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
        <hr />
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
        <hr />
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
          "gutterOilMobile": ""
				},
				rules:{
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
          hygienicLicense:[
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
				  ]
				}
			}
		},
		methods:{
			//修改状态
			handleAdd:function(){
				var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          if(valid){
            _self.$confirm('确认新增提交信息？').then(() => {
              var req = JSON.parse(JSON.stringify(_self.info))
              req.prepaidMoeny = req.prepaidMoeny*100
              req.price = req.price*100
              axios_post('/api/fi/rubbish_contract',req).then(res => {
                if(res){
                  _self.$router.push("/finance/rub/contractList")
                }
              })
            })
          }else{

          }
        })
			},
      back:function(){
				var _self = this
				_self.$confirm('确认放弃新增并返回？').then(() => {
          _self.$router.push("/finance/rub/contractList")
        })
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
