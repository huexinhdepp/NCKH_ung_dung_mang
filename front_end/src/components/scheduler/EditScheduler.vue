<template>
    <div data-app>
        <h1>Tạo lịch học mới</h1>
        <ag-grid-vue
            style="width: 90%; height: 500px; margin: 0 auto"
            class="ag-theme-alpine"
            :columnDefs="columnDefs"
            :rowData="rawData"
            @grid-ready="onGridReady"
            :getContextMenuItems="getContextMenuItems"
            :getMainMenuItems="getMainMenuItems"
        >
        </ag-grid-vue>
        <v-checkbox
            v-model="isDivide"
            :label="`Chia ca: ${isDivide.toString()}`"
            @change="toggleDivide(isDivide)"
        ></v-checkbox>
        <v-btn @click="addScheduler"> Thêm lịch học </v-btn>
        <v-form
            class="schedulerForm"
            v-for="(item, index) in schedulerList"
            :key="index"
        >
            <v-container>
                <v-row>
                    <v-col>
                        <v-row>
                            <v-text-field
                                v-model="item.room"
                                :rules="nameRules"
                                label="Phòng học"
                                required
                            ></v-text-field>
                        </v-row>

                        <v-row>
                            <v-text-field
                                v-model="item.timeSlot"
                                :rules="nameRules"
                                label="Các tiết...."
                                required
                            ></v-text-field>
                        </v-row>

                        <v-row>
                            <v-text-field
                                v-model="item.userApply"
                                label="Áp dụng cho ca học..."
                            ></v-text-field>
                        </v-row>
                    </v-col>
                    <v-col>
                        <v-row>
                            <v-menu offset-y v-if="!item.is_superuser">
                                <template v-slot:activator="{ on, attrs }">
                                    <!-- <v-icon v-bind="attrs" v-on="on">
                                    mdi mdi-pencil
                                </v-icon> -->
                                    <v-text-field
                                        v-bind="attrs"
                                        v-on="on"
                                        :value="item.picker"
                                        label="Lịch học vào ngày"
                                        readonly
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="item.picker"
                                    color="blue"
                                ></v-date-picker>
                            </v-menu>
                        </v-row>
                        <v-text-field
                            v-model="item.note"
                            label="Ghi chú (ex: nhớ mang theo laptop cá nhân)"
                        ></v-text-field>
                        <v-row>
                            <v-checkbox
                                v-model="item.isOnline"
                                label="Học online(tự động tạo link zoom)?"
                            ></v-checkbox>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
            <hr style="border-top: 2px solid; color: black; opacity: 1" />
        </v-form>
        <v-btn @click="submit">Submit</v-btn>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";
