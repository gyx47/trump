<template>
    <div class="page">
      <div class="header">
        <div class="title">特朗普支持率研究</div>
        <div class="title-bottom">
          <div class="bottom-sidebar"></div>
        </div>
      </div>
  
      <div class="row">
        <!-- 左侧侧栏 -->
        <div class="col-md-4">
          <!-- 统计数字 -->
          <!-- 左侧固定小像 -->
          <div class="col-md-4 trump-fixed-container">
                <div class="trump-portrait-container">
                    <img 
                        src="@/assets/images/trump2.jpg" 
                        alt="Donald Trump" 
                        class="trump-portrait"
                        @mouseover="showTrumpInfo = true"
                        @mouseleave="showTrumpInfo = false"
                    >
                    <div v-if="showTrumpInfo" class="trump-info-tooltip">
                        {{ trumpInfo }}
                    </div>
                </div>
            </div>
  
         
  
          <!-- 数据表格 -->
          <!-- <div class="box-content">
            <table
              class="table border-table darkblue mb-0"
              style="width:100%;"
              cellpadding="0"
              cellspacing="0"
            >
              <thead>
                <tr>
                  <th style="width:90px;">排名</th>
                  <th>区域</th>
                  <th class="text-right">本月</th>
                  <th class="text-right">上月</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in datalist" :key="idx">
                  <td>{{ idx + 1 }}</td>
                  <td class="enable" @click="tdSelect(item)">{{ item.area }}</td>
                  <td class="text-right">{{ item.nValue }}</td>
                  <td class="text-right">{{ item.yValue }}</td>
                </tr>
              </tbody>
            </table>
          </div> -->
        </div>
  
        <!-- 右侧主栏 -->
        <div class="col-md-8">
          <!-- 饼图区域 -->
          <div class="box-content mb-4">
            <div class="caption mb-3">
              <h6>特朗普政策提案类型统计</h6>
            </div>
            <div ref="policyCategoryChart" style="width:100%; height:400px;"></div>
          </div>
           <!-- 各国支持度趋势 -->
           <div class="box-content mb-4">
            <h5 class="caption mb-2" style="color:#fff;">各国支持度趋势</h5>
            <div ref="countryCharts" style="width:100%; height:300px;"></div>
          </div>
  
          <!-- 平均支持度趋势 -->
          <div class="box-content mb-4">
            <h5 class="caption mb-2" style="color:#fff;">平均支持度趋势</h5>
            <div ref="avgChart" style="width:100%; height:200px;"></div>
          </div>
          <!-- 世界热力图选择 -->
          <div class="box-content mb-4">
            <div class="caption mb-2 d-flex align-items-center">
              <h6 class="mb-0 mr-3">提案国家支持率分布</h6>
              <select
                v-model="selectedIssue"
                @change="loadIssueData(selectedIssue)"
                class="form-control form-control-sm"
                style="width: auto;"
              >
                <option
                  v-for="num in issueOptions"
                  :key="num"
                  :value="num"
                >
                  提案 {{ num }}
                </option>
              </select>
            </div>
            <div ref="worldMapChart" style="width:100%; height:500px;"></div>
          </div>
  
          <!-- 预留交互区 -->
          <!-- <div class="new-interactive-section">
            (其他新的交互界面将在这里展示...)
          </div> -->
          <div class="word-cloud-container">
    <h2>关键词词云图</h2>

        <wordcloud
        :data="defaultWords"
        nameKey="name"
        valueKey="value"
        :color="myColors"
        :showTooltip="true"
        :wordClick="wordClickHandler">
        </wordcloud>

      
  </div>
        </div>
      </div>
  
      <div class="footer">
        <div class="bottom-line"></div>
      </div>
    </div>
  </template>
  
<script>
import axios from 'axios';
import ICountUp from 'vue-countup-v2';
import * as echarts from 'echarts'; // 确保已安装并引入 ECharts
import 'echarts/map/js/world';

