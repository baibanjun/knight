<template>
  <div>
    <h3 style="margin-left:5%;">
      <span style="padding-right:80px;">时间: {{time}}</span>
      <el-button type="primary" @click="get_stock('one')">1号地磅</el-button>
      <el-button type="primary" @click="get_stock('two')">2号地磅</el-button>
      <el-button type="primary" @click="get_stock('three')">3号地磅</el-button>
      <el-button type="primary" @click="get_stock('four')">4号地磅</el-button>
      <el-button type="warning" icon="el-icon-plus" @click="add()">新增记录</el-button>
    </h3>
    <el-table
      :data="list"
      border
      style="width: 90%;margin-left: 5%;"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column label="出入库时间">
        <template slot-scope="scope">{{ time_format(scope.row.create_time) }}</template>
      </el-table-column>
      <el-table-column label="出入库编号">
        <template slot-scope="scope">{{ scope.row.sn }}</template>
      </el-table-column>
      <el-table-column prop="plate_number" label="车牌号"></el-table-column>
      <el-table-column prop="driver" label="运输人"></el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column prop="rough_weight" label="毛重(kg)">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.rough_weight_number?true:false">{{scope.row.rough_weight_number}}</el-tag>
          {{scope.row.rough_weight }}
        </template>
      </el-table-column>
      <el-table-column prop="tare_weight" label="皮重(kg)">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.tare_weight_number?true:false">{{scope.row.tare_weight_number}}</el-tag>
          {{scope.row.tare_weight }}
        </template>
      </el-table-column>
      <el-table-column prop="net_weight" label="净重(kg)"></el-table-column>
      <el-table-column label="出入库">
        <template slot-scope="scope">{{ scope.row.in_out_type==1?'入库':'出库' }}</template>
      </el-table-column>
      <el-table-column label="类别">
        <template
          slot-scope="scope"
        >{{ scope.row.recycle_type==1?'餐厨垃圾':scope.row.recycle_type==2?'红油':scope.row.recycle_type==3?'地沟油':'固渣'}}</template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :total="total" background @current-change="search"></el-pagination>
    </div>
    <el-dialog
      :visible.sync="stock_status"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
      center
    >
      <el-dialog
        width="20%"
        title="修正数据"
        :visible.sync="fix_status"
        :close-on-click-modal="false"
        :show-close="false"
        append-to-body
      >
        <p>请输入修正后重量(kg):</p>
        <el-input v-model.trim="fix_data.value"></el-input>
        <p>请填写修正原因:</p>
        <el-input type="textarea" v-model.trim="fix_data.msg"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fix_status = false">取 消</el-button>
          <el-button type="primary" @click="comfirm_change()">确 定</el-button>
        </span>
      </el-dialog>

      <span>
        <el-tabs v-model="active_index" @tab-click="indexClick(active_index)">
          <el-tab-pane label="1号地磅" name="one" v-if="all_stock_data.one.id">
            <h3 class="tac">1号地磅正称重······</h3>
          </el-tab-pane>
          <el-tab-pane label="2号地磅" name="two" v-if="all_stock_data.two.id">
            <h3 class="tac">2号地磅正称重······</h3>
          </el-tab-pane>
          <el-tab-pane label="3号地磅" name="three" v-if="all_stock_data.three.id">
            <h3 class="tac">3号地磅正称重······</h3>
          </el-tab-pane>
          <el-tab-pane label="4号地磅" name="four" v-if="all_stock_data.four.id">
            <h3 class="tac">4号地磅正称重······</h3>
          </el-tab-pane>
        </el-tabs>
        <table class="stock_table" cellspacing="0">
          <tr>
            <td width="40%">车牌号</td>
            <td>{{stock_data.plateNumber}}</td>
          </tr>
          <tr>
            <td>运输人</td>
            <td>{{stock_data.driver}}</td>
          </tr>
          <tr>
            <td>手机号</td>
            <td>{{stock_data.phone}}</td>
          </tr>
          <tr>
            <td rowspan="2">本次称重</td>
            <td>时间：{{stock_data.createTime}}</td>
          </tr>
          <tr>
            <td>
              重量:
              <span
                style="color:#409EFF;font-size: 20px;padding: 0 10px;"
              >{{stock_data.tempWeight}}kg</span>
              <el-button size="mini" @click="fix_status = true">修正</el-button>
            </td>
          </tr>
          <tr>
            <td rowspan="2">称重记录</td>
            <td>时间:{{stock_data.historyRecord?stock_data.historyRecord.createTime:'-'}}</td>
          </tr>
          <tr>
            <td>重量: {{stock_data.historyRecord?stock_data.historyRecord.roughWeight||stock_data.historyRecord.tareWeight:'-'}}kg</td>
          </tr>
          <tr>
            <td>拍取摄像头</td>
            <td>{{stock_data.cameraInfo}}</td>
          </tr>
          <tr>
            <td>进出场</td>
            <td>{{stock_data.weighInoutType==1?'入场':'出场'}}</td>
          </tr>
          <tr>
            <td>修正后数据</td>
            <td>
              <span
                style="color:#F56C6C;font-size: 20px;"
              >{{stock_data.fix_weight?(stock_data.fix_weight + 'kg'):''}}</span>
            </td>
          </tr>
        </table>
      </span>
      <span v-if="stock_data.weighInoutType==1">
        <p style="text-align: center;">
          <el-button :type="stock_type==1?'primary':''" @click="stock_type=1">入 库</el-button>
          <el-button :type="stock_type==2?'primary':''" @click="stock_type=2">出 库</el-button>
        </p>
        <hr />
        <p style="text-align: center;" v-show="stock_type">
          <el-button @click="post_data(1)" v-show="stock_type==1">餐厨垃圾</el-button>
          <el-button @click="post_data(2)">红油</el-button>
          <el-button @click="post_data(3)">地沟油</el-button>
          <el-button @click="post_data(4)" v-show="stock_type==2">固渣</el-button>
        </p>
      </span>
      <span v-if="stock_data.weighInoutType==2">
        <p style="text-align: center;">
          <el-button type="primary" @click="post_data(0)">提交数据</el-button>
        </p>
      </span>
      <p>
        <el-button type="danger" size="small" @click="jump()">跳过</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import { axios_post_fd, axios_get } from "@/api/main.js";
