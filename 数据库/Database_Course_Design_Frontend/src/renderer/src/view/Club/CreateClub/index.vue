<template>
  <div class="app-view">
    <h2>创建社团</h2>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="club-form">
      <!-- 社团名称 -->
      <el-form-item label="社团名称" prop="clubName">
        <el-input v-model="form.clubName" placeholder="请输入社团名称" />
      </el-form-item>

      <!-- 社团简介 -->
      <el-form-item label="社团简介" prop="clubIntroduction">
        <el-input
          v-model="form.clubIntroduction"
          type="textarea"
          placeholder="请输入社团简介"
          rows="4"
        />
      </el-form-item>

      <!-- 联系方式 -->
      <el-form-item label="联系方式" prop="contactInfo">
        <el-input v-model="form.contactInfo" placeholder="请输入联系方式" />
      </el-form-item>

      <!-- 活动场地 -->
      <el-form-item label="活动场地" prop="activityVenue">
        <el-input v-model="form.activityVenue" placeholder="请输入活动场地" />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交申请</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { submitClubApplication } from '@renderer/api'

// 表单数据
const form = ref({
  clubName: '',
  clubIntroduction: '',
  contactInfo: '',
  activityVenue: '',
  approvalId: Number(localStorage.getItem('user_id')) // 假设创始人 ID 为 1，可以根据实际登录用户动态设置
})

// 表单校验规则
const rules = {
  clubName: [
    { required: true, message: '请输入社团名称', trigger: 'blur' },
    { min: 2, max: 50, message: '社团名称长度应在 2 到 50 个字符之间', trigger: 'blur' }
  ],
  clubIntroduction: [
    { required: true, message: '请输入社团简介', trigger: 'blur' },
    { min: 10, max: 200, message: '社团简介长度应在 10 到 200 个字符之间', trigger: 'blur' }
  ],
  contactInfo: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { min: 5, max: 50, message: '联系方式长度应在 5 到 50 个字符之间', trigger: 'blur' }
  ],
  activityVenue: [
    { required: true, message: '请输入活动场地', trigger: 'blur' },
    { min: 5, max: 100, message: '活动场地长度应在 5 到 100 个字符之间', trigger: 'blur' }
  ]
}

// 表单引用
const formRef = ref()

// 提交表单
const handleSubmit = async (): Promise<void> => {
  try {
    // 校验表单
    await formRef.value?.validate()

    // 调用接口提交数据
    const { data } = await submitClubApplication(
      form.value.clubName,
      form.value.clubIntroduction,
      form.value.contactInfo,
      form.value.activityVenue,
      form.value.approvalId
    )

    // 显示成功提示
    ElMessage.success(data.message || '申请提交成功！')

    // 重置表单
    handleReset()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请检查表单内容或稍后重试！')
  }
}

// 重置表单
const handleReset = (): void => {
  formRef.value?.resetFields()
}
</script>

<style scoped>
.app-view {
  padding: 20px;
  background-color: #ffffff;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.club-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
