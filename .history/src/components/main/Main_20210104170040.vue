<template>
  <div class="main">
    <HomePage></HomePage>
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
