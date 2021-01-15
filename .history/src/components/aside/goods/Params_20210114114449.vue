<template>
  <div class="params">
    <!-- 头部层级导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card>
      <!-- 信息区 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数" type="danger" left show-icon :closable="false">
    </el-card>
  </div>

</template>

<script>
export default {};
</script>

<style lang="less" scoped></style>
