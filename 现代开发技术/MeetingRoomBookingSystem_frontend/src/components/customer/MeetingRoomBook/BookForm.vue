<template>
  <el-form
    :model="filterForm"
    :rules="rules"
    ref="filterFormRef"
    label-width="120px"
    class="booking-form"
  >
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker
        v-model="filterForm.startTime"
        type="datetime"
        placeholder="开始时间"
        value-format="x"
      />
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker
        v-model="filterForm.endTime"
        type="datetime"
        placeholder="结束时间"
        value-format="x"
      />
    </el-form-item>
    <el-form-item label="参会人数" prop="attendees">
      <el-input-number v-model="filterForm.attendees" :min="1" />
    </el-form-item>
    <el-form-item label="所需设备" prop="equipment">
      <el-select
        v-model="filterForm.equipments"
        multiple
        placeholder="请选择设备"
      >
        <el-option
          v-for="item in equipmentList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onFilter">筛选</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { useMeetingRoomBookStore } from "@/stores/modules/customer/meetingRoomBookStore";
import { computed, ref } from "vue";

// 使用 store
const meetingRoomBookStore = useMeetingRoomBookStore();

// 绑定筛选条件
const filterForm = computed(() => meetingRoomBookStore.filterForm);

// 设备列表
const equipmentList = computed(() => meetingRoomBookStore.equipmentList);

// 表单引用
const filterFormRef = ref();

// 表单验证规则
const rules = {
  startTime: [
    { required: true, message: "请选择开始时间", trigger: "change" },
    {
      validator: (rule, value) => {
        if (!value) {
          return new Error("请选择开始时间");
        }
        if (new Date(value) <= new Date()) {
          return new Error("开始时间必须晚于当前时间");
        }
        return true;
      },
      trigger: "change",
    },
  ],
  endTime: [
    { required: true, message: "请选择结束时间", trigger: "change" },
    {
      validator: (rule, value) => {
        if (!value || !filterForm.value.startTime) {
          return new Error("请选择结束时间");
        }
        if (new Date(value) <= new Date(filterForm.value.startTime)) {
          return new Error("结束时间必须晚于开始时间");
        }
        return true;
      },
      trigger: "change",
    },
  ],
  attendees: [
    { required: true, message: "请输入参会人数", trigger: "blur" },
    {
      type: "number",
      min: 1,
      message: "参会人数必须大于等于 1",
      trigger: "blur",
    },
  ],
  equipment: [
    {
      type: "array",
      required: false,
      message: "请选择所需设备",
      trigger: "change",
    },
  ],
};

// 筛选按钮点击事件
const onFilter = () => {
  filterFormRef.value.validate((valid) => {
    if (valid) {
      // 表单验证通过，执行筛选逻辑
      meetingRoomBookStore.filterMeetingRooms();
    } else {
      console.log("表单验证失败");
    }
  });
};
</script>

<style scoped>
.booking-form {
  margin-bottom: 20px;
}
</style>
