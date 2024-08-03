<template>
  <view class="container">

    <view class="filter-container">
      <view class="filter-header">
        <text class="filter-title active">推荐</text>
      </view>

      <view class="filters">
        <picker class="filter-item" :range="examTypes" @change="onExamChange">
          <view class="picker">
            <text>{{ selectedExam || '考试' }}</text>
            <uni-icons type="bottom" size="14"></uni-icons>
          </view>
        </picker>
        <picker class="filter-item" :range="provinces" @change="onProvinceChange">
          <view class="picker">
            <text>{{ selectedProvince || '省份' }}</text>
            <uni-icons type="bottom" size="14"></uni-icons>
          </view>
        </picker>
      </view>

    <view class="job-list">
      <view v-for="(job, index) in filteredJobs" :key="index" class="job-item">
        <view class="job-title">{{ job.title }}</view>
        <view class="job-info">
          <text class="job-location">{{ job.location }}</text>
          <text class="job-type">{{ job.type }}</text>
        </view>
      </view>
    </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const examTypes = ref(['全部', '公务员', '事业单位']);
const provinces = ref(['全部', '北京', '上海', '广东', '江苏', '浙江', '福建', '山东', '四川', '湖北', '河南']);

const selectedExam = ref('');
const selectedProvince = ref('');

const onExamChange = (e) => {
  selectedExam.value = examTypes.value[e.detail.value];
};

const onProvinceChange = (e) => {
  selectedProvince.value = provinces.value[e.detail.value];
};

const jobs = ref([
  { title: '抚州市金溪县公开遴选教师193名任教方案', location: '江西', type: '事业单位' },
  { title: '新余六中秋季招聘临聘教师6人公告', location: '江西', type: '' },
  { title: '南昌市红谷滩区招聘156名医生公告', location: '江西', type: '' },
]);

const filteredJobs = computed(() => {
  return jobs.value.filter(job => {
    // if (selectedTags.value.exam !== '全部' && job.type !== selectedTags.value.exam) return false;
    // if (selectedTags.value.status && job.status !== selectedTags.value.status) return false;
    // if (selectedTags.value.province !== '全部' && job.location !== selectedTags.value.province) return false;
    return true;
  });
});
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-container {
  background-color: #fff;
  padding: 10px 15px;
}

.filter-header {
  display: flex;
  margin-bottom: 15px;
}

.filter-title {
  font-size: 16px;
  font-weight: bold;
  margin-right: 20px;
  color: #999;
}

.filter-title.active {
  color: #007AFF;
  position: relative;
}

.filter-title.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #007AFF;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.filter-item {
  width: 48%; /* 略微小于50%以确保有一些间隔 */
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  padding: 8px 12px;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-list {
  margin-top: 10px;
}

.job-item {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.job-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.job-info {
  display: flex;
  font-size: 12px;
  color: grey;
}

.job-location, .job-type {
  margin-right: 10px;
}
</style>