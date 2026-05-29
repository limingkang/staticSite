<template>
  <div class="drag-builder-page">
    <header class="drag-builder-header">
      <div>
        <p>拖拽页面</p>
        <h1>简易页面生成器</h1>
      </div>
      <div class="drag-builder-header__actions">
        <el-button size="mini" @click="resetPage">重置</el-button>
        <el-button size="mini" type="primary" @click="previewVisible = true">预览</el-button>
      </div>
    </header>

    <main class="builder-layout">
      <aside class="panel component-panel">
        <div class="panel-title">
          <span>组件库</span>
          <strong>拖入画布</strong>
        </div>
        <div
          v-for="item in componentList"
          :key="item.type"
          class="component-card"
          draggable="true"
          @dragstart="handleComponentDragStart(item)"
        >
          <i :class="item.icon" />
          <div>
            <strong>{{ item.name }}</strong>
            <span>{{ item.desc }}</span>
          </div>
        </div>
      </aside>

      <section class="panel canvas-panel">
        <div class="panel-title">
          <span>编辑画布</span>
          <strong>{{ pageElements.length }} 个组件</strong>
        </div>
        <div
          ref="canvas"
          class="canvas"
          @dragover.prevent
          @drop="handleCanvasDrop"
          @mousedown.self="activeId = ''"
        >
          <div v-if="pageElements.length === 0" class="canvas-empty">
            从左侧拖入组件开始搭建
          </div>
          <div
            v-for="item in pageElements"
            :key="item.id"
            class="canvas-item"
            :class="{ active: item.id === activeId }"
            :style="itemStyle(item)"
            @mousedown.stop="startMove($event, item)"
          >
            <button class="item-delete" type="button" @click.stop="removeElement(item.id)">
              <i class="el-icon-close" />
            </button>
            <component :is="resolveRender(item.type)" :item="item" />
          </div>
        </div>
      </section>

      <aside class="panel config-panel">
        <div class="panel-title">
          <span>配置面板</span>
          <strong>{{ activeElement ? activeElement.name : '未选中' }}</strong>
        </div>

        <template v-if="activeElement">
          <label class="config-field">
            <span>标题/文字</span>
            <input v-model="activeElement.props.text" type="text">
          </label>

          <label v-if="activeElement.type === 'stat'" class="config-field">
            <span>数值</span>
            <input v-model="activeElement.props.value" type="text">
          </label>

          <label v-if="activeElement.type === 'image'" class="config-field">
            <span>图片地址</span>
            <input v-model="activeElement.props.url" type="text" placeholder="可输入图片 URL">
          </label>

          <div class="config-grid">
            <label class="config-field">
              <span>宽度</span>
              <input v-model.number="activeElement.width" type="number" min="40">
            </label>
            <label class="config-field">
              <span>高度</span>
              <input v-model.number="activeElement.height" type="number" min="24">
            </label>
            <label class="config-field">
              <span>字号</span>
              <input v-model.number="activeElement.fontSize" type="number" min="10">
            </label>
            <label class="config-field">
              <span>圆角</span>
              <input v-model.number="activeElement.radius" type="number" min="0">
            </label>
          </div>

          <div class="color-row">
            <label>
              <span>文字</span>
              <input v-model="activeElement.color" type="color">
            </label>
            <label>
              <span>背景</span>
              <input v-model="activeElement.background" type="color">
            </label>
          </div>

          <div class="config-actions">
            <el-button size="mini" @click="duplicateElement">复制</el-button>
            <el-button size="mini" @click="removeElement(activeElement.id)">删除</el-button>
          </div>
        </template>

        <div v-else class="config-empty">
          点击画布中的组件后，可在这里修改文字、尺寸、颜色和位置。
        </div>
      </aside>
    </main>

    <el-dialog
      title="页面预览"
      :visible.sync="previewVisible"
      width="1180px"
      custom-class="drag-preview-dialog"
    >
      <div class="preview-layout">
        <div class="preview-viewport">
          <div class="preview-canvas" :style="previewCanvasStyle">
            <div
              v-for="item in pageElements"
              :key="`preview-${item.id}`"
              class="canvas-item preview-item"
              :style="itemStyle(item)"
            >
              <component :is="resolveRender(item.type)" :item="item" />
            </div>
          </div>
        </div>
        <aside class="preview-json">
          <div class="panel-title">
            <span>保存 JSON</span>
            <strong>{{ pageElements.length }} 个组件</strong>
          </div>
          <pre>{{ savedJsonText }}</pre>
        </aside>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dragComponents, { componentMap } from './components'

