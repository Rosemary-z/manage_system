<template>
  <div>
    <!-- 头部层级导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 中部内容卡片区域 -->
    <el-card class="box-card">
      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe border style="width: 100%">
        <el-table-column type="index" width="30" label="#"></el-table-column>
        <el-table-column prop="goods_name" width="600" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          width="100"
          label="商品价格（元）"
        ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="upd_time" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        // 获取用户列表携带的参数对象
        pagenum: 1, // 当前页
        pagesize: 5, // 每页显示条数
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      let { data: res } = await this.$http.get("goods", { params: this.queryInfo });
      console.log("商品列表", res);
      this.goodsList = res.data.goods;
      if (res.meta.status != 200) {
        return this.$message.error("获取商品列表失败");
      }
    },
    // changeLevel(data) {
    //   console.log(data);
    //   if (data == 0) {
    //     this.levelType = "primary";
    //   }
    //   if (data == 1) {
    //     this.levelType = "success";
    //   }
    //   if (type == 2) {
    //     this.levelType = "warning";
    //   }
    // },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.level1 {
  border-bottom: 1px solid #eeeeee;
}
.firstChild {
  border-top: 1px solid #eeeeee;
}
.vtcenter {
  display: flex;
  align-items: center;
}
</style>