import { documentAPI } from "@/api/document.js";
// eslint-disable-next-line no-unused-vars
import { schedulerAPI } from "@/api/scheduler";
export default {
    components: {
        AgGridVue,
    },
    data() {
        return {
            columnDefs: [
                {
                    headerName: "",
                    field: "userNameDisplay",
                },
                {
                    headerName: "",
                    field: "id",
                },
            ],
            rawData: [],
            showContextMenu: false,
            isDivide: false,
            dialog: false,

            schedulerList: [
                {
                    room: "",
                    timeSlot: "",
                    userApply: "",
                    picker: null,
                    note: "",
                    isOnline: false,
                },
            ],
            nameRules: [(v) => !!v || "Text is required"],
            classId: "",
            feeUserInfo: {},
        };
    },
    async created() {
        this.feeUserInfo = JSON.parse(localStorage.getItem("feeUserInfo"));
        this.gridOptions = {};
        // Nap data
        let res = await documentAPI.detailDocument(this.$route.params.id);
        this.isDivide = res.columnDefs.some((a) => a.isDivide == true);
        console.log(res);
        this.columnDefs = res.columnDefs;
        this.rawData = res.rawData;
        this.classId = res.info.classId;
        // console.log(this.columnDefs)
        // Xac dinh cot duoc phep chinh sua (ko the sua ten + msv)
        this.columnDefs.map((field) => {
            // console.log(field.field != "student" && field.field != "id");
            if (field.field != "student" && field.field != "id") {
                Object.assign(this.columnDefs[this.columnDefs.indexOf(field)], {
                    editable: true,
                });
            }
        });
    },
    mounted() {},
    methods: {
        // Chuan bif
        onGridReady(params) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
        },

        //Menu cac thu
        getContextMenuItems(params) {
            console.log(params.defaultItems);
            return params.defaultItems;
        },
        getMainMenuItems(params) {
            // console.log(params.defaultItems);
            const colMenuItems = [];
            const itemsToExclude = [
                "separator",
                "pinSubMenu",
                "valueAggSubMenu",
            ];
            params.defaultItems.forEach((item) => {
                if (itemsToExclude.indexOf(item) < 0) {
                    colMenuItems.push(item);
                }
            });
            return colMenuItems;
        },
        toggleDivide(isDivide) {
            // console.log(this.columnDefs[this.columnDefs.indexOf("IsDivide")].field);
            if (isDivide == true) {
                this.columnDefs.push({
                    headerName: "Chia ca",
                    field: "IsDivide",
                    editable: true,
                });
                let size = this.rawData.length;
                let haftIndex = Math.round(size / 2);
                for (let i = 0; i < size; i++) {
                    if (i < haftIndex) {
                        this.rawData[i].IsDivide = "Ca 1";
                    } else {
                        this.rawData[i].IsDivide = "Ca 2";
                    }
                }
            } else {
                this.columnDefs.map((field) => {
                    // console.log(field.field != "student" && field.field != "id");
                    if (field.field == "IsDivide") {
                        this.columnDefs.splice(this.columnDefs.indexOf(field));
                    }
                });
                for (let i = 0; i < this.rawData.length; i++) {
                    delete this.rawData[i].IsDivide;
                }
                console.log(this.rawData);
            }
        },
        addScheduler() {
            this.schedulerList.push({
                room: "",
                timeSlot: "",
                userapply: "",
                picker: null,
                isOnline: false,
                note: "",
            });
        },
        async submit() {
            // console.log(typeof this.schedulerList[0].timeSlot);

            for (let i = 0; i < this.schedulerList.length; i++) {
                // eslint-disable-next-line no-unused-vars
                let newScheduler = {
                    classroom_id: this.schedulerList[i].room,
                    date: this.schedulerList[i].picker,
                    note: this.schedulerList[i].note,
                    time_slot: this.schedulerList[i].timeSlot.split(","),
                    user_applied: [],
                    isOnline: this.schedulerList[i].isOnline,
                    classId: this.classId,
                };

                console.log(this.columnDefs.some((a) => a.field == "IsDivide"));
                if (this.columnDefs.some((a) => a.field == "IsDivide")) {
                    this.rawData.map((student) => {
                        // console.log(student);
                        if (
                            student.IsDivide == this.schedulerList[i].userApply
                        ) {
                            newScheduler.user_applied.push(student.id);
                        }
                    });
                } else
                    this.rawData.map((student) => {
                        // console.log(student);

                        newScheduler.user_applied.push(student.id);
                    });
                console.log(newScheduler);
                if (
                    newScheduler.classroom_id == "" ||
                    !newScheduler.date ||
                    newScheduler.time_slot == "" ||
                    newScheduler.user_applied.length == 0 ||
                    newScheduler.classId == ""
                ) {
                    return;
                }
                this.columnDefs.push({
                    headerName: newScheduler.date,
                    field: newScheduler.date,
                    addByScheDuler: true,
                    editable: true,
                });

                newScheduler.user_applied.push(
                    this.feeUserInfo.userInfo.userName
                );
                let res = await schedulerAPI.createScheduler(
                    newScheduler.classroom_id,
                    newScheduler.date,
                    newScheduler.time_slot,
                    newScheduler.user_applied,
                    newScheduler.classId,
                    newScheduler.note,
                    newScheduler.isOnline,
                    this.$route.params.id
                );
                console.log(res);
            }
            // debugger
            let resd = await documentAPI.editDocument(
                this.columnDefs,
                this.rawData,
                this.$route.params.id
            );
            console.log(resd);
            this.$router.push("/document");
        },
    },
};
</script>