const componentPresets = {
  title: {
    name: '标题',
    width: 260,
    height: 56,
    fontSize: 28,
    color: '#17233c',
    background: '#ffffff',
    radius: 6,
    props: { text: '页面主标题' },
  },
  text: {
    name: '文本',
    width: 320,
    height: 80,
    fontSize: 15,
    color: '#586782',
    background: '#ffffff',
    radius: 6,
    props: { text: '这是一段可以编辑的说明文字。' },
  },
  button: {
    name: '按钮',
    width: 120,
    height: 42,
    fontSize: 14,
    color: '#ffffff',
    background: '#3a66ff',
    radius: 10,
    props: { text: '立即查看' },
  },
  stat: {
    name: '指标卡',
    width: 180,
    height: 110,
    fontSize: 14,
    color: '#17233c',
    background: '#eef6ff',
    radius: 8,
    props: { text: '今日访问', value: '12,480' },
  },
  divider: {
    name: '分割线',
    width: 360,
    height: 24,
    fontSize: 12,
    color: '#b9d0ff',
    background: '#ffffff',
    radius: 0,
    props: { text: '分割线' },
  },
  image: {
    name: '图片',
    width: 260,
    height: 150,
    fontSize: 14,
    color: '#7e8aa7',
    background: '#f1f6ff',
    radius: 8,
    props: { text: '图片占位', url: '' },
  },
}

const pageConfig = {
  width: 920,
  height: 600,
  background: '#ffffff',
}

