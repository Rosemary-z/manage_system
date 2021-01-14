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
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
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
