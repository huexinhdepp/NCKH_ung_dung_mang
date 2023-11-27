<template>
    <div>
        <div class="showList-document">
            <ag-grid-vue
                :columnDefs="columnDefs"
                class="ag-theme-alpine"
                :rowData="files"
                style="width: 950px; height: 600px"
                :getContextMenuItems="getContextMenuItems"
            ></ag-grid-vue>
        </div>
        <div class="showList-document-description">
            <div style="display: flex; justify-content: center">
                <v-btn
                    @click="toConfigDocument"
                    class="config"
                    v-if="!callByScheduler"
                    >Tạo mới</v-btn
                >
            </div>
        </div>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { documentAPI } from "@/api/document.js";
export default {
    components: {
        AgGridVue,
    },
    data: () => ({
        allUsers: [],
        files: [],
    }),
    computed: {
        columnDefs() {
            if (this.files.length) {
                let columnDefs = Object.keys(this.files[0]).map((a) => {
                    let valueFormatter = null;
                    let headerName;
                    if (a == "classId") {
                        headerName = "Mã lớp độc lập";
                    } else if (a == "host") {
                        headerName = "Mã giảng viên";
                    } else if (a == "hostName") {
                        headerName = "Tên giảng viên";
                    } else if (a == "subject") {
                        headerName = "Môn học";
                    } else {
                        headerName = a;
                    }
                    if (a == "sharePermission") {
                        valueFormatter = this.sharePermissionValueFormatter;
                    } else if (a == "hostName") {
                        valueFormatter = this.hostNameValueFormatter;
                    }
                    return {
                        field: a,
                        headerName: headerName,
                        valueFormatter: valueFormatter,
                    };
                });
                return columnDefs;
            }
            return [];
        },
    },
    methods: {
        toDashboard(id) {
            this.$router.push({
                name: "dashboardWorkspace",
                params: { id: id },
            });
            console.log(this.$route, `dashboard/workspace/${id}`);
        },
        sharePermissionValueFormatter(params) {
            console.log(params);
            switch (params.value) {
                case "onlyMe":
                    return "Chỉ mình tôi";
                case "all":
                    return "Tất cả";
                case "staff_only":
                    return "Chia sẻ cho giảng viên khác";
                default:
                    return "";
            }
        },
        hostNameValueFormatter(params) {
            console.log(params);
            let user = this.allUsers.find((a) => a.userName == params.value);
            return user.userNameDisplay;
        },
        toConfigDocument() {
            this.$router.push("/document/config");
        },
        toEditDocument(id) {
            if (this.callByScheduler == false) {
                this.$router.push(`document/editDocument/${id}`);
            } else {
                this.$emit("toConfigScheduler", id);
            }
        },
        getContextMenuItems(params) {
            var result = [
                {
                    // custom item
                    name: "Chi tiết báo cáo",
                    action: () => {
                        this.toDashboard(params.node.data.id);
                        console.log(params);
                    },
                },
            ];

            return result;
        },
    },
    toEditDocument(id) {
        this.$router.push({ name: "editDocument", params: { id: id } });
    },
    async created() {
        let res = await documentAPI.getListDocument();
        for (let i = 0; i < res.data.length; i++) {
            res.data[i].hostName = res.data[i].userName;
            this.files.push(res.data[i]);
        }
        this.allUsers = this.$store.state.user.users;
    },
    props: {
        callByScheduler: {
            title: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped>
table {
    border-spacing: 1;
    border-collapse: collapse;
    background: white;
    border-radius: 6px;
    overflow: hidden;
    max-width: 1200px;
    width: 100%;
    margin: 40px auto;
    position: relative;
}

tr:hover {
    background-color: #c4dede;
}
thead {
    background: #ffed86;
}
.config {
    margin: 20px auto;
}
.showList-document {
    display: flex;
    justify-content: center;
}
.showList-document-description {
}
</style>
