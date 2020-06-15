<template>
  <div>
    <h3 class="tac">时间: {{ now_time }}</h3>
    <div class="operation_box">
      <div class="">
        <h3 class="tac">当前读数(kg)</h3>
        <p class="tac">{{kitchen.num}}</p>
        <p class="tac"><el-button @click="post_data(1)">加工餐厨废油</el-button></p>
      </div>
      <div class="">
        <h3 class="tac">当前读数(kg)</h3>
        <p class="tac">{{illegal.num}}</p>
        <p class="tac"><el-button @click="post_data(2)">加工地沟油</el-button></p>
      </div>
    </div>
    <p style="margin-left: 5%;">
      <el-button-group>
        <el-button :type="type==1?'primary':''" @click="change_type(1)">加工餐厨废油</el-button>
        <el-button :type="type==2?'primary':''" @click="change_type(2)">加工地沟油</el-button>
      </el-button-group>
    </p>
    <!--列表-->
    <el-table :data="list" border style="width: 90%;margin-left: 5%;">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="createTime" label="入库时间">
        <template slot-scope="scope"> {{ time_format(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column prop="opId" label="入库编号"> </el-table-column>
      <el-table-column prop="operator" label="操作员"></el-table-column>
      <el-table-column prop="weight" label="净重(kg)"> </el-table-column>
      <el-table-column label="含油率">
        <template slot-scope="scope"> {{ scope.row.oil_length?(scope.row.oil_length*100).toFixed(2)+'%':'-'}}</template>
      </el-table-column>
      <el-table-column label="去杂净重">
        <template slot-scope="scope">
          {{ scope.row.oil_length?(scope.row.weight*scope.row.oil_length).toFixed(2):'-'}}
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
  </div>
</template>

<script>
  import { time_format } from '@/lib/tools.js'
  import { axios_get,axios_post_fd } from '@/api/main.js'
  export default {
    data() {
      return {
        now_time: '', //时间
        timer_1:null,//计时器
        timer_2:null,//计时器
        type: 1, //餐厨废油1、地沟油2
        illegal:{ //地沟油
          num:0,
          id:null,
          deviceId:null
        },
        kitchen:{ //餐厨废油
          num:0,
          id:null,
          deviceId:null
        },
        total:1,
        page:1,
        list: [
          {
            createTime:'',
            oil_length:null
          }
        ]
      }
    },
    mounted() {
      var _self = this
      //当前时间
      _self.timer_1 = setInterval(function() {
        let time = time_format({time:null})
        _self.now_time = time
      }, 1000)
      //初始执行一次
      _self.get_data()
      _self.timer_2 = setInterval(_self.get_data, 2000)
      _self.search(1)
    },
    //销毁组件时(中途切换路由)
    destroyed(){
      clearInterval(this.timer_1)
      clearInterval(this.timer_2)
    },
    methods: {
      //搜索列表
      search:function(currentPage){
      	var _self = this
        if(currentPage){
          _self.page = currentPage
        }
        axios_get('/api/operation',{page:_self.page,limit:10,status:0,type:_self.type}).then(res => {
      	  if(res){
      	    _self.list = res.list
            _self.total = res.totalCount
            _self.list.forEach(val => {
              val.oil_length = null
              if(!val.selectSample){}
              else val.oil_length = _self.get_oil_length(val.selectSample.leftValue,val.selectSample.total)
            })
      	  }
      	})
      },
      get_data:function(){
        var _self = this
        axios_get('/api/operation/temp_latest',{type:1}).then(res => {
          if(res){
            _self.kitchen.num = res.operation.weight
            _self.kitchen.deviceId = res.operation.deviceId
            _self.kitchen.id = res.operation.opId
          }
        })
        axios_get('/api/operation/temp_latest',{type:2}).then(res => {
          if(res){
            _self.illegal.num = res.operation.weight
            _self.illegal.deviceId = res.operation.deviceId
            _self.illegal.id = res.operation.opId
          }
        })
      },
      //切换检验列表
      change_type:function(_type){
        var _self = this
        if(_self.type == _type) return false
        _self.type = _type
        _self.search(1)
      },
      //取消测量
      cancel_post:function(){
        var _self = this
      },
      //确认测量并发送
      post_data: function(_type) {
        var _self = this
        var req = {type:_type}
        if(_type==1) req.id = _self.kitchen.id
        else req.id = _self.illegal.id
        console.log(req)
        _self.$confirm('确认提交本次入库记录？').then(() => {
          axios_post_fd('/api/operation/process',req).then(res => {
            if(res){
              _self.$message.success({
                 message: '提交成功',
                 offset:150
              })
              _self.search(1)
            }
          })
        })
      },
      //计算含油率
      get_oil_length: function(_left, _total) {
        return (_left / _total).toFixed(3)
      },
      //时间戳格式化
      time_format:function(req){
        return time_format({time:req})
      }
    }
  }
</script>

<style scoped>
  .el-table>>>.cell {
    text-align: center;
  }
  .el-table>>>th{
    padding:5px;
  }
  .el-table>>>td{
    padding:5px;
  }
  .operation_box{
    width: 90%;
    margin-left: 5%;
    height: 300px;
  }
  .operation_box div{
    width: 39%;
    float: left;
    margin:0 5%;
    border: 1px solid #ccc;
    height: 300px;
  }
  .operation_box div p{
    margin: 60px 0;
    font-size: 20px;
  }
</style>
