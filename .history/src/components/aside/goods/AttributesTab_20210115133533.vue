<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <AttributeTab :activeName="activeName" :attr_id="getCateId" />
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only"> </el-tab-pane>

      <el-button
        type="primary"
        class="addBtn"
        size="mini"
        @click="addParams(activeName)"
        :disabled="isBtnDisabled"
        >{{ activeTable.addType }}</el-button
      >
      <!-- 添加参数面板 -->
      <el-table
        :data="tableData"
        border
        stripe
        :activeName="activeName"
        :attr_id="attr_id"
      >
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
        </el-table-column>
      </el-table>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnType: "", // 子组件接收的来自父组件，应该渲染的btn类型为添加参数或者是添加属性
      tableData: [], // 表格面板绑定的数据数组
      activeName: "", // 当前激活的标签页name
      tableType: [], // 动态渲染的不同的数据列表
      attr_id: "",
      message: {
        error: [
          this.$message.error("获取动态参数列表失败"),
          this.$message.error("获取静态属性列表失败"),
          this.$message.error("获取动态参数失败"),
          this.$message.error("获取静态属性失败"),
        ],
        success: [
          this.$message.success("获取动态参数列表成功"),
          this.$message.success("获取静态属性列表成功"),
          this.$message.success("获取动态参数成功"),
          this.$message.success("获取静态属性成功"),
        ],
      },
    };
  },
  props: {
    activeName: String,
    attr_id: Number,
  },
  created() {
    this.getParamsData(this.activeName);
  },
  computed: {
    activeTable() {
      if (this.activeName == "many") {
        return (this.tableData = {
          addType: "添加参数",
          editType: "编辑参数",
          tabLabel: "参数列表",
        });
      } else if (this.activeName == "any")
        return (this.tableData = {
          addType: "添加属性",
          editType: "编辑属性",
          tableLabel: "属性列表",
        });
    },
  },
  methods: {
    async getParamsData(activeName, activeId) {
      // 获取表格绑定的数据数组
      if (activeId) {
        // 如果父组件传过来的attr_id有值，则进行下一步
        // 按钮恢复可点击状态
        this.isBtnDisabled = false;
        // 获取当前被选中的参数列表动态数据
        const { data: res } = await this.$http.get(
          `categories/${this.activeId}/attributes`,
          {
            params: { sel: this.activeName },
          }
        );
        if (res.meta.status !== 200) {
          return activeName == "many"
            ? this.$message.error("获取动态参数失败")
            : this.$message.error("获取静态属性失败");
        }
        res.data.forEach((item) => {
          //   通过三元表达式判断attr_vals是否为空
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          // 控制文本框的显示与隐藏
          item.inputVisible = false;
          // 文本框的输入值
          item.inputValue = "";
        });
        this.tableData = res.data;
        console.log("当前获取的表格数据类型为" + activeName, res);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
