<template>
  <img
    v-if="item.props.url"
    class="drag-image-block"
    :src="item.props.url"
    :alt="item.props.text"
  >
  <div v-else class="drag-image-placeholder">
    {{ item.props.text }}
  </div>
</template>

<script>
export default {
  name: 'DragImageBlock',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.drag-image-block,
.drag-image-placeholder {
  width: 100%;
  height: 100%;
}

.drag-image-block {
  object-fit: cover;
  display: block;
}

.drag-image-placeholder {
  border: 1px dashed rgba(58, 102, 255, 0.28);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
