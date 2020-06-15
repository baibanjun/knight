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
          	<el-form-item label="签订方式:" prop="contractWay">
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
	import { checkNull,checkPhone,checkFlexd,checkSelect } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
					"id": '',
          "no":'',
          "companyName": "",
          "companyContacts": "",
          "companyMobile": "",
          "companyAddress": "",
          "type":'1',
          "signAContractTime": "",
          "price": '',
          "netWeight":'',
          "totalPrices":'',
          "contractWay":'1',//签约方式
          "clearingForm": "1",
          "isInvoice": '1',
          "invoiceAccount":'',//发票账号
          "invoiceName":'', //发票抬头
          "signAContractUser": "",
          "signAContractMobile": "",
          "transportationUser": "",
          "transportationMobile": "",
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
				  price:[
				  	{ required: true,validator: checkFlexd, trigger: 'blur' }
				  ],
          clearingForm:[
				  	{ required: true,validator: checkSelect, trigger: 'blur' }
				  ],
          contractWay:[
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
				  ],
          remark:[
				  	{ required: true,validator: checkNull, trigger: 'blur' }
				  ]
				}
			}
		},
		computed:{
			gre_contract_id(){
				return this.$store.state.admin.gre_contract_id
			}
		},
    mounted() {
      var _self = this
      axios_get('api/admin/grease_contract/'+_self.gre_contract_id).then(res => {
        if(res){
          _self.info = res
          _self.info.type+=''
          _self.info.clearingForm+=''
          _self.info.isInvoice+=''
          _self.info.contractWay+=''
          _self.info.price = _self.info.price/100
          _self.info.totalPrices = _self.info.totalPrices?_self.info.totalPrices/100:''
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
              req.price *= 100
              if(req.type == 3||req.type == 4){
                req.totalPrices *= 100
                delete req.contractWay
              }
              else{
                req.totalPrices = 0
                req.netWeight = 0
              }

              if(req.type == 1||req.type == 5) delete req.contractWay
              axios_put('api/admin/grease_contract/'+_self.gre_contract_id,req).then(res => {
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
				_self.$confirm('确认放弃修改并返回？').then(() => {
          _self.$router.push("/admin/gre/contractList")
        })
			},
      handleDown:function(){
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['合同编号', '单位名称','联系人','手机号','公司地址','合同类别','签订时间','签订单价','结算模式','签订方式',
          '交易净重','交易总价','是否开票','发票抬头','发票账号','签订人员','手机号','运输人员','手机号', '备注'] // 对应表格输出的title
          const filterVal = ["no","companyName","companyContacts","companyMobile","companyAddress","type","signAContractTime","price",
          "clearingForm","contractWay","netWeight","totalPrices","isInvoice","invoiceAccount","invoiceName","signAContractUser",
          "signAContractMobile","transportationUser","transportationMobile","remark"] // 对应表格输出的数据
          var _info = JSON.parse(JSON.stringify(this.info))
          _info.type = _info.type==1?'购入红油':_info.type==2?'购入地沟油':_info.type==3?'售卖红油':_info.type==4?'售卖地沟油':'临时合同'
          _info.clearingForm = _info.clearingForm==1?'现结':_info.clearingForm==2?'月结':_info.clearingForm==3?'半年付':_info.clearingForm==4?'年付':'货到付款'
          _info.isInvoice = _info.isInvoice==1?'是':'否'        
          var arr = []
          arr.push(_info)
          const data = this.formatJson(filterVal, arr)
          export_json_to_excel(tHeader, data, '油脂合同详情') // 对应下载文件的名字
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
