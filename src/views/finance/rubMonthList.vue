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
      <el-form-item label="电话">
        <el-input placeholder v-model="search_info.phone"></el-input>
      </el-form-item>
      <el-form-item label="核对状态">
        <el-select v-model="search_info.status">
          <el-option label="已核对" value="1"></el-option>
          <el-option label="未核对" value="0"></el-option>
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
        <template slot-scope="scope">{{ scope.row.carNumber }}</template>
      </el-table-column>
      <el-table-column label="运输人"> 
        <template slot-scope="scope">{{ scope.row.driverName }}</template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column prop="pureWeight" label="月净重(kg)"></el-table-column>
      <el-table-column label="月发生额(元)">
        <template slot-scope="scope">{{scope.row.occurAmount/100}}</template>
      </el-table-column>
      <el-table-column label="核对状态">
        <template
          slot-scope="scope"
        >{{scope.row.status==1?'已核对':scope.row.status==2?'已核算':scope.row.status==3?'已清账':'未核对'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row.id,{status:scope.row.status,carNumber:scope.row.carNumber,driverId:scope.row.driverId})"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: center;padding: 10px 0;">
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
          id: "",
          carNumber: "-",
          driverName: "-",
          phone: "-",
          pureWeight: "0",
          occurAmount: "0",
          status: "0"
        }
      ],
      total: 1,
      search_info: {
        offset: 1,
        limit: 10,
        time: "",
        phone: "",
        carNumber: "",
        driverName: "",
        status: "0"
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
        time: time_format({ time: null, format: "YY-MM" }),
        phone: this.search_info.phone,
        carNumber: this.search_info.carNumber,
        driverName: this.search_info.driverName,
        status: this.search_info.status
      };
      axios_post("/api/fi/rub/list", xxx).then(res => {
        if (res) {
          console.log(res);
          require.ensure([], () => {
            const { export_json_to_excel } = require("@/vendor/Export2Excel");
            const tHeader = [
              "车牌号",
              "运输人",
              "电话",
              "月净重(kg)",
              "月发生额(kg)",
              "核对状态"
            ]; // 对应表格输出的title
            const filterVal = [
              "carNumber",
              "driverName",
              "phone",
              "pureWeight",
              "occurAmount",
              "status"
            ]; // 对应表格输出的数据
            var list = JSON.parse(JSON.stringify(this.list));
            list = res.records;
            console.log(list);

            list.forEach(item => {
              item.occurAmount = item.occurAmount / 100;
              item.status =
                item.status == 1
                  ? "已核对"
                  : item.status == 2
                  ? "已核算"
                  : item.status == 3
                  ? "已清账"
                  : "未核对";
            });
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, "餐厨垃圾入库(月)"); // 对应下载文件的名字
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
      axios_post("/api/fi/rub/list", _self.search_info).then(res => {
        if (res) {
          // console.log(res);
          _self.list = res.records;
          _self.total = res.total;
        }
      });
    },
    handleEdit: function(_id, _info) {
      var _self = this;
      if (!_info.status) _info.status = "0";
      _self.$store.commit("finance_rub_month", { _id: _id }); //id
      _self.$store.commit("set_finance_info", _info); //状态
      _self.$store.commit("set_finance_month", {
        month: _self.search_info.time
      }); //月份
      _self.$router.push("/finance/rub/monthDetail");
    }
  }
};
</script>

<style>
</style>
