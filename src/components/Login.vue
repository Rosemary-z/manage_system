<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="avatar" />
      </div>
      <!-- 登录表单 -->
      <div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="60px"
          class="login_form"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="iconfont icon-user"
              @focus="changeInputStyle"
              ref="inputBox"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              prefix-icon="iconfont icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login" :disabled="loginDisabled"
              >登录</el-button
            >
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginDisabled: true,
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "submit" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "submit" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "submit" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "submit" },
        ],
      },
      menuList: [],
      routeList: ["home", "login", "homepage"], // 可访问的路由列表
      childRoute: [],
    };
  },
  watch: {
    loginForm: {
      // 监听登录表单对象，如果对象里面的值都不为空，则解除禁用，反之设置禁用
      handler(newValue) {
        if (newValue.username && newValue.password) {
          this.loginDisabled = false;
        } else {
          this.loginDisabled = true;
        }
      },
      deep: true,
      // immediate: true,
    },
  },
  methods: {
    // 表单重置按钮
    resetLoginForm() {
      // console.log(this)
      // resetFields：element-ui提供的表单方法
      this.$refs.loginFormRef.resetFields();
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      // 将获取到的菜单列表存储到本地的数据中
      if (res.meta.status !== 200) {
        this.$notify({
          title: "错误",
          message: res.meta.msg,
          type: "error",
        });
      }
      this.menuList = res.data;
      // console.log("当前用户能查看的菜单列表", res.data);
      this.menuList.forEach((item) => {
        if (!item.children) {
          this.routeList.push(item.path);
        } else {
          item.children.forEach((itm) => {
            this.childRoute.push(itm.path);
          });
        }
      });
      this.routeList = [...this.routeList, ...this.childRoute];
      // console.log("一维路由访问列表", this.routeList);
      // sessionStorage.setItem("permissionList", this.routeList);
      // console.log(sessionStorage.getItem("permissionList"));
    },
    login() {
      // 表单预验证
      // valid：bool类型
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return false;
        // this.$http.post('login', this.loginForm): 返回值为promise
        // 返回值为promise，可加await简化操作 相应的也要加async
        const { data: res } = await this.$http.post("login", this.loginForm);
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$notify({ title: "错误", type: "error", message: res.meta.msg });
        this.$notify({ title: "成功", type: "success", message: res.meta.msg });
        this.getMenuList();
        // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
        //   1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        window.sessionStorage.setItem("username", res.data.username);
        // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
        this.$router.replace("/home");
      });
    },
    changeInputStyle() {
      this.$refs.inputBox.className = "inputBox";
    },
  },
};
</script>

<style lang="less" scoped>
/* // lang="less" 支持less格式
// scoped vue的指令，只在当前组件生效 */
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 360px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 60px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
.info {
  font-size: 13px;
  margin: 10px 15px;
}

/deep/.el-input__inner:focus {
  border: 1px solid #41b883;
  // box-shadow: 0px 0px 4px 4px #41b883;
  animation: change 0.5s;
}
@keyframes change {
  0% {
    box-shadow: none;
  }
  100% {
    box-shadow: 0px 0px 20px 0px #86c9c6;
  }
}
</style>
