<template>
  <div>

    <div class="demo">
      <ux-textarea :textarea-style="{resize:'none'}"
                   :auto-size="{minRows:2, maxRows:6}"
                   novalidate
                   placeholder="测试用"
                   class="custom-class" />
    </div>

    <div class="demo">
      <ux-textarea :auto-size="{minRows:2, maxRows:6}"
                   novalidate
                   placeholder="测试用"
                   class="custom-class"
                   style="resize: none" />
    </div>
    <div class="demo">
      <ux-textarea :auto-size="{minRows:2, maxRows:6}"
                   :textarea-style="{resize:'none'}"
                   show-word-limit
                   novalidate
                   placeholder="测试用"
                   class="custom-class" />
    </div>

    <div class="demo">
      <ux-textarea :theme="theme"
                   v-model="value"
                   :auto-size="true"
                   spellcheck="false"
                   @input="onInput"
                   @on-change="onChange"
                   @change="onChange"
                   @pressenter="onPressenter"
                   @keyup="onKeyup" />
    </div>

    <div class="demo">
      <ux-textarea :value="value"
                   :theme="theme" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { Input } from '@cloud-sn/uxcool';

  export default {
    components: {
      UxTextarea: Input.Textarea,
    },
    data() {
      return {
        value: 'abc',
      };
    },
    computed: mapState(['theme']),
    created() {
      setTimeout(() => {
        this.value = 'c\nggggggggg';
      }, 1500);
    },
    methods: {
      onInput(val) {
        console.log('input', val);
      },
      onChange(e) {
        console.log('change', e);
      },
      onPressenter(e) {
        console.log('pressenter', e);
      },
      onKeyup(e) {
        console.log('keyup', e);
      },
    },
  };
</script>
