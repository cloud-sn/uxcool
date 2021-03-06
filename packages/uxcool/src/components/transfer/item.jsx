import { debounce } from '@cloud-sn/v-utils';
import { buildComponentName } from '../utils';
import Checkbox from '../checkbox';

export default {
  name: buildComponentName('TransferListItem'),
  props: {
    prefixCls: {
      type: String,
      default: 'ux-transfer-list-content-item',
    },
    checked: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    title: {
      type: String,
      default: '',
    },
    label: {
      type: [String, Object, Array],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      const { prefixCls, item, disabled } = this;
      return {
        [prefixCls]: true,
        [`${prefixCls}-disabled`]: !!item.disabled || disabled,
      };
    },
  },
  created() {
    // fixed, 点击 checkbox label会同时触发两次click,一个label的,一个input的
    this.onDebounceClick = debounce(this.onClick, 10);
  },
  methods: {
    onClick(e) {
      const { item, disabled } = this;
      e.stopPropagation();
      if (item.disabled || disabled) {
        return;
      }
      this.$emit('click', item);
    },
  },
  render() {
    const {
      classes, checked, title, item, label, onDebounceClick, disabled
    } = this;
    return (
      <li class={classes} title={title} on-click={onDebounceClick}>
        <Checkbox control checked={checked} disabled={item.disabled || disabled} />
        <span>{label}</span>
      </li>
    );
  },
};
