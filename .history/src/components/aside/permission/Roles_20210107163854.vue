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

      <el-table border stripe>
        <el-table-column type="index" width="50" label=">"></el-table-column>
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column prop="username" label="角色名称"></el-table-column>
        <el-table-column prop="email" label="角色描述"></el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="400">
          <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
          <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped></style>
