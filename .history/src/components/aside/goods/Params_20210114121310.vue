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
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        left
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 级联选择器 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页 -->
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="0">动态参数</el-tab-pane>
        <el-tab-pane label="静态属性" name="1">静态属性</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      //   级联选择框的配置对象
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //   级联选择框双向绑定对象
      selectedCateKeys: [],
      activeIndex: "0", // 当前选中的tabName
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      // 获取商品分类列表
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.cateList = res.data;
      console.log("商品列表", this.cateList);
    },
    handleChange(value) {
      // 级联选择器选择变化时触发的函数
      console.log(value);
    },
    handleClick() {
      // tab被选中时触发
    },
  },
};
</script>

<style lang="less" scoped>
.el-tabs,
.el-cascader {
  margin-top: 15px;
}
</style>
