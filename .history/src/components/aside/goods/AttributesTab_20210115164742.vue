<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      class="addBtn"
      size="mini"
      @click="addParams"
      :disabled="isBtnDisabled"
      >{{ addType }}</el-button
    >
    <!-- 添加参数面板 -->
    <el-table :data="tableData" border stripe>
      <!-- <el-table-column type="expand">
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
        </el-table-column> -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column :label="paramsLabel" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      //   btnType: "", // 子组件接收的来自父组件，应该渲染的btn类型为添加参数或者是添加属性
      tableData: [], // 表格面板绑定的数据数组
      addType: "添加参数", //设置add添加按钮的值
      editType: "", // 设置编辑输入框里的值
      paramsLabel: "参数名称", // 设置表格里参数列的label值
      message: {
        error: [
          "获取动态参数列表失败",
          "获取静态属性列表失败",
          "获取动态参数失败",
          "获取静态属性失败",
        ],
        success: [
          "获取动态参数列表成功",
          "获取静态属性列表成功",
          "获取动态参数成功",
          "获取静态属性成功",
        ],
      },
      isBtnDisabled: true,
    };
  },
  props: {
    activeName: String,
    // attr_id: Number,
  },
  watch: {
    activeName(newValue) {
      console.log(newValue);
      if (newValue) {
        this.getParamsData();
      }
      console.log(this.paramsLabel);
      // 监听activeName的变化，设置不同的button值
      if (newValue == "many") {
        this.addType = "添加参数";
        this.paramsLabel = "参数名称";
      } else {
        this.addType = "添加属性";
        this.paramsLabel = "属性名称";
      }
    },
    attr_id(newValue) {
      // 监听attr_id的值，如果有值，则取消button禁用状态，反之设置禁用
      if (newValue) {
        return (this.isBtnDisabled = false);
      }
      this.isBtnDisabled = true;
    },
  },
  computed: {
    attr_id() {
      return this.$store.state.getAttr_Id.attr_id;
    },
  },
  created() {
    this.getParamsData();
  },
  methods: {
    //   触发父组件里的级联选择器变化函数
    async getParamsData() {
      // 获取表格绑定的数据数组
      if (!this.attr_id) {
        // 如果没值，则清空数组
        this.tableData = [];
        this.getParamsData();
      }
      if (this.attr_id) {
        this.isBtnDisabled = false;
        // 如果父组件传过来的attr_id有值，则进行下一步
        // 按钮恢复可点击状态
        this.isBtnDisabled = false;
        // 获取当前被选中的参数列表动态数据
        const { data: res } = await this.$http.get(
          `categories/${this.attr_id}/attributes`,
          {
            params: { sel: this.activeName },
          }
        );
        if (res.meta.status !== 200) {
          return this.activeName == "many"
            ? this.$message.error(this.message[error][1])
            : this.$message.error(this.message[error][2]);
        }
        res.data.forEach((item) => {
          //   通过三元表达式判断attr_vals是否为空
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          // 控制文本框的显示与隐藏
          // item.inputVisible = false;
          // 文本框的输入值
          // item.inputValue = "";
        });
        this.tableData = res.data;
        console.log("当前获取的表格数据类型为" + this.activeName, this.tableData);
      }
    },
    addParams() {},
  },
};
</script>

<style lang="less" scoped></style>
