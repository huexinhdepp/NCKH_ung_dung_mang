<template>
    <v-app id="inspire" data-app>
        <v-row>
            <v-col>
                <v-sheet height="400">
                    <v-calendar
                        class="show-calendar"
                        first-time="06:00"
                        ref="calendar"
                        :now="today"
                        :value="today"
                        :events="events"
                        color="primary"
                        @click:event="showEvent"
                        type="week"
                    ></v-calendar>
                    <v-menu
                        v-model="selectedOpen"
                        :close-on-content-click="false"
                        :activator="selectedElement"
                        offset-x
                    >
                        <v-card color="grey lighten-4" min-width="350px" flat>
                            <v-toolbar :color="selectedEvent.color" dark>
                                <v-toolbar-title
                                    v-html="selectedEvent.name"
                                ></v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon>
                                    <v-icon>mdi-heart</v-icon>
                                </v-btn>
                                <v-btn icon>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-card-text>
                                <span v-html="selectedEvent.note"></span>
                            </v-card-text>
                            <a
                                v-if="
                                    selectedEvent.scheduler
                                        ? selectedEvent.scheduler.zoomURl != ''
                                        : false
                                "
                                :href="selectedEvent.scheduler.zoomURl"
                            >
                                <v-btn>tham gia</v-btn>
                            </a>
                            <v-card-actions>
                                <v-btn
                                    text
                                    color="secondary"
                                    @click="selectedOpen = false"
                                >
                                    Cancel
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-menu>
                </v-sheet>
            </v-col>
            <showListDocument
                :callByScheduler="true"
                @toConfigScheduler="toConfigScheduler"
            ></showListDocument>
        </v-row>
    </v-app>
</template>

<script>
import { schedulerAPI } from "@/api/scheduler";
import ShowListDocument from "../document/ShowListDocument.vue";
import dayjs from "dayjs";
export default {
    components: {
        ShowListDocument,
    },
    data: () => ({
        today: dayjs().format("YYYY-MM-DD"),
        focus: "",
        type: "week",
        selectedOpen: false,
        events: [],
        selectedEvent: {},
        selectedElement: null,
    }),
    async created() {
        let monday = dayjs()
            .subtract(dayjs().day(), "day")
            .format("YYYY-MM-DD");
        let sunday = dayjs()
            .add(7 - dayjs().day(), "day")
            .format("YYYY-MM-DD");
        var firstday = monday;
        var lastday = sunday;

        let res = await schedulerAPI.getScheduler(firstday, lastday);
        console.log(res);
        var a = res;
        let result = [];
        let schedulerId = a.map((i) => {
            return i.scheduler;
        });
        // function onlyUnique(value, index, array) {
        //     return array.indexOf(value) === index;
        // }
        let schedulerClone = [];
        schedulerId = schedulerId.filter((s) => {
            if (!schedulerClone.includes(s.id)) {
                schedulerClone.push(s.id);
                return true;
            }
            return false;
        });
        // console.log(schedulerId);

        for (let i of schedulerId) {
            let sessionBySchedulerId = a.filter((a) => {
                return a.scheduler.id == i.id;
            });
            // console.log(sessionBySchedulerId);
            let mergeSession = {
                scheduler: sessionBySchedulerId[0].scheduler,
                name: "Phòng học: " + sessionBySchedulerId[0].classroom.room_id, // tạm để cái này, sau sẽ trả ra name
                subjectName: sessionBySchedulerId[0].document.subject.name,
                documentId: sessionBySchedulerId[0].document.subject.classId,
                note: sessionBySchedulerId[0].note,
                startDate: sessionBySchedulerId[0].date,
                endDate: sessionBySchedulerId[0].date,
            };
            let startTime = {
                current: 0,
                value: "",
            };
            let endTime = {
                current: 0,
                value: "",
            };
            for (let ses of sessionBySchedulerId) {
                switch (ses.time_slot) {
                    case 1:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "07:00";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "07:50";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 2:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "07:50";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "08:40";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 3:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "08:50";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "09:40";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 4:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "09:50";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "10:40";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 5:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "10:40";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "11:30";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 7:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "12:30";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "13:20";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 8:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "13:20";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "14:10";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 9:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "14:20";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "15:10";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 10:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "15:20";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "16:10";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 11:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "16:10";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "17:00";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 13:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "17:30";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "18:20";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 14:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "18:20";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "19:10";
                            endTime.current = ses.time_slot;
                        }

                        break;
                    case 15:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "19:20";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "20:10";
                            endTime.current = ses.time_slot;
                        }
                        break;
                    case 16:
                        if (
                            ses.time_slot < startTime.current ||
                            startTime.current == 0
                        ) {
                            startTime.value = "20:10";
                            startTime.current = ses.time_slot;
                        }
                        if (
                            ses.time_slot > endTime.current ||
                            endTime.current == 0
                        ) {
                            endTime.value = "21:00";
                            endTime.current = ses.time_slot;
                        }

                        break;
                }
            }
            mergeSession.startDate =
                mergeSession.startDate + " " + startTime.value;
            mergeSession.endDate = mergeSession.endDate + " " + endTime.value;
            // mergeSession.scheduler =
            result.push(mergeSession);
        }
        console.log(result);
        for (var i = 0; i < result.length; i++) {
            this.events.push({
                subjectName: result[i].subjectName,
                documentId: result[i].documentId,
                note: result[i].note,
                name: result[i].name,
                start: result[i].startDate,
                end: result[i].endDate,
                scheduler: result[i].scheduler,
            });
        }
    },
    mounted() {
        this.$refs.calendar.checkChange();
    },
    methods: {
        showEvent({ nativeEvent, event }) {
            const open = () => {
                this.selectedEvent = event;
                this.selectedElement = nativeEvent.target;
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => (this.selectedOpen = true))
                );
            };

            if (this.selectedOpen) {
                this.selectedOpen = false;
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => open())
                );
            } else {
                open();
            }

            nativeEvent.stopPropagation();
        },
        toConfigScheduler(id) {
            this.$router.push(`scheduler/editScheduler/${id}`);
        },
    },
};
</script>
<style scoped>
.show-calendar >>> .v-calendar-daily__day-interval {
    height: 24px !important;
}
</style>

<style>
.scheduler {
    width: 90%;
    display: inline-block;
}
</style>
