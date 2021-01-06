<template>
  <div class="main">
    <HomePage :show="bool" ref="homePage"></HomePage>
    <!-- main主体顶部公共层级导航部分 -->
    <ul class="layered-navigation" :show="bool">
      <li class="home-page" @click="jumpTo">
        <router-link to="/homepage">首页</router-link>
      </li>
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
      // this.$router.push('/homepage')
      this.bool = true;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  padding-left: 20px;
  .layered-navigation {
    display: flex;
    font-size: 20px;
    color: #606266;
    padding: 20px 0;
    .home-page {
      font-weight: bold;
    }
    .el-icon-arrow-right {
      margin: 0 20px;
    }
  }
}
</style>
