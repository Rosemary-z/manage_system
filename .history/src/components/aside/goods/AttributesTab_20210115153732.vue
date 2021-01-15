<template>
  <div>
    <el-button
      type="primary"
      class="addBtn"
      size="mini"
      @click="addParams"
      :disabled="isBtnDisabled"
      >{{ activeTable.addType }}</el-button
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
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column :label="activeTable.tabLabel" prop="attr_name"></el-table-column>
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
                <el-button type="primary" @click="submitForm(scope.row)">确 定</el-button>
              </div>
            </el-dialog>
          </template>
        </el-table-column> -->
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
      tableType: {
        addType: "添加参数",
        editType: "编辑参数",
        tabLabel: "参数列表",
      }, // 动态渲染的不同的数据列表
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
  computed: {
    activeTable() {
      if (this.activeName == "many") {
        return (this.tableType = {
          addType: "添加参数",
          editType: "编辑参数",
          tabLabel: "参数列表",
        });
      } else if (this.activeName == "any")
        return (this.tableType = {
          addType: "添加属性",
          editType: "编辑属性",
          tableLabel: "属性列表",
        });
    },
    attr_id() {
      return this.$store.state.getAttr_Id.attr_id;
    },
  },
  created() {
    this.getParamsData();
    console.log(this.tableType);
  },
  methods: {
    //   触发父组件里的级联选择器变化函数

    async getParamsData() {
      // 获取表格绑定的数据数组
      if (this.attr_id) {
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
          //   item.inputVisible = false;
          // 文本框的输入值
          //   item.inputValue = "";
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
