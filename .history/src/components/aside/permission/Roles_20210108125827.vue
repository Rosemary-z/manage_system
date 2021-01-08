<template>
  <div>
    <!-- 头部层级导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 中部内容卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col><el-button type="primary">添加角色</el-button></el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
                :class="['level1', i1 === 0 ? 'firstChild' : '', 'vtcenter']"
              >
                <!-- 第一列一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightsById(scope.row, item1.id)">
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 第二列二级权限 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                    :class="[i2 === 0 ? '' : 'firstChild', 'vtcenter']"
                  >
                    <el-col :span="6">
                      <el-tag
                        closable
                        type="success"
                        @close="removeRightsById(scope.row, item2.id)"
                      >
                        {{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        closable
                        type="warning"
                        v-for="(item3, i3) in item2.children"
                        :key="item3.id"
                        @close="removeRightsById(scope.row, item3.id)"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column width="50" label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="showSetRightsDialog(scope.row)"
              >操作</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 所有用户权限列表展示弹框 -->
    <el-dialog title="权限列表" :visible.sync="setRightsDialogVisible" width="50%">
      <!-- 树形权限空间 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightsDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      roleName: "",
      roleDesc: "",
      rightsList: [],
      // 用户权限对话框默认不展开
      setRightsDialogVisible: false,
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中的权限列表数组
      defKeys: [],
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        this.$message.error("获取用户列表数据失败");
      }
      this.roleList = res.data;
      console.log("用户列表数据", this.roleList);
    },
    // 用户删除权限弹框询问是否确定此操作
    async removeRightsById(role, rightId) {
      const removeResult = await this.$confirm("此操作将删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);

      if (removeResult != "confirm") {
        this.$message.info("删除已取消");
      } else {
        console.log("现在可以进行删除了");
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status != 200) {
          this.$message.error("删除用户权限失败");
        } else {
          this.$message.success("删除用户权限成功");
          // this.getRoleList(); //不建议这么做，因为会重新渲染整个页面，我们只需要赋值渲染这一部分数据即可
          role.children = res.data;
        }
      }
    },
    // 展示所有用户权限列表
    async showSetRightsDialog(role) {
      // 递归获取已有的三级权限
      this.defKeys = []; // 在调用函数前先清空数组
      this.getLeafKeys(role, this.defKeys);
      this.setRightsDialogVisible = true;
      // 请求用户权限列表数据
      const { data: res } = await this.$http.get("rights/tree");
      this.rightsList = res.data;
      console.log("用户权限列表", this.rightsList);
    },
    // 通过递归的形式获取角色下，所有三级权限的id，并保存到defKey中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        arr.push(node.id);
      } else {
        node.children.forEach((item) => this.getLeafKeys(item, arr));
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.level1 {
  border-bottom: 1px solid #eeeeee;
}
.firstChild {
  border-top: 1px solid #eeeeee;
}
.vtcenter {
  display: flex;
  align-items: center;
}
</style>
