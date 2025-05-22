<template>
    <div class="page">
        <div class="header">
            <div class="title">
                特朗普支持率研究
            </div>
            <div class="title-bottom">
                <div class="bottom-sidebar"></div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="col-sm-12 col-md-12">
                    <div class="box-content">
                        <div class="statistic-box row">
                            <div class="statistic-item col-md-6" v-for="item in indexData" :key="item.name">
                                <div class="icon-content">
                                    <span class="iconfont icon-shuju"></span>
                                </div>
                                <div class="text-content">
                                    <div class="text">
                                        <span class="counter">
                                            <ICountUp :delay="delay" :endVal="item.value" :options="options"
                                                @ready="onReady" />
                                        </span>
                                    </div>
                                    <div class="sub-title">{{ item.name }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <table class="table border-table darkblue" style="width: 100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="th" style="width: 90px;">排名</td>
                            <td class="th">区域</td>
                            <td class="th td_right">
                                <!-- 年销售量 -->
                            </td>
                            <td class="th td_right">
                                <!-- 月销售量 -->
                            </td>
                        </tr>
                        <tr v-for="(item, index) in datalist" :key="item.id">
                            <td class="border_bottom border_left_no">{{ index + 1 }}</td>
                            <td class="border_bottom enable" @click='tdSelect(item)'>
                                {{ item.area }}
                            </td>
                            <td class="td_right">
                                {{ item.nValue }}
                            </td>
                            <td class="td_right">
                                {{ item.yValue }}
                            </td>
                        </tr>
                    </table>
                </div>

            </div>

            <div class="col-md-8">
                <div class="row">
                    <div class="col-sm-12 col-md-12">
                        <div class="box-content">
                            <div class="caption">
                                <div class="main">
                                    <h2>
                                        <ICountUp :endVal="totalSales" />
                                        <small class="number warning">20.11%</small>
                                    </h2>
                                </div>
                                <div>
                                    <h6>特朗普政策提案类型统计</h6>
                                </div>
                            </div>

                            <div class="box-content" style="margin-top: 20px;">
                                <div ref="policyCategoryChart" style="height: 400px; width: 100%;"></div>
                            </div>

                            <div class="new-interactive-section" style="height: 200px; border: 1px dashed #ccc; margin-top: 20px; padding: 10px; color: #fff; text-align:center;">
                                (其他新的交互界面将在这里展示...)
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <div class="box-content" style="margin-top: 20px;">
                    <div class="caption">
                    <h4>提案国家支持率分布</h4>
                    <select v-model="selectedIssue" @change="loadIssueData(selectedIssue)">
                        <option v-for="num in issueOptions" :key="num" :value="num">提案 {{ num }}</option>
                    </select>
                    </div>
                    <div ref="worldMapChart" style="height: 500px; width: 100%;"></div>
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
import 'echarts/map/js/world.js';

// 导入政策分类数据
import policyDataJson from '@/assets/data/分类.json'; // <<== 确保路径正确

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
            indexData: [
                { name: '当前月销售额', value: 2341560 },
                { name: '对比上月增长', value: 1582 },
                { name: '总订单数', value: 2320 },
                { name: '客户数', value: 1560 },
                { name: '总客户数', value: 1560 }
            ],
            totalSales: 33710896.94,
            datalist: [
                { ranking: 1, area: "广东", nValue: 1758000, yValue: 214589 },
                { ranking: 1, area: "汕头", nValue: 175180, yValue: 145389 },
                { ranking: 1, area: "潮汕", nValue: 174580, yValue: 142589 }
            ],
            // 新图表所需数据
            policyCategoryStats: [],
            selectedIssue: 1, // 当前选择的提案编号
            issueOptions: [1, 2, 3, 4, 5], // 提案选项
            worldMapData: [], // 用于保存热力图数据
            chartInstance: null, // 地图图表实例
        };
    },
    methods: {
        onReady: function (instance, CountUp) {
            return;
        },
        tdSelect(item) {
            console.log("Selected area:", item);
        },

        processPolicyCategoryData() {
            if (!policyDataJson || !Array.isArray(policyDataJson)) {
                console.error("政策分类数据加载失败或格式不正确!");
                this.policyCategoryStats = [];
                return;
            }

            const categoryCounts = {};
            policyDataJson.forEach(item => {
                if (item.category) {
                    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
                }
            });

            this.policyCategoryStats = Object.keys(categoryCounts).map(categoryName => {
                return {
                    name: categoryName,
                    value: categoryCounts[categoryName]
                };
            });
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
                        emphasis: {
                            itemStyle: {
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
        loadIssueData(issueNumber) {
            const fileName = `TRUMPWORLD-issue-${issueNumber}.json`;
            fetch(require(`@/assets/data/${fileName}`))
                .then(res => res.json())
                .then(json => {
                this.worldMapData = data.default.map(item => ({
                    name: item.country,
                    value: parseFloat(item.net_approval),
                }));
                console.log('处理后的地图数据:', this.worldMapData);
                this.$nextTick(() => {
                    this.drawWorldMapChart();
                });
            }).catch(err => {
                console.error(`加载 ${fileName} 失败`, err);
            });
        },
        drawWorldMapChart() {
            if (!this.$refs.worldMapChart) return;

            if (this.chartInstance) {
                this.chartInstance.dispose(); // 清理旧实例
            }

            const chartDom = this.$refs.worldMapChart;
            const myChart = echarts.init(chartDom);

            if (!chartDom) {
                console.error('世界地图容器未找到');
                return;
            }

            console.log('找到地图容器:', chartDom);

            const option = {
                title: {
                    text: `特朗普提案 ${this.selectedIssue} 国家净支持率`,
                    left: 'center',
                    textStyle: { color: '#9AA8D4' }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: params => {
                        return `${params.name}<br/>净支持率: ${params.value}%`;
                    }
                },
                visualMap: {
                    min: -100,
                    max: 100,
                    inRange: {
                        color: ['#d73027', '#ffffbf', '#4575b4']
                    },
                    text: ['强烈反对', '中立', '强烈支持'],
                    calculable: true,
                    orient: 'horizontal',
                    bottom: 20,
                    left: 'center',
                    textStyle: { color: '#fff' }
                },
                series: [{
                    name: '净支持率',
                    type: 'map',
                    map: 'world',
                    roam: true,
                    label: { show: false },
                    data: this.worldMapData
                }]
            };

            myChart.setOption(option);
            this.chartInstance = myChart;

            // 注册 resize 监听器
            window.addEventListener('resize', this.onWindowResize);
        },
    },
    mounted() {
        console.log("Vue component mounted. Preparing new policy category chart.");
        this.processPolicyCategoryData();
        this.drawPolicyCategoryChart();
        this.loadIssueData(this.selectedIssue);
    },
    beforeDestroy() {
        // 清理 ECharts 实例和事件监听器
        if (this.policyCategoryChartInstance && !this.policyCategoryChartInstance.isDisposed()) {
            window.removeEventListener('resize', this.policyCategoryChartInstance.resize); // 如果是这样绑定的
            this.policyCategoryChartInstance.dispose();
            this.policyCategoryChartInstance = null;
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
    /* background-color: rgba(25, 47, 89, 0.5); */ /* 示例背景色 */
    /* border: 1px solid rgba(130, 157, 248, 0.3); */ /* 示例边框色 */
    padding: 10px; /* 增加内边距 */
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
</style>