export default {
  name: 'DragBuilder',
  components: dragComponents,
  data() {
    return {
      componentList: [
        { type: 'title', name: '标题', desc: '页面标题文本', icon: 'el-icon-document' },
        { type: 'text', name: '文本', desc: '普通说明内容', icon: 'el-icon-edit-outline' },
        { type: 'button', name: '按钮', desc: '行动按钮', icon: 'el-icon-thumb' },
        { type: 'stat', name: '指标卡', desc: '数字指标展示', icon: 'el-icon-data-line' },
        { type: 'divider', name: '分割线', desc: '内容分隔', icon: 'el-icon-minus' },
        { type: 'image', name: '图片', desc: '图片或占位块', icon: 'el-icon-picture-outline' },
      ],
      pageElements: [],
      activeId: '',
      draggingType: '',
      moving: null,
      previewVisible: false,
      idSeed: 1,
    }
  },
  computed: {
    activeElement() {
      return this.pageElements.find((item) => item.id === this.activeId)
    },
    savedJson() {
      return {
        page: { ...pageConfig },
        components: this.pageElements.map((item) => ({
          id: item.id,
          type: item.type,
          name: item.name,
          style: {
            left: item.left,
            top: item.top,
            width: item.width,
            height: item.height,
            fontSize: item.fontSize,
            color: item.color,
            background: item.background,
            radius: item.radius,
          },
          props: JSON.parse(JSON.stringify(item.props)),
        })),
      }
    },
    savedJsonText() {
      return JSON.stringify(this.savedJson, null, 2)
    },
    previewCanvasStyle() {
      return {
        width: `${pageConfig.width}px`,
        height: `${pageConfig.height}px`,
        background: pageConfig.background,
      }
    },
  },
  beforeDestroy() {
    this.clearMoveEvents()
  },
  methods: {
    resolveRender(type) {
      return componentMap[type] || componentMap.text
    },
    handleComponentDragStart(item) {
      this.draggingType = item.type
    },
    handleCanvasDrop(ev) {
      if (!this.draggingType) return
      const rect = this.$refs.canvas.getBoundingClientRect()
      const preset = componentPresets[this.draggingType]
      const left = this.clamp(ev.clientX - rect.left - preset.width / 2, 0, rect.width - preset.width)
      const top = this.clamp(ev.clientY - rect.top - preset.height / 2, 0, rect.height - preset.height)
      const element = this.createElement(this.draggingType, left, top)
      this.pageElements.push(element)
      this.activeId = element.id
      this.draggingType = ''
    },
    createElement(type, left, top) {
      const preset = componentPresets[type]
      return {
        id: `drag-${Date.now()}-${this.idSeed++}`,
        type,
        name: preset.name,
        left,
        top,
        width: preset.width,
        height: preset.height,
        fontSize: preset.fontSize,
        color: preset.color,
        background: preset.background,
        radius: preset.radius,
        props: JSON.parse(JSON.stringify(preset.props)),
      }
    },
    itemStyle(item) {
      return {
        left: `${item.left}px`,
        top: `${item.top}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        color: item.color,
        backgroundColor: item.background,
        borderRadius: `${item.radius}px`,
        fontSize: `${item.fontSize}px`,
      }
    },
    startMove(ev, item) {
      this.activeId = item.id
      const rect = this.$refs.canvas.getBoundingClientRect()
      this.moving = {
        id: item.id,
        startX: ev.clientX,
        startY: ev.clientY,
        startLeft: item.left,
        startTop: item.top,
        canvasWidth: rect.width,
        canvasHeight: rect.height,
      }
      document.addEventListener('mousemove', this.handleMove)
      document.addEventListener('mouseup', this.clearMoveEvents)
    },
    handleMove(ev) {
      if (!this.moving) return
      const item = this.pageElements.find((current) => current.id === this.moving.id)
      if (!item) return
      const nextLeft = this.moving.startLeft + ev.clientX - this.moving.startX
      const nextTop = this.moving.startTop + ev.clientY - this.moving.startY
      item.left = this.clamp(nextLeft, 0, this.moving.canvasWidth - item.width)
      item.top = this.clamp(nextTop, 0, this.moving.canvasHeight - item.height)
    },
    clearMoveEvents() {
      this.moving = null
      document.removeEventListener('mousemove', this.handleMove)
      document.removeEventListener('mouseup', this.clearMoveEvents)
    },
    removeElement(id) {
      this.pageElements = this.pageElements.filter((item) => item.id !== id)
      if (this.activeId === id) {
        this.activeId = ''
      }
    },
    duplicateElement() {
      if (!this.activeElement) return
      const copy = JSON.parse(JSON.stringify(this.activeElement))
      copy.id = `drag-${Date.now()}-${this.idSeed++}`
      copy.left += 18
      copy.top += 18
      this.pageElements.push(copy)
      this.activeId = copy.id
    },
    resetPage() {
      this.pageElements = []
      this.activeId = ''
      this.draggingType = ''
      this.previewVisible = false
    },
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), Math.max(min, max))
    },
  },
}
</script>

<style lang="less" scoped>
.drag-builder-page {
  min-height: 100%;
  padding: 16px;
  box-sizing: border-box;
  color: #17233c;
  background: #f7fbff;
}

.drag-builder-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.drag-builder-header p {
  margin: 0 0 6px;
  color: #3a66ff;
  font-size: 12px;
  font-weight: 700;
}

.drag-builder-header h1 {
  margin: 0;
  font-size: 24px;
  line-height: 1.25;
}

.drag-builder-header__actions {
  display: flex;
  gap: 8px;
}

.builder-layout {
  display: grid;
  grid-template-columns: 220px minmax(420px, 1fr) 280px;
  gap: 14px;
  min-height: 660px;
}

.panel {
  min-width: 0;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;
}

.component-panel,
.config-panel {
  padding: 14px;
}

.canvas-panel {
  padding: 14px;
}

.panel-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.panel-title span {
  font-size: 16px;
  font-weight: 700;
}

.panel-title strong {
  color: #7e8aa7;
  font-size: 12px;
  font-weight: 500;
}

.component-card {
  min-height: 66px;
  margin-bottom: 10px;
  padding: 11px;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fbfdff;
  cursor: grab;
  user-select: none;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.component-card:hover {
  border-color: #3a66ff;
  background: #f1f6ff;
  transform: translateY(-1px);
}

.component-card i {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #3a66ff;
  background: rgba(58, 102, 255, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.component-card strong,
.component-card span {
  display: block;
}

.component-card strong {
  font-size: 14px;
}

.component-card span {
  margin-top: 4px;
  color: #7e8aa7;
  font-size: 12px;
}

.canvas {
  position: relative;
  height: 600px;
  border: 1px dashed #b9d0ff;
  border-radius: 8px;
  background:
    linear-gradient(#eef5ff 1px, transparent 1px),
    linear-gradient(90deg, #eef5ff 1px, transparent 1px),
    #ffffff;
  background-size: 24px 24px;
  overflow: hidden;
}

.canvas-empty {
  position: absolute;
  inset: 0;
  color: #8ea0bf;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  pointer-events: none;
}

.canvas-item {
  position: absolute;
  z-index: 1;
  border: 1px solid rgba(58, 102, 255, 0.12);
  box-shadow: 0 8px 24px rgba(18, 35, 56, 0.08);
  box-sizing: border-box;
  cursor: move;
  overflow: hidden;
}

.canvas-item.active {
  border-color: #3a66ff;
  box-shadow:
    0 0 0 2px rgba(58, 102, 255, 0.12),
    0 12px 30px rgba(18, 35, 56, 0.12);
}

.item-delete {
  position: absolute;
  top: -1px;
  right: -1px;
  z-index: 2;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 0 0 0 8px;
  color: #ffffff;
  background: #ff6b8a;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.canvas-item:hover .item-delete,
.canvas-item.active .item-delete {
  display: inline-flex;
}

.config-field {
  display: block;
  margin-bottom: 12px;
}

.config-field span,
.color-row span {
  display: block;
  margin-bottom: 6px;
  color: #586782;
  font-size: 12px;
  font-weight: 700;
}

.config-field input {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  color: #17233c;
  box-sizing: border-box;
  outline: none;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.color-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.color-row input {
  width: 100%;
  height: 36px;
  padding: 2px;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  background: #ffffff;
}

.config-actions {
  display: flex;
  gap: 8px;
}

.config-empty {
  padding: 16px;
  border-radius: 8px;
  color: #7e8aa7;
  font-size: 13px;
  line-height: 1.8;
  background: #f7fbff;
}

.preview-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 14px;
}

.preview-viewport {
  height: 600px;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  background: #f7fbff;
  overflow: auto;
}

.preview-canvas {
  position: relative;
  min-width: 920px;
  min-height: 600px;
  background: #ffffff;
}

.preview-json {
  min-height: 600px;
  padding: 14px;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  background: #fbfdff;
  box-sizing: border-box;
}

.preview-json pre {
  height: 528px;
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  color: #25334d;
  background: #f1f6ff;
  overflow: auto;
  font-size: 12px;
  line-height: 1.6;
}

.preview-item {
  cursor: default;
}

.preview-item .item-delete {
  display: none;
}

@media (max-width: 1100px) {
  .builder-layout {
    grid-template-columns: 190px minmax(360px, 1fr);
  }

  .config-panel {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .drag-builder-header {
    flex-direction: column;
  }

  .builder-layout {
    grid-template-columns: 1fr;
  }

  .preview-layout {
    grid-template-columns: 1fr;
  }
}
</style>
