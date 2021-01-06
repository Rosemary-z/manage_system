<template>
  <div>
    <!-- 头部层级导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top: 15px"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input3: "", // 头部搜索框的值
      queryInfo: {
        // 获取用户列表携带的参数对象
        pagenum: 1, // 当前页
        pagesize: 5, // 每页显示条数
      },
      userList: [],
      total: 0, // 总共的用户数量
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
      } else {
        (this.userList = res.data), users;
        this.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
