<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="search_info.create_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input placeholder v-model="search_info.plate_number"></el-input>
      </el-form-item>
      <el-form-item label="运输人">
        <el-input placeholder v-model="search_info.driver"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input placeholder v-model="search_info.phone"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select value="0" v-model="search_info.invoice_status">
          <el-option label="全部" value></el-option>
          <el-option label="已开票" value="0"></el-option>
          <el-option label="未开票" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border show-summary>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column label="入库时间">
        <template slot-scope="scope">{{ time_format(scope.row.create_time) }}</template>
      </el-table-column>
      <el-table-column label="出入库编号">
        <template slot-scope="scope">{{ scope.row.sn }}</template>
      </el-table-column>
      <el-table-column label="车牌号">
        <template slot-scope="scope">{{ scope.row.plate_number }}</template>
      </el-table-column>
      <el-table-column label="运输人">
        <template slot-scope="scope">{{ scope.row.driver }}</template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column prop="weight" label="台账总量"></el-table-column>
      <el-table-column prop="net_weight" label="净重(kg)"></el-table-column>
      <el-table-column label="单价(元)">
        <template slot-scope="scope">{{ scope.row.trash_price/100 }}</template>
      </el-table-column>
      <el-table-column label="发生额(元)">
        <template
          slot-scope="scope"
        >{{ (scope.row.trash_price*scope.row.net_weight/100).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :total="total"
        background
        :current-page="search_info.page"
        @current-change="search"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { axios_get } from "@/api/main";
import { time_format } from "@/lib/tools.js";
export default {
  data() {
    return {
      list: [
        {
          driver_id: "",
          create_time: "",
          rough_weight: "",
          weight: "",
          net_weight: "",
          standingBooks: [],
          tare_weight: "",
          driver: "",
          phone: "",
          id: "4",
          sn: "",
          trash_price:'',
          totalMoney:'',
          plate_number: "",
          invoice_status: 0
        }
      ],
      total: 0,
      search_info: {
        page: 1,
        limit: 10,
        create_time: "",
        phone: "",
        plate_number: "",
        driver: "",
        invoice_status: ""
      }
    };
  },
  mounted() {
    var _self = this;
    _self.search(1);
  },
  methods: {
    // 导出
    leadingOut() {
      var xxx = {
        page: 1,
        limit: this.total,
        create_time: this.search_info.create_time,
        phone: this.search_info.phone,
        plate_number: this.search_info.plate_number,
        driver: this.search_info.driver,
        invoice_status: this.search_info.invoice_status
      };
      axios_get("api/fi/rubbish_day", xxx).then(res => {
        if (res) {
          require.ensure([], () => {
            const { export_json_to_excel } = require("@/vendor/Export2Excel");
            const tHeader = [
              "入库时间",
              "出入库编号",
              "车牌号",
              "运输人",
              "手机号",
              "台账总量",
              "净重(kg)",
              "单价(元)",
              "发生额(元)"
            ]; // 对应表格输出的title
            const filterVal = [
              "create_time",
              "sn",
              "plate_number",
              "driver",
              "phone",
              "weight",
              "net_weight",
              "trash_price",
              "totalMoney"
            ]; // 对应表格输出的数据
            var list = JSON.parse(JSON.stringify(this.list));
            list = res.list;
            console.log(list);
            list.forEach(item => {
              item.create_time = this.time_format(item.create_time);
              item.trash_price = item.trash_price / 100;
              item.totalMoney = (
                (item.trash_price * item.net_weight) 
              ).toFixed(2);
            });
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "餐厨油脂出库(日)"); // 对应下载文件的名字
          });
        }
      });
    },
    formatJson: function(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    search: function(currentPage) {
      var _self = this;
      if (currentPage) {
        _self.search_info.page = currentPage;
      }
      axios_get("api/fi/rubbish_day", _self.search_info).then(res => {
        if (res) {
          _self.list = res.list;
          _self.total = res.totalCount;
        }
      });
    },
    handleEdit: function(_id) {
      this.$store.commit("finance_rub_day", { _id: _id });
      this.$router.push("/finance/rub/dayDetail");
    },
    //时间戳格式化
    time_format: function(req) {
      return time_format({ time: req });
    }
    //合计
    // getSummaries:function(param){
    //   var _self = this
    //   const { columns, data } = param;
    //   const sums = [];
    //   columns.forEach((column, index) => {
    //     if (index === 0) {
    //       sums[index] = '总计';
    //       return;
    //     }
    //     switch(column.property) {
    //       case "weight":
    //       sums[index] = _self.sums_data.weight
    //       break;
    //       case "totalMoney":
    //       sums[index] = _self.sums_data.totalMoney
    //       break;
    //       case "net_weight":
    //       sums[index] = _self.sums_data.net_weight
    //       break;
    //       default:
    //       break;
    //     }
    //   });
    //   return sums;
    // }
  }
};
</script>

<style>
</style>
