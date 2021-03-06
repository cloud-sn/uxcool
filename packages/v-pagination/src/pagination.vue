<template>
  <!-- simple -->
  <ul v-if="simple"
      :class="[simpleClasses,className]">
    <li v-if="showBeforeTotal !== noop"
        :class="beforeTotalClasses"
        v-html="beforeTotalLiteral" />
    <li :title="genTitle(locale.prev_page)"
        :class="prevClasses"
        tabindex="0"
        @click="prev"
        @keypress.enter="prev">
      <v-nodes :vnodes="itemRender(prevPageNo, 'prev' ,prevIcon)" />
    </li>
    <li :class="simpleSepClasses" />
    <li :title="genTitle(locale.next_page)"
        :class="nextClasses"
        tabindex="0"
        @click="next"
        @keypress.enter="next">
      <v-nodes :vnodes="itemRender(nextPageNo,'next', nextIcon)" />
    </li>
  </ul>
  <ul v-else
      :class="[classes,className]"
      :style="styles"
      unselectable="unselectable">

    <li v-if="showBeforeTotal !== noop"
        :class="beforeTotalClasses"
        v-html="beforeTotalLiteral" />

    <li :title="genTitle(locale.prev_page)"
        :class="prevClasses"
        tabindex="0"
        @click="prev"
        @keypress.enter="prev">
      <v-nodes :vnodes="itemRender(prevPageNo, 'prev', prevIcon)" />
    </li>
    <template v-for="(item) in pagers">
      <li v-if="item.type === 'jump'"
          :title="item.title"
          :class="item.classes"
          tabindex="0"
          @click="item.onClick"
          @keypress="item.onKeyPress">
        <v-nodes :vnodes="itemRender(item.getPage(), `jump-${item.key}`, item.jumpIcon())" />
      </li>
      <pager v-if="item.type==='pager'"
             :page="item.page"
             :active="item.active"
             :show-title="item.showTitle"
             :root-prefix-cls="item.prefixCls"
             :class-name="item.classes"
             @click.native="item.onClick"
             @keypress.native.enter="item.onKeyPress">
        <v-nodes :vnodes="itemRender(item.page, 'page', getPageItem(item))" />
      </pager>
    </template>
    <li :title="genTitle(locale.next_page)"
        :class="nextClasses"
        tabindex="0"
        @click="next"
        @keypress.enter="next">
      <v-nodes :vnodes="itemRender(nextPageNo,'next', nextIcon)" />
    </li>
    <li v-if="showAfterTotal !== noop"
        :class="afterTotalClasses"
        v-html="afterTotalLiteral" />

    <options :root-prefix-cls="prefixCls"
             :have-quick-jumper="showQuickJumper"
             :locale="locale"
             :current="pageNo"
             :have-confirm-btn="showQuickJumperConfirmBtn"
             @on-quick-jumper="handleChange" />
  </ul>

</template>