import { time_format } from "@/lib/tools.js";
export default {
  data() {
    return {
      remark: "",
      to_index: { one: 1, two: 2, three: 3, four: 4 }, //转化为数字
      active_index: "one", //当前检测设备
      timer: null, //时间计时器
      timer1: null, //数据请求计时器
      time: "", //当前时间
      stock_type: 0, //进出库
      product_type: 0, //货物类型
      all_stock_data: {
        //4个磅秤的称重数据
        one: { id: false },
        two: { id: false },
        three: { id: false },
        four: { id: false }
      },
      fix_status: false, //修改数据状态
      fix_data: {
        //临时修改数据
        value: "",
        msg: ""
      },
      total: 1, //列表总个数
      sums_data: {}, //列表合计
      list: [
        //出入库列表
        {
          id: 10038,
          createTime: null,
          recycleType: 1,
          inOutType: 1,
          plateNumber: "-",
          driver: "-",
          phone: "-",
          roughWeight: 0,
          tareWeight: 0,
          netWeight: 0
        }
      ]
    };
  },
  computed: {
    stock_status() {
      return this.all_stock_data.one.id
        ? true
        : this.all_stock_data.two.id
        ? true
        : this.all_stock_data.three.id
        ? true
        : this.all_stock_data.four.id
        ? true
        : false;
    },
    stock_data() {
      var _self = this;
      return _self.all_stock_data[_self.active_index];
    }
  },
  mounted() {
    var _self = this;
    _self.timer = setInterval(() => {
      _self.time = time_format({ time: null });
    }, 1000);
    // _self.timer1 = setInterval(() => {
    //   _self.get_stock('one')
    //   _self.get_stock('two')
    //   _self.get_stock('three')
    //   _self.get_stock('four')
    // },5000)
    _self.search(1);
  },
  //销毁组件时(中途切换路由)
  destroyed() {
    clearInterval(this.timer);
    clearInterval(this.timer1);
  },
  methods: {
    // 新增记录
    add: function() {
      this.$router.push("/warehousing/addDay");
    },
    search: function(currentPage) {
      var _self = this;
      axios_get("/api/stock", { page: currentPage, limit: 10, status: 0 }).then(
        res => {
          if (res.sun != null) {
            _self.sums_data = res.sum;
          }
          if (res) {
            // console.log(res)
            _self.list = res.list;
            _self.total = res.totalCount;
          }
        }
      );
    },
    get_stock: function(_index) {
      //获取磅秤数据
      // console.log(_index)
      var _self = this;
      axios_get("/api/stock/temp_latest", {
        deviceId: _self.to_index[_index]
      }).then(res => {
        if (res) {
          // console.log(res)
          if (!res.stockRecord) {
            (_self.all_stock_data[_index] = { id: false }),
              _self.$message.error({
                message: "暂无数据,请重试",
                showClose: true,
                offset: 150
              });
          } else if (res.stockRecord.id != _self.all_stock_data[_index].id) {
            _self.remark = res.stockRecord.remark;
            if (_self.stock_status == false) _self.active_index = _index; //弹出时确定一个
            _self.all_stock_data[_index] = res.stockRecord;
            _self.all_stock_data[_index].fix_weight = null;
            _self.all_stock_data[_index].fix_reason = null;
          } else {
            return false;
          }
        }
      });
    },
    //跳过
    jump: function() {
      var _self = this;
      axios_post_fd("/api/stock/stock_process", {
        id: _self.stock_data.id,
        inout_type: 3
      }).then(res => {
        if (res) {
          _self.all_stock_data[_self.active_index] = { id: false };
          if (_self.stock_status) {
            _self.active_index = _self.all_stock_data.one.id
              ? "one"
              : _self.all_stock_data.two.id
              ? "two"
              : _self.all_stock_data.three.id
              ? "three"
              : _self.all_stock_data.four.id
              ? "four"
              : null;
          }
          _self.search(1);
        }
      });
    },
    comfirm_change: function() {
      var _self = this;
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (_self.fix_data.msg == "") {
        _self.$message.error({
          message: "修正原因不能为空",
          offset: 150
        });
        return false;
      } else if (!reg.test(_self.fix_data.value)) {
        _self.$message.error({
          message: "修正数据有误",
          offset: 150
        });
        _self.fix_data.value = "";
        return false;
      } else {
        _self.all_stock_data[_self.active_index].fix_weight =
          _self.fix_data.value;
        _self.all_stock_data[_self.active_index].fix_reason =
          _self.fix_data.msg;
        _self.fix_data = { value: "", msg: "" };
        _self.fix_status = false;
      }
    },
    post_data: function(_type) {
      console.log(_type);
      var _self = this;
      _self.$confirm("确认提交本次测量?").then(() => {
        var post_data = {};
        //0为出场时
        if (_type == 0) {
          post_data = {
            id: _self.stock_data.id,
            inout_type: _self.stock_data.historyRecord.inOutType,
            recycle_type: _self.stock_data.historyRecord.recycleType,
            weight_number: _self.remark
          };
        } else {
          post_data = {
            id: _self.stock_data.id,
            inout_type: _self.stock_type,
            recycle_type: _type,
            weight_number: _self.remark
          };
        }
        //判断是否有修改
        if (!_self.stock_data.fix_weight) {
        } else {
          post_data.fix_weight = _self.stock_data.fix_weight; //上传修改值
          post_data.fix_reason = _self.stock_data.fix_reason; //上传修改理由
        }
        axios_post_fd("/api/stock/stock_process", post_data).then(res => {
          if (res) {
            console.log(res);
            _self.all_stock_data[_self.active_index] = { id: false };
            if (_self.stock_status) {
              _self.active_index = _self.all_stock_data.one.id
                ? "one"
                : _self.all_stock_data.two.id
                ? "two"
                : _self.all_stock_data.three.id
                ? "three"
                : _self.all_stock_data.four.id
                ? "four"
                : null;
            }
            _self.search(1);
          }
        });
      });
    },
    //时间戳格式化
    time_format: function(req) {
      return time_format({ time: req });
    },
    //切换地磅
    indexClick: function(req) {
      this.get_stock(req);
    },
    //合计
    getSummaries: function(param) {
      var _self = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        switch (column.property) {
          case "rough_weight":
            sums[index] = _self.sums_data.rough_weight;
            break;
          case "tare_weight":
            sums[index] = _self.sums_data.tare_weight;
            break;
          case "net_weight":
            sums[index] = _self.sums_data.net_weight;
            break;
          default:
            break;
        }
      });
      return sums;
    }
  }
};
</script>

<style scoped>
.title_time {
  text-align: center;
}
.stock_table {
  /* border: 1px solid #ccc; */
  width: 100%;
}
.stock_table tr td {
  border: 1px solid #ccc;
  height: 35px;
  text-align: center;
}
</style>
