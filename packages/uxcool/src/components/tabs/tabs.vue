<template>
  <v-tabs v-bind="bindProps"
          :class="classes"
          :tab-bar-position="tabPosition"
          :animated="isAnimated"
          v-on="bindListeners">
    <template slot="tabBarExtraContent">
      <slot name="tabBarExtraContent" />
    </template>
    <slot />
  </v-tabs>
</template>


<script>
  import omit from 'object.omit';
  import { VTabs } from '@cloud-sn/v-tabs';
  import { buildComponentName, isFlexSupported } from '../utils';

  export default {
    name: buildComponentName('Tabs'),
    components: {
      VTabs,
    },
    props: {
      prefixCls: {
        type: String,
        default: 'ux-tabs',
      },
      type: {
        type: String,
        default: 'line',
        validator(val) {
          return ['line', 'card'].indexOf(val) > -1;
        },
      },
      editable: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String,
        default: 'default',
        validator(val) {
          return ['default', 'large', 'small', ''].indexOf(val) > -1;
        },
      },
      tabPosition: {
        type: String,
        default: 'top',
        validator(val) {
          return ['top', 'left', 'right', 'bottom'].indexOf(val) > -1;
        },
      },
      value: {
        type: String,
        default: undefined,
      },
      animated: {
        type: Boolean,
        default() {
          return this.type !== 'card';
        },
      },
      theme: {
        type: String,
        default: 'light',
      },
      control: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      isSupportFlex() {
        return isFlexSupported();
      },
      bindProps() {
        return omit(this.$props, ['theme', 'tabPosition', 'type', 'animated']);
      },
      bindListeners() {
        const { $listeners, onTabClick } = this;

        return {
          ...$listeners,
          'tab-click': onTabClick,
        };
      },
      classes() {
        const {
          prefixCls, type, tabPosition, size, theme, isSupportFlex
        } = this;
        return {
          [`${prefixCls}-vertical`]: tabPosition === 'left' || tabPosition === 'right',
          [`${prefixCls}-${size}`]: !!size,
          [`${prefixCls}-${type}`]: true,
          [`${prefixCls}-${theme}`]: true,
          'no-flex': !isSupportFlex,
        };
      },
      isAnimated() {
        const { animated } = this;
        return animated;
      },
    },
    methods: {
      onTabClick(tab, name, e) {
        const { control } = this;
        if (!control) {
          this.$emit('input', name);
        }
        this.$emit('tab-click', name, tab, e);
      },
    },
  };
</script>
