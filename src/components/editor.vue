<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <el-popover placement="bottom" width="400" trigger="click" popper-class="lajisty" :open-delay="100">
      <div class="editor-operator-con">
        <div style="width: 206px">
          <div>操作符</div>
          <span
            v-for="tag in operaterList"
            :key="tag"
            class="el-tag el-tag--small el-tag--light tag-special-sty"
            contenteditable="false"
            @click="insertOperator(tag)"
          >
            {{ tag }}
          </span>
        </div>
        <div style="flex: 1">
          <div>指标</div>
          <span
            v-for="tag in markMetric"
            :key="tag.code"
            class="el-tag el-tag--small el-tag--light tag-special-sty"
            contenteditable="false"
            @click="clickColumnItem(tag)"
          >
            {{ tag.text }}
          </span>
        </div>
      </div>
      <div
        slot="reference"
        ref="myEditorDom"
        :contenteditable="true"
        class="edit-container"
        @blur="changeText($event)"
        v-html="editerval"
      />
    </el-popover>
    <div class="editor-introduce">
      公式编辑器支持以下运算符：'+', '-', '*', '/', '()', 'and', 'or', '>', '\', '=', 'if'
    </div>
    <div class="editor-introduce">
      举例：我们需要跟进7天内有销无库的信息，输入公式为"7天销量>0 and 当前库存=0"
    </div>
  </div>
