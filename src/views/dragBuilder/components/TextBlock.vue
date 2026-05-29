<template>
  <div class="drag-text-block">
    {{ item.props.text }}
  </div>
</template>

<script>
export default {
  name: 'DragTextBlock',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.drag-text-block {
  width: 100%;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  line-height: 1.7;
}
</style>
