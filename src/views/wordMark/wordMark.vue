<template>
  <div class="word-mark-page" @click="handlePageClick">
    <header class="word-mark-header">
      <div>
        <p class="word-mark-eyebrow">
          滑词标注
        </p>
        <h1>语料实体与属性标注</h1>
      </div>
      <div class="word-mark-actions">
        <el-button size="mini" @click.stop="resetDemo">
          重置
        </el-button>
        <el-button size="mini" type="primary" @click.stop="saveResult">
          生成结果
        </el-button>
      </div>
    </header>

    <main class="word-mark-main">
      <section class="word-mark-panel word-mark-panel--corpus">
        <div class="panel-title">
          <span>原始语料</span>
          <strong>拖选文字后选择标注类型</strong>
        </div>

        <textarea
          v-model="form.userQuestion"
          class="corpus-editor"
          rows="4"
          @input="handleCorpusInput"
          @mouseup.stop="handleTextareaSelect"
          @click.stop
        />

        <div
          ref="markText"
          class="mark-text"
          @mouseup.stop="handleSelect"
          @click.stop
        >
          <span
            v-for="(part, index) in displayParts"
            :key="index"
            :class="{
              'mark-text__entity': part.type === 'entity',
              'mark-text__property': part.type === 'property',
            }"
            :data-start="part.start"
            :data-end="part.end"
          >{{ part.text }}</span>
        </div>
      </section>

      <section class="word-mark-panel word-mark-panel--form">
        <div class="panel-title">
          <span>标注信息</span>
          <strong>本地填写，无接口提交</strong>
        </div>

        <label class="field-row">
          <span>实体</span>
          <input v-model.trim="form.entity" type="text" placeholder="从语料中滑选实体" @input="syncEntityTag">
        </label>

        <label class="field-row">
          <span>属性</span>
          <input v-model.trim="form.property" type="text" placeholder="从语料中滑选属性，也可手动输入" @input="syncPropertyTag">
        </label>

        <label class="field-row">
          <span>属性值</span>
          <input v-model.trim="form.propertyValue" type="text" placeholder="输入属性值">
        </label>

        <label class="field-row">
          <span>属性语料</span>
          <p class="field-hint">说明：<code>&lt;e&gt;</code> 是原功能中的实体占位符，表示已标注实体。</p>
          <textarea v-model="corpus" rows="3" placeholder="实体会自动替换成 <e>" />
        </label>
      </section>

      <section class="word-mark-panel word-mark-panel--result">
        <div class="panel-title">
          <span>结果预览</span>
          <strong>页面内生成，便于复制检查</strong>
        </div>
        <pre>{{ resultText }}</pre>
      </section>
    </main>

    <div
      v-if="tagPicker.visible"
      class="tag-picker"
      :style="{ left: tagPicker.left + 'px', top: tagPicker.top + 'px' }"
      @click.stop
      @mousedown.prevent
    >
      <button type="button" @click="applyMark('entity')">
        实体
      </button>
      <button type="button" @click="applyMark('property')">
        属性
      </button>
    </div>
  </div>
</template>

<script>
const defaultQuestion = '用户想查询李白的出生年代和代表作品'

