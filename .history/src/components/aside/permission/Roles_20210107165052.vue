<template>
  <div>
    <!-- 头部层级导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 中部内容卡片区域 -->
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <!-- 表格区域 -->

      <el-table border stripe :data="roleList">
        <el-table-column type="index" width="50" label=">"></el-table-column>
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column prop="rolename" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="300">
          <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
          <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: {},
      roleName: "",
      roleDesc: "",
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        this.$message.error("获取用户列表数据失败");
      }
      this.roleList = res.data;
      console.log("用户列表数据", this.roleList);
    },
  },
};
</script>

<style lang="less" scoped></style>
