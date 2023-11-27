<template>
    <div class="back" data-app>
        <h1 style="text-align: center">Tạo văn bản mới</h1>
        <div class="config-document-config">
            <div class="config-document-config-field">
                <div class="input-field">
                    <p>Trường tương ứng với tên sinh viên:</p>
                    <v-text-field
                        v-model="columnDefs[0].headerName"
                        type="text"
                        placeholder="name display"
                    ></v-text-field>
                </div>
                <div class="input-field">
                    <p>Trường tương ứng với mã sinh viên:</p>
                    <v-text-field
                        v-model="columnDefs[1].headerName"
                        type="text"
                        placeholder="id"
                    ></v-text-field>
                </div>
                <div class="input-field">
                    <p>Mã lớp độc lập:</p>
                    <v-text-field
                        v-model="classId"
                        type="text"
                        placeholder="classID"
                    ></v-text-field>
                </div>
            </div>
            <div class="config-document-specific-field">
                <div style="width: 30%">
                    <p>Chọn môn học tương ứng:</p>
                    <div style="display: flex; align-items: center">
                        <v-autocomplete
                            :items="subjectName"
                            item-text="name"
                            item-value="id"
                            label="Subject"
                            v-model="subjectId"
                        >
                        </v-autocomplete>
                        <v-btn
                            style="margin-left: 20px"
                            @click="gotoAddSubject"
                            :disabled="
                                !(
                                    this.$store.state.user.user.userInfo
                                        .orgChart == 'superUser' ||
                                    this.$store.state.user.user.userInfo
                                        .orgChart == 'staff'
                                )
                            "
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </div>
                </div>
                <div style="width: 30%">
                    <p>Import danh sách dạng excel vào:</p>
                    <v-file-input
                        id="file"
                        v-model="file"
                        @change="handleFile"
                    />
                </div>
                <div style="width: 30%">
                    <p>Quyền xem:</p>
                    <v-autocomplete
                        :items="sharePermission"
                        item-text="text"
                        item-value="value"
                        label="Quyền xem"
                        v-model="sharePermissionValue"
                    >
                    </v-autocomplete>
                </div>
            </div>
            <div style="display: flex; justify-content: center; margin: 30px">
                <v-btn @click="createDocument"> submit </v-btn>
            </div>
        </div>
        <ag-grid-vue
            style="width: 90%; height: 900px; margin: 0 auto"
            class="ag-theme-alpine"
            :columnDefs="fetchColumnDefs"
            :rowData="rawData"
        >
        </ag-grid-vue>
    </div>
</template>

<script>
import { read, utils } from "xlsx";
import { AgGridVue } from "ag-grid-vue";
import { documentAPI } from "@/api/document.js";
import { subjectAPI } from "@/api/subject.js";

export default {
    async created() {
        if (
            !(
                this.$store.state.user.user.userInfo.orgChart == "superUser" ||
                this.$store.state.user.user.userInfo.orgChart == "staff"
            )
        ) {
            this.$router.push("/");
        }

        let res = await subjectAPI.getListSubject();
        // console.log(res.data[0]);
        // res.data.map (item => {
        //     console.log(res.data.name[item])
        // })
        this.subjectName = res.data;
        console.log(this.subjectName);
    },
    components: {
        AgGridVue,
    },
    data() {
        return {
            sharePermission: [
                {
                    text: "Chỉ mình tôi",
                    value: "onlyMe",
                },
                {
                    text: "Chia sẻ cho các giảng viên khác",
                    value: "staff_only",
                },
                {
                    text: "Tất cả mọi người(kể cả sinh viên)",
                    value: "all",
                },
            ],
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
            sharePermissionValue: "",
            rawData: [],
            file: undefined,
            fetchColumnDefs: [],

            subjectName: null,
            classId: null,
            subjectId: null,
        };
    },
    methods: {
        async createDocument() {
            let userNameDisplayHeaderName = this.columnDefs[0].headerName;
            let idHeaderName = this.columnDefs[1].headerName;
            let classId = this.classId;
            let subjectId = this.subjectId;
            if (
                this.fetchColumnDefs.filter(
                    (col) =>
                        col.field == userNameDisplayHeaderName ||
                        col.field == idHeaderName
                ).length == 2
            ) {
                this.fetchColumnDefs.map((col, idx) => {
                    if (col.field == userNameDisplayHeaderName) {
                        this.fetchColumnDefs.splice(idx, 1);
                    }
                });
                this.fetchColumnDefs.map((col, idx) => {
                    if (col.field == idHeaderName) {
                        this.fetchColumnDefs.splice(idx, 1);
                    }
                });
                this.fetchColumnDefs = this.fetchColumnDefs.concat(
                    this.columnDefs
                );
                this.rawData.map((data) => {
                    let userNameValue = data[this.columnDefs[0].headerName];
                    let idValue = data[this.columnDefs[1].headerName];
                    delete data[this.columnDefs[0].headerName];
                    delete data[this.columnDefs[1].headerName];
                    data[this.columnDefs[0].field] = userNameValue;
                    data[this.columnDefs[1].field] = idValue;
                });
                let res = await documentAPI.createDocument(
                    this.fetchColumnDefs,
                    this.rawData,
                    classId,
                    subjectId,
                    this.sharePermissionValue
                );
                console.log(res);
                return;
            }
        },
        async handleFile(e) {
            let file = await e.arrayBuffer();
            const wb = read(file);
            const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            this.rawData = data;
            this.translateRawData();
        },
        translateRawData() {
            // let rawData =[]
            let columnDefs = [];
            let headerName = [];
            this.rawData.map((e) => {
                console.log(Object.keys(e));
                headerName = [...new Set(headerName.concat(Object.keys(e)))];
                // concat(result, Object.keys(e))
                console.log(headerName);
            });
            headerName.map((field) => {
                columnDefs.push({
                    field: field,
                    headerName: field,
                });
            });
            this.fetchColumnDefs = columnDefs;
        },
        gotoAddSubject() {
            this.$router.push("/document/config/addSubject");
        },
    },
    computed: {},
};
</script>

<style scoped>
.config-document-config {
}
.config-document-config-field {
    display: flex;
    justify-content: space-around;
}
.config-document-config-field .input-field {
    width: 25%;
}
.config-document-config-field .input-field p {
    margin: 0;
}
.config-document-config-field > .input-field > .v-text-field {
    margin: 0;
    padding: 0;
}
.config-document-specific-field {
    margin-top: 25px;
}

.config-document-specific-field p {
    margin: 0;
}
.config-document-specific-field >>> .v-text-field {
    margin: 0;
    padding: 0;
}
.config-document-specific-field {
    display: flex;
    justify-content: space-around;
}
</style>
