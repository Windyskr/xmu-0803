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
    </view>

    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="error" class="error">{{ error }}</view>
    <view v-else class="job-list">
      <view v-for="job in notices" :key="job.id" class="job-item">
        <view class="job-title">{{ job.title }}</view>
        <view class="job-info">
          <text class="job-location">{{ job.province }}</text>
          <text class="job-type">{{ job.type === 1 ? '公务员' : '事业编' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref, watch} from 'vue';
import {useNotices} from "@/utils/requests";

const examTypes = ['全部', '公务员', '事业编'];
const provinces = [
  '全部',
  '北京', '天津', '上海', '重庆',  // 直辖市
  '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽',
  '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南',
  '四川', '贵州', '云南', '陕西', '甘肃', '青海',  // 省
  '内蒙古', '广西', '西藏', '宁夏', '新疆',  // 自治区
  '香港', '澳门', '台湾'  // 特别行政区和台湾省
];
const selectedExam = ref('全部');
const selectedProvince = ref('全部');

const { notices, loading, error, loadNotices } = useNotices();

const onExamChange = (e) => {
  selectedExam.value = examTypes[e.detail.value];
};

const onProvinceChange = (e) => {
  selectedProvince.value = provinces[e.detail.value];
};

watch([selectedExam, selectedProvince], async ([newExam, newProvince]) => {
  const examType = newExam === '公务员' ? '1' : newExam === '事业编' ? '2' : '';
  const province = newProvince === '全部' ? '' : newProvince;
  await loadNotices(province, examType);
});

// Initial load
loadNotices();
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

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 16px;
}

.error {
  color: red;
}
</style>