// 导入政策分类数据
import policyDataJson from '@/assets/data/分类.json';
import policy1 from '@/assets/data/TRUMPWORLD-issue-1.json';
import policy2 from '@/assets/data/TRUMPWORLD-issue-2.json';
import policy3 from '@/assets/data/TRUMPWORLD-issue-3.json';
import policy4 from '@/assets/data/TRUMPWORLD-issue-4.json';
import policy5 from '@/assets/data/TRUMPWORLD-issue-5.json';
import pres from '@/assets/data/TRUMPWORLD-pres.json';
import us from '@/assets/data/TRUMPWORLD-us.json';
import wordcloud from "vue-wordcloud";
// 保留可能通用的辅助函数
// var Order = "orderID"; // 如果不再需要可以移除
// var asc = function (x, y) { ... }
// var desc = function (x, y) { ... }
// function formatLargeNumber(num) { ... }
// function getXYData(data, property) { ... }
// var monthArray = ['1月', ...]; // 如果新界面仍需月份，保留

export default {
    name: 'index',
    components: {
        ICountUp,
        wordcloud,  
        // ECharts // 如果作为组件使用
    },
    data() {
        return {
            delay: 0,
            options: { // ICountUp options
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                prefix: '',
                suffix: ''
            },
           
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

            // 新图表所需数据
            policyCategoryStats: [],
            selectedIssue: 1, // 当前选择的提案编号
            issueOptions: [1, 2, 3, 4, 5], // 提案选项
            proposalLabels: { // <--- 新增这个对象
        1: "撤销对国际气候变化协议的支持",
        2: "在美国和墨西哥边境修建隔离墙",
        3: "撤回美国对伊朗核武器协议的支持",
        4: "撤回美国对主要贸易协议的支持",
        5: "对来自某些穆斯林为主国家的入境人员实行更严格的限制"
      },
            worldMapData: [], // 用于保存热力图数据
            chartInstance: null, // 地图图表实例
            years: [],
            countries: [],        // 国家列表（从字段名里提取）
            seriesPres: [],       // 对总统支持度的多国折线数据
            seriesNat: [],        // 对国家支持度的多国折线数据
            avgPres: [],          // 全体平均——总统
            avgNat: [],           // 全体平均——国家
            // trump小像
            showTrumpInfo: false,
            trumpInfo: "特朗普是美国第45任总统，曾在2017年至2021年任职。他的政策主张包括减税、移民改革和贸易保护主义等。",
        };
    },
    methods: {
         // 在 mounted 或 processData 里做一次转换：
    //   prepareWordCloud() {
    //     this.words = this.rawWords.map(([text, value]) => ({ text, value }));
    //   },
    wordClickHandler(name, value, vm) {
      console.log('wordClickHandler', name, value, vm);
    },
        onReady: function (instance, CountUp) {
            return;
        },
        tdSelect(item) {
            console.log("Selected area:", item);
        },
        processData() {
            // ① 年份数组
            this.years = pres.map(d => d.year);

            // ② 国家列表：取第 1 条记录的所有字段，去掉 "year" 和 "avg"
            this.countries = Object.keys(pres[0])
                .filter(k => k !== 'year' && k !== 'avg');

            // ③ 每个国家的两条折线
            this.seriesPres = this.countries.map(country => ({
                name: country,
                type: 'line',
                data: pres.map(d => d[country] !== '' ? +d[country] : null)
            }));
            this.seriesNat = this.countries.map(country => ({
                name: country,
                type: 'line',
                data: us.map(d => d[country] !== '' ? +d[country] : null)
            }));

            // ④ 全体平均
            this.avgPres = pres.map(d => +d.avg);
            this.avgNat = us.map(d => +d.avg);
        },
        processPolicyCategoryData() {

            const categoryCounts = {};
            const policy1count = {};
            const policy2count = {};
            const policy3count = {};
            const policy4count = {};
            const policy5count = {};
            policyDataJson.forEach(item => {
                if (item.category) {
                    categoryCounts[item.category] = (categoryCounts[item.category]|| 0) + 1;
                }
            });
            // console.log("政策分类数据:", policyDataJson);
            // console.log(categoryCounts)
            //每个国家对特朗普政策的支持率，所有国家
            policy1.forEach(item => {
                if (item.country) {
                    console.log(item.country)
                    policy1count[item.country] = policy1count[item.net_approval];
                }
            });
            console.log(policy1)
            console.log("111", policy1count)
            policy2.forEach(item => {
                if (item.country) {
                    policy2count[item.country] = policy2count[item.net_approval];
                }
            });
            policy3.forEach(item => {
                if (item.country) {
                    policy3count[item.country] = policy3count[item.net_approval];
                }
            });
            policy4.forEach(item => {
                if (item.country) {
                    policy4count[item.country] = policy4count[item.net_approval];
                }
            });
            policy5.forEach(item => {
                if (item.country) {
                    policy5count[item.country] = policy5count[item.net_approval];
                }
            });

            this.policyCategoryStats = Object.keys(categoryCounts).map(categoryName => {
                return {
                    name: categoryName,
                    value: categoryCounts[categoryName]
                };
            });
            this.policy1 = Object.keys(policy1count).map(categoryName => {
                return {
                    name: categoryName,
                    value: policy1count[categoryName]
                };
            });
            this.policy2 = Object.keys(policy2count).map(categoryName => {
                return {
                    name: categoryName,
                    value: policy2count[categoryName]
                };
            });
            this.policy3 = Object.keys(policy3count).map(categoryName => {
                return {
                    name: categoryName,
                    value: policy3count[categoryName]
                };
            });
            this.policy4 = Object.keys(policy4count).map(categoryName => {
                return {
                    name: categoryName,
                    value: policy4count[categoryName]
                };
            });
            this.policy5 = Object.keys(policy5count).map(categoryName => {
                return {
                    name: categoryName,
                    value: policy5count[categoryName]
                };
            });


        },
        loadIssueData(issueNumber) {
            let data = [];
            switch (issueNumber) {
            case 1:
                data = this.formatDataForWorldMap(policy1);
                break;
            case 2:
                data = this.formatDataForWorldMap(policy2);
                break;
            case 3:
                data = this.formatDataForWorldMap(policy3);
                break;
            case 4:
                data = this.formatDataForWorldMap(policy4);
                break;
            case 5:
                data = this.formatDataForWorldMap(policy5);
                break;
            }

            this.worldMapData = data;
            this.drawWorldMapChart();
        },
        formatDataForWorldMap(jsonData) {
            return jsonData.map(item => ({
            name: item.country,
            value: parseFloat(item.net_approval)
            }));
        },

        drawPolicyCategoryChart() {
            const chartDom = this.$refs.policyCategoryChart;
            if (!chartDom) {
                console.error("政策分类图表的DOM元素未找到!");
                return;
            }
            if (!this.policyCategoryStats || this.policyCategoryStats.length === 0) {
                console.warn("政策分类数据为空，不绘制图表。");
                // 可以在DOM上显示提示信息
                chartDom.innerHTML = '<p style="color: #fff; text-align: center; padding-top: 20px;">政策分类数据为空</p>';
                return;
            }

            const myChart = echarts.init(chartDom);
            const option = {
                title: {
                    text: '特朗普政策提案类型统计 (2025/01/20 - 02/24)',
                    left: 'center',
                    textStyle: {
                        color: '#9AA8D4',
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top: 'middle',
                    data: this.policyCategoryStats.map(item => item.name),
                    textStyle: {
                        color: '#9AA8D4'
                    }
                },
                series: [
                    {
                        name: '政策类型',
                        type: 'pie',
                        radius: '70%', // 可以调整饼图大小
                        center: ['60%', '55%'], // 调整饼图位置，给图例留出空间
                        data: this.policyCategoryStats,
                        itemStyle: {
                            areaColor: '#2a333d',
                            borderColor: '#fff',   // 白色边框
                            borderWidth: 1
                        },
                        emphasis: {
                            itemStyle: {
                                areaColor: '#2a333d',
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            color: '#fff',
                            formatter: '{b}: {d}%'
                        },
                        labelLine: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
            window.addEventListener('resize', () => {
                if (myChart && !myChart.isDisposed()) {
                    myChart.resize();
                }
            });
            // 将 myChart 实例保存到组件实例上，以便在 beforeDestroy 中清理
            this.policyCategoryChartInstance = myChart;
        },

        drawCharts() {
            // —— 1. 多国折线 —— 
            // 我们把总统和国家两套 series 拼到一起
            const allSeries = [
                ...this.seriesPres.map(s => ({ ...s, smooth: true, lineStyle: { width: 2 } })),
                ...this.seriesNat.map(s => ({
                    ...s, smooth: true, lineStyle: { width: 2 },
                    // 给国家系列加个后缀区分
                    name: s.name + '（国家）'
                }))
            ].map(serie => {
                // 默认调暗
                const baseLineStyle = { opacity: 5, width: 5 };
                // 鼠标 / programmatic 高光时恢复
                const emphasis = { focus: 'series', lineStyle: { opacity: 10, width: 30,color: 'red' } };
                return {
                    ...serie,
                    lineStyle: { ...baseLineStyle, ...(serie.lineStyle || {}) },
                    emphasis
                };
            });
            console.log("allSeries", allSeries);
            const countryChart = echarts.init(this.$refs.countryCharts);
            countryChart.setOption({
                title: {
                    text: '各国对总统 & 对国家支持度趋势',
                    left: 'center',
                    textStyle: { color: '#fff' }
                },
                tooltip: { trigger: 'axis' },
                legend: {
                    data: allSeries.map(s => s.name),
                    type: 'scroll',
                    top: 30,
                    textStyle: { color: '#9AA8D4' }
                },
                grid: { left: '3%', right: '4%', bottom: '8%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: this.years,
                    axisLabel: { color: '#9AA8D4' }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#9AA8D4' }
                },
                series: allSeries
            });
            window.addEventListener('resize', countryChart.resize);

            // —— 2. 全体平均折线 —— 
            const avgChart = echarts.init(this.$refs.avgChart);
            avgChart.setOption({
                title: {
                    text: '全体平均支持度趋势',
                    left: 'center',
                    textStyle: { color: '#fff' }
                },
                tooltip: { trigger: 'axis' },
                legend: {
                    data: ['平均——总统', '平均——国家'],
                    top: 30,
                    textStyle: { color: '#9AA8D4' }
                },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: this.years,
                    axisLabel: { color: '#9AA8D4' }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#9AA8D4' }
                },
                series: [
                    {
                        name: '平均——总统',
                        type: 'line',
                        data: this.avgPres,
                        smooth: true,
                        lineStyle: { width: 2 }
                    },
                    {
                        name: '平均——国家',
                        type: 'line',
                        data: this.avgNat,
                        smooth: true,
                        lineStyle: { width: 2, type: 'dashed' ,color:'blue'}
                    }
                ]
            });
            window.addEventListener('resize', avgChart.resize);
            countryChart.on('legendselectchanged', params => {
                const clickedSeriesName = params.name; // 获取当前被点击操作的图例项目名称 (string)
                const selectionStates = params.selected; // 获取所有图例项目的当前选中状态 (object)
                console.log("Clicked series name:", clickedSeriesName);
                console.log("Selection states:", selectionStates);
                console.log("All series:", allSeries);
                allSeries.forEach(serie => {
                    // 检查当前遍历到的系列 (serie) 是否是刚刚被点击的那个，
                    // 并且这个系列在图例中现在是“选中”状态
                    if (serie.name === clickedSeriesName && selectionStates[clickedSeriesName]) {
                        // 如果是，则高亮这个系列
                        countryChart.dispatchAction({
                            type: 'highlight',
                            seriesName: serie.name
                        });
                    } else {
                        // 否则，将其余所有系列都设置为普通（在你代码中是暗淡）状态
                        // (包括那些被取消选中的系列，以及其他未被点击但仍保持选中状态的系列)
                        // ECharts 默认会隐藏取消选中的图例对应的系列，downplay 调用能确保其视觉效果回到基础样式
                        countryChart.dispatchAction({
                            type: 'downplay',
                            seriesName: serie.name
                        });
                    }
                });
            });

  // —— 3. 点击图例时，只高光选中系列的线，其余系列调暗 —— 
  const names = allSeries.map(s => s.name);
  countryChart.on('legendselectchanged', ({ name: selectedName }) => {
    names.forEach(name => {
      countryChart.dispatchAction({
        type: name === selectedName ? 'highlight' : 'downplay',
        seriesName: name
      });
    });
  });

  this.countryChart = countryChart;


  window.addEventListener('resize', avgChart.resize);
  this.avgChart = avgChart;
},
    drawWorldMapChart() {
        const chartDom = this.$refs.worldMapChart;
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        const selectedIssueLabel = this.proposalLabels[this.selectedIssue] || `提案 ${this.selectedIssue}`; // 后备文本
        const option = {
            title: {
            text: `特朗普提案 ${selectedIssueLabel} - 各国净支持率分布`,
            left: 'center',
            textStyle: { color: '#fff' }
            },
            tooltip: {
            trigger: 'item',
            formatter: params => {
                return `${params.name}<br/>净支持率: ${params.value}`;
            }
            },
            visualMap: {
  type: 'continuous',
  min: -89,
  max:  41,
  calculable: true,
  orient: 'horizontal',
  bottom: 20,
  left: 'center',
  text: ['高支持率','低支持率'],
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
        }
    },
    mounted() {
        // this.prepareWordCloud();
        console.log("Vue component mounted. Preparing new policy category chart.");
        this.processPolicyCategoryData();
        this.processData();
        this.drawPolicyCategoryChart();
        this.drawCharts();
        this.loadIssueData(this.selectedIssue);
    
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
    }
}
</script>

<style scoped>
/* 您原有的样式 */
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

.box-content {
    display: block;
    line-height: 1.42857143;
    -webkit-transition: border 0.2s ease-in-out;
    -o-transition: border 0.2s ease-in-out;
    transition: border 0.2s ease-in-out;
    /* 为了美观，给图表容器也加上背景和边框 */
    /* background-color: rgba(25, 47, 89, 0.5); */
    /* 示例背景色 */
    /* border: 1px solid rgba(130, 157, 248, 0.3); */
    /* 示例边框色 */
    padding: 10px;
    /* 增加内边距 */
}

.statistic-item {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    overflow: hidden;
}

.statistic-item .icon-content {
    width: 50px;
    min-width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3b4e82;
    border-radius: 50%;
}

.icon-content .iconfont {
    font-size: 24px;
    color: #fff;
}

.text-content {
    margin-left: 10px;
    overflow: hidden;
}

.statistic-item .text {
    font-size: 26px;
    color: #fff;
}

.statistic-item .sub-title {
    font-size: 14px;
    text-align: left;
    color: rgb(154, 168, 212);
}

.table {
    width: 100%;
    background-color: transparent;
    color: #666;
    border-width: 1px;
    border-style: solid;
    border-color: #e6e6e6;
}

.table.darkblue {
    border-color: rgba(130, 157, 248, 0.705);
}

.table.darkblue td {
    border: none;
}

.table.darkblue tr .th {
    color: rgb(154, 168, 212);
}

.table.darkblue tr td {
    color: rgb(229, 233, 247);
}

.table td,
.table th {
    position: relative;
    padding: 9px 15px;
    min-height: 20px;
    line-height: 20px;
    font-size: 14px;
    border-width: 1px;
    border-style: solid;
    border-color: #e6e6e6;
    padding: 5px 10px;
    border-top: none;
    border-left: none
}

.table td:last-child {
    border-right: none;
}

.td_right {
    text-align: right;
}

.box-content .caption {
    text-align: left;
    color: #fff;
}

small.number {
    color: #0b8603;
    font-weight: bold;
}

.warning {
    color: red;
}
/* 新增特朗普小像样式 */

.trump-fixed-container {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 33.333333%; /* 保持col-md-4的宽度 */
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    pointer-events: none; /* 允许点击穿透到下方内容 */
}

.trump-portrait-container {
    pointer-events: auto; /* 恢复小像区域的点击事件 */
    max-width: 90%;
    padding: 20px;
}

.scrollable-content {
    margin-left: 33.333333%; /* 为固定的小像留出空间 */
    width: 66.666667%; /* col-md-8的宽度 */
}

/* 响应式调整 - 
当屏幕宽度小于992px时，.trump-fixed-container 会变为普通流式布局，不再固定，宽度100%
*/
@media (max-width: 992px) {
    .trump-fixed-container {
        position: static;
        width: 100%;
        height: auto;
        transform: none;
    }
    
    .scrollable-content {
        margin-left: 0;
        width: 100%;
    }
}

.trump-portrait {
    max-width: 100%;
    max-height: 400px;
    border: 3px solid rgba(130, 157, 248, 0.705);
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.trump-portrait:hover {
    transform: scale(1.05);
}

.trump-info-tooltip {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(25, 47, 89, 0.9);
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    width: 80%;
    text-align: center;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 100;
}
.word-cloud-container {
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>