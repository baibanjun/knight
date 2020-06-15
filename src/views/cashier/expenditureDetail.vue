<template>
	<div>
		<div class="out_info_box">
      <el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
        <table class="info_table" cellspacing="0">
          <tr>
            <td width="20%" class="tac">基本信息</td>
            <td>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="名称:" prop="name">
                    <el-input v-model.trim="info.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="交易对象:" prop="trader">
                    <el-input v-model.trim="info.trader"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="账目分类:" prop="categoryId">
                    <el-select v-if="info.categoryId!=4" v-model="info.categoryId">
                     <el-option v-for="n in categoryList" :label="n.name" :value="n.id"></el-option>
                    </el-select>
                    <el-tag type="info" v-if="info.categoryId==4">废物处置费</el-tag>
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
                  <el-form-item label="金额(元):" prop="amount">
                    <el-input v-model.trim="info.amount"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="入账日期(kg):" prop="payDate">
                    <el-date-picker v-model="info.payDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                </el-col>
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
          id:'',
          name:'',
          trader:'',
          categoryId:'',
          amount:'',
          payDate:'',
          payType:'1',
          remark:'',
          type:'2',
          changeRemark:'',
          status:''
        },
        categoryList:[],
        rules:{
        	name:[
        		{ required: true,validator: checkNull, trigger: 'blur' }
        	],
          trader:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          payDate:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          categoryId:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          remark:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          changeRemark:[
          	{ required: true,validator: checkNull, trigger: 'blur' }
          ],
          amount:[
          	{ required: true,validator: checkFlexd, trigger: 'blur' }
          ]
        }
			}
		},
		computed:{
			expenditure_id(){
				return this.$store.state.cashier.expenditure_id
			}
		},
    mounted() {
      var _self = this
      //账目分类
      axios_post('/api/ac/list',{offset:1,limit:100,type:'2',status:'1',flag:'1',}).then(res => {
      	if(res){
          _self.categoryList = res.records
      	}
      })
      //该账目详情
      axios_post('/api/ca/inout/detail/'+_self.expenditure_id).then(res => {
        if(res){
          _self.info.id = res.id
          _self.info.name = res.name
          _self.info.trader = res.trader
          _self.info.categoryId = res.categoryId
          _self.info.amount = res.totalAmount/100
          _self.info.payDate = time_format({time:_self.info.payDate,format:"YY-MM-DD"})
          _self.info.payType = res.payType?(res.payType + ''):'4'
          _self.info.remark = res.remark
          _self.info.changeRemark = res.changeRemark
          _self.info.status = res.status
        }
      })
    },
		methods:{
      handleEdit:function(_type){
      	var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          var req = JSON.parse(JSON.stringify(_self.info)) //深拷贝
              req.amount*=100
              req.payDate = time_format({time:req.payDate,format:"timestamp"})
        	if(valid){
            if(_type == 1){
              _self.$confirm('确认保存修改信息?', '提示').then(()=> {
                axios_post('/api/ca/inout/save',req).then( res => {
                  if(res===null){
                    _self.$router.push("/cashier/expenditure")
                  }
                })
              })
            }
            else{
              _self.$confirm('确认账单已清账?', '提示').then(()=> {
                axios_post('/api/ca/inout/clear',req).then( res => {
                  if(res===null){
                    _self.$router.push("/cashier/expenditure")
                  }
                })
              })
            }
        	}
        })

      },
			back:function(_index){
				var _self = this
				_self.$confirm('确认放弃修改并返回？').then(() => {
          this.$router.push('/cashier/expenditure')
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
