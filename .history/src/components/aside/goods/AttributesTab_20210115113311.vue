<template>
  <div>
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
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnType: "",
    };
  },
  created() {},
  methods: {},
  computed() {},
};
</script>

<style lang="less" scoped></style>
