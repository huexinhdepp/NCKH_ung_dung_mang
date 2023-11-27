<template>
  <input
    type="checkbox"
    @click="checkedHandler($event)"
    :checked="params.value"
  />
</template>

<script>
export default {
  methods: {
    checkedHandler(event) {
      let checked = event.target.checked;
      let colId = this.params.column.colId;
      this.params.node.setDataValue(colId, checked);
    },
  },
};
</script>
