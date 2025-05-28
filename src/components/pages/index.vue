<template>
  <div class="landing-page">
    <!-- 背景装饰 -->
    <div class="background-decoration"></div>

    <!-- 主体内容 -->
    <div class="content-wrapper">
      <!-- 特朗普头像 -->
      <div class="portrait-container" @mouseover="showTrumpInfo = true" @mouseleave="showTrumpInfo = false">
        <img src="@/assets/images/trump2.jpg" alt="Donald Trump" class="trump-image" />
        <div v-if="showTrumpInfo" class="tooltip-box">
          {{ trumpInfo }}
        </div>
      </div>

      <!-- 文字介绍 -->
      <div class="introduction">
        <h1>唐纳德·特朗普</h1>
        <p class="subtitle">第45任美国总统 | 商业大亨 | 真实政治风向标</p>
        <div class="bio-text">
          <p>唐纳德·约翰·特朗普（Donald John Trump）于1946年6月14日出生在美国纽约市。</p>
          <p>他是一位企业家、电视名人，并在2017年至2021年间担任美国第45任总统。</p>
          <p>特朗普以其直言不讳的风格、反建制立场和社交媒体活跃度而闻名全球。</p>
          <p>此页面用于研究其政策支持率与公众影响力趋势。</p>
        </div>
      </div>

      <!-- 进入按钮 -->
      <div class="enter-button">
        <button @click="$router.push('/test')">进入可视化分析</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      showTrumpInfo: false,
      trumpInfo:
        '特朗普是美国第45任总统，曾在2017年至2021年任职。他的政策主张包括减税、移民改革和贸易保护主义等。',
    };
  },
};
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background-color: #0a1931;
  color: #e0e0e0;
  font-family: 'Microsoft YaHei', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a1931, #0f285d);
  z-index: -1;
}

.content-wrapper {
  max-width: 900px;
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 30px rgba(0, 123, 255, 0.2);
}

/* 头像区域 */
.portrait-container {
  position: relative;
  margin-bottom: 30px;
  cursor: pointer;
}

.trump-image {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #1f77b4;
  transition: transform 0.3s ease;
}

.trump-image:hover {
  transform: scale(1.05);
}

.tooltip-box {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 介绍文字 */
.introduction h1 {
  font-size: 36px;
  color: #ffffff;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  color: #9aa8d4;
  margin-bottom: 20px;
  font-weight: 300;
}

.bio-text {
  font-size: 16px;
  line-height: 1.6;
  color: #cfd8dc;
  text-align: left;
  max-width: 600px;
  margin: 0 auto 30px auto;
}

/* 按钮样式 */
.enter-button {
  margin-top: 20px;
}

.enter-button button {
  background-color: #1f77b4;
  color: white;
  border: none;
  padding: 14px 30px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.enter-button button:hover {
  background-color: #165d8c;
  transform: scale(1.05);
}
</style>