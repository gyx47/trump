<template>
  <div class="dashboard-container">
    <div class="header">
      <div class="title">特朗普支持率研究</div>
      <div class="title-bottom">
        <div class="bottom-sidebar"></div>
      </div>

    </div>
    <header class="dashboard-header">
      <div class="header-icons">
        <span>MAKE</span><span>AMERICA</span><span>GREAT</span><span>AGAIN</span>
      </div>
    </header>


    <main class="dashboard-main">
      <aside class="sidebar left-sidebar" :style="getColumnStyle('left')">
        <div class="chart-card">
          <div class="card-title" @click="toggleExpand('left')">各国对美国与美国总统信任度趋势</div>
          <div ref="countryCharts" class="echart-container"></div>
        </div>
        <div class="chart-card">
          <div class="card-title" @click="toggleExpand('left')">国际对美国与美国总统平均信任度趋势</div>
          <div ref="avgChart" class="echart-container"></div>
        </div>
        <div class="chart-card">
          <div class="card-title" @click="toggleExpand('left')">哈里斯与特朗普在各州的得票率比较</div>
          <div ref="voteRateChart" style="width:100%; height:600px;"></div>
        </div>
      </aside>

      <section class="main-content" :style="getColumnStyle('main')">
        <div class="top-stats">
          <!-- <div class="stat-item"> -->
          <!-- <div class="stat-value">这项特朗普支持率研究仪表盘，从国际反响、国内选情、政策焦点到媒体热度，为您全方位解析了其支持度的现状、构成与动态趋势<span class="stat-change down"></span></div> -->
          <div class="stat-label" style="text-align: left; line-height: 1.3;">
            <p>
              <strong>仪表盘总结：</strong>这项特朗普支持率研究仪表盘，从国际反响、国内选情到政策焦点媒体舆情，为用户全方位解析了其支持度的现状、构成与动态趋势。
            </p>
            <strong>主要分析维度细分：</strong>
            <ul style="list-style-position: outside; padding-left: 20px;">
              
              <li style="margin-bottom: 0.75em;">
                <strong>国际关系动态</strong><br>
                <small><em>“各国对美国与美国总统信任度趋势”、“提案国家支持率分布”、“国际对美国与美国总统平均信任度趋势”</em></small>
              </li>
              <li style="margin-bottom: 0.75em;">
                <strong>国内选举模拟</strong><br>
                <small><em>“2024年美国总统选举结果”、“哈里斯与特朗普在各州的得票率比较”、“哈里斯与特朗普在各州赢得的选举人票数”</em></small>
              </li>
              <li style="margin-bottom: 0.75em;">
                <strong>政策画像构建</strong><br>
                <small><em>“特朗普曾政策提案类型统计”</em></small>
              </li>
              <li style="margin-bottom: 0.75em;">
                <strong>媒体舆情</strong><br>
                <small><em>“特朗普相关关键词词云图”</em></small>
              </li>
            </ul>
          </div>
          <!-- </div> -->
          <!-- <div class="stat-item">
            <div class="stat-value">26237 <span class="stat-unit">T</span> <span class="stat-change up"></span>
            </div>
            <div class="stat-label">twitter number(2016-2020)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">99 <span class="stat-change down">-1%</span></div>
            <div class="stat-label">当前拥堵数(段)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">7421 <span class="stat-change down">-7%</span></div>
            <div class="stat-label">当前报警数(起)</div>
          </div> -->
        </div>
        <div class="map-container">
          <div class="map-controls" @click="toggleExpand('main')">
            <h6 class="mb-0 mr-3">提案国家支持率分布</h6>
            <select v-model="selectedIssue" @change="loadIssueData(selectedIssue)" class="form-control form-control-sm">
              <option v-for="num in issueOptions" :key="num" :value="num">
                提案 {{ num }}: {{ proposalLabels[num] }}
              </option>
            </select>
          </div>
          <div ref="worldMapChart" class="placeholder-map"></div>
        </div>
        <div class="map-container">
          <div class="map-controls" @click="toggleExpand('main')">
            <h6 class="mb-0 mr-3">2024年美国总统选举结果</h6>
            <!-- <div ref="electionResultMap" style="width:100%; height:600px;"></div> -->
            <div v-if="selectedState" class="state-info-card">
              <h4>{{ selectedState.name }}</h4>
              <p>胜者: {{ selectedState.value === 1 ? 'Trump' : 'Harris' }}</p>
              <p>Harris票数: {{ selectedState.HarrisSum }}</p>
              <p>Trump票数: {{ selectedState.trumpSum }}</p>
              <p>Harris选举人票: {{ selectedState.HarrisNum }}</p>
              <p>Trump选举人票: {{ selectedState.trumpNum }}</p>
            </div>
          </div>
          <div ref="electionResultMap" style="width:100%; height:600px;"></div>
        </div>
        <!-- <div class="bottom-summary">
          <div class="summary-title">今日实时收费</div>
          <div class="summary-items">
            <div class="summary-item"><span>大同北</span><span>XX元</span></div>
            <div class="summary-item"><span>大同南</span><span>XX元</span></div>
            <div class="summary-item"><span>朔州</span><span>XX元</span></div>
            <div class="summary-item"><span>太原</span><span>XX元</span></div>
          </div>
          <div class="summary-circles">
            <div class="circle-item">
              <div class="placeholder-circle">[车辆总数]</div>
              <span>车辆总数</span>
            </div>
            <div class="circle-item">
              <div class="placeholder-circle">[今日上线]</div>
              <span>今日上线</span>
            </div>
            <div class="circle-item">
              <div class="placeholder-circle">[今日营收]</div>
              <span>今日营收</span>
            </div>
          </div>
        </div> -->
      </section>

      <aside class="sidebar right-sidebar" :style="getColumnStyle('right')">
        <div class="chart-card">
          <div class="card-title" @click="toggleExpand('right')">特朗普政策提案类型统计</div>
          <div ref="policyCategoryChart" class="echart-container"></div>
        </div>
        <div class="chart-card word-cloud-card">
          <div class="card-title" @click="toggleExpand('right')">特朗普推特关键词词云图</div>
          <wordcloud :data="defaultWords" nameKey="name" valueKey="value" :color="myColors" :showTooltip="true"
            :wordClick="wordClickHandler" class="wordcloud-container">
          </wordcloud>
        </div>
        <div class="chart-card">
          <div class="card-title" @click="toggleExpand('right')">哈里斯与特朗普在各州赢得的选举人票数</div>
          <div ref="electoralVotesChart" style="width:100%; height:600px;"></div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import ICountUp from 'vue-countup-v2';
