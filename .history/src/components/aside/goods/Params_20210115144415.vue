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
      <AttributesTab :activeName="activeName" :attr_id="getCateId" />
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
      this.$store.commit("getAttr_Id/getAttr_IdMut", this.getCateId);
    },
    ...mapMutations({
      getAttr_IdMut: "getAttr_Id/getAttr_IdMut",
    }),
  },
  computed: {
    // 获取级联选择器当前选中的参数id
    getCateId() {
      if (this.selectedCateKeys.length === 3) {
        // 如果数组长度为3，证明用户选择了第三级菜单，将参数id return
        return this.selectedCateKeys[2];
      }
      return null;
    },

    ...mapState({
      attr_id: (state) => state.getAttr_Id.attr_id,
    }),
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
