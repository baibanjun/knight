<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
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
					<el-col :span="16">
						<el-form-item label="公司地址:" prop="companyAddress">
				      <el-input v-model.trim="info.companyAddress"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<hr>
				<el-row>
				  <el-col :span="8">
				  	<el-form-item label="合同类别:">
				  		<el-select v-model="info.type" @change="info.clearingForm = ''">
				        <el-option label="购入-红油" value="1"></el-option>
				        <el-option label="购入-地沟油" value="2"></el-option>
				        <el-option label="售卖-红油" value="3"></el-option>
				        <el-option label="售卖-地沟油" value="4"></el-option>
				        <el-option label="临时合同" value="5"></el-option>
				      </el-select>
				  	</el-form-item>
				  </el-col>
					<el-col :span="8">
						<el-form-item label="签订时间:" prop="signAContractTime">
				      <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model.trim="info.signAContractTime"></el-date-picker>
						</el-form-item>
					</el-col>
				  <el-col :span="8">
				  	<el-form-item label="签订单价(元/kg):" prop="price">
				  		<el-input v-model.trim="info.price"></el-input>
				  	</el-form-item>
				  </el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="结算模式:" prop="clearingForm">
							<el-select v-model="info.clearingForm">
							  <el-option label="现结" value="1" v-if="info.type!='2'"></el-option>
							  <el-option label="月结" value="2" v-if="info.type=='1'"></el-option>
                <el-option label="半年付" value="3" v-if="info.type=='2'"></el-option>
                <el-option label="年付" value="4" v-if="info.type=='2'"></el-option>
                <el-option label="货到付款" value="5" v-if="info.type!='1'&&info.type!='2'"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
          <el-col :span="8" v-if="info.type=='3'||info.type=='4'">
          	<el-form-item label="交易净重(kg):" prop="netWeight">
          		<el-input v-model.trim="info.netWeight"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="8" v-if="info.type=='3'||info.type=='4'">
          	<el-form-item label="交易总价(元):" prop="totalPrices">
          		<el-input v-model.trim="info.totalPrices"></el-input>
          	</el-form-item>
          </el-col>
          <el-col :span="8" v-if="info.type=='2'">
          	<el-form-item label="签订方式:">
          		<el-select v-model="info.contractWay">
          		  <el-option label="免费" value="1"></el-option>
          		  <el-option label="对方付费" value="2"></el-option>
                <el-option label="己方付费" value="3"></el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
						<el-form-item label="开票:" prop="account">
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
				  	<el-form-item label="发票抬头:" prop="invoiceName" >
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
	import { checkNull,checkPhone,checkFlexd,checkSelect } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
          "no":'',
          "companyName": "",
          "companyContacts": "",
          "companyMobile": "",
          "companyAddress": "",
          "type":'1',
          "signAContractTime": "",
          "price": '',
          "clearingForm": "",
          "netWeight":'',
          "totalPrices":'',
          "contractWay":'1',//签约方式
          "isInvoice": '1',
          "invoiceAccount":'',//发票账号
          "invoiceName":'', //发票抬头
          "signAContractUser": "",
          "signAContractMobile": "",
          "transportationUser": "",
          "transportationMobile": ""
				},
				rules:{
          no:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
					companyName:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
          companyContacts:[
          	{ required: true,validator: checkNull , trigger: 'blur' }
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
          price:[
          	{ required: true,validator: checkFlexd, trigger: 'blur' }
          ],
          clearingForm:[
          	{ required: true,validator: checkSelect, trigger: 'blur' }
          ],
          netWeight:[
          	{ required: true,validator: checkFlexd, trigger: 'blur' }
          ],
          totalPrices:[
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
              req.price *= 100
              if(req.type == 3||req.type == 4){
                req.totalPrices *= 100
                delete req.contractWay
              }
              else{
                delete req.totalPrices
                delete req.netWeight
              }

              if(req.type == 1||req.type == 5) delete req.contractWay
              axios_post('api/admin/grease_contract',req).then(res => {
                if(res){
                  _self.$router.push("/admin/gre/contractList")
                }
              })
            })
        	}
        })

			},
      back:function(){
				var _self = this
				_self.$confirm('确认放弃新增并返回？').then(() => {
          _self.$router.push("/admin/gre/contractList")
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
	.el-table>>>.cell {
		text-align: center;
	}
	.el-table>>> th{
		padding: 4px 0;
	}
</style>
