<template>
  <div style="text-align: center; margin: 0 20px">
    <div style="margin-top: 100px">
      <div style="font-size: 25px; font-weight: bold">注册新用户</div>
      <div style="font-size: 14px; color: grey">
        欢迎注册会议室预订系统，请在下方填写相关信息
      </div>
    </div>
    <div style="margin-top: 50px">
      <el-form
        :model="form"
        :rules="rules"
        @validate="onValidate"
        ref="formRef"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            :maxlength="8"
            type="text"
            placeholder="用户名"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            :maxlength="16"
            type="password"
            placeholder="密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password_repeat">
          <el-input
            v-model="form.password_repeat"
            :maxlength="16"
            type="password"
            placeholder="重复密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="电子邮件地址"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="role">
          <el-select v-model="form.role" placeholder="请选择用户类型">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="客户" value="customer"></el-option>
            <el-option label="员工" value="employee"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="17">
              <el-input
                v-model="form.code"
                :maxlength="6"
                type="text"
                placeholder="请输入验证码"
              >
                <template #prefix>
                  <el-icon><EditPen /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-button
                type="success"
                @click="validateEmail"
                :disabled="!isEmailValid || coldTime > 0"
              >
                {{ coldTime > 0 ? "请稍后 " + coldTime + " 秒" : "获取验证码" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        
      </el-form>
    </div>
    <div style="margin-top: 80px">
      <el-button style="width: 270px" type="warning" @click="register" plain
        >立即注册</el-button
      >
    </div>
    <div style="margin-top: 20px">
      <span style="font-size: 14px; line-height: 15px; color: grey"
        >已有账号?
      </span>
      <el-link
        type="primary"
        style="translate: 0 -2px"
        @click="router.push('/')"
        >立即登录</el-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditPen, Lock, Message, User } from "@element-plus/icons-vue";
import router from "@/router";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { get, post } from "@/api/auth";

// 定义表单数据类型
interface Form {
  username: string;
  password: string;
  password_repeat: string;
  email: string;
  code: string;
  role: string;
}

// 表单数据
const form = reactive<Form>({
  username: "",
  password: "",
  password_repeat: "",
  email: "",
  code: "",
  role: "",
});

// 表单验证规则
const validateUsername = (
  rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
    callback(new Error("用户名不能包含特殊字符，只能是中文/英文"));
  } else {
    callback();
  }
};

const validatePassword = (
  rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== form.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { validator: validateUsername, trigger: ["blur", "change"] },
    {
      min: 2,
      max: 8,
      message: "用户名的长度必须在2-8个字符之间",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 16,
      message: "密码的长度必须在6-16个字符之间",
      trigger: ["blur", "change"],
    },
  ],
  password_repeat: [
    { validator: validatePassword, trigger: ["blur", "change"] },
  ],
  email: [
    { required: true, message: "请输入邮件地址", trigger: "blur" },
    {
      type: "email",
      message: "请输入合法的电子邮件地址",
      trigger: ["blur", "change"],
    },
  ],
  code: [{ required: true, message: "请输入获取的验证码", trigger: "blur" }],
  role: [{ required: true, message: "请选择用户类型", trigger: "change" }],
};

// 引用和状态
const formRef = ref<InstanceType<typeof import("element-plus")["ElForm"]>>();
const isEmailValid = ref(false);
const coldTime = ref(0);

// 验证表单字段
const onValidate = (prop: string, isValid: boolean) => {
  if (prop === "email") isEmailValid.value = isValid;
};

// 注册函数
const register = () => {
  formRef.value?.validate((isValid) => {
    if (isValid) {
      post(
        "/api/auth/register",
        {
          username: form.username,
          password: form.password,
          email: form.email,
          code: form.code,
          role: form.role,
        },
        () => {
          ElMessage.success("注册成功，请等待管理员审核");
          router.push("/");
        }
      );
    } else {
      ElMessage.warning("请完整填写注册表单内容！");
    }
  });
};

// 验证邮箱并获取验证码
const validateEmail = () => {
  coldTime.value = 60;
  get(
    `/api/auth/ask-code?email=${form.email}&type=register`,
    () => {
      ElMessage.success(`验证码已发送到邮箱: ${form.email}，请注意查收`);
      const handle = setInterval(() => {
        coldTime.value--;
        if (coldTime.value === 0) {
          clearInterval(handle);
        }
      }, 1000);
    },
    (message) => {
      ElMessage.warning(message);
      coldTime.value = 0;
    }
  );
};
</script>

<style scoped></style>