export default {
  name: 'WordMark',
  data() {
    return {
      form: {
        userQuestion: defaultQuestion,
        entity: '',
        property: '',
        propertyValue: '',
      },
      entityTag: null,
      propertyTag: null,
      corpus: defaultQuestion,
      tagPicker: {
        visible: false,
        left: 0,
        top: 0,
        selection: null,
      },
      lastResult: null,
    }
  },
  computed: {
    displayParts() {
      const text = this.form.userQuestion || ''
      const marks = [
        this.entityTag ? { ...this.entityTag, type: 'entity' } : null,
        this.propertyTag ? { ...this.propertyTag, type: 'property' } : null,
      ]
        .filter((item) => item && item.start >= 0 && item.end > item.start)
        .map((item) => ({
          ...item,
          start: Math.max(0, Math.min(text.length, item.start)),
          end: Math.max(0, Math.min(text.length, item.end)),
        }))
        .filter((item) => item.end > item.start)
        .sort((a, b) => a.start - b.start)

      if (marks.length === 0) {
        return [{ type: 'text', text, start: 0, end: text.length }]
      }

      const parts = []
      let cursor = 0
      marks.forEach((mark) => {
        if (mark.start < cursor) return
        if (mark.start > cursor) {
          parts.push({
            type: 'text',
            text: text.slice(cursor, mark.start),
            start: cursor,
            end: mark.start,
          })
        }
        parts.push({
          type: mark.type,
          text: text.slice(mark.start, mark.end),
          start: mark.start,
          end: mark.end,
        })
        cursor = mark.end
      })
      if (cursor < text.length) {
        parts.push({
          type: 'text',
          text: text.slice(cursor),
          start: cursor,
          end: text.length,
        })
      }
      return parts.filter((part) => part.text)
    },
    resultText() {
      const result = this.lastResult || this.buildResult()
      return JSON.stringify(result, null, 2)
    },
  },
  methods: {
    handleSelect(ev) {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const text = selection.toString()
      if (!text.trim()) {
        this.closePicker()
        return
      }

      const range = selection.getRangeAt(0)
      const container = this.$refs.markText
      if (!container || !container.contains(range.commonAncestorContainer)) {
        return
      }

      const start = this.getSelectionOffset(range.startContainer, range.startOffset)
      const end = this.getSelectionOffset(range.endContainer, range.endOffset)
      if (start === null || end === null) {
        this.closePicker()
        return
      }

      const selected = this.normalizeSelection(start, end)
      if (!selected) {
        this.closePicker()
        return
      }

      this.tagPicker = {
        visible: true,
        left: Math.min(ev.clientX + 10, window.innerWidth - 120),
        top: Math.min(ev.clientY + 12, window.innerHeight - 90),
        selection: selected,
      }
    },
    handleTextareaSelect(ev) {
      const target = ev.target
      const selected = this.normalizeSelection(target.selectionStart, target.selectionEnd)
      if (!selected) {
        this.closePicker()
        return
      }

      this.tagPicker = {
        visible: true,
        left: Math.min(ev.clientX + 10, window.innerWidth - 120),
        top: Math.min(ev.clientY + 12, window.innerHeight - 90),
        selection: selected,
      }
    },
    applyMark(type) {
      const selected = this.tagPicker.selection
      if (!selected) return

      if (type === 'entity') {
        this.form.entity = selected.text
        this.entityTag = {
          start: selected.start,
          end: selected.end,
        }
      } else {
        this.form.property = selected.text
        this.propertyTag = {
          start: selected.start,
          end: selected.end,
        }
        this.updateCorpus()
      }

      this.lastResult = null
      this.closePicker()
      window.getSelection().removeAllRanges()
    },
    syncEntityTag() {
      const text = this.form.userQuestion || ''
      const entity = this.form.entity || ''
      const index = entity ? text.indexOf(entity) : -1
      this.entityTag = index >= 0
        ? { start: index, end: index + entity.length }
        : null
      this.lastResult = null
    },
    syncPropertyTag() {
      const text = this.form.userQuestion || ''
      const property = this.form.property || ''
      const index = property ? text.indexOf(property) : -1
      this.propertyTag = index >= 0
        ? { start: index, end: index + property.length }
        : null
      this.updateCorpus()
    },
    getSelectionOffset(node, offset) {
      const container = this.$refs.markText
      let current = node.nodeType === Node.TEXT_NODE ? node.parentNode : node

      if (current === container) {
        return this.getContainerBoundaryOffset(container, offset)
      }

      while (current && current !== container && (!current.dataset || current.dataset.start === undefined)) {
        current = current.parentNode
      }

      if (!current || current === container) return null

      const start = Number(current.dataset.start)
      const end = Number(current.dataset.end)
      if (node.nodeType === Node.TEXT_NODE) {
        return start + offset
      }
      return offset <= 0 ? start : end
    },
    getContainerBoundaryOffset(container, offset) {
      const children = Array.prototype.filter.call(container.childNodes, (child) => {
        return child.dataset && child.dataset.start !== undefined
      })
      const child = children[offset]
      if (child) {
        return Number(child.dataset.start)
      }

      const previous = children[offset - 1] || children[children.length - 1]
      if (previous) {
        return Number(previous.dataset.end)
      }

      return 0
    },
    normalizeSelection(start, end) {
      const text = this.form.userQuestion || ''
      let safeStart = Math.max(0, Math.min(text.length, start))
      let safeEnd = Math.max(0, Math.min(text.length, end))

      if (safeStart > safeEnd) {
        const temp = safeStart
        safeStart = safeEnd
        safeEnd = temp
      }

      while (safeStart < safeEnd && /\s/.test(text.charAt(safeStart))) {
        safeStart += 1
      }
      while (safeEnd > safeStart && /\s/.test(text.charAt(safeEnd - 1))) {
        safeEnd -= 1
      }

      if (safeStart === safeEnd) return null
      return {
        start: safeStart,
        end: safeEnd,
        text: text.slice(safeStart, safeEnd),
      }
    },
    updateCorpus() {
      const text = this.form.userQuestion || ''
      const entity = this.form.entity || ''
      const tag = this.entityTag

      if (entity && tag && text.slice(tag.start, tag.end) === entity) {
        this.corpus = `${text.slice(0, tag.start)}<e>${text.slice(tag.end)}`
      } else {
        this.corpus = entity ? text.replace(entity, '<e>') : text
      }
      this.lastResult = null
    },
    handleCorpusInput() {
      this.syncEntityTag()
      this.syncPropertyTag()
      if (!this.form.property) {
        this.corpus = this.form.userQuestion || ''
      }
    },
    buildResult() {
      return {
        entity: this.form.entity,
        property: this.form.property,
        propertyValue: this.form.propertyValue,
        corpus: this.corpus,
      }
    },
    saveResult() {
      if (!this.form.entity) {
        this.$message.warning('请先标注或输入实体')
        return
      }
      if (!this.form.property) {
        this.$message.warning('请先标注或输入属性')
        return
      }
      this.lastResult = this.buildResult()
      this.$message.success('结果已生成')
    },
    resetDemo() {
      this.form = {
        userQuestion: defaultQuestion,
        entity: '',
        property: '',
        propertyValue: '',
      }
      this.entityTag = null
      this.propertyTag = null
      this.corpus = defaultQuestion
      this.lastResult = null
      this.closePicker()
    },
    closePicker() {
      this.tagPicker = {
        visible: false,
        left: 0,
        top: 0,
        selection: null,
      }
    },
    handlePageClick() {
      this.closePicker()
    },
  },
}
</script>

