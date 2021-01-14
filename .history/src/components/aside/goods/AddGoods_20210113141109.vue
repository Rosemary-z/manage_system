<template>
  <div>
    <!-- 顶部提示息区 -->
    <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
    </el-alert>
    <!-- 步骤条 -->
    <el-steps :space="200" :active="1" finish-status="success">
      <el-step title="已完成"></el-step>
      <el-step title="进行中"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped></style>
