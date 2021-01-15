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
      <el-table-column :label="paramsLabel" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-dialog :visible.sync="addDialogVisible">
            <el-form
              ref="addParamsFormRef"
              :model="addParamsForm"
              :rules="addParamsFormRules"
            >
              <el-form-item :label="editType" prop="attr_name" label-width="100px">
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
          "修改动态参数失败",
          "修改静态属性失败",
        ],
        success: [
          "获取动态参数列表成功",
          "获取静态属性列表成功",
          "修改动态参数成功",
          "修改静态属性成功",
        ],
      },
      isBtnDisabled: true,
      addParamsForm: {
        //添加参数表单对象
        attr_name: "", // 参数名称
      },
      addParamsFormRules: {
        attr_name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
      },
      addDialogVisible: false, // 添加参数对话框默认关闭
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
        this.editType = "编辑参数";
      } else {
        this.addType = "添加属性";
        this.paramsLabel = "属性名称";
        this.editType = "编辑属性";
      }
    },
    attr_id(newValue) {
      this.getParamsData(); // 在这里触发页面渲染函数，好处是，不会有延迟，因为只要状态机里的attr_id被监听，就可以及时执行
      // 监听attr_id的值，如果有值，则取消button禁用状态，反之设置禁用
      if (newValue) {
        return (this.isBtnDisabled = false);
      }
      this.isBtnDisabled = true;
      this.tableData = [];
    },
  },
  computed: {
    attr_id() {
      return this.$store.state.getAttr_Id.attr_id;
    },
  },
  created() {
    // this.getParamsData();
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
          // item.inputVisible = false;
          // 文本框的输入值
          // item.inputValue = "";
        });
        this.tableData = res.data;
        console.log("当前获取的表格数据类型为" + this.activeName, this.tableData);
      }
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
    addParams() {
      this.addDialogVisible = true;
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.attr_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.activeName == "many"
          ? this.$message.error(this.message[error][3])
          : this.$message.error(this.message[error][4]);
      }
      return this.activeName == "many"
        ? this.$message.success(this.message[success][3])
        : this.$message.success(this.message[success][4]);
    },
    // 根据Id删除对应的参数项
    async removeParams(attrId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该属性/参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.getCateId}/attributes/${attrId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败！");
      }
      this.$message.success("删除成功！");
      this.getParamsData();
    },
    // 点击按钮显示输入框
    showInput(row) {
      row.inputVisible = true;
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 修改参数
    editParams() {
      this.$refs.editFromRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.attr_id}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          return this.activeName == "many"
            ? this.$message.error(this.message[error][3])
            : this.$message.error(this.message[error][4]);
        }
        return this.activeName == "many"
          ? this.$message.success(this.message[success][3])
          : this.$message.success(this.message[success][4]);
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    showEditDialog(row) {
      // 点击编辑按钮触发的函数
      // 弹出对话框，可以修改参数名
      this.editType = "编辑参数";
      this.addDialogVisible = true;
      // 拿到此行的参数名称,并设置初始值给input输入框
      this.addParamsForm.attr_name = row.attr_name;
      // 用户修改之后，提交表单,修改参数名称
    },
    submitForm(row) {
      // 判断用户是在编辑还是添加参数，触发不同的表单校验
      if (this.editType == "添加参数") {
        // 添加表单提交验证
        this.$refs.addParamsFormRef.validate(async (valid) => {
          console.log(this.addParamsForm.attr_name);
          if (!valid) return;
          this.saveAttrVals();
        });
        if (this.editType == "编辑参数") {
          this.$refs.addParamsFormRef.validate(async (valid) => {
            if (!valid) return;
            if (this.addParamsForm.attr_name == row.attr_name) {
              return this.$message.error(
                "修改的参数名和原始参数名一样，请重新输入或点击取消"
              );
            }
            this.saveAttrVals();
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 0 10px 0 0;
}
.input-new-tag {
  width: 100px;
}
</style>