<script>
  import { isFunction } from '@cloud-sn/v-utils';
  import Pager from './pager.vue';
  import Options from './options.vue';

  const locale = {
    items_per_page: '条/页',
    jump_to: '跳至',
    page: '页',

    prev_page: '上一页',
    next_page: '下一页',
    prev_5: '向前 5 页',
    next_5: '向后 5 页',
    prev_3: '向前 3 页',
    next_3: '向后 3 页',
    confirm: '确定',
  };
  function defaultItemRender(page, type, node) {
    return node;
    // return `<a>${type === 'page' ? page : ''}</a>`;
  }

  function noop() {}

  function isInteger(val) {
    return typeof val === 'number' && Number.isFinite(val) && Math.floor(val) === val;
  }
  const pagerTpl = {
    type: 'pager',
    prefixCls: '',
    onClick: noop,
    onKeyPress: noop,
    key: 1,
    page: 1,
    active: false,
    showTitle: true,
  };

  export default {
    name: 'Pagination',
    components: {
      Pager,
      Options,
      VNodes: {
        functional: true,
        render(h, ctx) {
          return ctx.props.vnodes;
        },
      },
    },
    props: {
      prefixCls: {
        type: String,
        default: 'ux-pagination',
      },
      styles: {
        type: Object,
        default: null,
      },
      className: String,
      size: {
        type: String,
        default: '',
      },
      simple: {
        type: Boolean,
        default: false,
      },
      current: {
        type: Number,
        default: 1,
      },
      total: {
        type: Number,
        required: true,
        default: 0,
      },
      pageSize: {
        type: Number,
        default: 10,
      },
      showSizeChanger: {
        type: Boolean,
        default: false,
      },
      onShowSizeChange: {
        type: Function,
        default: noop,
      },
      showLessItems: {
        type: Boolean,
        default: false,
      },
      selectComponentClass: Object,
      showQuickJumper: {
        type: Boolean,
        default: false,
      },
      showQuickJumperConfirmBtn: {
        type: Boolean,
        default: true,
      },
      showTitle: {
        type: Boolean,
        default: true,
      },
      pageSizeOptions: Array,
      showBeforeTotal: {
        type: Function,
        default: noop,
      },
      showAfterTotal: {
        type: Function,
        default: noop,
      },
      itemRender: {
        type: Function,
        default: defaultItemRender,
      },
      mode: {
        type: String,
        default: 'normal',
        validator(val) {
          return ['normal', 'stream'].indexOf(val) > -1;
        },
      },
      pageBufferSize: {
        type: Number,
        default: undefined,
      },
      renderPrevIcon: {
        type: Function,
        default: undefined,
      },
      renderNextIcon: {
        type: Function,
        default: undefined,
      },
      renderJumpPrevIcon: {
        type: Function,
        default: undefined,
      },
      renderJumpNextIcon: {
        type: Function,
        default: undefined,
      },
    },
    data() {
      const { prefixCls, showLessItems, genTitle } = this;
      return {
        noop,
        pageNo: +this.current,
        prevPageNo: 0,
        nextPageNo: 0,
        usedPageSize: this.pageSize,
        locale,
        prevDisabled: false,
        nextDisabled: false,
        pagers: [],
        jumpPrevObj: {
          type: 'jump',
          title: genTitle(showLessItems ? locale.prev_3 : locale.prev_5),
          key: 'prev',
          classes: `${prefixCls}-jump-prev`,
          onClick: this.jumpPrev,
          onKeyPress: this.jumpPrev,
          getPage: this.getJumpPrevPage,
          jumpIcon: () => this.jumpPrevIcon,
        },
        jumpNextObj: {
          type: 'jump',
          title: genTitle(showLessItems ? locale.next_3 : locale.next_5),
          key: 'next',
          classes: `${prefixCls}-jump-next`,
          onClick: this.jumpNext,
          onKeyPress: this.jumpNext,
          getPage: this.getJumpNextPage,
          jumpIcon: () => this.jumpNextIcon,
        },
      };
    },
    computed: {
      simpleClasses() {
        const { prefixCls } = this;
        return {
          [prefixCls]: true,
          [`${prefixCls}-simple`]: true,
        };
      },
      simpleSepClasses() {
        const { prefixCls } = this;
        return {
          [`${prefixCls}-sep`]: true,
        };
      },
      beforeTotalClasses() {
        const { prefixCls } = this;
        return {
          [`${prefixCls}-before-total-text`]: true,
        };
      },
      afterTotalClasses() {
        const { prefixCls } = this;
        return {
          [`${prefixCls}-after-total-text`]: true,
        };
      },
      prevClasses() {
        const { prefixCls } = this;
        return {
          [`${prefixCls}-prev`]: true,
          [`${prefixCls}-disabled`]: this.prevDisabled,
        };
      },
      nextClasses() {
        const { prefixCls } = this;
        return {
          [`${prefixCls}-next`]: true,
          [`${prefixCls}-disabled`]: this.nextDisabled,
        };
      },
      classes() {
        const { prefixCls } = this;
        return {
          [prefixCls]: true,
          [`${prefixCls}-mini`]: this.size === 'small',
        };
      },
      totalPage() {
        const { usedPageSize: pageSize, total } = this;
        return Math.floor((total - 1) / pageSize) + 1;
      },
      beforeTotalLiteral() {
        return this.genTotalLiteral(this.showBeforeTotal);
      },
      afterTotalLiteral() {
        return this.genTotalLiteral(this.showAfterTotal);
      },
      prevIcon() {
        const { renderPrevIcon, getIconNode } = this;
        return getIconNode(renderPrevIcon);
      },
      nextIcon() {
        const { renderNextIcon, getIconNode } = this;
        return getIconNode(renderNextIcon);
      },
      jumpPrevIcon() {
        const { renderJumpPrevIcon, getIconNode } = this;
        return getIconNode(renderJumpPrevIcon);
      },
      jumpNextIcon() {
        const { renderJumpNextIcon, getIconNode } = this;
        return getIconNode(renderJumpNextIcon);
      },
    },
    watch: {
      pageSize(newVal, val) {
        if (newVal !== val) {
          this.usedPageSize = newVal;
        }
      },
      totalPage() {
        this.reRender();
      },
      current(nVal, oVal) {
        if (nVal && nVal !== oVal) {
          this.pageNo = nVal;
          this.reRender();
        }
      },
    },
    created() {
      this.reRender();
    },
    methods: {
      getPageItem(item) {
        return <a>{item.page}</a>;
      },
      getIconNode(fn) {
        const { $props, prefixCls } = this;
        return isFunction(fn) ? fn({ ...$props }) : <a class={`${prefixCls}-item-link`} />;
      },
      genTotalLiteral(cb) {
        const {
          total, pageNo, usedPageSize: pageSize, totalPage
        } = this;
        // 当前页对应的条目范围
        const range = [
          pageNo > 0 ? (pageNo - 1) * pageSize + 1 : 0,
          pageNo * pageSize > total ? total : pageNo * pageSize,
        ];
        return cb(total, pageSize, totalPage, pageNo, range);
      },
      genTitle(title) {
        return this.showTitle ? title : '';
      },
      resetPageNo() {
        const { pageNo, totalPage } = this;
        if (pageNo < 1) {
          this.pageNo = 1;
        } else if (pageNo > totalPage) {
          this.pageNo = totalPage;
        } else {
          this.pageNo = pageNo;
        }
      },
      hasPrev() {
        return this.pageNo > 1;
      },
      hasNext() {
        return this.pageNo < this.totalPage;
      },
      jumpPrev() {
        return this.handleChange(this.getJumpPrevPage());
      },
      jumpNext() {
        return this.handleChange(this.getJumpNextPage());
      },
      getJumpPrevPage() {
        const { pageNo, showLessItems } = this;
        return Math.max(1, pageNo - (showLessItems ? 3 : 5));
      },
      getJumpNextPage() {
        const { pageNo, showLessItems, totalPage } = this;
        return Math.min(totalPage, pageNo + (showLessItems ? 3 : 5));
      },
      prev() {
        if (this.hasPrev()) {
          this.handleChange(this.pageNo - 1);
        }
      },
      next() {
        if (this.hasNext()) {
          this.handleChange(this.pageNo + 1);
        }
      },
      handleChange(page) {
        const { totalPage, pageNo, usedPageSize } = this;
        let nPage = page;
        if (!isInteger(page)) {
          return;
        }
        if (nPage === pageNo) return;

        if (nPage < 1) {
          nPage = 1;
        }
        if (nPage > totalPage) {
          nPage = totalPage;
        }

        this.pageNo = nPage;
        this.render();
        this.$emit('change', nPage, usedPageSize);
      },
      render() {
        const {
          simple,
          pageBufferSize,
          totalPage,
          pageNo: current,
          prefixCls,
          showTitle,
          jumpPrevObj,
          jumpNextObj,
          handleChange,
          showLessItems,
          mode,
        } = this;
        const list = [];

        this.prevDisabled = !this.hasPrev();
        this.nextDisabled = !this.hasNext();

        // 简单模式 有自身的逻辑
        if (simple) {
          return;
        }

        let bufferSize = showLessItems ? 1 : 2;

        if (mode === 'stream') {
          bufferSize = 4;
        }
        const pbs = Number(pageBufferSize);
        if (typeof pbs === 'number' && pbs > 0) {
          bufferSize = pbs;
        }

        if (mode !== 'stream' && totalPage <= 5 + bufferSize * 2) {
          for (let i = 1; i <= totalPage; i += 1) {
            list.push({
              ...pagerTpl,
              ...{
                prefixCls,
                onClick() {
                  handleChange(i);
                },
                onKeyPress() {
                  handleChange(i);
                },
                key: i,
                page: i,
                active: i === current,
                showTitle,
              },
            });
          }
        } else {
          let left = Math.max(1, current - bufferSize);
          let right = Math.min(totalPage, current + bufferSize);

          // 选中开始几位时, 按钮个数保持最少pageBufferSize*2+1个
          if (current < bufferSize + 1) {
            // prettier-ignore
            right = 1 + (bufferSize * 2);
          }

          // 选中最后几页时,按钮个数保证最少pageBufferSize*2+1个
          if (current > totalPage - bufferSize) {
            // prettier-ignore
            left = totalPage - (bufferSize * 2);
          }

          for (let i = left; i <= right; i += 1) {
            list.push({
              ...pagerTpl,
              ...{
                prefixCls,
                onClick() {
                  handleChange(i);
                },
                onKeyPress() {
                  handleChange(i);
                },
                key: i,
                page: i,
                active: i === current,
                showTitle,
              },
            });
          }

          // stream 模式 不新增 省略条和 首尾节点
          if (mode !== 'stream') {
            const firstPager = {
              ...pagerTpl,
              ...{
                prefixCls,
                onClick() {
                  handleChange(1);
                },
                onKeyPress() {
                  handleChange(1);
                },
                key: 1,
                page: 1,
                showTitle,
              },
            };

            const lastPager = {
              ...pagerTpl,
              ...{
                prefixCls,
                onClick() {
                  handleChange(totalPage);
                },
                onKeyPress() {
                  handleChange(totalPage);
                },
                key: totalPage,
                page: totalPage,
                showTitle,
              },
            };
            // 最少4个按钮时才显示 省略条
            if (current >= bufferSize * 2 + 1 && current !== 3) {
              list[0].classes = `${prefixCls}-item-after-jump-prev`;
              list.unshift(jumpPrevObj);
            }

            if (current <= totalPage - bufferSize * 2 && current !== totalPage - 2) {
              list[list.length - 1].classes = `${prefixCls}-item-after-jump-next`;
              list.push(jumpNextObj);
            }

            if (left !== 1) {
              list.unshift(firstPager);
            }

            if (right !== totalPage) {
              list.push(lastPager);
            }
          }
        }

        this.prevPageNo = current - 1 > 0 ? current - 1 : 1;
        this.nextPageNo = current + 1 > totalPage ? totalPage : current + 1;
        this.pagers = list;
      },
      reRender() {
        const { resetPageNo, render } = this;
        resetPageNo();
        render();
      },
    },
  };
</script>
