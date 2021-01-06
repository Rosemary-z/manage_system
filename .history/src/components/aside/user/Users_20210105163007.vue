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
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
              clearable
              @clear="getUserList"
            >
              <!-- 添加用户按钮 -->
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" border stripe>
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
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="180">
          <template>
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
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%">
        <!-- 内容主体区 表单-->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username" required>
            <el-input v-model="addForm.username" size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" required>
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" required>
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile" required>
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部操作区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('addFormRef')">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 添加用户表单验证规则定义
    // 1. 用户名验证规则
    var checkUserName = (rule, value, callback) => {
      // 非空验证
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      // 正则验证
      // var userNameReg = /^[a-zA-Z][a-zA-Z0-9_]{5,8}$/;
      var userNameReg = /^[a-zA-Z]\w{5,10}$/;
      if (!userNameReg.test(value)) {
        return callback(new Error("用户名为5-10位数字字母下划线组成，开头必须是字母"));
      }
    };
    // 2. 密码验证规则
    var checkPassWord = (rule, value, callback) => {
      // 非空验证
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      // 正则验证
      var checkPassReg = /^\d{6}$/;
      if (!checkPassReg.test(value)) {
        return callback(new Error("密码为6位数字"));
      }
    };
    // 3. 邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      // 非空验证
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      // 正则验证
      var checkEmailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!checkEmailReg.test(value)) {
        return callback(new Error("邮箱格式有误"));
      }
    };
    // 4. 手机号码验证规则
    var checkMobile = (rule, value, callback) => {
      // 非空验证
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      // 正则验证
      var checkMobileReg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
      if (!checkMobileReg.test(value)) {
        return callback(new Error("电话号码不合法"));
      }
    };
    return {
      searchInput: "", // 头部搜索框的值
      queryInfo: {
        // 搜索关键字
        query: "",
        // 获取用户列表携带的参数对象
        pagenum: 1, // 当前页
        pagesize: 2, // 每页显示条数
      },
      userList: [],
      total: 0, // 总共的用户数量
      // 添加用户弹框是否关闭
      dialogVisible: false,
      // 添加用户表单绑定的数据对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [{ validator: checkUserName, trigger: "blur" }],
        password: [{ validator: checkPassWord, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
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
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
        console.log(this.userList, this.total);
      }
    },
    // switch开关状态发生变化时执行的回调函数
    async userStateChange(userInfo) {
      // 设置用户新的状态
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        this.$message.error("更改用户状态失败");
      }
      this.$message.success("更改用户状态成功");
    },
    handleSizeChange(currentSize) {
      // size-change函数触发一个回调函数，拿到新的每页显示的条数值
      // 赋值  重新获取数据，渲染页面
      this.queryInfo.pagesize = currentSize;
      this.getUserList();
    },
    handleCurrentChange(currentPage) {
      // 拿到最新的当前页信息，重新获取数据，渲染页面
      this.queryInfo.pagenum = currentPage;
      this.getUserList();
    },
    // 表单提交验证
    submitForm(addForm) {
      this.dialogVisible = false;
      this.$refs[addFormRef].validate((valid) => {
        if (valid) {
          alert("已提交数据!");
        } else {
          console.log("错误提交!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
