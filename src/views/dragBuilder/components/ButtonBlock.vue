<template>
  <button class="drag-button-block" type="button">
    {{ item.props.text }}
  </button>
</template>

<script>
export default {
  name: 'DragButtonBlock',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.drag-button-block {
  width: 100%;
  height: 100%;
  border: none;
  color: inherit;
  background: transparent;
  font: inherit;
  font-weight: 700;
  cursor: inherit;
}
</style>
