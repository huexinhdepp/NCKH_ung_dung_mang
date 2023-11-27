<template>
    <div class="back" data-app>
        <h1>Chỉnh sửa văn bản</h1>
        <ag-grid-vue
            style="width: 90%; height: 900px; margin: 0 auto"
            class="ag-theme-alpine"
            :columnDefs="columnDefs"
            :rowData="rawData"
            @grid-ready="onGridReady"
            :getContextMenuItems="getContextMenuItems"
            :getMainMenuItems="getMainMenuItems"
        >
        </ag-grid-vue>
        <!-- <edit-doc-dialog ref="confirm" /> -->
        <v-btn @click="saveDocDialog"> Save </v-btn>
        <v-btn @click="returnToDocList"> Cancel </v-btn>
        <Dialog v-if="dialog.show" @close-dialog="closeDialog">
            <template v-slot:header>Thêm cột</template>
            <template v-slot:content>
                <div style="display: flex; align-items: center">
                    <span>Tên cột:</span>
                    <v-text-field
                        v-model="dialog.newColumn"
                        style="margin-left: 8px; margin-top: 0; padding: 0"
                    ></v-text-field>
                </div>
                <v-checkbox
                    v-model="dialog.isMarkField"
                    style="margin-top: 0"
                    label="Đây là một trường để nhập điểm?"
                />
                <p>(*Việc chọn trường sẽ hỗ trợ việc làm báo cáo)</p>
            </template>
            <template v-slot:actions>
                <div style="display: flex; justify-content: flex-end">
                    <v-btn
                        style="background-color: #36cc4a"
                        @click="addNewColumn"
                        >Thêm</v-btn
                    >
                    <v-btn @click="closeDialog" style="margin-left: 15px"
                        >Đóng</v-btn
                    >
                </div>
            </template>
        </Dialog>

        <Dialog v-if="confirmSave" @close-dialog="closeDialog">
            <template v-slot:header>Xác nhận</template>
            <template v-slot:content>
                <div style="display: flex; align-items: center">
                    <span>Lưu văn bản?</span>
                </div>
            </template>
            <template v-slot:actions>
                <div style="display: flex; justify-content: flex-end">
                    <v-btn style="background-color: #36cc4a" @click="saveDoc"
                        >Lưu</v-btn
                    >
                    <v-btn
                        @click="confirmSave = false"
                        style="margin-left: 15px"
                        >Hủy</v-btn
                    >
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";
import { documentAPI } from "@/api/document.js";
import Dialog from "../common/Dialog.vue";
export default {
    components: {
        AgGridVue,
        Dialog,
    },

    data() {
        return {
            dialog: {
                show: false,
                newColumn: "",
                isMarkField: false,
            },
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

            // dialog: false,
            newColumn: "",
            confirmSave: false,
        };
    },
    async created() {
        // Nap data
        let res = await documentAPI.detailDocument(this.$route.params.id);
        this.columnDefs = res.columnDefs;
        this.rawData = res.rawData;

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

    methods: {
        addNewColumn() {
            let normalizedNewField = this.dialog.newColumn
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D");
            normalizedNewField = normalizedNewField
                .replace(/[^a-zA-Z0-9]/g, "")
                .split(" ")
                .join("");

            console.log(normalizedNewField);
            this.columnDefs.push({
                field: normalizedNewField,
                headerName: this.dialog.newColumn,
                isMarkField: this.dialog.isMarkField,
                editable: true,
            });
            this.dialog.isMarkField = false;
            this.dialog.newColumn = "";
            this.dialog.show = false;
        },
        closeDialog() {
            this.dialog.show = false;
        },
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

            // Menu Xoa cot
            colMenuItems.push({
                name: "Xóa cột",
                action: () => {
                    let name = params.column.colDef.field;

                    if (name == "student" || name == "id") {
                        alert("Cột này không thể xóa!!!");
                    } else {
                        this.delRecord(params);
                    }
                },
            });

            //Menu them cot (dat o cot cuoi cung)

            let id = params.column.colId;
            const last = this.columnDefs[this.columnDefs.length - 1];
            // console.log(id);
            // console.log(last.field);
            if (id == last.field) {
                colMenuItems.push({
                    name: "Thêm cột",
                    action: () => {
                        this.dialog.show = true;
                    },
                });
            }
            return colMenuItems;
        },

        // Them cot
        async addRecord() {
            if (await this.$refs.add.open()) {
                this.submit();
            }
        },
        submit() {
            let normalizedNewField = this.$refs.add.newColumn
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D");
            normalizedNewField = normalizedNewField
                .replace(/[^a-zA-Z0-9]/g, "")
                .split(" ")
                .join("");

            console.log(normalizedNewField);
            this.columnDefs.push({
                field: normalizedNewField,
                headerName: this.$refs.add.newColumn,
                editable: true,
            });
        },

        //Xoa cot
        async delRecord(params) {
            if (
                await this.$refs.confirm.open(
                    "Xác nhận xóa",
                    "Bạn có muốn xóa hoàn toàn cột này hay không?"
                )
            ) {
                this.deleteRecord(params);
            }
        },
        deleteRecord(params) {
            //console.log("ok");
            //console.log(params);
            let name = params.column.colDef.field;
            var removeIndex = this.columnDefs
                .map((item) => item.field)
                .indexOf(name);
            //console.log(removeIndex);
            this.columnDefs.splice(removeIndex, 1);
            console.log("Record deleted.");
        },

        // Dieu huong
        returnToDocList() {
            this.$router.push("/document");
        },

        // Luu doc
        async saveDocDialog() {
            // if (
            //     await this.$refs.confirm.open(
            //         "Xác nhận lưu",
            //         "Xác nhận lưu toàn bộ thay đổi?"
            //     )
            // ) {
            //     this.saveDoc();
            // }
            this.confirmSave = true;
        },
        async saveDoc() {
            let res = await documentAPI.editDocument(
                this.columnDefs,
                this.rawData,
                this.$route.params.id
            );
            console.log(res);
            this.$router.push("/document");
        },
    },
};
</script>

<style scoped>
.v-text-field__details .v-messages {
    display: none;
}
</style>
