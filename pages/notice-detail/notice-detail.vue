<template>
  <view class="container">
    <view v-if="loading" class="loading">
      <uni-icons type="spinner-cycle" size="24" color="#007AFF"></uni-icons>
      <text>加载中...</text>
    </view>
    <view v-else-if="error" class="error">
      <uni-icons type="error" size="24" color="#FF5A5F"></uni-icons>
      <text>{{ error }}</text>
    </view>
    <view v-else-if="notice" class="notice-detail">
      <view class="notice-header">
        <view class="notice-title">{{ notice.title }}</view>
        <view class="notice-info">
          <view class="info-item">
            <text>{{ notice.province }} </text>
          </view>
          <view class="info-item">
            <text>·</text>
          </view>
          <view class="info-item">
            <text>{{ notice.type === 1 ? '公务员' : '事业编' }}</text>
          </view>
<!--          <view class="info-item">-->
<!--            <text>·</text>-->
<!--          </view>-->
<!--          <view class="info-item">-->
<!--            <text>{{ formatDate(notice.addTime) }}</text>-->
<!--          </view>-->
        </view>
      </view>

      <view v-if="digestLines.length > 0" class="notice-digest">
        <text v-for="(line, index) in digestLines" :key="index">{{ line }}</text>
      </view>

      <view class="notice-content">
        <rich-text :nodes="notice.content" selectable="true" ></rich-text>
        <view v-if="parsedAffix.length > 0" class="notice-affix">
          <view class="affix-title">附件</view>
          <view v-for="(item, index) in parsedAffix" :key="index" class="affix-item" @tap="downloadFile(item)">
            <text class="affix-name">{{ item.title }}</text>
          </view>
        </view>

        <view v-if="notice.sourceUrl" class="source-url">
          <text class="source-url-label">原文:</text>
          <text class="source-url-content" >
            {{ notice.title }}
            <uni-icons type="star" color="grey" @tap="copySourceUrl"></uni-icons>
          </text>
          <text class="source-url-not">内容以官方公告为准，如有侵权，请联系删除</text>
        </view>
      </view>
  </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useNoticeDetail } from '@/utils/requests';

const props = defineProps({
  id: {
    type: [Number, String],
    required: true
  }
});

const { notice, loading, error, loadNoticeDetail } = useNoticeDetail();

onMounted(() => {
  loadNoticeDetail(props.id);
});

const digestLines = computed(() => {
  if (!notice.value || !notice.value.digest) return [];
  return notice.value.digest.split('\n').filter(line => line.trim() !== '');
});

const parsedAffix = computed(() => {
  if (!notice.value || !notice.value.affix) return [];
  try {
    console.log('Parsing affix:', notice.value.affix);
    return new Function('return ' + notice.value.affix)();
  } catch (e) {
    console.error('Failed to parse affix:', e);
    return [];
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const downloadFile = (item) => {
  if (!item || !item.url) {
    uni.showToast({title: '无效的文件链接', icon: 'none'});
    return;
  }

  uni.showLoading({title: '下载中...'});

  uni.downloadFile({
    url: item.url,
    success: (res) => {
      if (res.statusCode === 200) {
        uni.saveFile({
          tempFilePath: res.tempFilePath,
          success: (saveRes) => {
            uni.hideLoading();
            uni.showToast({title: '文件已保存', icon: 'success'});
            console.log('文件已保存到：' + saveRes.savedFilePath);
          },
          fail: (err) => {
            console.error('保存文件失败：', err);
            uni.hideLoading();
            uni.showToast({title: '保存失败', icon: 'none'});
          }
        });
      } else {
        uni.hideLoading();
        uni.showToast({title: '下载失败', icon: 'none'});
      }
    },
    fail: (err) => {
      console.error('下载文件失败：', err);
      uni.hideLoading();
      uni.showToast({title: '下载失败', icon: 'none'});
    }
  });
};

const copySourceUrl = () => {
  uni.setClipboardData({
    data: notice.value.sourceUrl,
    success: () => {
      uni.showToast({title: '链接已复制', icon: 'success'});
    },
    fail: () => {
      uni.showToast({title: '复制失败', icon: 'none'});
    }
  });
};
</script>

<style>
.container {
  height: 100vh;
}

.notice-detail {
  padding: 20px;
}

.notice-header, .notice-content {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
}

.notice-digest {
  background-color: #e6f7ff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.notice-digest text {
  display: block;
  margin-bottom: 8px;
}

.notice-affix {
  background-color: #e6f7ff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.source-url {
  padding: 20px;
}

.notice-title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.3;
}

.notice-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: grey;
}

.info-item text {
  margin-left: 5px;
}

.notice-content {
  overflow-x: auto;
}

.notice-content >>> * {
  max-width: 100%;
}

.notice-content >>> img {
  max-width: 100%;
  height: auto;
}

.affix-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.affix-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 15px;
  margin-bottom: 10px;
}

.affix-name {
  font-size: 15px;
  color: #333;
  margin-left: 10px;
}

.source-url-label {
  font-weight: bold;
  color: #333;
}

.source-url-content {
  font-size: 16px;
  color: grey;
  margin-top: 5px;
}

.source-url-not {
  display: block;
  color: grey;
  font-size: 12px;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading text, .error text {
  margin-top: 10px;
  font-size: 16px;
  color: #666;
}

.error text {
  color: #FF5A5F;
}
</style>