<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
						<el-form-item label="车牌号:">
              <el-tag type="info">{{info.plateNumber}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="运输人:">
              <el-tag type="info">{{info.driver}}</el-tag>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="手机号:">
              <el-tag type="info">{{info.phone}}</el-tag>
          	</el-form-item>
          </el-col>
				</el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="出入库编号:">
        			<el-tag type="info">{{info.sn}}</el-tag>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="台账总量(kg):">
          		<el-tag type="info">{{ standing_books_weight }}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="净重(kg):">
          		<el-tag type="info">{{info.netWeight}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
          	<el-form-item label="处置费单价(元):" prop="trashPrice">
          		<el-input v-model.trim="info.trashPrice"></el-input>
          	</el-form-item>
          </el-col>
        </el-row>
				<el-form-item label="来源单位:">
          <el-table border style="width: 80%" :data="info.standingBooks">
            <el-table-column prop="name" label="单位名称"></el-table-column>
            <el-table-column prop="weight" label="台账量(kg)"></el-table-column>
          </el-table>
				</el-form-item>
				<el-form-item>
					<el-col :span="8">
						<el-button type="primary" icon="el-icon-finished" @click="handleEdit">保存</el-button>
            <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
          </el-col>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get } from '@/api/main'
	import { checkFlexd } from '@/lib/tools'
	export default{
		data(){
			return{
				info:{
          id:'',
          sn:'',
          trashPrice:'', //单价
					plateNumber:'',
          driver:'',
          phone:'',
          standing_books_weight:'',//台账总量
          netWeight:'',//净重
          standingBooks:[]
				},
        rules:{
          trashPrice:[
            { required: true,validator: checkFlexd, trigger: 'blur' }
          ]
        }
			}
		},
		computed:{
      //id
			rub_day_id(){
				return this.$store.state.finance.rub_day_id
			},
      //台账总量
      standing_books_weight(){
        var _self = this
        let weight = 0
        _self.info.standingBooks.forEach(item => {
          weight += Number(item.weight)
        })
        return weight
      }
		},
    mounted() {
      var _self = this
      axios_get('/api/fi/rubbish_day/'+_self.rub_day_id).then(res => {
        if(res){
          _self.info = Object.assign(_self.info, res)
          // _self.info = res
          if(res.trashPrice == undefined||res.trashPrice===null){
            _self.info.trashPrice = ''
            return false
          }
          _self.info.trashPrice = res.trashPrice/100
        }
      })
    },
		methods:{
			handleEdit:function(){
				var _self = this
        _self.$refs['ruleForm'].validate((valid) => {
          if(valid){
            _self.$confirm('确认修改单价?', '提示').then(()=> {
              axios_get('/api/fi/rubbish_day/save/price/'+_self.rub_day_id+'/'+(_self.info.trashPrice*100).toFixed(0)).then( res => {
                if(res===null){
                  _self.$router.push("/finance/rub/dayList")
                }
              })
            })
          }
        })
			},
			//返回
			back:function(){
				this.$router.push("/finance/rub/dayList")
			}
		}
	}
</script>

<style scoped>
	.out_info_box{
		margin-left: 5%;
		width: 80%;
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
