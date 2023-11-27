<template>
  <div>
    <v-dialog
      v-model="dialog"
      :max-width="options.width"
      :style="{ zIndex: options.zIndex }"
      @keydown.esc="cancel"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Thêm cột</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="Nhập tên cột"
              required
              v-model="newColumn"
              :rules="inputRules"
            ></v-text-field>
            <v-checkbox>abcd</v-checkbox>
            <v-spacer></v-spacer>
            <v-btn
              v-if="!options.noconfirm"
              color="grey"
              text
              class="body-2 font-weight-bold"
              @click.native="cancel"
            >
              Hủy
            </v-btn>
            <v-btn
              color="primary"
              class="body-2 font-weight-bold"
              outlined
              @click.native="agree"
            >
              Thêm
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "AddColFormDialog",
  data() {
    return {
      dialog: false,
      newColumn: "",
      resolve: null,
      reject: null,
      options: {
        color: "grey lighten-3",
        width: 400,
        zIndex: 200,
        noconfirm: false
      },
      inputRules: [(v) => !!v || "Tên cột không được để trống"],
    };
  },

  methods: {
    open(options) {
      this.dialog = true;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
        if (this.$refs.form.validate()) {
            this.resolve(true);
            this.dialog = false;
        } else {
            this.dialog = true;
        }
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  }
};
</script>
