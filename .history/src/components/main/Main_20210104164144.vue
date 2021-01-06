<template>
  <div class="main">
    <HomePage v-if="bool" ref="homePage"></HomePage>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <router-view v-if="!bool"></router-view>
  </div>
</template>

<script>
import Users from "../aside/user/Users";
import Rights from "../aside/permission/Rights";
import Roles from "../aside/permission/Roles";
import Categories from "../aside/goods/Categories";
import GoodsList from "../aside/goods/GoodsList";
import Params from "../aside/goods/Params";
import Orders from "../aside/order/Orders";
import Reports from "../aside/data/Reports";
import HomePage from "@/components/main/HomePage";
export default {
  data() {
    return {
      bool: false,
    };
  },
  components: {
    HomePage,
    Users,
    Rights,
    Roles,
    Categories,
    GoodsList,
    Params,
    Orders,
    Reports,
  },
  methods: {
    jumpTo() {
      this.bool = true;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  .layered-navigation {
    display: flex;
    font-size: 14px;
    color: #606266;
    .home-page {
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: #333333;
      }
    }
    .el-icon-arrow-right {
      margin: 0 10px;
    }
  }
}
</style>
