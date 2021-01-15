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
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <AttributesTab :activeName="activeName" :ref="attributeTab" />
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <AttributesTab :activeName="activeName" :ref="attributeTab" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import AttributesTab from "@/components/aside/goods/AttributesTab";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    AttributesTab,
  },
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
      activeName: "many", // 当前选中的tabName
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
      console.log("所有参数列表", this.cateList);
    },
    handleChange() {
      // 级联选择器选择变化时触发的函数
      // this.getParamsData();
      this.$refs.attributeTab.getParamsData();
      this.$store.commit("getAttr_Id/getAttr_IdMut", this.selectedCateKeys[2]);
      if (this.selectedCateKeys.length !== 3) {
        // 如果不是选择的第三级，则清空selectedCateKeys数组
        this.selectedCateKeys = [];
        return;
      } else {
        this.$refs.attributeTab.getParamsData();
      }
    },
    handleTabClick() {
      // 标签页点击选择时重新刷新页面
      this.$refs.attributeTab.getParamsData();
      console.log(1233);
    },
    ...mapState({
      attr_id: (state) => state.getAttr_Id.attr_id,
    }),
  },
  computed: {},
  watch: {
    // 监听状态机中attr_id的变化，并将新值return
    attr_id(newValue) {
      if (newValue) {
        this.$store.commit("getAttr_Id/getAttr_IdMut", newValue);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-tabs,
.el-cascader {
  margin-top: 15px;
}
.el-tag {
  margin: 0 10px 0 0;
}
.input-new-tag {
  width: 100px;
}
</style>
