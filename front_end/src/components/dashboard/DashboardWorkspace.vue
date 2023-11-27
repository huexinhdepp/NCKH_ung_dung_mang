<template>
    <div class="dashboard-workspace">
        <div class="dashboard-content">
            <grid-layout
                :isResizable="false"
                :isDraggable="false"
                :layout="[]"
                :col-num="12"
                :row-height="30"
            >
                <grid-item :x="0" :y="0" :w="4" :h="2" i="1">
                    Số lượng sinh viên:
                    {{ studentNumber }}
                </grid-item>
                <grid-item :x="4" :y="0" :w="4" :h="2" i="2">
                    Mã lớp:
                    {{ classId }}
                </grid-item>
                <grid-item :x="8" :y="0" :w="4" :h="2" i="2">
                    Giảng viên:
                    {{ hostName }}
                </grid-item>
                <!-- <a> -->

                <grid-item :x="0" :y="2" :w="3" :h="2" i="2">
                    Tên môn học:
                    {{ subjectName }}
                </grid-item>
                <grid-item :x="3" :y="2" :w="3" :h="2" i="2">
                    Mã môn:
                    {{ subjectCode }}
                </grid-item>
                <grid-item :x="6" :y="2" :w="3" :h="2" i="2">
                    Số buổi học(đã đăng kí trên hệ thống):
                    {{ countScheduler }}
                </grid-item>
                <grid-item :x="9" :y="2" :w="3" :h="2" i="2">
                    Tổng số tiết học(đã đăng ký trên hệ thống):
                    {{ countSession }}
                </grid-item>
                <!-- <a></a> -->
                <grid-item :x="0" :y="4" :w="8" :h="8" i="2">
                    <highChart
                        v-if="isReady"
                        style="max-width: 100%; max-height: 100%"
                        :options="dashboardAnalyticsAttendance"
                    ></highChart>
                </grid-item>
                <grid-item :x="8" :y="4" :w="4" :h="8" i="2">
                    <highChart
                        v-if="isReady"
                        style="max-width: 100%; max-height: 100%"
                        :options="dashboardAnalyticsAttendanceAvoid"
                    ></highChart>
                </grid-item>
                <!-- <a></a> -->
                <grid-item :x="0" :y="13" :w="6" :h="10" i="2">
                    <div>
                        <highChart
                            v-if="isReady"
                            style="max-width: 100%; max-height: 100%"
                            :options="dashboardAnalyticsPointAverage"
                        ></highChart>
                    </div>
                </grid-item>
                <grid-item :x="6" :y="13" :w="6" :h="10" i="2">
                    <div>
                        <highChart
                            v-if="isReady"
                            style="max-width: 100%; max-height: 100%"
                            :options="dashboardAnalyticsPointHightest"
                        ></highChart>
                    </div>
                </grid-item>
            </grid-layout>
        </div>
    </div>
</template>

