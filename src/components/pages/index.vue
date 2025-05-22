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
                <div class="col-md-12" style="margin-top:20px;">
                    <h5 style="color:#fff;">各国支持度趋势</h5>
                    <div ref="countryCharts" style="width:100%; height:300px;"></div>
                </div>
                <div class="col-md-12" style="margin-top:20px;">
                    <h5 style="color:#fff;">平均支持度趋势</h5>
                    <div ref="avgChart" style="width:100%; height:200px;"></div>
                </div>

                <div class="col-md-12">
                    <table class="table border-table darkblue" style="width: 100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="th" style="width: 90px;">排名</td>
                            <td class="th">区域</td>
                            <td class="th td_right">
                            </td>
                            <td class="th td_right">
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
            <!-- 比如放在左侧 col-md-4 内，表格下方 -->
            <!-- <div class="col-md-12" style="margin-top: 20px;">
                <div ref="myLineChart" style="height: 300px; width: 100%;"></div>
            </div> -->
            <div ref="countryCharts" style="width:100%; height:400px;"></div>
            <div ref="avgChart" style="width:100%; height:300px; margin-top:20px;"></div>

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

                            <div class="new-interactive-section"
                                style="height: 200px; border: 1px dashed #ccc; margin-top: 20px; padding: 10px; color: #fff; text-align:center;">
                                (其他新的交互界面将在这里展示...)
                            </div>

                        </div>
                    </div>
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

// 导入政策分类数据
import policyDataJson from '@/assets/data/分类.json';
import policy1 from '@/assets/data/TRUMPWORLD-issue-1.json';
import policy2 from '@/assets/data/TRUMPWORLD-issue-2.json';
import policy3 from '@/assets/data/TRUMPWORLD-issue-3.json';
import policy4 from '@/assets/data/TRUMPWORLD-issue-4.json';
import policy5 from '@/assets/data/TRUMPWORLD-issue-5.json';
import pres from '@/assets/data/TRUMPWORLD-pres.json';
import us from '@/assets/data/TRUMPWORLD-us.json';

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
            years: [],
            countries: [],        // 国家列表（从字段名里提取）
            seriesPres: [],       // 对总统支持度的多国折线数据
            seriesNat: [],        // 对国家支持度的多国折线数据
            avgPres: [],          // 全体平均——总统
            avgNat: [],           // 全体平均——国家
        };
    },
    methods: {
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
                    categoryCounts[item.category] = categoryCounts[item.category];
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
                        lineStyle: { width: 2, type: 'dashed' }
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

            this.countryChart = countryChart;
            this.avgChart = avgChart;
        },
    },
    mounted() {
        console.log("Vue component mounted. Preparing new policy category chart.");
        this.processPolicyCategoryData();
        this.processData();
        this.drawPolicyCategoryChart();
        this.drawCharts();

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
</style>