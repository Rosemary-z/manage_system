<template>
  <div>
    <el-menu
      :default-active="activePath"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#373d41"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <!-- :default-active="activePath" 默认激活的当前父菜单，参数为当前激活的路由路径 -->
      <!-- 一级菜单 -->
      <!-- 用户管理 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconObj[item.authName]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/' + itm.path" v-for="itm in item.children" :key="itm.id">
          <template slot="title">
            <i :class="iconObj[itm.authName]"></i>
            <span>{{ itm.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        用户管理: "el-icon-s-custom",
        用户列表: "el-icon-tickets",
        权限管理: "el-icon-unlock",
        角色列表: "el-icon-notebook-2",
        权限列表: "el-icon-set-up",
        商品管理: "el-icon-s-goods",
        商品列表: "el-icon-menu",
        分类参数: "el-icon-c-scale-to-original",
        商品分类: "el-icon-s-grid",
        订单管理: "el-icon-s-order",
        订单列表: "el-icon-menu",
        数据统计: "el-icon-s-marketing",
        数据报表: "el-icon-s-data",
      },
      activePath: "",
    };
  },
  created() {
    // 页面创建成功之后，调用函数发送请求，获取左侧菜单list数据
    this.getMenuList();
  },
  updated() {
    // 用户在导航栏切换路由时拿到的当前激活的路由路径
    this.activePath = this.$route.path;
  },
  computed: {
    activeTitle() {
      return this.$store.state.index.activeTitle;
    },
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      // 将获取到的菜单列表存储到本地的数据中
      if (res.meta.status !== 200) {
        this.$notify({
          title: "错误",
          message: res.meta.msg,
          type: "error",
        });
      }
      this.menuList = res.data;
      console.log(this.menuList);
    },
    // 点击子菜单选项，拿到path，跳转路由
    jumpTo(path) {
      this.$router.push(path);
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  margin-top: 20px;
  border: none;
}
</style>
