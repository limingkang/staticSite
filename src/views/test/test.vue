<template>
  <div class="test-page">
    <div class="demo-grid">
      <section class="demo-section">
        <h3>单选部门</h3>
        <select-tree
          v-model="singleDepCode"
          :data="departmentTree"
          :props="treeProps"
          node-key="depCode"
          placeholder="请选择部门"
          filterable
          @node-label="handleSingleLabel"
          @node-click="handleSingleClick"
        />

        <div class="result-box">
          <p>选中值：{{ singleDepCode || '-' }}</p>
          <p>选中节点：{{ singleNode ? singleNode.depName : '-' }}</p>
        </div>
      </section>

      <section class="demo-section">
        <h3>多选部门</h3>
        <select-tree
          v-model="multipleDepCodes"
          :data="departmentTree"
          :props="treeProps"
          node-key="depCode"
          multiple
          strictly
          placeholder="请选择多个部门"
          filterable
          @node-label="handleMultipleLabel"
        />

        <div class="result-box">
          <p>选中值：{{ multipleDepCodes.length ? multipleDepCodes.join(', ') : '-' }}</p>
          <p>选中节点：{{ multipleNames || '-' }}</p>
        </div>
      </section>

      <section class="demo-section demo-section--wide">
        <h3>公式编辑器</h3>
        <editor
          ref="formulaEditor"
          :editerval="editorValue"
          :mark-metric="metricList"
        />

        <div class="action-row">
          <el-button size="mini" type="primary" @click="readEditorValue">
            读取内容
          </el-button>
          <el-button size="mini" @click="resetEditorValue">
            重置内容
          </el-button>
        </div>

        <div class="result-box">
          <p>编辑器内容：{{ editorSnapshot || '-' }}</p>
          <p>已选指标：{{ editorMarks.length ? editorMarks.join(', ') : '-' }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Editor from '@/components/editor.vue'
import SelectTree from '@/components/treeSelect/selectTree.vue'

export default {
  name: 'Test',
  components: {
    Editor,
    SelectTree,
  },
  data() {
    return {
      loading: false,
      singleDepCode: '',
      singleNode: null,
      multipleDepCodes: [],
      multipleNodes: [],
      editorValue: '',
      editorSnapshot: '',
      editorMarks: [],
      metricList: [
        { code: 'sales7', text: '7天销量' },
        { code: 'stock', text: '当前库存' },
        { code: 'price', text: '销售价' },
        { code: 'profit', text: '利润率' },
      ],
      treeProps: {
        value: 'depCode',
        label: 'depName',
        children: 'children',
      },
      departmentTree: [
        {
          depCode: '100',
          depName: '总部',
          children: [
            {
              depCode: '110',
              depName: '行政中心',
              children: [
                { depCode: '111', depName: '人事部' },
                { depCode: '112', depName: '财务部' },
              ],
            },
            {
              depCode: '120',
              depName: '业务中心',
              children: [
                { depCode: '121', depName: '销售一部' },
                { depCode: '122', depName: '销售二部' },
              ],
            },
          ],
        },
        {
          depCode: '200',
          depName: '研发中心',
          children: [
            { depCode: '210', depName: '前端组' },
            { depCode: '220', depName: '后端组' },
            { depCode: '230', depName: '测试组' },
          ],
        },
      ],
    }
  },
  computed: {
    multipleNames() {
      return this.multipleNodes.map((item) => item.depName).join(', ')
    },
  },
  methods: {
    handleSingleLabel(node) {
      this.singleNode = node || null
    },
    handleSingleClick(node) {
      console.log('单选点击节点：', node)
    },
    handleMultipleLabel(nodes) {
      this.multipleNodes = nodes || []
    },
    readEditorValue() {
      this.editorSnapshot = this.$refs.formulaEditor.getEditorVal()
      this.editorMarks = this.$refs.formulaEditor.getMarkArray()
    },
    resetEditorValue() {
      this.editorValue = this.$refs.formulaEditor.getEditorVal()
      this.$nextTick(() => {
        this.editorValue = ''
        this.editorSnapshot = ''
        this.editorMarks = []
      })
    },
  },
}
</script>

<style lang="less" scoped>
.test-page {
  padding: 16px;
}

.demo-grid {
  //display: grid;
  //grid-template-columns: repeat(2, minmax(0, 1fr));
  //gap: 16px;
}

.demo-section {
  padding: 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;

  h3 {
    margin: 0 0 12px;
    color: #303133;
    font-size: 16px;
    font-weight: 600;
  }
}

.demo-section--wide {
  grid-column: 1 / -1;
}

.action-row {
  margin-top: 12px;
}

.result-box {
  margin-top: 16px;
  padding: 12px;
  color: #606266;
  background: #f5f7fa;
  border-radius: 4px;

  p {
    margin: 0;
    line-height: 24px;
  }
}

@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