import * as echarts from 'echarts';
import 'echarts/map/js/world';
import wordcloud from "vue-wordcloud";

// 导入数据 (请确保路径正确)
import policyDataJson from '@/assets/data/分类.json';
import policy1 from '@/assets/data/TRUMPWORLD-issue-1.json';
import policy2 from '@/assets/data/TRUMPWORLD-issue-2.json';
import policy3 from '@/assets/data/TRUMPWORLD-issue-3.json';
import policy4 from '@/assets/data/TRUMPWORLD-issue-4.json';
import policy5 from '@/assets/data/TRUMPWORLD-issue-5.json';
import pres from '@/assets/data/TRUMPWORLD-pres.json';
import us from '@/assets/data/TRUMPWORLD-us.json';
import electionData from '@/assets/data/election2024.json';
// import wordcloud from "vue-wordcloud";
import usaGeoJson from '@/assets/data/USA.json';

export default {
  name: 'DashboardLayout',
  components: {
    ICountUp,
    wordcloud,
  },
  data() {
    return {
      // 模板数据 (如果需要)
      // ...

      // 数据代码数据
      delay: 0,
      options: { /* ICountUp options */ },
      myColors: ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef'],
      defaultWords: [{ name: 'poll', value: 302 },
      { name: 'polls', value: 109 },
      { name: 'lead', value: 54 },
      { name: 'cruz', value: 42 },
      { name: 'iowa', value: 42 },
      { name: 'big', value: 41 },
      { name: 'gop', value: 39 },
      { name: 'carson', value: 38 },
      { name: 'debate', value: 36 },
      { name: 'makeamericagreatagain', value: 33 },
      { name: 'rubio', value: 33 },
      { name: 'national', value: 31 },
      { name: 'leading', value: 27 },
      { name: 'hillary', value: 26 },
      { name: 'bush', value: 26 },
      { name: 'america', value: 21 },
      { name: 'shows', value: 21 },
      { name: 'wow', value: 21 },
      { name: 'win', value: 18 },
      { name: 'reuters', value: 18 },
      { name: 'clinton', value: 16 },
      { name: 'fox', value: 12 },
      { name: 'race', value: 12 },
      { name: 'ahead', value: 9 },
      { name: 'voters', value: 8 },
      { name: 'election', value: 6 },
      { name: 'candidate', value: 6 },
      { name: 'pollster', value: 4 },
      { name: 'nominee', value: 4 },
      { name: 'trump', value: 2 }


      ],
      policyCategoryStats: [],
      selectedIssue: 1,
      issueOptions: [1, 2, 3, 4, 5],
      proposalLabels: {
        1: "撤销对国际气候变化协议的支持",
        2: "在美国和墨西哥边境修建隔离墙",
        3: "撤回美国对伊朗核武器协议的支持",
        4: "撤回美国对主要贸易协议的支持",
        5: "对来自某些穆斯林为主国家的入境人员实行更严格的限制"
      },
      worldMapData: [],
      years: [],
      countries: [],
      seriesPres: [],
      seriesNat: [],
      avgPres: [],
      avgNat: [],
      showTrumpInfo: false, // 如果不需要特朗普小像，可以移除
      trumpInfo: "...",    // 如果不需要特朗普小像，可以移除

      // ECharts 实例
      policyCategoryChartInstance: null,
      worldMapChartInstance: null,
      countryChart: null,
      avgChart: null,
      expandedColumn: null,
      voteRateChart: null,
      electoralVotesChart: null,
      electionResultMap: null,

    };
  },
  watch: {
    // [新增] 监听列状态变化，延迟后重绘图表
    expandedColumn() {
      setTimeout(() => {
        this.resizeCharts();
      }, 550); // 延迟时间应略长于 CSS 过渡时间
    },
    // [新增] 根据状态计算列样式 (使用 width) 的方法

  },
  methods: {
    toggleExpand(columnName) {
      this.expandedColumn = this.expandedColumn === columnName ? null : columnName;
    },
    getColumnStyle(columnName) {
      // [修正] 添加 height 过渡
      const baseStyle = { transition: 'width 0.2s ease-in-out, height 0.5s ease-in-out' };
      const expandedWidth = '50%';
      const shrunkWidth = '25%';
      const defaultLeftRightWidth = '30%';
      const defaultMainWidth = '40%';

      // [修正] 使用 px，并考虑默认状态的高度
      // 警告：直接设置列高可能破坏布局！ 'auto' 或 '100%' 通常是更好的默认值。
      const defaultHeight = '30%'; // 或 '100vh' 减去 header 高度等
      const expandedHeight = '1200px'; // 示例：展开时的高度 (px)
      const shrunkHeight = '500px';   // 示例：收缩时的高度 (px)

      let targetWidth;
      let targetHeight;

      if (!this.expandedColumn) {
        targetWidth = columnName === 'main' ? defaultMainWidth : defaultLeftRightWidth;
        targetHeight = defaultHeight; // 默认状态下保持自动或全高

      } else if (this.expandedColumn === columnName) {
        targetWidth = expandedWidth;
        targetHeight = expandedHeight; // 展开时设置指定高度

      } else {
        targetWidth = shrunkWidth;
        targetHeight = shrunkHeight; // 收缩时设置指定高度
      }

      // 返回样式，包含 width 和 height
      return { ...baseStyle, width: targetWidth, height: targetHeight };
    },
    wordClickHandler(name, value, vm) {
      console.log('wordClickHandler', name, value, vm);
    },
    tdSelect(item) {
      console.log("Selected area:", item);
    },
    processData() {
      // ① 获取年份数组 (和原来一样)
      this.years = pres.map(d => d.year);

      // // ② 获取 *所有可能* 的国家列表 (和原来一样)
      // const potentialCountries = Object.keys(pres[0])
      //     .filter(k => k !== 'year' && k !== 'avg');

      // // ③ [新增] 筛选国家 - 只保留全年都有数据的
      // this.countries = potentialCountries.filter(country => {
      //     // 检查 pres 数据集中的每一行 (每一年)
      //     const presComplete = pres.every(yearData => 
      //         yearData[country] !== undefined && yearData[country] !== null && yearData[country] !== ''
      //     );
      //     // 检查 us 数据集中的每一行 (每一年)
      //     const usComplete = us.every(yearData => 
      //         yearData[country] !== undefined && yearData[country] !== null && yearData[country] !== ''
      //     );

      //     // 只有当一个国家在 *两个* 数据集中都全年有数据时，才返回 true
      //     return presComplete || usComplete;
      // });
      // ② 获取 *所有可能* 的国家列表 (和原来一样)
      const potentialCountries = Object.keys(pres[0])
        .filter(k => k !== 'year' && k !== 'avg');

      // ③ 筛选国家 - 只保留在 pres 或 us 数据集中至少有6个有效数据点的国家
      this.countries = potentialCountries.filter(country => {
        // 检查 pres 数据集中该国家有多少个有效数据点
        const presValidCount = pres.filter(yearData =>
          yearData[country] !== undefined &&
          yearData[country] !== null &&
          yearData[country] !== ''
        ).length;

        // 检查 us 数据集中该国家有多少个有效数据点
        const usValidCount = us.filter(yearData =>
          yearData[country] !== undefined &&
          yearData[country] !== null &&
          yearData[country] !== ''
        ).length;

        // 如果一个国家在 pres 数据集或 us 数据集中至少有6个有效数据点 (即6个或更多)，则保留
        // "6个以上" 通常理解为 ">= 6"。如果您严格需要 "多于6个" (即7个或更多), 请将下方的 >= 改为 >
        return presValidCount >= 6 || usValidCount >= 6;
      });

      // 打印筛选后的国家列表（可选，用于调试）
      console.log("将用于绘图的国家 (Filtered):", this.countries);

      // ④ [修改] 使用 *筛选后* 的 this.countries 来构建 series
      this.seriesPres = this.countries.map(country => ({
        name: country + '(pres)',
        type: 'line',
        data: pres.map(d => d[country] !== '' ? +d[country] : null)
      }));

      // ④ [修改] 使用 *筛选后* 的 this.countries 来构建 series
      this.seriesNat = this.countries.map(country => ({
        // 注意：这里我们为 '国家' 系列添加后缀，以便在图例中区分
        name: country + '（us）',
        type: 'line',
        data: us.map(d => d[country] !== '' ? +d[country] : null)
      }));

      // ⑤ 全体平均数据保持不变 (和原来一样)
      this.avgPres = pres.map(d => +d.avg);
      this.avgNat = us.map(d => +d.avg);
    },
    processPolicyCategoryData() {
      const categoryCounts = {};
      policyDataJson.forEach(item => {
        if (item.category) {
          categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        }
      });
      this.policyCategoryStats = Object.keys(categoryCounts).map(categoryName => ({
        name: categoryName,
        value: categoryCounts[categoryName]
      }));
      // 注意：原始代码中处理 policy1-5 的部分似乎有逻辑错误，
      // 这里暂时不包含，如果需要请修正原始逻辑并添加。
    },
    loadIssueData(issueNumber) {
      let data = [];
      let sourceData;
      switch (issueNumber) {
        case 1: sourceData = policy1; break;
        case 2: sourceData = policy2; break;
        case 3: sourceData = policy3; break;
        case 4: sourceData = policy4; break;
        case 5: sourceData = policy5; break;
      }
      this.worldMapData = this.formatDataForWorldMap(sourceData);
      this.drawWorldMapChart();
    },
    formatDataForWorldMap(jsonData) {
      return jsonData.map(item => ({
        name: item.country,
        value: parseFloat(item.net_approval) || 0 // 确保有值
      }));
    },
    drawPolicyCategoryChart() {
      const chartDom = this.$refs.policyCategoryChart;
      if (!chartDom) return;
      this.policyCategoryChartInstance = echarts.init(chartDom);
      const option = {
        title: {
          text: '特朗普政策提案类型统计',
          left: 'center',
          textStyle: { color: '#9AA8D4', fontSize: 16 }
        },
        tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
        legend: {
          orient: 'vertical', left: 'left', top: 'middle',
          data: this.policyCategoryStats.map(item => item.name),
          textStyle: { color: '#9AA8D4' }
        },
        series: [{
          name: '政策类型', type: 'pie', radius: '70%', center: ['60%', '55%'],
          data: this.policyCategoryStats,
          itemStyle: { borderColor: '#0a1931', borderWidth: 1 }, // 适应深色背景
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
          label: { color: '#fff', formatter: '{b}: {d}%' },
          labelLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
        }]
      };
      this.policyCategoryChartInstance.setOption(option);
    },
    drawCharts() {
      // --- 多国折线图 ---
      const countryChartDom = this.$refs.countryCharts;
      if (!countryChartDom) return;
      this.countryChart = echarts.init(countryChartDom);
      const allSeries = [
        ...this.seriesPres.map(s => ({ ...s, smooth: true, lineStyle: { width: 1, opacity: 0.7 } })), // 调整线条样式
        ...this.seriesNat.map(s => ({ ...s, smooth: true, lineStyle: { width: 1, opacity: 0.7, type: 'dashed' }, name: s.name }))
      ];
      // [新增] 创建一个所有图例都未选中的初始状态对象
      const allNames = allSeries.map(s => s.name);
      const initialSelected = {};
      allNames.forEach(name => {
        initialSelected[name] = false; // 将所有项的初始状态设为 false (未选中)
      });
      this.countryChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { type: 'scroll', top: 5, textStyle: { color: '#9AA8D4' }, data: allSeries.map(s => s.name), selected: initialSelected },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true }, // 调整grid
        xAxis: { type: 'category', data: this.years, axisLabel: { color: '#9AA8D4' } },
        yAxis: { type: 'value', axisLabel: { color: '#9AA8D4' } },
        series: allSeries,
        textStyle: { color: '#e0e0e0' } // 全局文字颜色
      });

      // --- 平均折线图 ---
      const avgChartDom = this.$refs.avgChart;
      if (!avgChartDom) return;
      this.avgChart = echarts.init(avgChartDom);
      this.avgChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { top: 5, textStyle: { color: '#9AA8D4' }, data: ['平均——总统', '平均——国家'] },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true }, // 调整grid
        xAxis: { type: 'category', data: this.years, axisLabel: { color: '#9AA8D4' } },
        yAxis: { type: 'value', axisLabel: { color: '#9AA8D4' } },
        series: [
          { name: '平均——总统', type: 'line', data: this.avgPres, smooth: true, lineStyle: { width: 2 } },
          { name: '平均——国家', type: 'line', data: this.avgNat, smooth: true, lineStyle: { width: 2, type: 'dashed', color: '#50c4f2' } }
        ],
        textStyle: { color: '#e0e0e0' }
      });
    },
    drawWorldMapChart() {
      const chartDom = this.$refs.worldMapChart;
      if (!chartDom) return;

      const myChart = echarts.init(chartDom);
      const selectedIssueLabel = this.proposalLabels[this.selectedIssue] || `提案 ${this.selectedIssue}`; // 后备文本
      const option = {
        // title: {
        //     text: `特朗普提案 ${selectedIssueLabel} - 各国净支持率分布`,
        //     left: 'center',
        //     textStyle: { color: '#fff' }
        // },
        tooltip: {
          trigger: 'item',
          formatter: params => {
            return `${params.name}<br/>净支持率: ${params.value}`;
          }
        },
        visualMap: {
          type: 'continuous',
          min: -89,
          max: 41,
          calculable: true,
          orient: 'horizontal',
          bottom: 20,
          left: 'center',
          text: ['高支持率', '低支持率'],
          inRange: {
            color: [
              '#ffffff',  // min ≈ -89
              '#fee6ce',  // ≈ -65（20%分位）
              '#fdd0a2',  // ≈ -47（40%分位）
              '#fdae6b',  // ≈ -30（60%分位）
              '#fd8d3c',  // ≈ -12（80%分位）
              '#ef3b2c',  // 中高端
              '#cb181d',  // 更高
              '#a50f15'   // max = +41
            ]
          }
        },




        mapType: 'world',
        roam: true,
        itemStyle: {
          areaColor: '#2a333d',
          borderColor: '#111'
        },
        emphasis: {
          itemStyle: {
            areaColor: '#2a333d'
          }
        },
        series: [
          {
            name: '净支持率',
            type: 'map',
            mapType: 'world',
            data: this.worldMapData,
            showLegendSymbol: true,
            label: {
              show: false
            }
          }
        ]
      };

      myChart.setOption(option);
      window.addEventListener('resize', () => myChart.resize());

      // 保存实例用于销毁
      this.worldMapChartInstance = myChart;
    },
    resizeCharts() {
      console.log("Resizing charts...");
      [
        this.policyCategoryChartInstance,
        this.worldMapChartInstance,
        this.countryChart,
        this.avgChart,
        this.voteRateChart,
        this.electoralVotesChart,
        this.electionResultMap

      ].forEach(chart => {
        if (chart && !chart.isDisposed()) {
          try {
            chart.resize();
          } catch (e) {
            console.error("Error resizing chart:", e);
          }
        }
      });
      // 词云图通常会自动适应，如果需要手动调整，可以在这里添加逻辑
    },
    // 加载选举数据
    async loadElectionData() {
      try {
        // 这里应该替换为实际的数据加载方式
        // 假设我们已经通过某种方式将Excel数据转换为JSON
        this.electionData = electionData;

        // 加载美国各州地理信息

        this.statesGeoJson = usaGeoJson;

        // 注册地图
        echarts.registerMap('USA', this.statesGeoJson);

        // 绘制图表
        this.drawVoteRateChart();
        this.drawElectoralVotesChart();
        this.drawElectionResultMap();

      } catch (error) {
        console.error('加载选举数据失败:', error);
      }
    },

    // 绘制得票率比较图表
    drawVoteRateChart() {
      const chartDom = this.$refs.voteRateChart;
      if (!chartDom) return;

      const myChart = echarts.init(chartDom);

      const sortedData = [...this.electionData]
        .filter(state => state.id && state.id !== '全美')
        .sort((a, b) => b.trumpRate - a.trumpRate);

      const option = {
        // title: {
        //   text: '哈里斯与特朗普在各州的得票率比较',
        //   left: 'center',
        //   textStyle: { color: '#fff' }
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params) => {
            return `${params[0].name}<br/>` +
              `${params[0].marker} ${params[0].seriesName}: ${params[0].value}%<br/>` +
              `${params[1].marker} ${params[1].seriesName}: ${params[1].value}%`;
          }
        },
        legend: {
          data: ['Harris得票率', 'Trump得票率'],
          textStyle: { color: '#9AA8D4' },
          top: 30
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: { color: '#9AA8D4' },
          max: 100,
          min: 0,
          splitLine: { lineStyle: { color: '#444' } }
        },
        yAxis: {
          type: 'category',
          data: sortedData.map(state => state.name),
          axisLabel: {
            color: '#9AA8D4',
            fontSize: 12,
            rotate: 0
          },
          axisLine: { lineStyle: { color: '#444' } }
        },
        series: [
          {
            name: 'Harris得票率',
            type: 'bar',
            stack: 'total',
            emphasis: { focus: 'self' },
            data: sortedData.map(state => state.HarrisRate),
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#4c7bb6' },
                  { offset: 1, color: '#1f77b4' }
                ]
              }
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}%',
              color: '#fff'
            }
          },
          {
            name: 'Trump得票率',
            type: 'bar',
            stack: 'total',
            emphasis: { focus: 'self' },
            data: sortedData.map(state => state.trumpRate),
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#d62728' },
                  { offset: 1, color: '#e35b5b' }
                ]
              }
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}%',
              color: '#fff'
            }
          },
          {
            name: '基准线(50%)',
            type: 'line',
            data: sortedData.map(() => 50),
            symbol: 'none',
            lineStyle: {
              color: '#fff',
              type: 'dashed',
              width: 1
            }
          }
        ],
        animationType: 'slide'
      };

      myChart.setOption(option);
      window.addEventListener('resize', () => myChart.resize());
      this.voteRateChart = myChart;
    },

    // 绘制选举人票数图表
    drawElectoralVotesChart() {
      const chartDom = this.$refs.electoralVotesChart;
      if (!chartDom) return;

      const myChart = echarts.init(chartDom);

      const sortedData = [...this.electionData]
        .filter(state => state.id && state.id !== '全美')
        .sort((a, b) => b.trumpNum - a.trumpNum);

      const option = {
        // title: {
        //   text: '哈里斯与特朗普在各州赢得的选举人票数',
        //   left: 'center',
        //   textStyle: { color: '#fff' }
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['Harris选举人票', 'Trump选举人票'],
          textStyle: { color: '#9AA8D4' },
          top: 30
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: { color: '#9AA8D4' },
          splitLine: { lineStyle: { color: '#444' } }
        },
        yAxis: {
          type: 'category',
          data: sortedData.map(state => state.name),
          axisLabel: {
            color: '#9AA8D4',
            fontSize: 12,
            rotate: 0
          }
        },
        series: [
          {
            name: 'Harris选举人票',
            type: 'bar',
            data: sortedData.map(state => state.HarrisNum),
            itemStyle: {
              borderRadius: [4, 4],
              borderColor: '#1f77b4',
              borderWidth: 1,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#4c7bb6' },
                  { offset: 1, color: '#1f77b4' }
                ]
              }
            },
            label: {
              show: true,
              position: 'right',
              color: '#fff'
            }
          },
          {
            name: 'Trump选举人票',
            type: 'bar',
            data: sortedData.map(state => state.trumpNum),
            itemStyle: {
              borderRadius: [4, 4],
              borderColor: '#d62728',
              borderWidth: 1,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#e35b5b' },
                  { offset: 1, color: '#d62728' }
                ]
              }
            },
            label: {
              show: true,
              position: 'right',
              color: '#fff'
            }
          }
        ],
        animationType: 'fade'
      };

      myChart.setOption(option);
      window.addEventListener('resize', () => myChart.resize());
      this.electoralVotesChart = myChart;
    },

    // 绘制选举结果地图
    drawElectionResultMap() {
      const chartDom = this.$refs.electionResultMap;
      if (!chartDom || !this.statesGeoJson) return;

      // 英文州名映射表
      const stateNameMap = {
        '阿拉巴马': 'Alabama',
        '阿拉斯加': 'Alaska',
        '亚利桑那': 'Arizona',
        '阿肯色': 'Arkansas',
        '加利福尼亚': 'California',
        '科罗拉多': 'Colorado',
        '康涅狄格': 'Connecticut',
        '特拉华': 'Delaware',
        '佛罗里达': 'Florida',
        '佐治亚': 'Georgia',
        '夏威夷': 'Hawaii',
        '爱达荷': 'Idaho',
        '伊利诺伊': 'Illinois',
        '印第安纳': 'Indiana',
        '艾奥瓦': 'Iowa',
        '堪萨斯': 'Kansas',
        '肯塔基': 'Kentucky',
        '路易斯安那': 'Louisiana',
        '缅因': 'Maine',
        '马里兰': 'Maryland',
        '马萨诸塞': 'Massachusetts',
        '密歇根': 'Michigan',
        '明尼苏达': 'Minnesota',
        '密西西比': 'Mississippi',
        '密苏里': 'Missouri',
        '蒙大拿': 'Montana',
        '内布拉斯加': 'Nebraska',
        '内华达': 'Nevada',
        '新罕布什尔': 'New Hampshire',
        '新泽西': 'New Jersey',
        '新墨西哥': 'New Mexico',
        '纽约': 'New York',
        '北卡罗来纳': 'North Carolina',
        '北达科他': 'North Dakota',
        '俄亥俄': 'Ohio',
        '俄克拉何马': 'Oklahoma',
        '俄勒冈': 'Oregon',
        '宾夕法尼亚': 'Pennsylvania',
        '罗得岛': 'Rhode Island',
        '南卡罗来纳': 'South Carolina',
        '南达科他': 'South Dakota',
        '田纳西': 'Tennessee',
        '得克萨斯': 'Texas',
        '犹他': 'Utah',
        '佛蒙特': 'Vermont',
        '弗吉尼亚': 'Virginia',
        '华盛顿': 'Washington',
        '西弗吉尼亚': 'West Virginia',
        '威斯康星': 'Wisconsin',
        '怀俄明': 'Wyoming'
      };

      const mapData = this.electionData
        .filter(state => state.id && state.id !== '全美')
        .map(state => ({
          name: stateNameMap[state.name] || state.name, // 替换为英文名
          value: state.trumpNum > state.HarrisNum ? 1 : 0,
          HarrisSum: state.HarrisSum,
          trumpSum: state.trumpSum,
          HarrisNum: state.HarrisNum,
          trumpNum: state.trumpNum
        }));

      const myChart = echarts.init(chartDom);

      const option = {
        // title: {
        //   text: '2024年美国总统选举结果',
        //   left: 'center',
        //   textStyle: { color: '#fff' }
        // },
        tooltip: {
          trigger: 'item',
          formatter: params => {
            const data = params.data;
            if (!data) return params.name;
            const winner = data.value === 1 ? 'Trump' : 'Harris';
            return `
                    <div style="font-weight:bold">${params.name}</div>
                    <div>胜者: ${winner}</div>
                    <div>Harris票数: ${data.HarrisSum}</div>
                    <div>Trump票数: ${data.trumpSum}</div>
                    <div>Harris选举人票: ${data.HarrisNum}</div>
                    <div>Trump选举人票: ${data.trumpNum}</div>
                `;
          }
        },
        visualMap: {
          min: 0,
          max: 1,
          calculable: false,
          inRange: {
            color: ['#1f77b4', '#d62728']
          },
          text: ['Harris', 'Trump'],
          orient: 'horizontal',
          left: 'center',
          bottom: 20,
          textStyle: { color: '#fff' }
        },
        series: [{
          name: '选举结果',
          type: 'map',
          map: 'USA',
          roam: true,
          emphasis: { label: { show: false } }, // 隐藏hover时的标签
          data: mapData,
          itemStyle: {
            areaColor: '#2a333d',
            borderColor: '#111'
          },
          label: {
            show: false // 不显示州名
          }
        }]
      };

      myChart.setOption(option);
      window.addEventListener('resize', () => myChart.resize());
      myChart.on('click', params => {
        this.selectedState = params.data;
      });
      this.electionResultMap = myChart;
    },
    // resizeCharts() {
    //   [this.policyCategoryChartInstance, this.worldMapChartInstance, this.countryChart, this.avgChart].forEach(chart => {
    //     if (chart && !chart.isDisposed()) {
    //       chart.resize();
    //     }
    //   });
    // }
  },
  mounted() {
    this.processPolicyCategoryData();
    this.processData();
    this.loadElectionData();
    // 延迟或使用 $nextTick 确保 DOM 准备好
    this.$nextTick(() => {
      this.drawPolicyCategoryChart();
      this.drawCharts();
      this.loadIssueData(this.selectedIssue);
      window.addEventListener('resize', this.resizeCharts);
    });
  },
  beforeDestroy() {
    // 清理 ECharts 实例和事件监听器
    if (this.policyCategoryChartInstance && !this.policyCategoryChartInstance.isDisposed()) {
      window.removeEventListener('resize', this.policyCategoryChartInstance.resize); // 如果是这样绑定的
      this.policyCategoryChartInstance.dispose();
      this.policyCategoryChartInstance = null;
    }
    if (this.worldMapChartInstance && !this.worldMapChartInstance.isDisposed()) {
      this.worldMapChartInstance.dispose();
      this.worldMapChartInstance = null;
    }
    if (this.voteRateChart && !this.voteRateChart.isDisposed()) {
      window.removeEventListener('resize', this.voteRateChart.resize);
      this.voteRateChart.dispose();
    }
    if (this.electoralVotesChart && !this.electoralVotesChart.isDisposed()) {
      window.removeEventListener('resize', this.electoralVotesChart.resize);
      this.electoralVotesChart.dispose();
    }
    if (this.electionResultMap && !this.electionResultMap.isDisposed()) {
      window.removeEventListener('resize', this.electionResultMap.resize);
      this.electionResultMap.dispose();
    }
  }
};
</script>

