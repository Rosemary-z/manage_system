<template>
  <div>
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
export default {
  components: {
    Users,
    Rights,
    Roles,
    Categories,
    GoodsList,
    Params,
    Orders,
    Reports,
  },
};
</script>

<style lang="less" scoped></style>
