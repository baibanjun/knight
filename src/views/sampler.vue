<template>
  <div>
	<h3 class="title_time">时间: {{ now_time }}</h3>
    <p style="margin-left: 5%;">
		<el-button-group>
			<el-button :type="oil_type==1?'primary':''" @click="change_type(1)">餐厨油脂检验</el-button>
			<el-button :type="oil_type==2?'primary':''" @click="change_type(2)">加工油脂检验</el-button>
		</el-button-group>

      <span style="margin-left: 5%;">状 态:
        <el-select placeholder="请选择" v-model="status" @change="search(1)">
          <el-option v-for="item in status_list" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </span>
    </p>
    <!--餐厨列表-->
    <el-table  v-if="oil_type == 1" :data="list" border style="width: 90%;margin-left: 5%;">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="createTime" label="出入库时间"> </el-table-column>>
      <el-table-column prop="sn" label="出入库编号"> </el-table-column>
      <el-table-column prop="plateNumber" label="车牌号"></el-table-column>
      <el-table-column prop="driver" label="运输人"> </el-table-column>
      <el-table-column label="出入库">
        <template slot-scope="scope"> {{ scope.row.inOutType==1?'入库':'出库' }}</template>
      </el-table-column>
      <el-table-column label="类别">
        <template slot-scope="scope">
          {{ scope.row.recycleType==1?'餐厨垃圾':scope.row.recycleType==2?'红油':scope.row.recycleType==3?'地沟油':'固渣'}}
        </template>
      </el-table-column>
      <el-table-column label="含油率检验">
        <el-table-column label="烧样法"><template slot-scope="scope">
            <el-button type="primary" size="mini" plain v-if="!scope.row.burnSample" @click="start_sampler(scope.row.id)">开始抽样</el-button>
            <p class="sample_info" v-if="scope.row.burnSample" :class="scope.row.burnSample.sampleId==scope.row.selectSample.sampleId?'sample_info_main':''">
              <span>烧样法</span>
              <span>取样重量:{{ scope.row.burnSample.total }} g</span>
              <span>油脂重量:{{ scope.row.burnSample.leftValue }} g</span>
              <span>含油率:{{ get_oil_length(scope.row.burnSample.leftValue,scope.row.burnSample.total) }}</span>
            </p>
          </template></el-table-column>

        <el-table-column label="分离法"><template slot-scope="scope">
            <el-button type="primary" size="mini" plain v-if="!scope.row.sepaSample" @click="start_sampler(scope.row.id)">开始抽样</el-button>
            <p class="sample_info" v-if="scope.row.sepaSample" :class="scope.row.sepaSample.sampleId==scope.row.selectSample.sampleId?'sample_info_main':''">
              <span>分离法</span>
              <span>取样体积:{{ scope.row.sepaSample.total }} mL</span>
              <span>油脂体积:{{ scope.row.sepaSample.leftValue }} mL</span>
              <span>含油率:{{ get_oil_length(scope.row.sepaSample.leftValue,scope.row.sepaSample.total) }}</span>
            </p>
          </template></el-table-column>
      </el-table-column>
      <el-table-column prop="isFixed" label="修正记录">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.isFixed==1" @click="get_fix_list(scope.row.id)">已修正</el-button>
          <span v-if="scope.row.isFixed!=1">未修正</span>
        </template>
      </el-table-column>
    </el-table>

    <!--加工列表-->
    <el-table  v-if="oil_type == 2" :data="list" border style="width: 90%;margin-left: 5%;">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column label="出入库时间">
        <template slot-scope="scope"> {{ time_format(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="出入库编号"><template slot-scope="scope">{{ scope.row.sn}}</template></el-table-column>
      <el-table-column label="类别">
        <template slot-scope="scope">
          {{ scope.row.type==1?'加工餐厨废油':'加工地沟油'}}
        </template>
      </el-table-column>
      <el-table-column label="含油率检验">
        <el-table-column label="烧样法"><template slot-scope="scope">
            <el-button type="primary" size="mini" plain v-if="!scope.row.burnSample" @click="start_sampler(scope.row.opId)">开始抽样</el-button>
            <p class="sample_info" v-if="scope.row.burnSample" :class="scope.row.burnSample.sampleId==scope.row.selectSample.sampleId?'sample_info_main':''">
              <span>烧样法</span>
              <span>取样重量:{{ scope.row.burnSample.total }} g</span>
              <span>油脂重量:{{ scope.row.burnSample.leftValue }} g</span>
              <span>含油率:{{ get_oil_length(scope.row.burnSample.leftValue,scope.row.burnSample.total) }}</span>
            </p>
          </template></el-table-column>

        <el-table-column label="分离法"><template slot-scope="scope">
            <el-button type="primary" size="mini" plain v-if="!scope.row.sepaSample" @click="start_sampler(scope.row.opId)">开始抽样</el-button>
            <p class="sample_info" v-if="scope.row.sepaSample" :class="scope.row.sepaSample.sampleId==scope.row.selectSample.sampleId?'sample_info_main':''">
              <span>分离法</span>
              <span>取样体积:{{ scope.row.sepaSample.total }} mL</span>
              <span>油脂体积:{{ scope.row.sepaSample.leftValue }} mL</span>
              <span>含油率:{{ get_oil_length(scope.row.sepaSample.leftValue,scope.row.sepaSample.total) }}</span>
            </p>
          </template></el-table-column>
      </el-table-column>
      <el-table-column prop="isFixed" label="修正记录">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.isFixed==1" @click="get_fix_list(scope.row.opId)">已修正</el-button>
          <span v-if="scope.row.isFixed!=1">未修正</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination
        :total="total"
        background
        :current-page="page"
        @current-change="search"
        >
      </el-pagination>
    </div>

    <!--弹出层-->
    <el-dialog
    	title="含油率检验"
    	:visible.sync="sampler_status"
    	width="60%"
    	:close-on-click-modal="false"
    	:show-close="false"
    	center>
      <!--内层-->
    	<el-dialog
    		width="20%"
    		title="修正数据"
    		:visible.sync="fix_status"
    		:close-on-click-modal="false"
    		:show-close="false"
    		append-to-body>
    		<p>请输入修正后数据(g或ml)</p>
    		<el-input v-model="fix_data.value"></el-input>
    		<p>请填写修正原因:</p>
    		<el-input type="textarea" v-model="fix_data.msg"></el-input>
    		<span slot="footer" class="dialog-footer">
    			<el-button @click="fix_status = false">取 消</el-button>
    			<el-button type="primary" @click="comfirm_change()">确 定</el-button>
    		</span>
    	</el-dialog>

    	<span>

    		<table class="sampler_table" cellspacing="0" v-show="burn_sample.open">
          <tr>
            <td rowspan="2" width="150"><el-radio v-model="standard" label="1" size="mini" border>标准方法</el-radio></td>
            <td rowspan="2" width="120">烧样法</td>
            <td>取样重量</td>
            <td>油渣重量</td>
            <td>固渣重量</td>
            <td>含油率</td>
          </tr>
          <tr>
            <td>
              <p v-if="!burn_sample.complete">{{burn_sample.total}}g</p>
              <p><el-link type="primary" @click="start_fix(1)" v-if="burn_sample.complete">{{burn_sample.total}}g</el-link></p>
              <p><el-button size="mini" type="success" plain @click="confirm_data_first(1)" v-show="!burn_sample.first_complete">确认</el-button></p>
            </td>
            <td>
              <p v-if="!burn_sample.complete">{{burn_sample.leftValue}}g</p>
              <p><el-link type="primary" v-if="burn_sample.complete"  @click="start_fix(2)">{{burn_sample.leftValue}}g</el-link></p>
              <p><el-button size="mini" type="success" plain @click="confirm_data_sec(1)" v-show="burn_sample.first_complete&&!burn_sample.complete">确认</el-button></p>
            </td>
            <td>
              <p v-if="!burn_sample.complete">{{burn_sample.leftValue}}g</p>
              <p><el-link type="primary" v-if="burn_sample.complete"  @click="start_fix(2)">{{burn_sample.leftValue}}g</el-link></p>
              <p><el-button size="mini" type="success" plain @click="confirm_data_sec(1)" v-show="burn_sample.first_complete&&!burn_sample.complete">确认</el-button></p>
            </td>
            <td>{{ burn_oil_length }}</td>
          </tr>
    		</table>

        <table class="sampler_table" cellspacing="0" v-show="sepa_sample.open">
          <tr>
            <td rowspan="2" width="150"><el-radio v-model="standard" label="2" size="mini" border>标准方法</el-radio></td>
            <td rowspan="2" width="120">分离法</td>
            <td>取样体积</td>
            <td>油脂体积</td>
            <td>含油率</td>
          </tr>
          <tr>
            <td>
              <p v-if="!sepa_sample.complete">{{sepa_sample.total}}ml</p>
              <p><el-link type="primary" @click="start_fix(3)" v-if="sepa_sample.complete">{{sepa_sample.total}}ml</el-link></p>
              <p><el-button size="mini" type="success" plain @click="confirm_data_first(2)"  v-show="!sepa_sample.first_complete">确认</el-button></p>
            </td>
            <td>
              <p v-if="!sepa_sample.complete">{{sepa_sample.leftValue}}ml</p>
              <p><el-link type="primary" v-if="sepa_sample.complete"  @click="start_fix(4)">{{sepa_sample.leftValue}}ml</el-link></p>
              <p><el-button size="mini" type="success" plain @click="confirm_data_sec(2)"  v-show="sepa_sample.first_complete&&!sepa_sample.complete">确认</el-button></p>
            </td>
            <td>{{ sepa_oil_length }}</td>
          </tr>
        </table>
    	</span>
    	<p style="text-align: center;">
    		<el-button type="primary" @click="post_data()">确认该标准方法</el-button>
    		<el-button @click="cancel_post()">取 消</el-button>
    	</p>
    </el-dialog>

    <el-dialog
    	width="60%"
    	title="修正列表"
    	:visible.sync="fix_list_status"
    	:close-on-click-modal="false"
    	:show-close="false"
    	append-to-body>
      <el-table :data="fix_list" border style="width: 90%;margin-left: 5%;">
        <el-table-column label="修正记录">
          <template slot-scope="scope"> {{ time_format(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="修正项"><template slot-scope="scope"> {{ scope.row.type==1?'烧样数据':'分离数据' }}</template> </el-table-column>
        <el-table-column prop="lastData" label="原读数"></el-table-column>
        <el-table-column prop="newData" label="修正后读数"> </el-table-column>
        <el-table-column prop="remark" label="修正原因"></el-table-column>
      </el-table>
    	<span slot="footer" class="dialog-footer">
    		<el-button @click="fix_list_status = false">取 消</el-button>
    	</span>
    </el-dialog>
  </div>
</template>

<script>
  import { time_format } from '@/lib/tools.js'
  import { axios_get,axios_post_fd } from '@/api/main.js'
  export default {
    data() {
      return {
        now_time: '', //时间
        timer:null, //时间计时器
        oil_type: 1, //餐厨油脂1、加工油脂2
        status: 0, //搜索时状态
        sampler_status:false, //检验弹窗状态
        standard:null, //选取检验标准
        fix_status:false,//修改状态
        fix_aim:1,//修改目标 1烧样总2烧样油 3分离总 4分离油
        fix_data:{ //修改弹窗内容
          value:'',
          msg:''
        },
        temporary_id:{//第一条确认之后返回的sample_id
          burn_sample_id:null,
          sepa_sample_id:null
        },
        stock_id:null,//当前抽样的基础库数据id
        burn_sample:{  //烧样法数据
          open:false, //有无数据
          first_complete:false, //第一步完成
          complete:false, //该项完成
          device_id:null,//设备id
          total:1,  //取样
          total_id:null, //第一次拿到的sample_id
          leftValue:0 ,//油脂
          left_id:null//第二次拿到的sample_id
        },
        sepa_sample:{  //分离法数据
          open:false,
          first_complete:false, //第一步完成
          complete:false, //该项完成
          device_id:null,//设备id
          total:1,
          total_id:null,
          leftValue:0,
          left_id:null
        },
        burn_timer:null,
        sepa_timer:null,
        status_list: [{text: '全部',value: 0}, {text: '已检验',value: 1}, {text: '未检验',value: 2}],//状态选项
        total:1,
        page:1,
        list: [] ,//列表数据
        fix_list_status:false, //修正列表弹窗
        fix_list:[] //修正
      }
    },
    computed:{
      burn_oil_length(){  //烧样含油率
        let _self = this
        let _lenth = '0%';
        if(_self.burn_sample.total!=0){
            _lenth = Math.ceil((_self.burn_sample.leftValue / _self.burn_sample.total) * 100) + '%'
        }
        return _lenth
      },
      sepa_oil_length(){  //分离法含油率
        let _self = this
        let _lenth = '0%';
        if(_self.sepa_sample.total!=0){
            _lenth = Math.ceil((_self.sepa_sample.leftValue / _self.sepa_sample.total) * 100) + '%'
        }
        return _lenth
      }
    },
    mounted() {
      var _self = this
      //当前时间
      _self.timer = setInterval(function() {
        let time = time_format({time:null})
        _self.now_time = time
      }, 1000)
      _self.search(1)
    },
    //销毁组件时(中途切换路由)
    destroyed(){
      //清除所有计时器
      clearInterval(this.timer)
      clearInterval(this.burn_timer)
      clearInterval(this.sepa_timer)
    },
    methods: {
      //搜索列表
      search:function(currentPage){
      	var _self = this
        if(currentPage){
          _self.page = currentPage
        }
        axios_post_fd('/api/sampler/getList',{page:_self.page,limit:10,status:_self.status,oil_type:_self.oil_type}).then(res => {
      	  if(res){
      	    _self.list = res.list
            _self.total = res.totalCount
      	  }
      	})
      },
      //获取修正list
      get_fix_list:function(_id){
        var _self = this
        axios_post_fd('/api/sampler/getModifyRecords',{stock_id:_id}).then(res => {
          if(res){
            _self.fix_list = res.records
            _self.fix_list_status = true
          }
        })
      },
      //切换检验列表
      change_type:function(_type){
        var _self = this
        if(_self.oil_type == _type) return false
        _self.oil_type = _type
        _self.search(1)
      },
      //确认修改数据
      comfirm_change:function(){
      	var _self = this
        const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      	if(_self.fix_data.msg==''){
      		_self.$message.error({
      			message: '修正原因不能为空',
      			offset:150
      		})
      		return false
      	}
        else if(!reg.test(_self.fix_data.value)){
          _self.$message.error({
          	message: '修正数据有误',
          	offset:150
          })
          _self.fix_data.value = ''
          return false
        }
        else{
          var req = {oil_type:_self.oil_type,stock_id:_self.stock_id,value:_self.fix_data.value,remark:_self.fix_data.msg}
          if(_self.fix_aim==1){
            req.sample_id = _self.temporary_id.burn_sample_id
            req.type = 1
          }
          if(_self.fix_aim==2){
            req.sample_id = _self.temporary_id.burn_sample_id
            req.type = 2
          }
          if(_self.fix_aim==3){
            req.sample_id = _self.temporary_id.sepa_sample_id
            req.type = 1
          }
          if(_self.fix_aim==4){
            req.sample_id = _self.temporary_id.sepa_sample_id
            req.type = 2
          }
          axios_post_fd('/api/sampler/updateSample',req).then(res => {
            if(res){
              var _val = JSON.parse(JSON.stringify(_self.fix_data.value))//深拷贝
              if(_self.fix_aim==1) _self.burn_sample.total = _val
              if(_self.fix_aim==2) _self.burn_sample.leftValue = _val
              if(_self.fix_aim==3) _self.sepa_sample.total = _val
              if(_self.fix_aim==4) _self.sepa_sample.leftValue = _val
              _self.fix_data = {value:'',msg:''}
              _self.fix_status = false
            }
          })
      	}
      },
      start_fix:function(_type){
        var _self = this
        _self.fix_aim = _type
        _self.fix_status = true
      },
      //开启检验弹窗
      start_sampler:function(_id){
        var _self = this
        _self.stock_id = _id
        _self.burn_sample = {open:false,first_complete:false,complete:false,total:1,leftValue:0}
        _self.sepa_sample = {open:false,first_complete:false,complete:false,total:1,leftValue:0}
        _self.sampler_status = true
        //立即执行一次
        _self.get_burn_data()
        _self.get_sepa_data()
        _self.burn_timer = setInterval(_self.get_burn_data,2000)
        _self.sepa_timer = setInterval(_self.get_sepa_data,2000)
      },
      //获取烧样数据
      get_burn_data:function(){
        var _self = this
        axios_post_fd('/api/sampler/getTemSample').then(res => {
          if(res){
            if(res.tempSample&&!_self.burn_sample.open){ //开启烧样法
              _self.burn_sample.open = true
              _self.burn_sample.device_id = res.tempSample.deviceId
            }
            _self.standard = _self.standard||'1' //优先选择当前标准

            if(_self.burn_sample.complete){
              clearInterval(_self.burn_timer)//清除计时器
            }
            else if(!_self.burn_sample.first_complete){ //第一条数据(取样)
              _self.burn_sample.total = res.tempSample.weight
              _self.burn_sample.total_id = res.tempSample.sampleId
            }
            else{
              _self.burn_sample.leftValue = res.tempSample.weight
              _self.burn_sample.left_id = res.tempSample.sampleId
            }
          }
        })
      },
      //获取分离数据
      get_sepa_data:function(){
        var _self = this
        axios_post_fd('/api/sampler/getTemSepSample').then(res => {
          if(res){
            if(res.tempSample&&!_self.sepa_sample.open){ //开启烧样法
              _self.sepa_sample.open = true
              _self.sepa_sample.device_id = res.tempSample.deviceId
            }

            _self.standard = _self.standard||'2'

            if(_self.sepa_sample.complete){
              clearInterval(_self.sepa_timer)
            }
            else if(!_self.sepa_sample.first_complete){
              _self.sepa_sample.total = res.tempSample.volume
              _self.sepa_sample.total_id = res.tempSample.sampleId
            }
            else{
              _self.sepa_sample.leftValue = res.tempSample.volume
              _self.sepa_sample.left_id = res.tempSample.sampleId
            }
          }
        })
      },
      //确认第一次取样数据
      confirm_data_first:function(_type){ //_type 烧样1  分离2
        var _self = this
        var req = {type:_type}
        if(_type == 1){
          req.device_id = _self.burn_sample.device_id
          req.total_id = _self.burn_sample.total_id
          req.weight = _self.burn_sample.total
        }
        if(_type == 2){
          req.device_id = _self.sepa_sample.device_id
          req.total_id = _self.sepa_sample.total_id
          req.weight = _self.sepa_sample.total
        }
        axios_post_fd('/api/sampler/addFisrtSample',req).then(res => {
          if(res){
            if(_type == 1){
              _self.burn_sample.first_complete = true
              _self.temporary_id.burn_sample_id = res.sampleId
            }
            else{
              _self.sepa_sample.first_complete = true
              _self.temporary_id.sepa_sample_id = res.sampleId
            }
          }
        })
      },
      //确认第二次取样数据
      confirm_data_sec:function(_type){ //_type 烧样1  分离2
        var _self = this
        var req = {type:_type,stock_id:_self.stock_id,oil_type:_self.oil_type}
        if(_type == 1){
          req.sample_id = _self.temporary_id.burn_sample_id
          req.left_id = _self.burn_sample.left_id
          req.left_value = _self.burn_sample.leftValue
        }
        if(_type == 2){
          req.sample_id = _self.temporary_id.sepa_sample_id
          req.left_id = _self.sepa_sample.left_id
          req.left_value = _self.sepa_sample.leftValue
        }
        axios_post_fd('/api/sampler/addSecondSample',req).then(res => {
          if(res){
            if(_type == 1){
              _self.burn_sample.complete = true
            }
            else{
              _self.sepa_sample.complete = true
            }
          }
        })
      },
      //取消测量
      cancel_post:function(){
        var _self = this
        clearInterval(_self.burn_timer)
        clearInterval(_self.sepa_timer)
        _self.standard = null
        _self.sampler_status = false
        _self.search(1)
      },
      //确认测量并发送
      post_data: function(_type) {
        var _self = this
        var _msg = ''
        var req = {stock_id:_self.stock_id,oil_type:_self.oil_type}
        if(!_self.standard) return false
        if(_self.standard == 1&&!_self.burn_sample.complete){
          _self.$message.error({
          	message: '该标准方法还未完成取样',
          	offset:150
          })
          return false
        }
        if(_self.standard == 2&&!_self.sepa_sample.complete){
          _self.$message.error({
          	message: '该标准方法还未完成取样',
          	offset:150
          })
          return false
        }
        if(_self.standard==1){
          _msg = '确认烧样法为标准方法?'
          req.sample_id = _self.temporary_id.burn_sample_id
        }
        else{
          _msg = '确认分离法为标准方法?'
          req.sample_id = _self.temporary_id.sepa_sample_id
        }
        _self.$confirm(_msg).then(() => {
          axios_post_fd('/api/sampler/selectSample',req).then(res => {
            if(res){
              clearInterval(_self.burn_timer)
              clearInterval(_self.sepa_timer)
              _self.standard = null
              _self.sampler_status = false
              _self.search(1)
            }
          })
        })
      },
      //计算含油率
      get_oil_length: function(_left, _total) {
        var num = (_left / _total)*100
        return num.toFixed(2) + '%'
      },
      //时间戳格式化
      time_format:function(req){
        return time_format({time:req})
      }
    }
  }
</script>

<style scoped>
  .title_time {
    text-align: center;
  }

  .el-table>>>.cell {
    text-align: center;
  }
  .el-table>>>th{
    padding:5px;
  }
  .el-table>>>td{
    padding:5px;
  }
  .sample_info span {
    display: block;
    color: #909399;
  }

  .sample_info_main span {
    color: #000000
  }
  .sampler_table{
    width: 100%;
    margin-bottom: 20px;
  }
  .sampler_table tr td{
  	border: 1px solid #ccc;
  	height: 35px;
  	text-align: center;
  }
</style>
