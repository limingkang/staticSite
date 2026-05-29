<template>
  <div class="drag-divider-block" />
</template>

<script>
export default {
  name: 'DragDividerBlock',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.drag-divider-block {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.drag-divider-block::before {
  content: '';
  width: 100%;
  height: 2px;
  background: currentColor;
}
</style>
