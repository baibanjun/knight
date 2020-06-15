<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm">
				<el-row>
				  <el-col :span="8">
				  	<el-form-item label="合同编号:">
              <el-tag type="info">{{info.no}}</el-tag>
				  	</el-form-item>
				  </el-col>
					<el-col :span="8">
						<el-form-item label="单位名称:">
              <el-tag type="info">{{info.companyName}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="联系人:">
							<el-tag type="info">{{info.companyContacts}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
				  <el-col :span="8">
				  	<el-form-item label="手机号:">
				  		<el-tag type="info">{{info.companyMobile}}</el-tag>
				  	</el-form-item>
				  </el-col>
					<el-col :span="16">
						<el-form-item label="公司地址:">
				      <el-tag type="info">{{info.companyAddress}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>
				<hr>
				<el-row>
				  <el-col :span="8">
				  	<el-form-item label="合同类别:">
              <el-tag type="info">{{info.type==1?'购入-红油':info.type==2?'购入-地沟油':info.type==3?'售卖-红油':info.type==4?'售卖-地沟油':'临时合同'}}</el-tag>
				  	</el-form-item>
				  </el-col>
					<el-col :span="8">
						<el-form-item label="签订时间:">
				      <el-tag type="info">{{info.signAContractTime}}</el-tag>
						</el-form-item>
					</el-col>
				  <el-col :span="8">
				  	<el-form-item label="签订单价(元/kg):">
				  		<el-tag type="info">{{info.price}}</el-tag>
				  	</el-form-item>
				  </el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="结算模式:">
              <el-tag type="info">{{info.clearingForm==1?'现结':info.clearingForm==2?'月结':info.clearingForm==3?'半年付':info.clearingForm==4?'年付':'货到付款'}}</el-tag>
						</el-form-item>
					</el-col>
				  <el-col :span="8" v-if="info.type=='3'||info.type=='4'">
				  	<el-form-item label="交易净重(kg):">
				  		<el-tag type="info">{{info.netWeight}}</el-tag>
				  	</el-form-item>
				  </el-col>
				  <el-col :span="8" v-if="info.type=='3'||info.type=='4'">
				  	<el-form-item label="交易总价(元):">
				  		<el-tag type="info">{{info.totalPrices}}</el-tag>
				  	</el-form-item>
				  </el-col>
				  <el-col :span="8" v-if="info.type=='2'">
				  	<el-form-item label="签订方式:">
              <el-tag type="info">{{info.contractWay==1?'免费':info.contractWay==2?'对方付费':'己方付费'}}</el-tag>
				  	</el-form-item>
				  </el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="开票:" prop="account">
				      <el-switch
                disabled
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
				  	<el-form-item label="发票抬头:">
				      <el-tag type="info">{{info.invoiceName}}</el-tag>
				  	</el-form-item>
				  </el-col>
				  <el-col :span="8" v-if="info.isInvoice=='1'">
				  	<el-form-item label="发票账号:">
				  		<el-tag type="info">{{info.invoiceAccount}}</el-tag>
				  	</el-form-item>
				  </el-col>
				</el-row>
				<hr />
				<el-row>
					<el-col :span="8">
						<el-form-item label="签订人员:">
				      <el-tag type="info">{{info.signAContractUser}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="手机号:">
							<el-tag type="info">{{info.signAContractMobile}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
				  <el-col :span="8">
				  	<el-form-item label="运输人员:">
				      <el-tag type="info">{{info.transportationUser}}</el-tag>
				  	</el-form-item>
				  </el-col>
					<el-col :span="8">
						<el-form-item label="手机号:">
							<el-tag type="info">{{info.transportationMobile}}</el-tag>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_put  } from '@/api/main'
	export default{
		data(){
			return{
				info:{
					"id": '',
          "companyName": "",
          "companyContacts": "",
          "companyMobile": "",
          "companyAddress": "",
          "type":'1',
          "signAContractTime": "",
          "price": '',
          "clearingForm": "1",
          "isInvoice": '1',
          "invoiceAccount":'',//发票账号
          "invoiceName":'', //发票抬头
          "signAContractUser": "",
          "signAContractMobile": "",
          "transportationUser": "",
          "transportationMobile": "",
          "remark": ""
				}
			}
		},
		computed:{
			gre_contract_id(){
				return this.$store.state.finance.gre_contract_id
			}
		},
    mounted() {
      var _self = this
      axios_get('/api/fi/grease_contract/'+_self.gre_contract_id).then(res => {
        if(res){
          _self.info = res
          _self.info.type+=''
          _self.info.clearingForm+=''
          _self.info.isInvoice+=''
          _self.info.price = _self.info.price/100
          _self.info.totalPrices = _self.info.totalPrices?_self.info.totalPrices/100:0
        }
      })
    },
		methods:{
			back:function(){
				var _self = this
        _self.$router.push("/finance/gre/contractList")
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
