<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="search_info.time"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input placeholder v-model="search_info.carNumber"></el-input>
      </el-form-item>
      <el-form-item label="运输人">
        <el-input placeholder v-model="search_info.driverName"></el-input>
      </el-form-item>
      <el-form-item label="油脂类别">
        <el-select v-model="search_info.type">
          <el-option label="全部" value="0"></el-option>
          <el-option label="红油" value="2"></el-option>
          <el-option label="地沟油" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="核对状态">
        <el-select v-model="search_info.status">
          <el-option label="未核对" value="0"></el-option>
          <el-option label="已核对" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(1)">查询</el-button>
        <el-button type="success" icon="el-icon-download" @click="leadingOut()">导出数据</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border style="width: 100%" show-summary>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column label="车牌号">
        <template slot-scope="scope">{{scope.row.carNumber}}</template>
      </el-table-column>
      <el-table-column prop="pureWeight" label="月去杂净重(kg)"></el-table-column>
      <el-table-column label="月发生额(元)">
        <template slot-scope="scope">{{scope.row.occurAmount/100}}</template>
      </el-table-column>
      <el-table-column label="油脂类别">
        <template
          slot-scope="scope"
        >{{scope.row.categoryId==2?'红油':scope.row.categoryId==3?'地沟油':'餐厨垃圾'}}</template>
      </el-table-column>
      <el-table-column label="核对状态">
        <template slot-scope="scope">{{!scope.row.status||scope.row.status==0?'未核对':'已核对'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row.id,{occurAmount:scope.row.occurAmount,pureWeight:scope.row.pureWeight,status:scope.row.status,time:search_info.time,carNumber:scope.row.carNumber,driverName:scope.row.driverName,phone:scope.row.phone,type:scope.row.categoryId})"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination
        :total="total"
        background
        :current-page="search_info.offset"
        @current-change="search"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { axios_post } from "@/api/main";
import { time_format } from "@/lib/tools";
export default {
  data() {
    return {
      list: [
        {
          time: "",
          mobile: "",
          id: "",
          warehouse_number: "",
          net_weight: "",
          license_plate_number: "",
          net_weight_without_impurity: ""
        }
      ],
      total: 1,
      search_info: {
        offset: 1,
        limit: 10,
        time: "",
        type: "0",
        status: "0",
        carNumber: "",
        driverName:""
      }
    };
  },
  created() {
    //获取当前月
    this.search_info.time = time_format({ time: null, format: "YY-MM" });
  },
  mounted() {
    var _self = this;
    _self.search(1);
  },
  methods: {
    // 导出
    leadingOut() {
     var xxx = {
        offset: 1,
        limit: this.total,
        time: this.search_info.time,
        type: this.search_info.type,
        status: this.search_info.status,
        carNumber: this.search_info.carNumber,
        driverName: this.search_info.driverName
      };
      axios_post("/api/fi/oil/list", xxx).then(res => {
        if (res) {
			console.log(res)
          require.ensure([], () => {
            const { export_json_to_excel } = require("@/vendor/Export2Excel");
            const tHeader = [
              "车牌号",
              "月去杂净重(kg)",
              "月发生额(元)",
              "油脂类别",
              "核对状态"
            ]; // 对应表格输出的title
            const filterVal = [
              "carNumber",
              "pureWeight",
              "occurAmount",
              "categoryId",
              "status"
            ]; // 对应表格输出的数据
            var list = JSON.parse(JSON.stringify(this.list));
            list = res.records;

            list.forEach(item => {
              item.occurAmount = item.occurAmount / 100;
              item.categoryId =
                item.categoryId == 2
                  ? "红油"
                  : item.categoryId == 3
                  ? "地沟油"
                  : "餐厨垃圾";
              item.status =
                !item.status || item.status == 0 ? "未核对" : "已核对";
            });
            console.log(list);
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "餐厨油脂出库(月)"); // 对应下载文件的名字
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
        _self.search_info.offset = currentPage;
      }
      axios_post("/api/fi/oil/list", _self.search_info).then(res => {
        if (res) {
          _self.list = res.records;
          _self.total = res.total;
        }
      });
    },
    handleEdit: function(_id, _info) {
      var _self = this;
      _self.$store.commit("finance_gre_month", { _id: _id });
      _self.$store.commit("set_finance_info", _info);
      _self.$router.push("/finance/gre/monthDetail");
    }
  }
};
</script>

<style>
</style>
