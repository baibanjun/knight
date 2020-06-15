<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
						<el-form-item label="日期:">
              <el-tag>{{info.dateStr}}</el-tag>
						</el-form-item>
					</el-col>
          <el-col :span="8">
          	<el-form-item label="总净重(kg):">
              <el-tag type="info">{{info.netWeightTotal}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="废弃固渣(车):" prop="solidRubbishAmount">
             <el-input v-model.trim="info.solidRubbishAmount"></el-input>
          	</el-form-item>
          </el-col>
				</el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="废物处置费(元):">
        			<el-tag type="info">{{info.price/100}}</el-tag>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="加工油净重(kg):">
          		<el-tag type="info">{{info.netWeightOil}}</el-tag>
          	</el-form-item>
          </el-col>
          <el-col :span="8">
          	<el-form-item label="去杂净重(kg):">
          		<el-tag type="info">{{(info.netWeightWithoutImpurity*1).toFixed(2)}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="加工油入库记录:">
          <el-table border :data="list" height="300">
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <el-table-column label="入库时间"><template slot-scope="scope">{{ time_format(scope.row.create_time) }}</template></el-table-column>
            <el-table-column prop="user_name" label="操作员"></el-table-column>
            <el-table-column prop="weight" label="净重(kg)"></el-table-column>
            <el-table-column label="含油率(%)"><template slot-scope="scope">{{ (scope.row.oil_content*100).toFixed(2) }}</template></el-table-column>
            <el-table-column label="去杂净重">
              <template slot-scope="scope">{{ (scope.row.weight*scope.row.oil_content).toFixed(2) }}</template>
            </el-table-column>
          </el-table>
        </el-form-item>
				<el-form-item label="修改备注:">
					<el-input type="textarea" v-model="info.remark"></el-input>
				</el-form-item>
				<el-form-item>
          <el-button type="primary" icon="el-icon-finished" @click="handleEdit">保存</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { axios_get,axios_put  } from '@/api/main'
  import { time_format,checkInt,checkNull } from '@/lib/tools.js'
	export default{
		data(){
			return{
				info:{
					id:'',
					dateStr:'',
					solidRubbishAmount:'',
					netWeightWithoutImpurity:'',//去杂
					netWeightTotal:'',//总净重
					netWeightOil:'',
					remark:'',
          price:''
				},
        list:[
          {
            create_time:'',
            weight:'',
            oil_content:'',
            user_name:'',
            net_weight_without_impurity:''
          }
        ],
        rules:{
        	remark:[
        		{ required: true,validator: checkNull, trigger: 'blur' }
        	],
          solidRubbishAmount:[
            { required: true,validator: checkInt, trigger: 'blur' }
          ]
        }
			}
		},
    mounted() {
      var _self = this
      //详情
      axios_get('/api/admin/rubbish_day_auto/'+_self.rub_dispose_id).then(res => {
        if(res){
          _self.info = res
          //加工油记录
          axios_get('/api/admin/rubbish_day_auto/records',{day:res.dateStr,page:1,limit:500}).then(data => {
            _self.list = data.list
          })
        }
      })
    },
    computed:{
      rub_dispose_id(){
      	return this.$store.state.admin.rub_dispose_id
      }
    },
		methods:{
			//返回
			back:function(){
				var _self = this
        _self.$router.push("/admin/rub/disposeList")
			},
      handleEdit:function(){
        var _self = this
        _self.$confirm('确认保存修改信息?', '提示')
          .then(()=> {
            axios_put('/api/admin/rubbish_day_auto/'+_self.rub_dispose_id,{solidRubbishAmount:_self.info.solidRubbishAmount,remark:_self.info.remark}).then(res => {
              if(res){
                _self.$router.push("/admin/rub/disposeList")
              }
            })
          })

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
		margin-left: 5%;
		width: 90%;
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
