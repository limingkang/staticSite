import ButtonBlock from './ButtonBlock.vue'
import DividerBlock from './DividerBlock.vue'
import ImageBlock from './ImageBlock.vue'
import StatBlock from './StatBlock.vue'
import TextBlock from './TextBlock.vue'
import TitleBlock from './TitleBlock.vue'

export const componentMap = {
  title: 'DragTitleBlock',
  text: 'DragTextBlock',
  button: 'DragButtonBlock',
  stat: 'DragStatBlock',
  divider: 'DragDividerBlock',
  image: 'DragImageBlock',
}

export default {
  DragButtonBlock: ButtonBlock,
  DragDividerBlock: DividerBlock,
  DragImageBlock: ImageBlock,
  DragStatBlock: StatBlock,
  DragTextBlock: TextBlock,
  DragTitleBlock: TitleBlock,
}
