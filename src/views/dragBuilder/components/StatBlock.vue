<template>
  <div class="drag-stat-block">
    <strong>{{ item.props.value }}</strong>
    <span>{{ item.props.text }}</span>
  </div>
</template>

<script>
export default {
  name: 'DragStatBlock',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.drag-stat-block {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.drag-stat-block strong {
  font-size: 1.8em;
  line-height: 1;
}

.drag-stat-block span {
  margin-top: 10px;
  color: inherit;
  opacity: 0.72;
}
</style>
