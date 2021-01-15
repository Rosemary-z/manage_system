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
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button type="primary" class="addBtn" size="mini">添加参数</el-button>
          <!-- 添加参数面板 -->
          <el-table :data="manyTabData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="success">添加tag</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamsById(scope.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">静态属性</el-tab-pane>
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
      activeName: "many", // 当前选中的tabName
      manyTabData: [], // 动态参数列表
      // addParamsForm:{
      //   //添加参数表单对象
      //   attr_id:'',// 参数id
      //   attr_name:'',// 参数名称
      // },
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
      this.getParamsData();
    },
    handleTabClick() {
      // tab被选中时获取参数数据列表
      this.getParamsData();
    },
    async getParamsData() {
      // 获取当前被选中的参数列表动态数据
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: "many" },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取动态参数列表失败");
      }
      this.manyTabData = res.data;
      console.log("动态参数", this.manyTabData);
    },
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
  },
};
</script>

<style lang="less" scoped>
.el-tabs,
.el-cascader {
  margin-top: 15px;
}
</style>
