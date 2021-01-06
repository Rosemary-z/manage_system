<template>
  <div>
    <!-- 头部层级导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格卡片区域 -->
    <el-card class="box-card">
      <!-- 头部搜索框、添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 头部搜索框 -->
            <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
              <!-- 添加用户按钮 -->
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 使用作用域插槽来获取本行的数据 -->
          <!-- @change="userStateChange(scope.row.mg_state)" change事件：switch开关状态发生变化所执行的回调函数 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 信息提示框包括button -->
            <el-tooltip
              effect="dark"
              content="分配用户角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input3: "", // 头部搜索框的值
      queryInfo: {
        // 获取用户列表携带的参数对象
        pagenum: 1, // 当前页
        pagesize: 5, // 每页显示条数
      },
      userList: [],
      total: 0, // 总共的用户数量
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
        console.log(this.userList, this.total);
      }
    },
    // 用户状态开启与关闭
    userStateChange(newValue) {
      console.log(111);
      console.log(newValue);
    },
  },
};
</script>

<style lang="less" scoped></style>
