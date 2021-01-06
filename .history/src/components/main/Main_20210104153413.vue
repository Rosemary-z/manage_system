<template>
  <div class="main">
    <HomePage v-if="bool" ref="homePage"></HomePage>
    <!-- main主体顶部公共层级导航部分 -->
    <ul class="layered-navigation" v-else-if="!bool">
      <li class="home-page" @click="jumpTo">首页</li>
      <li>
        <span class="el-icon-arrow-right"></span>
        <span class="level level1">一级标题</span>
      </li>
      <li>
        <span class="el-icon-arrow-right"></span>
        <span class="level level2">二级标题</span>
      </li>
    </ul>
    <router-view></router-view>
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
    }
    .el-icon-arrow-right {
      margin: 0 10px;
    }
  }
}
</style>