<style lang="less" scoped>
.word-mark-page {
  min-height: 100%;
  padding: 18px;
  box-sizing: border-box;
  color: #17233c;
  background: #f7fbff;
}

.word-mark-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.word-mark-eyebrow {
  margin: 0 0 6px;
  color: #3a66ff;
  font-size: 12px;
  font-weight: 700;
}

.word-mark-header h1 {
  margin: 0;
  font-size: 24px;
  line-height: 1.25;
}

.word-mark-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.word-mark-main {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.75fr);
  gap: 14px;
}

.word-mark-panel {
  padding: 16px;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;
}

.word-mark-panel--result {
  grid-column: 1 / -1;
}

.panel-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.panel-title span {
  color: #17233c;
  font-size: 16px;
  font-weight: 700;
}

.panel-title strong {
  color: #7e8aa7;
  font-size: 12px;
  font-weight: 500;
}

.corpus-editor,
.field-row input,
.field-row textarea {
  width: 100%;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  box-sizing: border-box;
  color: #17233c;
  font: inherit;
  outline: none;
  background: #fbfdff;
}

.corpus-editor {
  min-height: 92px;
  padding: 12px;
  line-height: 1.8;
  resize: vertical;
}

.mark-text {
  min-height: 110px;
  margin-top: 12px;
  padding: 14px;
  border: 1px dashed #b9d0ff;
  border-radius: 8px;
  color: #34445d;
  font-size: 15px;
  line-height: 2;
  background: #f8fbff;
  user-select: text;
}

.mark-text__entity {
  padding: 2px 4px;
  border-radius: 4px;
  color: #2452d8;
  background: rgba(58, 102, 255, 0.14);
}

.mark-text__property {
  padding: 2px 4px;
  border-radius: 4px;
  color: #a25200;
  background: rgba(255, 181, 71, 0.28);
}

.field-row {
  display: block;
  margin-bottom: 14px;
}

.field-row:last-child {
  margin-bottom: 0;
}

.field-row span {
  display: block;
  margin-bottom: 7px;
  color: #586782;
  font-size: 13px;
  font-weight: 700;
}

.field-hint {
  margin: -2px 0 8px;
  color: #7e8aa7;
  font-size: 12px;
  line-height: 1.6;
}

.field-hint code {
  padding: 1px 4px;
  border-radius: 4px;
  color: #2452d8;
  background: rgba(58, 102, 255, 0.1);
  font-family: Consolas, Monaco, monospace;
}

.field-row input {
  height: 38px;
  padding: 0 11px;
}

.field-row textarea {
  min-height: 76px;
  padding: 10px 11px;
  resize: vertical;
}

.word-mark-panel pre {
  min-height: 132px;
  margin: 0;
  padding: 14px;
  border-radius: 8px;
  color: #25334d;
  background: #f1f6ff;
  overflow: auto;
  font-size: 13px;
  line-height: 1.7;
}

.tag-picker {
  position: fixed;
  z-index: 20;
  display: flex;
  gap: 6px;
  padding: 8px;
  border: 1px solid #d6e6ff;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 32px rgba(18, 35, 56, 0.18);
}

.tag-picker button {
  height: 30px;
  padding: 0 12px;
  border: 1px solid #b9d0ff;
  border-radius: 6px;
  color: #2452d8;
  font-size: 13px;
  font-weight: 700;
  background: #f7fbff;
  cursor: pointer;
}

.tag-picker button:hover {
  border-color: #3a66ff;
  color: #ffffff;
  background: #3a66ff;
}

@media (max-width: 860px) {
  .word-mark-header,
  .panel-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .word-mark-main {
    grid-template-columns: 1fr;
  }
}
</style>