<style scoped>
/* 模板原有样式 */
.header {
  margin: 4px;
}

.header .title {
  font-size: 24px;
  color: #fff;
}

.title-bottom {
  height: 30px;
  justify-content: center;
  display: flex;
}

.bottom-sidebar {
  width: 100%;
  height: 100%;
  opacity: 1;
  background-image: url("~@/assets/images/bottombar.gif");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  width: 400px;
}

.bottom-line {
  width: 100%;
  height: 30px;
  background-image: url("~@/assets/images/bottomline.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center center;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #0a1931;
  /* 深蓝色背景 */
  color: #e0e0e0;
  /* 浅色文字 */
  font-family: 'Microsoft YaHei', sans-serif;
  padding: 10px;
  box-sizing: border-box;
}

.dashboard-header {
  display: flex;
  justify-content: center;
  /* 标题居中 */
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(13, 33, 65, 0.5);
  /* 半透明背景 */
  border-bottom: 1px solid #1f4287;
  position: relative;
  /* 为了 header-icons 的绝对定位 */
}

.dashboard-header h1 {
  color: #50c4f2;
  /* 亮蓝色标题 */
  font-size: 24px;
  margin: 0;
  letter-spacing: 2px;
}

.header-icons {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 15px;
}

.header-icons span {
  font-size: 12px;
  /* 示例图标文字 */
  padding: 5px;
  border: 1px solid #50c4f2;
  border-radius: 3px;
}

.dashboard-main {
  display: flex;
  flex-grow: 1;
  gap: 10px;
  /* 各区域之间的间隙 */
  overflow: hidden;
  /* 防止内容溢出 */
  padding-top: 10px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: rgba(13, 33, 65, 0.3);
  /* 半透明背景 */
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #16336e;
  transition: width 0.5s ease-in-out;
  flex-shrink: 0;
  /* 防止列自动收缩 */
}

.left-sidebar {
  width: 30%;
  /* 调整宽度以容纳图表 */
}

.right-sidebar {
  width: 30%;
  /* 调整宽度以容纳图表 */
}

.main-content {
  flex-grow: 1;
  /* 中间内容区占据剩余空间 */
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: width 0.5s ease-in-out;
  flex-shrink: 0;
  /* 防止列自动收缩 */
}

.chart-card,
.data-table-card {
  background-color: rgba(22, 43, 87, 0.5);
  /* 卡片背景 */
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #1f4287;
  flex: 1;
  /* 让卡片在侧边栏中平均分配空间 */
  display: flex;
  flex-direction: column;
  overflow: auto;
  /* 防止图表溢出 */
}

.card-title {
  color: #50c4f2;
  font-size: 16px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #1f4287;
  flex-shrink: 0;
  /* 防止标题被压缩 */
  cursor: pointer;
  /* [新增] 添加手型光标 */
  transition: color 0.2s ease;
}

.card-title:hover {
  color: #f4d35e;
  /* [新增] 悬停效果 */
}

/* ECharts 图表容器样式 */
.echart-container {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  /* 让 ECharts 填充父容器 */
  min-height: 200px;
  /* 保证最小高度 */
}

.data-table-card .table-row,
.data-table-card .table-header {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  border-bottom: 1px solid #16336e;
}

.data-table-card .table-row:last-child,
.data-table-card .table-header:last-child {
  border-bottom: none;
}

.data-table-card .table-header {
  color: #86abf1;
  font-weight: bold;
}

.data-table-card .table-row span:last-child {
  color: #f4d35e;
  /* 数据颜色 */
}

/* 中间主内容区特定样式 */
.top-stats {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: rgba(22, 43, 87, 0.5);
  border-radius: 4px;
  border: 1px solid #1f4287;
  flex-shrink: 0;
  /* 防止压缩 */
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #f4d35e;
}

.stat-value .stat-unit {
  font-size: 16px;
  color: #50c4f2;
}

.stat-change {
  font-size: 12px;
  margin-left: 5px;
}

.stat-change.up {
  color: #79d70f;
}

.stat-change.down {
  color: #e63946;
}

.stat-label {
  font-size: 12px;
  color: #86abf1;
  margin-top: 5px;
}

.map-container {
  flex-grow: 1;
  background-color: rgba(22, 43, 87, 0.5);
  border-radius: 4px;
  border: 1px solid #1f4287;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 200px;
  /* 确保内容不溢出 */
}

/* 地图选择器样式 */
.map-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  background-color: rgba(10, 25, 49, 0.8);
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.map-controls h6 {
  color: #e0e0e0;
  margin: 0;
  font-size: 14px;
  cursor: pointer;
  /* [新增] 添加手型光标 */
  transition: color 0.2s ease;
}

.map-controls h6:hover {
  color: #f4d35e;
  /* [新增] 悬停效果 */
}

.map-controls select {
  background-color: #0a1931;
  color: #e0e0e0;
  border: 1px solid #1f4287;
  border-radius: 3px;
  padding: 3px 5px;
  font-size: 12px;
}

.placeholder-map {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  color: #7996c3;
  font-size: 16px;
  width: 100%;
  height: 100%;
}

.bottom-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: rgba(22, 43, 87, 0.5);
  border-radius: 4px;
  border: 1px solid #1f4287;
  min-height: 80px;
  position: relative;
  /* 为标题定位 */
  flex-shrink: 0;
  /* 防止压缩 */
}

