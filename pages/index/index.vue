<template>
  <view class="container">
    <view class="filter-container">
      <view class="filter-header">
        <text class="filter-title active">推荐</text>
      </view>

      <view class="filters">
        <view class="filter-item" @tap="toggleDropdown('exam')">
          <view class="picker">
            <text>{{ selectedExam }}</text>
            <uni-icons :type="isExamOpen ? 'top' : 'bottom'" size="14"></uni-icons>
          </view>
        </view>
        <view class="filter-item" @tap="toggleDropdown('province')">
          <view class="picker">
            <text>{{ selectedProvince }}</text>
            <uni-icons :type="isProvinceOpen ? 'top' : 'bottom'" size="14"></uni-icons>
          </view>
        </view>
      </view>

      <view v-if="isExamOpen" class="dropdown exam-dropdown">
        <view class="dropdown-grid">
          <view
              v-for="exam in examTypes"
              :key="exam"
              class="dropdown-item"
              :class="{ 'dropdown-item-selected': exam === selectedExam }"
              @tap="handleSelect('exam', exam)"
          >
            {{ exam }}
          </view>
        </view>
      </view>

      <view v-if="isProvinceOpen" class="dropdown province-dropdown">
        <view class="dropdown-grid">
          <view
              v-for="province in provinces"
              :key="province"
              class="dropdown-item"
              :class="{ 'dropdown-item-selected': province === selectedProvince }"
              @tap="handleSelect('province', province)"
          >
            {{ province }}
          </view>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading">
      <uni-icons type="spinner-cycle" size="24" color="#007AFF"></uni-icons>
      <text>加载中...</text>
    </view>
    <view v-else-if="error" class="error">{{ error }}</view>
    <view v-else-if="notices.length === 0" class="empty">暂无数据</view>
    <view v-else class="job-list">
      <view v-for="job in notices" :key="job.id" class="job-item" @tap="navigateToDetail(job.id)">
        <view class="job-title">{{ job.title }}</view>
        <view class="job-info">
          <text class="job-location-type">
            {{ job.province }}   ·
            {{ job.type === 1 ? '公务员' : '事业编' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useNotices } from "@/utils/requests";

const examTypes = [
  '考试', '公务员', '事业单位'
];
const provinces = [
  '省份', '北京', '天津', '上海', '重庆',
  '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽',
  '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南',
  '四川', '贵州', '云南', '陕西', '甘肃', '青海',
  '内蒙古', '广西', '西藏', '宁夏', '新疆',
  '香港', '澳门', '台湾'
];

const isExamOpen = ref(false);
const isProvinceOpen = ref(false);
const selectedExam = ref('考试');
const selectedProvince = ref('省份');

const { notices, loading, error, loadNotices } = useNotices();

const toggleDropdown = (type) => {
  if (type === 'exam') {
    isExamOpen.value = !isExamOpen.value;
    isProvinceOpen.value = false;
  } else if (type === 'province') {
    isProvinceOpen.value = !isProvinceOpen.value;
    isExamOpen.value = false;
  }
};

const handleSelect = (type, value) => {
  if (type === 'exam') {
    selectedExam.value = value;
    isExamOpen.value = false;
  } else if (type === 'province') {
    selectedProvince.value = value;
    isProvinceOpen.value = false;
  }
};

watch([selectedExam, selectedProvince], async ([newExam, newProvince]) => {
  const examType = newExam === '公务员' ? '1' : newExam === '事业编' ? '2' : '';
  const province = newProvince === '省份' ? '' : newProvince;
  await loadNotices(province, examType);
});

const navigateToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/notice-detail/notice-detail?id=${encodeURIComponent(id)}`
  });
};

onMounted(() => {
  loadNotices();
});
</script>

<style>
.container {
  background-color: #fff;
  min-height: 100vh;
}

.filter-container {
  background-color: #fff;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.filter-header {
  display: flex;
  margin-bottom: 20px;
}

.filter-title {
  font-size: 18px;
  font-weight: bold;
  margin-right: 20px;
  color: #333;
  position: relative;
}

.filter-title.active {
  color: #007AFF;
}

.filter-title.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #007AFF;
  border-radius: 1.5px;
}

.filters {
  display: flex;
  justify-content: space-between;
}

.filter-item {
  width: 48%;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 15px;
  transition: all 0.3s ease;
}

.filter-item:active {
  background-color: #f0f0f0;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.dropdown-item {
  width: 33.33%;
  text-align: center;
  padding: 10px;
  font-size: 14px;
}

.dropdown-item-selected {
  color: #007AFF;
  font-weight: bold;
}

.job-list {
  padding: 10px;
}

.job-item {
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.job-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

.job-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.job-location-type {
  color: grey;
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.loading, .error, .empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #666;
}

.loading {
  color: #007AFF;
}

.error {
  color: #ff4d4f;
}
</style>