<template>
  <div>
    <div class="demo">
      <popconfirm title="Are you sure delete this task?"
                  :disabled="!isTrigger"
                  placement="bottom"
                  @confirm="onConfirm"
                  @cancel="onCancel">
        <a @click="onDelete">Delete</a>
      </popconfirm>
      <ux-switch v-model="isTrigger"
                 @change="onChange" />
    </div>

  </div>
</template>


<script>
  import { Popconfirm, Switch } from '@cloud-sn/uxcool';

  export default {
    components: {
      Popconfirm,
      UxSwitch: Switch,
    },
    data() {
      return {
        isTrigger: true,
      };
    },
    methods: {
      onChange(visible) {
        this.isTrigger = visible;
        console.log(visible);
      },
      onConfirm() {
        console.log('confirm');
      },
      onCancel() {
        console.log('cancel');
      },
      onDelete() {
        if (!this.isTrigger) {
          this.onConfirm();
        }
      },
    },
  };
</script>