.summary-title {
  position: absolute;
  top: -12px;
  /* 调整位置 */
  left: 20px;
  background-color: #0a1931;
  padding: 0 10px;
  color: #50c4f2;
  font-size: 16px;
}

.bottom-summary .summary-items {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 13px;
  flex: 2;
}

.bottom-summary .summary-item span:last-child {
  color: #f4d35e;
  margin-left: 5px;
}

.summary-circles {
  display: flex;
  gap: 20px;
  flex: 1;
  justify-content: flex-end;
}

.circle-item {
  text-align: center;
}

.placeholder-circle {
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.2);
  border: 2px solid #50c4f2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7996c3;
  font-size: 10px;
  margin: 0 auto 5px auto;
}

.circle-item span {
  font-size: 12px;
  color: #86abf1;
}

/* 词云图特定样式 */
.word-cloud-card {
  display: flex;
  flex-direction: column;
}

.wordcloud-container {
  flex-grow: 1;
  /* 让词云填充卡片空间 */
  width: 100%;
  height: 100%;
  min-height: 150px;
  /* 保证最小高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.wordcloud-container>div {
  /* 假设 vue-wordcloud 生成一个 div */
  width: 100% !important;
  height: 100% !important;
}

/* 数据代码中可能需要的样式 (简化和调整) */
.caption {
  text-align: left;
  color: #fff;
  margin-bottom: 10px;
}

.form-control-sm {
  height: auto;
  /* 调整下拉框大小 */
  padding: .25rem .5rem;
  font-size: .875rem;
}

/* 移除或调整特朗普小像样式，因为它未被包含 */
</style>