</template>
<script>
// 使用该组件的地方如何想重置编辑器内容则：
// resetval() {
//       this.editerval = this.$refs.sql.getEditorVal()
//       this.$nextTick(() => {
//         this.editerval = ''
//       })
//     },
export default {
  name: 'SqlEditer',
  props: {
    editerval: {
      default: '',
      type: String,
    },
    // 指标特殊字段
    markMetric: {
      default: () => {
        return []
      },
      type: Array,
    },
  },
  data() {
    return {
      editEvent: null, // 编辑器部分的事件保存
      selectionTemp: null, // 保存光标选中
      range: null, // 光标位置临时对象
      inputValTmple: '', // 保存输入值的临时变量
      operaterList: ['+', '-', '*', '/', '()', 'and', 'or', '>', '<', '=', 'if(condition, exprTrue, exprFalse)'],
    }
  },
  watch: {
    editerval(newval) {
      this.init(newval)
    },
  },
  mounted() {
    this.init(this.editerval)
    this.$refs.myEditorDom.addEventListener('keydown', e => {
      // 允许：数字键、删除、方向键、Tab
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', '%']

      // 如果按下的是非数字键且不在允许列表中，阻止输入
      console.log(e)
      if (!(e.key >= '0' && e.key <= '9') && !allowedKeys.includes(e.key)) {
        console.log('forbidden')
        e.preventDefault()
      }
    })
    this.$refs.myEditorDom.addEventListener('paste', e => {
      const pasteText = (e.clipboardData || window.clipboardData).getData('text')
      if (!/^\d+$/.test(pasteText)) {
        e.preventDefault()
      }
    })
  },
  methods: {
    // 取出指标数组
    extractSpanContents(html) {
      const regex = /<span\b[^>]*>([\s\S]*?)<\/span>/gi
      const matches = []
      let match
      while ((match = regex.exec(html)) !== null) {
        if (match[1] !== 'and' && match[1] !== 'or') {
          matches.push(match[1])
        }
      }
      return matches
    },
    // 验证括号是否成对出现闭合了，正则表达式实现不友好，性能很差
    isValidParentheses(str) {
      // 使用栈来跟踪括号
      const stack = []
      for (let i = 0; i < str.length; i++) {
        const char = str[i]
        if (char === '(') {
          // 遇到左括号时，将其推入栈中
          stack.push(char)
        } else if (char === ')') {
          // 遇到右括号时，检查栈是否为空
          if (stack.length === 0) {
            return false // 栈为空，说明没有对应的左括号
          }
          // 弹出栈顶的左括号
          stack.pop()
        }
      }
      // 最后检查栈是否为空
      return stack.length === 0
    },
    // 重置也使用此方法
    init(val) {
      this.inputValTmple = val
    },
    errorToast(text) {
      this.$vui_message({
        message: text,
        type: 'error',
        duration: 2000,
      })
    },
    // 判断输入值是否合法
    judgeVal() {
      // 大于号和小于号会被编码，需要转义回字符串><
      this.inputValTmple = this.inputValTmple.replace(/&(lt|gt);/g, (match, p1) => {
        return p1 === 'lt' ? '<' : '>'
      })
      let tempRecord = this.inputValTmple.replace(/\s+/g, '')
      const chinesstext = tempRecord.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '')
      if (/[\u4E00-\u9FA5]/g.test(chinesstext)) {
        this.errorToast('不支持输入中文')
        return false
      }
      tempRecord = tempRecord.replace(/<\/?span[^>]*>/gi, '') // 去除标签保留值
      console.log('验证时候格式化', tempRecord)
      if (!this.isValidParentheses(tempRecord)) {
        this.errorToast('()没有闭合')
        return false
      }
      // regex = /^(?:[^a-zA-Z]*|\b(?:if|and|or)\b[^a-zA-Z]*)+$/i
      // 验证操作符不能出现在开头或者结尾
      const regexMath = /^(?![+\-*\/=><andor]).*(?<![+\-*\/<=>andor])$/
      if (!regexMath.test(tempRecord)) {
        this.errorToast('语法错误0000')
        return false
      }
      // 验证运算符 +-*/不能互相组合连续出现
      const regexMathOperatorOne = /^(?!.*\s)(?!.*[+\-*/]{2})/
      if (!regexMathOperatorOne.test(tempRecord)) {
        this.errorToast('语法错误1111')
        return false
      }
      // +-*/=>< 大于号 ><+-/*
      const regexMathTwo = /([-+*\/=<>]>|>[-+*\/<>])/
      if (regexMathTwo.test(tempRecord)) {
        this.errorToast('语法错误2222')
        return false
      }
      // +-*=<> 小于号 +-/*<>
      const regexMathThree = /([-+*\/=<>]<|<[-+*\/<>])/
      if (regexMathThree.test(tempRecord)) {
        this.errorToast('语法错误3333')
        return false
      }
      // ==
      const regexMathFour = /==/
      if (regexMathFour.test(tempRecord)) {
        this.errorToast('语法错误4444')
        return false
      }
      // ><=+-*/or and 与操作 and or><=+-*/
      const regexMathFive = /^(?!.*[><=+\-*/andor]and)(?!.*and[andor>=<+*/-]).*$/
      if (!regexMathFive.test(tempRecord)) {
        this.errorToast('语法错误5555')
        return false
      }
      // ><=+-*/and or 或操作 and or><=+-*/
      const regexMathSix = /^(?!.*[><=+\-*/andor]or)(?!.*or[andor>=<+*/-]).*$/
      if (!regexMathSix.test(tempRecord)) {
        this.errorToast('语法错误6666')
        return false
      }
      // if(,,)
      const regexMathSeven = /^.*if\(\S+,\S+,\S+\).*$/
      if (/[if,]/.test(tempRecord) && !regexMathSeven.test(tempRecord)) {
        this.errorToast('if语法错误')
        return false
      }

      if (tempRecord.length > 400) {
        this.errorToast('字符超长')
        return false
      }
      const marks = this.extractSpanContents(this.inputValTmple)
      if (!marks.length) {
        this.errorToast('至少选择一个指标')
        return false
      } else if (marks.length > 5) {
        this.errorToast('最多支持5个指标')
        return false
      }
      return true
    },
    // 获取选择的指标数组
    getMarkArray() {
      return this.extractSpanContents(this.inputValTmple)
    },
    // 获取输入的值,对数据进行格式化
    getEditorVal() {
      let temp = this.inputValTmple.replace(/(\s*)and(\s*)/g, ' and ')
      temp = temp.replace(/(\s*)or(\s*)/g, ' or ')
      return temp
    },
    // 插入运算符
    insertOperator(ope) {
      if (ope === 'and' || ope === 'or') {
        this.insertData(`<span contenteditable="false">${ope}</span>`)
      } else if (/[if]/.test(ope)) {
        this.insertData('if(,,)')
      } else {
        this.insertData(ope)
      }
    },
    // 选择某个指标
    clickColumnItem(modelItem) {
      // 在光标选中位置插入选中指标
      const html = `<span class="edittagstyself" contenteditable="false">${modelItem.text}</span>`
      this.insertData(html)
    },
    // 光标后面插入数据方法
    insertData(html) {
      if (this.selectionTemp.rangeCount === 0 || !this.selectionTemp.isCollapsed) {
        console.warn('光标未就绪或存在选中文本')
        return
      }
      const el = document.createElement('div')
      el.innerHTML = html
      const frag = document.createDocumentFragment()
      let node
      let lastNode
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node)
      }
      this.range.insertNode(frag)
      // Preserve the selection
      if (lastNode) {
        this.range.setStartAfter(lastNode)
        // this.range.setEndAfter(lastNode)
        this.range.collapse(true)
        this.selectionTemp.removeAllRanges()
        this.selectionTemp.addRange(this.range)
      }
      this.inputValTmple = this.editEvent.target.innerHTML
    },
    // 输入区域失去焦点，例如点击指标时候会失去焦点
    changeText(event) {
      this.editEvent = event
      this.selectionTemp = window.getSelection()
      this.range = this.selectionTemp.getRangeAt(0)
      // 临时变量用来存储当前行itemShowValue值 （解决光标问题，contenteditable与v-html所在的元素值的改变如果不是通过输入而是通过赋值实现，光标就会跑到最前面；）
      const itemShowTempVal = event.target.innerHTML.replace(
        /&nbsp;|<div>|<br>|<\/div>|\s(?!class|contenteditable|el-tag)|\n|\r/g,
        '',
      )
      if (itemShowTempVal.length > 800) {
        this.$message.warning('字符超长')
        return
      }
      this.inputValTmple = itemShowTempVal
    },
  },
}
</script>
<style>
/* 可直接用这个组件 vui-popover 则不需要该class, 但是该组件有bug，工厂需要修复很多参数不支持 */
.lajisty {
  z-index: 99999 !important;
}
</style>
<style scoped>
.editor-operator-con {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.editor-operator-con .tag-special-sty {
  margin-right: 2px;
  cursor: pointer;
  margin-top: 2px;
}
.editor-introduce {
  color: #415fff;
  margin: 8px 0;
  line-height: 10px;
  font-size: 12px;
}
.edit-container {
  padding: 6px;
  height: 100px;
  line-height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  text-align: left;
  overflow-x: hidden;
  overflow-y: auto;
  word-break: break-all;
}
</style>
