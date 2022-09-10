<template>
  <div class="container">
    <div class="left-bg"><img :src="imgSrc" alt="" srcset="" /></div>
    <div class="right-login-info">
      <div class="box">
        <div class="header">登录</div>
        <el-form class="form" :model="form" ref="ruleFormRef" :rules="rules">
          <el-form-item prop="account">
            <el-input
              class="input-class"
              v-model="form.account"
              autocomplete="on"
              clearable
              placeholder="用户名"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              class="input-class"
              type="password"
              v-model="form.password"
              show-password
              placeholder="密码"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><Unlock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="content">
              <dragVerify v-model:value="isVerifyPass"></dragVerify>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit-btn"
              @click="submitForm(ruleFormRef)"
              :loading="loading"
              :disabled="!isVerifyPass || loading"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import imgSrc from "@/assets/login-bg.png"
import { reactive, ref } from "vue"
import { ElIcon, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import { User, Unlock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import DragVerify from '@/components/DragVerify.vue'
import { login } from '@/utils/request'
import userStore from "@/store/userStore"

const userModel = userStore()

const ruleFormRef = ref()
const loading = ref(false)
const isVerifyPass = ref(false)
const router = useRouter()
const form = reactive({
  account: "",
  password: "",
});
const rules = reactive({
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { required: true, message: '请输入用户名', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { required: true, message: '请输入密码', trigger: 'change' },
  ],
})
const submitForm = async formEl => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      loading.value = true

      login(form).then(res => {
        loading.value = false
        userModel.updateUserInfo(res)
        router.replace('/')
      })
    }
  })
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  .left-bg {
    width: 45%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right-login-info {
    flex: 1;
    .box {
      width: 300px;
      position: relative;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      .header {
        font-size: 23px;
        font-weight: 600;
        color: #404040;
        letter-spacing: 3px;
        margin-bottom: 23px;
      }
    }
    .form {
      .input-class {
        border-bottom: 1px solid #D8DAE1;
        :deep(.el-input__wrapper) {
          box-shadow: none;
        }
      }
      .content {
        width: 100%;
      }
      .submit-btn {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>