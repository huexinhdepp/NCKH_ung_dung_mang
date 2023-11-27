<template>
    <div class="addSubject" data-app>
        <h1>Thêm môn học</h1>
        <div v-for="(item, index) in subjectList" :key="index">
            <div style="display: flex; justify-content: space-around">
                <div style="width: 40%">
                    <v-text-field
                        v-model="item.name"
                        :rules="nameRules"
                        label="Tên môn"
                        required
                    ></v-text-field>
                </div>
                <div style="width: 40%">
                    <v-text-field
                        v-model="item.subjectId"
                        :rules="nameRules"
                        label="Mã môn"
                        required
                    ></v-text-field>
                </div>
            </div>

            <v-col>
                <v-textarea
                    v-model="item.description"
                    label="Mô tả môn"
                    maxlength="320"
                ></v-textarea>
            </v-col>

            <v-col>
                <v-container>
                    <v-icon v-if="item.errors == true" style="color: red">
                        mdi-alert
                    </v-icon>
                    <v-icon v-if="item.errors == false" style="color: green">
                        mdi-check-bold
                    </v-icon>
                </v-container>
            </v-col>
            <hr />
        </div>
        <v-row>
            <v-btn @click="addForm">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-row>
        <v-btn @click="submit" class="submit">Submit</v-btn>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { subjectAPI } from "@/api/subject.js";
export default {
    created() {
        if (
            !(
                this.$store.state.user.user.userInfo.orgChart == "superUser" ||
                this.$store.state.user.user.userInfo.orgChart == "staff"
            )
        ) {
            this.$router.push("/");
        }
    },
    data() {
        return {
            valid: false,
            subjectList: [
                {
                    name: "",
                    subjectId: "",
                    description: "",
                    errors: null,
                },
            ],
            nameRules: [(v) => !!v || "Text is required"],
        };
    },
    methods: {
        addForm() {
            this.subjectList.push({
                name: "",
                subjectId: "",
                description: "",
                errors: null,
            });
        },
        async submit() {
            let out = this.subjectList;
            for (let i = 0; i < out.length; i++) {
                try {
                    console.log(out[i]);
                    let res = await subjectAPI.createSubject(
                        out[i].name,
                        out[i].subjectId,
                        out[i].description
                    );
                    console.log(res);

                    if (res.status == 200) {
                        this.subjectList[i].errors = false;
                    } else {
                        this.subjectList[i].errors = true;
                    }
                } catch (error) {
                    this.subjectList[i].errors = true;
                }
            }
        },
    },
};
</script>

<style scoped>
hr {
    color: red;
    height: 1px;
}
.submit {
    margin-top: 5%;
}
</style>
