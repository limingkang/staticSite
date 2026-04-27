import Button from 'element-ui/lib/button'
import Dialog from 'element-ui/lib/dialog'
import Dropdown from 'element-ui/lib/dropdown'
import DropdownItem from 'element-ui/lib/dropdown-item'
import DropdownMenu from 'element-ui/lib/dropdown-menu'
import Form from 'element-ui/lib/form'
import FormItem from 'element-ui/lib/form-item'
import Input from 'element-ui/lib/input'
import Message from 'element-ui/lib/message'
import Popover from 'element-ui/lib/popover'
import Select from 'element-ui/lib/select'
import Tree from 'element-ui/lib/tree'
import 'element-ui/lib/theme-chalk/base.css'
import 'element-ui/lib/theme-chalk/icon.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import 'element-ui/lib/theme-chalk/dropdown.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/input.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/popover.css'
import 'element-ui/lib/theme-chalk/select.css'
import 'element-ui/lib/theme-chalk/tree.css'

const elementUiComponents = [
  Button,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Form,
  FormItem,
  Input,
  Popover,
  Select,
  Tree,
]

export default {
  install(Vue) {
    elementUiComponents.forEach((component) => {
      Vue.use(component)
    })

    Vue.prototype.$message = Message
  },
}
