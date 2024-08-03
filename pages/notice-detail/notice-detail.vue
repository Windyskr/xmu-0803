<template>
  <view class="container">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="error" class="error">{{ error }}</view>
    <view v-else-if="notice" class="notice-detail">
      <view class="notice-title">{{ notice.title }}</view>
      <view class="notice-info">
        <text>{{ notice.province }}</text>
        <text>{{ notice.type === 1 ? '公务员' : '事业编' }}</text>
        <text>{{ notice.addTime }}</text>
      </view>
      <view class="notice-digest">{{ notice.digest }}</view>
      <rich-text :nodes="notice.content"></rich-text>

      <view v-if="parsedAffix.length > 0" class="notice-affix">
        <view class="affix-title">附件</view>
        <view v-for="(item, index) in parsedAffix" :key="index" class="affix-item" @click="downloadFile(item)">
          <image src="/static/file-icon.png" class="file-icon" />
          <text class="affix-name">{{ item.title }}</text>
        </view>
      </view>

      <view v-if="notice.sourceUrl" class="source-url">
        <text class="source-url-label">原文链接：</text>
        <text class="source-url-content" @longpress="copySourceUrl">{{ notice.sourceUrl }}</text>
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

const parsedAffix = computed(() => {
  if (!notice.value || !notice.value.affix) return [];
  try {
    // console.log('Parsing affix:', notice.value.affix);
    return new Function('return ' + notice.value.affix)();
  } catch (e) {
    console.error('Failed to parse affix:', e);
    return [];
  }
});

const copySourceUrl = () => {
  if (notice.value && notice.value.sourceUrl) {
    uni.setClipboardData({
      data: notice.value.sourceUrl,
      success: function () {
        uni.showToast({
          title: '链接已复制',
          icon: 'success'
        });
      }
    });
  }
};

const downloadFile = (item) => {
  uni.showLoading({
    title: '下载中...'
  });

  const downloadTask = uni.downloadFile({
    url: item.url,
    success: (res) => {
      if (res.statusCode === 200) {
        const tempFilePath = res.tempFilePath;
        uni.saveFile({
          tempFilePath: tempFilePath,
          success: function (saveRes) {
            const savedFilePath = saveRes.savedFilePath;
            uni.hideLoading();
            uni.showToast({
              title: '文件已保存',
              icon: 'success'
            });
            console.log('文件已保存到：' + savedFilePath);
          },
          fail: function(err) {
            console.error('保存文件失败：', err);
            uni.hideLoading();
            uni.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        });
      } else {
        uni.hideLoading();
        uni.showToast({
          title: '下载失败',
          icon: 'none'
        });
      }
    },
    fail: (err) => {
      console.error('下载文件失败：', err);
      uni.hideLoading();
      uni.showToast({
        title: '下载失败',
        icon: 'none'
      });
    }
  });

  downloadTask.onProgressUpdate((res) => {
    console.log('下载进度', res.progress);
    console.log('已经下载的数据长度', res.totalBytesWritten);
    console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
  });
};
</script>


<style scoped>
.container {
  padding: 20px;
}

.notice-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.notice-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.notice-digest {
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 14px;
}

.notice-affix {
  margin-top: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

.affix-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.affix-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.file-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.affix-name {
  font-size: 14px;
  color: #333;
}

.source-url {
  margin-top: 20px;
  font-size: 14px;
}

.source-url-label {
  font-weight: bold;
}

.source-url-content {
  color: #007AFF;
  text-decoration: underline;
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