<script>
import { documentAPI } from "@/api/document.js";
import VueGridLayout from "vue-grid-layout";
import Highcharts from "highcharts";
import { Chart } from "highcharts-vue";
import HighchartsMore from "highcharts/highcharts-more";
HighchartsMore(Highcharts);
export default {
    components: {
        "grid-layout": VueGridLayout.GridLayout,
        "grid-item": VueGridLayout.GridItem,
        highChart: Chart,
    },
    name: "dashboardWorkspace",
    data() {
        return {
            isReady: false,
            originData: {},
            // studentNumber: 0,
            // classId: "",
            teacher: "",
            allUsers: [],
            columnDefs: [],
            rawData: [],
        };
    },
    async created() {
        this.allUsers = this.$store.state.user.users;
        let res = await documentAPI.detailDocument(this.$route.params.id);
        this.columnDefs = res.columnDefs;
        this.rawData = res.rawData;
        this.originData = {
            detail: res.detail,
            info: res.info,
            scheduler: res.scheduler,
            session: res.session,
            subject: res.subject,
        };
        this.isReady = true;
    },

    computed: {
        hostName() {
            if (this.originData.info) {
                let hostId = this.originData.info.host;
                let host = this.allUsers.find((u) => u.id == hostId);
                return host.userNameDisplay;
            }
            return "";
        },
        studentNumber() {
            if (this.originData.detail) {
                return this.originData.detail.length;
            }
            return 0;
        },
        classId() {
            if (this.originData.info) {
                return this.originData.info.classId;
            }
            return "";
        },
        countScheduler() {
            if (this.originData.scheduler) {
                return this.originData.scheduler.length;
            }
            return "";
        },
        countSession() {
            if (this.originData.session) {
                return this.originData.session.length;
            }
            return "";
        },
        subjectCode() {
            if (this.originData.subject) {
                return this.originData.subject.subjectId;
            }
            return "";
        },
        subjectName() {
            if (this.originData.subject) {
                return this.originData.subject.name;
            }
            return "";
        },
        dashboardAnalyticsAttendance() {
            let addBySchedulerField = this.columnDefs
                .filter((a) => a.addByScheDuler)
                .map((a) => a.field);
            let data = [];
            this.rawData.map((a) => {
                let count = 0;
                for (let f of addBySchedulerField) {
                    if (a[f] == parseInt(a[f])) {
                        count += parseInt(a[f]);
                    }
                }
                data.push([a.userNameDisplay, count]);
            });
            let chartOptions = {
                chart: {
                    type: "column",
                },
                title: {
                    text: "Thống kê số tiết nghỉ theo sinh viên",
                },
                subtitle: {
                    text: "dữ liệu được lấy ra từ những buổi học được đăng kí trên hệ thống",
                },
                xAxis: {
                    type: "category",
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: "13px",
                            fontFamily: "Verdana, sans-serif",
                        },
                    },
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Số tiết nghỉ",
                    },
                },
                tooltip: {
                    pointFormat: "<b>{point.y} (tiết)</b>",
                },
                series: [
                    {
                        name: "Sinh viên",
                        data: data,
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            color: "#FFFFFF",
                            align: "right",
                            format: "{point.y}", // one decimal
                            y: 10, // 10 pixels down from the top
                            style: {
                                fontSize: "13px",
                                fontFamily: "Verdana, sans-serif",
                            },
                        },
                    },
                ],
            };

            return chartOptions;
        },
        dashboardAnalyticsPointAverage() {
            let MarkField = this.columnDefs.filter((a) => a.isMarkField);
            let data = [];
            MarkField.map((m) => {
                let sum = 0;
                for (let r of this.rawData) {
                    if (r[m.field] != undefined) {
                        sum += Number(r[m.field]);
                    }
                }
                let average = sum / this.rawData.length;
                data.push([m.headerName, average]);
            });

            let chartOptions = {
                chart: {
                    type: "line",
                },
                title: {
                    text: "Điểm trung bình qua các bài thi",
                },
                subtitle: {
                    text: "dữ liệu được lấy ra từ những cột được đánh dấu là 'trường để nhập điểm'",
                },
                xAxis: {
                    type: "category",
                    labels: {
                        style: {
                            fontSize: "13px",
                            fontFamily: "Verdana, sans-serif",
                        },
                    },
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Điểm trung bình",
                    },
                },
                tooltip: {
                    pointFormat: "<b>{point.y}</b>",
                },
                series: [
                    {
                        name: "Bài kiểm tra",
                        data: data,
                        dataLabels: {
                            enabled: true,
                            color: "#FFFFFF",
                            align: "right",
                            format: "{point.y}", // one decimal
                            y: 10, // 10 pixels down from the top
                            style: {
                                fontSize: "13px",
                                fontFamily: "Verdana, sans-serif",
                            },
                        },
                    },
                ],
            };

            return chartOptions;
        },
        dashboardAnalyticsPointHightest() {
            let MarkField = this.columnDefs.filter((a) => a.isMarkField);
            let data = [];
            let studentName = "";
            MarkField.map((m) => {
                let hightest = 0;
                for (let r of this.rawData) {
                    if (r[m.field] != undefined) {
                        if (hightest < Number(r[m.field])) {
                            hightest = Number(r[m.field]);
                            studentName = r.userNameDisplay;
                        }
                    }
                }
                data.push({
                    label: m.headerName,
                    y: hightest,
                    studentName: studentName,
                });
            });

            let chartOptions = {
                chart: {
                    type: "line",
                },
                title: {
                    text: "Điểm cao nhất trong các bài thi",
                },
                subtitle: {
                    text: "dữ liệu được lấy ra từ những cột được đánh dấu là 'trường để nhập điểm'",
                },
                xAxis: {
                    type: "category",
                    labels: {
                        style: {
                            fontSize: "13px",
                            fontFamily: "Verdana, sans-serif",
                        },
                        formatter: (a) => {
                            console.log(a);
                            return a.chart.userOptions.series[0].data[a.value]
                                .label;
                        },
                    },
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Điểm cao nhất",
                    },
                },
                tooltip: {
                    pointFormat: "<b>{point.studentName}: {point.y}</b>",
                },
                series: [
                    {
                        name: "Bài kiểm tra",
                        data: data,
                        dataLabels: {
                            enabled: true,
                            color: "#FFFFFF",
                            align: "right",
                            format: "{point.y}", // one decimal
                            y: 10, // 10 pixels down from the top
                            style: {
                                fontSize: "13px",
                                fontFamily: "Verdana, sans-serif",
                            },
                        },
                    },
                ],
            };

            return chartOptions;
        },
        dashboardAnalyticsAttendanceAvoid() {
            let data = [];
            let addBySchedulerField = this.columnDefs.filter(
                (a) => a.addByScheDuler
            );
            addBySchedulerField.map((m) => {
                let count = 0;
                for (let r of this.rawData) {
                    if (r[m.field] != undefined) {
                        if (r[m.field] != "0" && Number(r[m.field]) != 0) {
                            count += 1;
                        }
                    }
                }
                data.push([m.headerName, count]);
            });
            let options = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height: "100%",
                    type: "pie",
                },
                title: {
                    text: "Số lượng sinh viên nghỉ(theo ngày)",
                    style: {
                        fontSize: "12px",
                    },
                    align: "left",
                },
                tooltip: {
                    pointFormat: "{series.name}: <b>{point.y}</b>",
                },
                // accessibility: {
                //     point: {
                //         valueSuffix: "%",
                //     },
                // },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: "pointer",
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "8px",
                            },
                            format: "Ngày:{point.name}",
                        },
                    },
                },
                series: [
                    {
                        name: "Số sinh viên nghỉ",
                        colorByPoint: true,
                        data: data,
                    },
                ],
            };
            return options;
        },
    },
};
</script>

<style scoped>
.dashboard-content {
    width: 100%;
    width: -moz-available; /* WebKit-based browsers will ignore this. */
    width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
    width: stretch;
}
.dashboard-workspace {
    display: flex;
    height: 100%;
}
.dashboard-config {
    width: 25%;
    border-left: 1px black solid;
}

/* test layout */
.vue-grid-layout {
    background: #eee;
}

.layoutJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
}

.columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
}

.vue-resizable-handle {
    z-index: 5000;
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=");
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: se-resize;
}

.vue-grid-item:not(.vue-grid-placeholder) {
    background: #ccc;
    border: 1px solid black;
}

.vue-grid-item.resizing {
    opacity: 0.9;
}

.vue-grid-item.static {
    background: #cce;
}

.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 24px;
}

.vue-grid-item .minMax {
    font-size: 12px;
}

.vue-grid-item .add {
    cursor: pointer;
}

.remove {
    position: absolute;
    right: 2px;
    top: 0;
    cursor: pointer;
}
</style>
