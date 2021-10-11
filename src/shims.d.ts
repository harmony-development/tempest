declare module "vue-virtual-scroll-list" {
  import { Vue, Prop } from "vue-property-decorator";
  import { VueConstructor } from "vue";

  export default class VirtualScroll extends Vue {
    @Prop()
    dataKey: string | Function;

    @Prop()
    dataSources: object[];

    @Prop()
    dataComponent: VueConstructor;

    @Prop({ default: 30 })
    keeps: number;

    @Prop({ default: () => ({}) })
    extraProps: object;

    @Prop({ default: 50 })
    estimateSize: number;

    @Prop({ default: 0 })
    start: number;

    @Prop({ default: 0 })
    offset: number;

    @Prop({ default: "vertical" })
    direction: "vertical" | "horizontal";

    @Prop({ default: false })
    pageMode: boolean;

    @Prop({ default: 0 })
    topThreshold: number;

    @Prop({ default: 0 })
    bottomThreshold: number;

    @Prop({ default: "div" })
    rootTag: string;

    @Prop({ default: "div" })
    wrapTag: string;

    @Prop()
    wrapClass: string;

    @Prop({ default: () => ({}) })
    wrapStyle: object;

    @Prop({ default: "div" })
    itemTag: string;

    @Prop()
    itemClass: string;

    @Prop({ default: () => ({}) })
    itemStyle: object;

    @Prop({ default: () => ({}) })
    itemScopedSlots: object;

    @Prop({ default: "div" })
    headerTag: string;

    @Prop()
    headerClass: string;

    @Prop({ default: () => ({}) })
    headerStyle: object;

    @Prop({ default: "div" })
    footerTag: string;

    @Prop()
    footerClass: string;

    @Prop({ default: () => ({}) })
    footerStyle: object;

    /** Reset all state back to initial **/
    reset(): void;
    /** Manual set scroll position to bottom **/
    scrollToBottom(): void;
    /** Manual set scroll position to a designated index **/
    scrollToIndex(index: number): void;
    /** Manual set scroll position to a designated offset **/
    scrollToOffset(offset: number): void;
    /** Get the designated item size by id (from data-key value) **/
    getSize(id: string): number;
    /** Get the total number of stored (rendered) items **/
    getSizes(): number[];
    /** Get the current scroll offset **/
    getOffset(): number;
    /** Get wrapper element client viewport size (width or height) **/
    getClientSize(): number;
    /** Get all scroll size (scrollHeight or scrollWidth) **/
    getScrollSize(): number;
    /** When using page mode and virtual list root element offsetTop or offsetLeft change, you need to call this method manually **/
    updatePageModeFront(): void;
  }
}
