<template>
    <div class="dialog-container">
        <v-card class="dialog-card">
            <v-card-title class="dialog-card-dialog-title">
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                    "
                >
                    <slot name="header"></slot>
                    <v-icon
                        style="font-size: 18px; cursor: pointer"
                        @click="closeDialog"
                        >mdi-close</v-icon
                    >
                </div>
            </v-card-title>
            <div class="dialog-content">
                <slot name="content"></slot>
            </div>
            <div class="dialog-actions">
                <slot name="actions"></slot>
            </div>
        </v-card>
    </div>
</template>

<script>
export default {
    methods: {
        closeDialog() {
            this.$emit("close-dialog");
        },
    },
};
</script>
<style scoped>
.dialog-card-dialog-title {
    display: flex;
}
.dialog-card {
    width: 450px;
    height: auto;
}
.dialog-container {
    justify-content: center;
    align-items: center;
    display: flex;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    left: 0;
    top: 0;
}
.dialog-content {
    margin: 0 16px;
}
.dialog-actions {
    margin: 10px 16px;
}
</style>
