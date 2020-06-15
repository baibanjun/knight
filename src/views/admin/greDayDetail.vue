<template>
	<div>
		<div class="out_info_box">
			<el-form class="demo-form-inline" label-width="140px" ref="ruleForm" :rules="rules" :model="info">
				<el-row>
					<el-col :span="8">
						<el-form-item label="车牌号:">
					    <el-tag type="info">{{info.plate_number}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="运输人:" prop="driver">
							<el-input v-model.trim="info.driver"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="手机号:" prop="phone">
							<el-input v-model.trim="info.phone"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="入库类型:">
        		  <el-select v-model="info.recycle_type">
        		  	<el-option label="餐厨垃圾" value="1"></el-option>
        		  	<el-option label="红油" value="2"></el-option>
        		  	<el-option label="地沟油" value="3"></el-option>
        		  </el-select>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="出入库编号:">
        			<el-tag type="info">{{info.sn}}</el-tag>
        		</el-form-item>
        	</el-col>
        </el-row>
        <hr>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="毛重(kg):">
              <el-tag type="info">{{info.rough_weight}}</el-tag>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="皮重(kg):" prop="tare_weight">
        			<el-input v-model.trim="info.tare_weight"></el-input>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="净重(kg):">
          		<el-tag type="info">{{info.net_weight}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="取样量:">
              <el-tag type="info">{{info.total}}</el-tag>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="油脂量:">
        			<el-tag type="info">{{info.left_value}}</el-tag>
        		</el-form-item>
        	</el-col>
          <el-col :span="8">
          	<el-form-item label="含油率(%):">
          		<el-tag type="info">{{(info.oil_content*100).toFixed(2)}}</el-tag>
          	</el-form-item>
          </el-col>
        </el-row>
        <hr>
        <el-row>
        	<el-col :span="8">
        		<el-form-item label="去杂净重(kg):">
              <el-tag type="info">{{ (info.net_weight_without_impurity*1).toFixed(2) }}</el-tag>
        		</el-form-item>
        	</el-col>
        	<el-col :span="8">
        		<el-form-item label="除粗渣量(kg):" prop="without_impurity_offset">
              <el-input v-model.trim="info.without_impurity_offset" placeholder="请输入除粗渣量"></el-input>
        		</el-form-item>
        	</el-col>
        </el-row>

				<el-form-item label="修改备注:">
					<el-input type="textarea" v-model.trim="info.update_reason"></el-input>
				</el-form-item>

				<el-form-item>
          <el-button type="info" disabled="" v-if="info.account_id">已核对</el-button>
          <el-button type="primary" icon="el-icon-finished" @click="handleEdit" v-if="!info.account_id">保存</el-button>
          <el-button icon="el-icon-d-arrow-left" @click="back">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { axios_get, axios_put } from '@/api/main'
import { checkNull, checkPhone,checkFlexd } from '@/lib/tools'
export default {
  data () {
    return {
      info: {
        id: '',
        sn: '',
        recycle_type: '', // 回收类别
        plate_number: '',
        driver: '',
        phone: '',
        oil_content: '',
        rough_weight: '', // 毛重
        net_weight: '', // 净重
        tare_weight: '', // 皮重
        total: '',
        left_value: '',
        without_impurity_offset: 0, // 粗渣
        update_reason: ''
      },
      rules: {
        driver: [
          { required: true, validator: checkNull, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        tare_weight: [
          { required: true, validator: checkFlexd, trigger: 'blur' }
        ],
        without_impurity_offset: [
          { required: true, validator: checkFlexd, trigger: 'blur' }
        ],
        impurity: [
          { required: true, validator: checkFlexd, trigger: 'blur' }
        ],
        update_reason: [
          { required: true, validator: checkNull, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    gre_day_id () {
      return this.$store.state.admin.gre_day_id
    }
  },
  mounted () {
    var _self = this
    axios_get('api/admin/grease_day/' + _self.gre_day_id).then(res => {
      if (res) {
        _self.info = res
        _self.info.recycle_type += '' // 字符串化
        _self.info.without_impurity_offset += ''
      }
    })
  },
  methods: {
    handleEdit: function () {
      var _self = this
      _self.$refs['ruleForm'].validate((valid) => {
      	if(valid){
          var req = {
            id: _self.info.id,
            tareWeight: _self.info.tare_weight,
            driver: _self.info.driver,
            phone: _self.info.phone,
            updateReason: _self.info.update_reason,
            recycleType: _self.info.recycle_type,
            withoutImpurityOffset: _self.info.without_impurity_offset
          }
          _self.$confirm('确认保存修改信息?', '提示').then(() => {
            axios_put('api/admin/grease_day/' + _self.gre_day_id, req).then(res => {
              if (res) {
                _self.$router.push('/admin/gre/dayList')
              }
            })
          })
      	}else{

      	}
      })


    },
    // 返回
    back: function () {
      this.$router.push('/admin/gre/dayList')
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
