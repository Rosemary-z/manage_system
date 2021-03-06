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
          <el-button
            type="primary"
            class="addBtn"
            size="mini"
            @click="addParams"
            :disabled="isBtnDisabled"
            >添加参数</el-button
          >
          <!-- 添加参数面板 -->
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamsById(scope.row)"
                ></el-button>
                <el-dialog :visible.sync="addDialogVisible">
                  <el-form
                    ref="addParamsFormRef"
                    :model="addParamsForm"
                    :rules="addParamsFormRules"
                  >
                    <el-form-item
                      :label="handleParamsType"
                      prop="attr_name"
                      label-width="100px"
                    >
                      <el-input v-model="addParamsForm.attr_name"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm(scope.row)"
                      >确 定</el-button
                    >
                  </div>
                </el-dialog>
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
      onlyTabData: [], // 静态参数列表
      addParamsForm: {
        //添加参数表单对象
        attr_name: "", // 参数名称
      },
      addParamsFormRules: {
        attr_name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
      },
      addDialogVisible: false, // 添加参数对话框默认关闭
      isBtnDisabled: true, //添加按钮默认禁用
      handleParamsType: "", //默认弹出的编辑参数的对话框显示的label
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
      this.getParamsData();
    },
    handleTabClick() {
      // tab被选中时获取参数数据列表
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        // 清空表格数据
        this.manyTabData = [];
        this.onlyTabData = [];
        return;
      }
      this.isBtnDisabled = false;
      // 获取当前被选中的参数列表动态数据
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      res.data.forEach((item) => {
        //   通过三元表达式判断attr_vals是否为空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框的输入值
        item.inputValue = "";
      });
      if (this.activeName === "many") {
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
      console.log("参数列表", res);
    },
    handleClose(index, row) {
      // 关闭标签触发的函数，删除当前tag
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
    showInput(row) {
      // 键盘按下事件，展示input输入框并自动获取焦点
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(row) {
      // 去除空格
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // input输入框失去焦点时，拿到用户输入的值，并且新增属性tag
      row.attr_vals.push(row.inputValue.trim());
      row.inputVisible = false;
      row.inputValue = "";
      // 拿到修改后的属性数组，发起请求，保存到数据库
      this.saveAttrVals(row);
    },
    async saveAttrVals(row) {
      let changedRowData = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" "),
      };
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        changedRowData
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数失败");
      }
      this.$message.success("修改参数成功");
    },
    addParams() {
      // 点击添加参数按钮触发的函数
      // 弹出对话框
      this.handleParamsType = "添加参数";
      this.addDialogVisible = true;
    },
    submitForm(row) {
      // 判断用户是在编辑还是添加参数，触发不同的表单校验
      if (this.handleParamsType == "添加参数") {
        // 添加表单提交验证
        this.$refs.addParamsFormRef.validate(async (valid) => {
          console.log(this.addParamsForm.attr_name);
          if (!valid) return;
          const { data: res } = await this.$http.post(
            `categories/${this.getCateId}/attributes`,
            {
              attr_name: this.addParamsForm.attr_name,
              attr_sel: this.activeName,
            }
          );
          if (res.meta.status !== 201) {
            return this.$message.error("添加参数失败");
          }
          this.$message.success("添加参数成功");
          this.$refs.addParamsFormRef.resetFields();
          this.getParamsData();
          this.addDialogVisible = false;
        });
      } else if (this.handleParamsType == "编辑参数") {
        this.$refs.addParamsFormRef.validate(async (valid) => {
          if (!valid) return;
          if (this.addParamsForm.attr_name == row.attr_name) {
            return this.$message.error(
              "修改的参数名和原始参数名一样，请重新输入或点击取消"
            );
          }
          // row.attr_name == this.addParamsForm.attr_name;
          // console.log(row.attr_name);
          // console.log(this.addParamsForm.attr_name);
          const { data: res } = await this.$http.put(
            `categories/${this.getCateId}/attributes/${row.attr_id}`,
            {
              attr_name: this.addParamsForm.attr_name,
              attr_sel: row.attr_sel,
              attr_vals: row.attr_vals.join(" "),
            }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("修改参数失败");
          }
          this.$message.success("修改参数成功");
          this.$refs.addParamsFormRef.resetFields();
          this.addDialogVisible = false;
          this.getParamsData();
        });
      }
    },
    showEditDialog(row) {
      // 点击编辑按钮触发的函数
      // 弹出对话框，可以修改参数名
      this.handleParamsType = "编辑参数";
      this.addDialogVisible = true;
      // 拿到此行的参数名称,并设置初始值给input输入框
      this.addParamsForm.attr_name = row.attr_name;
      // 用户修改之后，提交表单,修改参数名称
    },
    async removeParamsById(row) {
      const { data: res } = await this.$http.delete(
        ` categories/${this.getCateId}/attributes/${row.attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败");
      }
      console.log(res);
      this.$message.error("删除参数成功");
      this.getParamsData();
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
.el-tag {
  margin: 0 10px 0 0;
}
.input-new-tag {
  width: 100px;
}
</style>
