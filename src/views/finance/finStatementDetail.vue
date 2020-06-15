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
                <el-col :span="8">
                  <el-form-item label="车牌号:">
                    <el-tag type="info">{{info.carNumber}}</el-tag>
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
                  <el-form-item label="当月重量(kg):">
                    <el-tag type="info">{{info.pureWeight}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="累计结欠(元):">
                    <el-tag type="warning">{{info.totalAmount/100}}</el-tag> &nbsp;                   
                    <el-button type="danger" circle size="mini" disabled v-if="info.inOutType==2">出</el-button>
                    <el-button type="success" circle size="mini" disabled v-if="info.inOutType==1">入</el-button>
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
              <el-row>
                <el-form-item label="抵扣款项:">
                  <el-button type="success" icon="el-icon-plus" @click="add_project">添加</el-button>
                </el-form-item>
              </el-row>
              <el-row v-for="(n,index) in info.deductions">
                <el-col :span="8">
                  <el-form-item>
                    <el-select v-model="n.categoryId">
                      <el-option v-for="m in categoryList" :label="m.name" :value="m.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="抵扣金额(元):" prop="amount">
                    <el-input v-model.trim="n.amount"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-button type="danger" icon="el-icon-delete" circle @click="del_project(index)"></el-button>
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

          <tr v-if="info.categoryId!=1">
            <td width="20%" class="tac">运输信息</td>
            <td>
              <el-table :data="info.stockRecords" border>
                <el-table-column label="入库时间"><template slot-scope="scope">{{time_format(scope.row.createdAt)}}</template> </el-table-column>
                <el-table-column prop="pureWeight" label="净重(kg)"> </el-table-column>
                <el-table-column prop="oilPercent" label="含油率(%)"></el-table-column>
                <el-table-column prop="name" label="去杂净重(kg)">
                  <template slot-scope="scope">{{(scope.row.pureWeight*scope.row.oilPercent/100).toFixed(2)}}</template>
                </el-table-column>
                <el-table-column prop="otherWeight" label="除粗渣量(kg)"> </el-table-column>
                <el-table-column label="单价(元)">
                  <template slot-scope="scope">{{scope.row.price/100}}</template>
                </el-table-column>
                <el-table-column label="发生额(元)">
                  <template slot-scope="scope">{{(scope.row.pureWeight*scope.row.oilPercent*scope.row.price/10000).toFixed(2)}}</template>
                </el-table-column>
              </el-table>
            </td>
          </tr>
        </table>

        <el-form-item label="修改备注:" prop="changeRemark">
        	<el-input type="textarea" v-model.trim="info.changeRemark"></el-input>
        </el-form-item>
      </el-form>

			<el-form class="demo-form-inline" label-width="140px" >
				<el-form-item>
          <el-row>
            <el-col :span="4">
              <el-button type="warning" icon="el-icon-document-checked" @click="handleEdit(2)" v-if="info.status==1">确认核算</el-button>
              <el-button type="info" v-if="info.status!=1" disabled>已核算</el-button>
            </el-col>
            <el-col :span="16">
              <el-button type="primary" icon="el-icon-finished" @click="handleEdit(1)" v-if="info.status==1">保存修改</el-button>
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
          remark:'',
          changeRemark:'',
          deductions:[
            {categoryId:'',amount:0}
          ],
          stockRecords:[]
        },
        categoryList:[],
				rules:{
					remark:[
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
				return this.$store.state.finance.statement_id
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
      axios_post('/api/fi/payment/'+_self.statement_id).then(res => {
        if(res){
          _self.info = res
          _self.info.deductions.forEach(value => {
            value.amount = value.amount/100
          })
        }
      })
    },
		methods:{
      handleEdit:function(_type){  //_type 1修改 2核算
      	var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
        	if(valid){
            var req = {
              id:_self.info.id,
              remark:_self.info.remark,
              changeRemark:_self.info.changeRemark,
              deductions:[]
            }
            _self.info.deductions.forEach(value => {
              var _item = {}
              _item.categoryId = value.categoryId
              _item.amount = value.amount
              _item.amount*=100
              req.deductions.push(_item)
            })
            if(_type == 1){
              _self.$confirm('确认保存修改信息?', '提示').then(()=> {
                axios_post('/api/fi/payment/save',req).then( res => {
                  if(res===null){
                    _self.$router.push("/finance/fin/statement")
                  }
                })
              })
            }
            else{
              _self.$confirm('确认核算该账单？').then(() => {
                axios_post('/api/fi/payment/settle',req).then( res => {
                  if(res===null){
                    _self.$router.push("/finance/fin/statement")
                  }
                })
              })
            }
        	}
        })
      },
			back:function(){
        this.$router.push('/finance/fin/statement')
			},
      handleCheck:function(){
      	var _self = this

      },
      //新增和删除扣款项
      add_project:function(){
        var _self = this
        this.info.deductions.push({categoryId:'',amount:0})
      },
      del_project:function(_index){
        this.info.deductions.splice(_index,1)
      },
      //时间戳格式化
      time_format:function(req){
        return time_format({time:req})
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
