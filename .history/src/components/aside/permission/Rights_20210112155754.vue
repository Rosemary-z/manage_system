<template>
  <div>
    <!-- 头部层级导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 中部内容卡片区域 -->
    <el-card class="box-card">
      <!-- 表格区域 -->
      <el-table :data="rightsList" stripe border style="width: 100%">
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-button plain>{{
              scope.row.level == levelType.level ? levelType.level : ""
            }}</el-button>
          </template>
          <!-- <el-button type="primary" plain>一级</el-button> -->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      levelType: [
        { level: 1, colorType: "primary", value: "一级" },
        { level: 2, colorType: "success", value: "二级" },
        { level: 3, colorType: "warning", value: "三级" },
      ],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      let { data: res } = await this.$http.get("rights/list");
      console.log("所有权限列表", res);
      this.rightsList = res.data;
      if (res.meta.status != 200) {
        return this.$message.error("获取权限列表失败");
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
