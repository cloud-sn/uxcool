<template>
  <div class="demo"
       style="margin-bottom:250px"
  >
    <h4>normal</h4>
    <ux-affix :offset-top="0">
      <ux-button>top</ux-button>
    </ux-affix>
    <ux-affix :offset-top="100">
      <ux-button>top</ux-button>
    </ux-affix>
  </div>
</template>


<script>
  import { Affix, Button } from '@cloud-sn/uxcool';

  export default {
    components: {
      UxAffix: Affix,
      UxButton: Button,
    },
  };
</script>
