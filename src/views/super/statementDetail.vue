<template>
	<div>
		<div class="out_info_box">
      <el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
        <table class="info_table" cellspacing="0">
          <tr>
            <td width="20%" class="tac">个人信息</td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="送货人:">
                    <el-tag type="info">{{info.driverName||'--'}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="手机号:">
                    <el-tag type="info">{{info.phone||'--'}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="车牌号:">
                    <el-tag type="info">{{info.carNumber}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="银行账号:" prop="bankCard">
                    <el-tag type="info" v-if="info.categoryId==1">{{info.bankCard}}</el-tag>
                    <el-input v-model.trim="info.bankCard" v-if="info.categoryId!=1"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>

          <tr>
            <td class="tac">账单信息</td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="账单类别:">
                    <el-tag type="info">{{info.categoryId==1?'餐厨垃圾':info.categoryId==2?'红油':'地沟油'}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="累计结欠(元):">
                    <el-tag type="warning">{{info.totalAmount/100}}</el-tag> &nbsp;
                    <el-button type="danger" circle size="mini" disabled v-if="info.inOutType==2">出</el-button>
                    <el-button type="success" circle size="mini" disabled v-if="info.inOutType==1">入</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="还款日期:" prop="payDate">
                    <el-date-picker v-model="info.payDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="info.categoryId==1">
                <el-col :span="8">
                  <el-form-item label="预付总额(元):">
                    <el-tag type="info">{{info.prepayAmount/100}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="月发生额(元):">
                    <el-tag type="info">{{info.occurAmount/100}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-for="(n,index) in info.deductions">
                <el-col :span="8">
                  <el-form-item label="抵扣款项:">
                    <el-tag type="info">{{n.categoryName}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="抵扣金额(元):" prop="amount">
                    <el-tag type="info">{{n.amount}}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="转款方式:">
                    <el-select v-model="info.payType">
                      <el-option label="现金" value="1"></el-option>
                      <el-option label="支付宝转账" value="2"></el-option>
                      <el-option label="微信转账" value="3"></el-option>
                      <el-option label="银行转账" value="4"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注信息:">
                    <el-input v-model.trim="info.remark"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>
        </table>

        <el-form-item label="修改备注:">
        	<el-input type="textarea" v-model.trim="info.changeRemark"></el-input>
        </el-form-item>
      </el-form>

			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-row>
            <el-col :span="4">
              <el-button type="warning" icon="el-icon-document-checked" @click="handleEdit(2)" v-if="info.status==2">确认清账</el-button>
              <el-button type="info" v-if="info.status==3" disabled>已清账</el-button>
            </el-col>
            <el-col :span="16">
              <el-button type="primary" icon="el-icon-finished" @click="handleEdit(1)" v-if="info.status==2">保存修改</el-button>
              <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
            </el-col>
          </el-row>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_post } from '@/api/main'
	import { checkNull,checkFlexd,time_format } from '@/lib/tools'
	export default{
		data(){
			return{
        info:{
          driverName:'',
          phone:'',
          categoryId:'',
          pureWeight:'',
          totalAmount:'',
          prepayAmount:'',
          occurAmount:'',
          payDate:'',
          remark:'',
          bankCard:'',
          changeRemark:'',
          payType:'1',
          deductions:[
            {categoryId:'',amount:0}
          ]
        },
        categoryList:[],
        list:[{name:123}],
				rules:{
					remark:[
						{ required: true,validator: checkNull, trigger: 'blur' }
					],
          payDate:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          bankCard:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          changeRemark:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ]
				}
			}
		},
		computed:{
			statement_id(){
				return this.$store.state.superUser.statement_id
			}
		},
    created() {
      var _self = this
      axios_post('/api/ac/list',{offset:1,limit:100,type:'3',status:'1',flag:'0',}).then(res => {
      	if(res){
          _self.categoryList = res.records
      	}
      })
    },
    mounted() {
      var _self = this
      axios_post('/api/sa/payment/detail/'+_self.statement_id).then(res => {
        if(res){
          _self.info = res
          _self.info.payType = _self.info.payType||'1'
          _self.info.payType += ''
          _self.info.payDate = time_format({time:_self.info.payDate,format:"YY-MM-DD"})
        }
      })
    },
		methods:{
      handleEdit:function(_type){
      	var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
        	if(valid){
            var req = {
              id:_self.info.id,
              bankCard:_self.info.bankCard,
              remark:_self.info.remark,
              payDate:_self.info.payDate,
              payType:_self.info.payType,
              changeRemark:_self.info.changeRemark
            }
            req.payDate = time_format({time:req.payDate,format:"timestamp"})
            if(_type == 1){
              _self.$confirm('确认保存修改信息?', '提示').then(()=> {
                axios_post('/api/sa/payment/save',req).then( res => {
                  if(res===null){
                    _self.$router.push("/super/statement")
                  }
                })
              })
            }
            else{
              _self.$confirm('确认已清账?', '提示').then(()=> {
                axios_post('/api/sa/payment/clear',req).then( res => {
                  if(res===null){
                    _self.$router.push("/super/statement")
                  }
                })
              })
            }
        	}else{

        	}
        })
      },
			back:function(){
        this.$router.push('/super/statement')
			}
		}
	}
</script>

<style scoped>
	.out_info_box{
		margin-left: 2%;
		width: 96%;
		box-shadow: 0 0 5px #ccc;
		padding: 20px 20px;
	}
  .info_table{
    width: 100%;
    margin: 10px 0;
  }
  .info_table td{
    border: 1px solid #ccc;
    padding: 20px 10px;
  }
  .tac{
    text-align: center;
  }
</style>
