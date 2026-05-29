<template>
  <div class="drag-title-block">
    {{ item.props.text }}
  </div>
</template>

<script>
export default {
  name: 'DragTitleBlock',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.drag-title-block {
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-weight: 800;
}
</style>
