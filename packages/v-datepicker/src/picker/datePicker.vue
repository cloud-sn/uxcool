<template>
  <trigger :prefix-cls="pickerPrefixCls"
           :visible="open"
           :actions="actions"
           :popup-align="align"
           :popup-placement="placement"
           :builtin-placements="buildinPlacements"
           :popup-transition-name="transitionName"
           :popup-animation="animation"
           :get-popup-container="getPopupContainer"
           destroy-popup-on-hide
           @on-popup-visible-change="onPopupVisible"
  >
    <template slot="trigger">
      <slot name="trigger" />
    </template>

    <calendar slot="popup"
              :prefix-cls="prefixCls"
              :class="`${prefixCls}-${theme}`"
              :value="innerValue"
              :mode="mode"
              :locale="locale"
              :format="dateFormat"
              :show-ok="showOk"
              :has-time-picker="isShowTime"
              :show-today="showToday"
              :show-time="showTime"
              :disabled-date="disabledDate"
              :disabled-time="disabledTime"
              :date-input-placeholder="dateInputPlaceholder"
              :control-mode="controlMode"
              :show-date-input="showDateInput"
              :show-week-number="showWeekNumber"
              v-on="bindListeners"
    >
      <template slot="timePicker"
                slot-scope="props"
      >
        <time-picker-panel v-if="isShowTime"
                           v-bind="timePickerPanelProps"
                           @on-change="props.onChange"
        />
      </template>
    </calendar>
  </trigger>
</template>


<script>
  import Trigger from '@cloud-sn/v-trigger';
  import { VTimePickerPanel } from '@cloud-sn/v-timepicker';
  import { formatDate, normalizeDate } from '../utils';
  import Calendar from '../calendar.vue';
  import localeEN from '../locale/en_US';
  import placements from './placements';

  export default {
    name: 'DatePicker',
    components: {
      Calendar,
      Trigger,
      TimePickerPanel: VTimePickerPanel,
    },
    props: {
      prefixCls: {
        type: String,
        default: 'v-calendar',
      },
      pickerPrefixCls: {
        type: String,
        default: 'v-calendar-picker',
      },
      locale: {
        type: Object,
        default() {
          return localeEN;
        },
      },
      mode: {
        type: String,
        default: undefined,
      },
      theme: {
        type: String,
        default: 'light',
      },
      isOpen: {
        type: Boolean,
        default: false,
      },
      value: Date,
      disabled: Boolean,
      format: String,
      showTime: [Boolean, Object],
      showToday: Boolean,
      showOk: {
        type: Boolean,
        default() {
          return !!this.showTime;
        },
      },
      showDateInput: Boolean,
      dateInputPlaceholder: String,
      disabledDate: Function,
      disabledTime: Function,
      placement: {
        type: String,
        default: 'bottomLeft',
      },
      transitionName: {
        type: String,
        default: '',
      },
      animation: {
        type: String,
        default: '',
      },
      getPopupContainer: {
        type: Function,
        default: null,
      },
      okConfirm: {
        type: Boolean,
        default: false,
      },
      controlMode: {
        type: Boolean,
        default: false,
      },
      showWeekNumber: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        buildinPlacements: placements,
        innerValue: null,
        inputValue: null,
        open: false,
        align: {
          // points: ['tl', 'tl'],
        },
        disabledHours: null,
        disabledMinutes: null,
        disabledSeconds: null,
      };
    },
    computed: {
      inputClasses() {
        const { prefixCls } = this;
        return {
          [`${prefixCls}-picker-input`]: true,
        };
      },
      actions() {
        const { disabled } = this;
        return disabled ? [] : ['click'];
      },
      formatValue() {
        const { inputValue, dateFormat } = this;
        if (!inputValue) {
          return '';
        }
        return formatDate(inputValue, dateFormat);
      },
      isShowTime() {
        return !!this.showTime;
      },
      timeProps() {
        const { showTime } = this;
        if (typeof showTime === 'object') {
          return showTime;
        }
        return {};
      },
      dateFormat() {
        const { format, isShowTime } = this;
        return format || (isShowTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
      },
      isHasOkButton() {
        const { isShowTime, showOk } = this;
        return showOk === true || (showOk !== false && !!isShowTime);
      },
      isOkConfirm() {
        const { isHasOkButton, okConfirm } = this;
        return isHasOkButton && okConfirm;
      },
      timePickerPanelProps() {
        const {
          prefixCls,
          innerValue,
          disabledHours,
          disabledMinutes,
          disabledSeconds,
          timeProps,
        } = this;
        return {
          showHour: true,
          showMinute: true,
          showSecond: true,
          ...timeProps,
          prefixCls: `${prefixCls}-time-picker`,
          value: innerValue,
          disabledHours,
          disabledMinutes,
          disabledSeconds,
        };
      },
      bindListeners() {
        const {
          $listeners, onPanelChange, onSelect, onOk
        } = this;
        return {
          ...$listeners,
          'on-panel-change': onPanelChange,
          'on-select': onSelect,
          'on-ok': onOk,
        };
      },
    },
    watch: {
      value(nVal, oVal) {
        if (nVal !== oVal) {
          const validDate = normalizeDate(nVal);
          this.innerValue = validDate;
          this.inputValue = validDate;
        }
      },
      isOpen(nVal) {
        this.setOpen(nVal);
      },
    },
    created() {
      const {
        value, isOpen, disabledTime, disabled
      } = this;
      const validDate = normalizeDate(value);
      this.innerValue = validDate;
      this.inputValue = validDate;
      this.setOpen(disabled ? false : isOpen);
      if (disabledTime) {
        const opts = disabledTime(validDate);
        this.disabledHours = opts.disabledHours;
        this.disabledMinutes = opts.disabledMinutes;
        this.disabledSeconds = opts.disabledSeconds;
      }
    },
    methods: {
      setOpen(flag) {
        this.open = flag;
      },
      onPanelChange(...args) {
        this.$emit('panel-change', ...args);
      },
      onChange(val, hide = true) {
        const { setOpen, dateFormat } = this;
        this.inputValue = val;
        this.$emit('change', val, formatDate(val, dateFormat));
        if (hide) {
          setOpen(false);
        }
      },
      onSelect(val) {
        const { isOkConfirm, isHasOkButton, onChange } = this;
        this.innerValue = val;
        if (!isOkConfirm) {
          onChange(val, !isHasOkButton);
        }
      },
      onFocus(e) {
        this.$emit('focus', e);
      },
      onPopupVisible(visible) {
        if (visible) {
          this.innerValue = this.inputValue;
        }
        this.setOpen(visible);
        this.$emit('open-change', visible);
      },
      onOk(value) {
        const { isHasOkButton, isOkConfirm, onChange } = this;
        this.setOpen(false);
        if (isHasOkButton) {
          this.$emit('ok', value);
          if (isOkConfirm) {
            onChange(value);
          }
        }
      },
    },
  };
</script>
