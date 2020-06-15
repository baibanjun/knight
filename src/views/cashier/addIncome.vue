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
                    <el-select v-model="info.categoryId">
                     <el-option v-for="n in categoryList" :label="n.name" :value="n.id"></el-option>
                    </el-select>
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
                  <el-form-item label="备注信息:" prop="remark">
                    <el-input v-model.trim="info.remark"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </td>
          </tr>
        </table>
      </el-form>

			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-button type="primary" icon="el-icon-finished" @click="handleAdd">确认新增</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_post } from '@/api/main'
	import { checkNull,checkFlexd } from '@/lib/tools'
	export default{
		data(){
			return{
        info:{
          name:'',
          trader:'',
          categoryId:'',
          amount:'',
          payDate:'',
          payType:'1',
          remark:'',
          type:'1'
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
          amount:[
          	{ required: true,validator: checkFlexd, trigger: 'blur' }
          ]
				}
			}
		},
    mounted() {
      var _self = this
      axios_post('/api/ac/list',{offset:1,limit:100,type:'1',status:'1',flag:'1',}).then(res => {
      	if(res){
          _self.categoryList = res.records
          if(res.records.length>0) _self.info.categoryId = res.records[0].id
      	}
      })
    },
		methods:{
      handleAdd:function(){
      	var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          var req = JSON.parse(JSON.stringify(_self.info)) //深拷贝
              req.amount*=100
              req.payDate = new Date(req.payDate).getTime()
        	if(valid){
            _self.$confirm('确认新增该账目?', '提示').then(()=> {
              axios_post('/api/ca/inout/add',req).then( res => {
                if(res===null){
                  _self.$router.push("/cashier/income")
                }
              })
            })
        	}else{

        	}
        })

      },
			back:function(_index){
				var _self = this
				_self.$confirm('确认放弃新增并返回？').then(() => {
          this.$router.push('/cashier/income')
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
