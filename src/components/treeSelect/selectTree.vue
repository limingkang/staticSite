<template>
  <el-select
    ref="select"
    :value="selectShowLabel"
    :placeholder="placeholder"
    size="mini"
    :clearable="clearable"
    :disabled="disabled"
    :filterable="filterable"
    :filter-method="filterMethod"
    style="width: 100%"
    @clear="clear"
    @visible-change="visibleChange"
  >
    <template slot="empty">
      <div style="max-height: 250px;overflow: auto;">
        <el-tree
          v-if="treeRenderInit"
          ref="tree"
          class="tree-select__tree"
          :class="`tree-select__tree--${multiple ? 'checked' : 'radio'}`"
          :node-key="nodeKey"
          :data="data"
          :props="props"
          :default-expanded-keys="[value]"
          :show-checkbox="multiple"
          :highlight-current="!multiple"
          :expand-on-click-node="multiple"
          :filter-node-method="filterNode"
          :check-strictly="strictly"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        />
      </div>
    </template>
  </el-select>
</template>

<script>
export default {
  name: 'TreeSelect',
  props: {
    // v-model 绑定
    value: {
      type: [String, Number, Array],
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // 树形数据
    data: {
      type: Array,
      default: function() {
        return []
      },
    },
    // 每个树节点作为唯一标识的属性
    nodeKey: {
      type: [String, Number],
      default: 'depCode',
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    strictly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    // tree 的 props 配置
    props: {
      type: Object,
      default: function() {
        return {
          value: 'depCode',
          label: 'depName',
          children: 'children',
        }
      },
    },
  },
  data() {
    return {
      filterFlag: false,
      selectShowLabel: null,
      treeRenderInit: true,
    }
  },
  watch: {
    value: {
      handler(val) {
        this.init(val)
      },
      immediate: true,
      deep: true,
    },
    data: function(val) {
      this.init(this.value)
    },
  },
  methods: {
    handleNodeClick(data) {
      // 确保只选择最后一层的节点
      if ((data.children && data.children.length > 0) || this.multiple) {
        return
      }
      this.$emit('input', data[this.nodeKey])
      this.$emit('node-label', data)
      this.$emit('node-click', data)
      this.$refs.select.visible = false
    },
    handleCheckChange() {
      const nodes = this.$refs.tree.getCheckedNodes(true)
      const value = nodes.map((item) => item[this.nodeKey])
      this.$emit('input', value)
      this.$emit('node-label', nodes)
    },
    // 数据初始化时选中的默认值
    init(initData) {
      if (this.data.length === 0) {
        this.selectShowLabel = this.multiple ? [] : ''
        return
      }
      // 多选
      if (this.multiple) {
        this.selectShowLabel = []
        if (this.value.length === 0) {
          this.treeRenderInit = false
          this.$nextTick(() => {
            this.treeRenderInit = true
          })
          return
        }
        this.$refs.tree.setCheckedKeys(initData || [])
        this.$nextTick(() => {
          const nodes = this.$refs.tree.getCheckedNodes(true)
          this.selectShowLabel = nodes.map((item) => item[this.props.label])
        })
      } else {
        if (!this.value) {
          this.treeRenderInit = false
          this.selectShowLabel = ''
          this.$nextTick(() => {
            this.treeRenderInit = true
          })
          return
        }
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(initData || '')
          const node = this.$refs.tree.getNode(initData)
          this.selectShowLabel = node ? node.data[this.props.label] : ''
        })
      }
    },
    visibleChange(showTree) {
      if (showTree) {
        const tree = this.$refs.tree
        this.filterFlag && tree.filter('')
        this.filterFlag = false
        let selectDom = null
        if (this.multiple) {
          selectDom = tree.$el.querySelector('.el-tree-node.is-checked')
        } else {
          selectDom = tree.$el.querySelector('.is-current')
        }
        setTimeout(() => {
          this.$refs.select.scrollToOption({ $el: selectDom })
        }, 0)
      }
    },
    clear() {
      this.$emit('input', this.multiple ? [] : '')
      this.$emit('node-label', this.multiple ? [] : '')
    },
    filterMethod(val) {
      this.filterFlag = true
      this.$refs.tree.filter(val)
    },
    filterNode(value, data) {
      if (!value) return true
      const label = this.props.label || 'name'
      return data[label].indexOf(value) !== -1
    },
  },
}
</script>

<style lang="less">
.tree-select__option {
  &.el-select-dropdown__item {
    height: auto;
    line-height: 1;
    padding: 0;
    background-color: #fff;
  }
}

.tree-select__tree {
  padding: 4px 20px;
  font-weight: 400;
  &.tree-select__tree--radio {
    .el-tree-node.is-current > .el-tree-node__content {
      color: var(--common-primary-strong);
      font-weight: 700;
    }
  }
}
</style>

