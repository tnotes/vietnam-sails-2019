(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cd91b702"],{b0af:function(e,t,a){"use strict";a("a4d3"),a("4de4"),a("0481"),a("4160"),a("4069"),a("a9e3"),a("e439"),a("dbb4"),a("b64b"),a("159b");var n=a("ade3"),r=(a("615b"),a("10d2")),i=a("297c"),o=a("1c87"),s=a("58df");function c(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?c(Object(a),!0).forEach((function(t){Object(n["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):c(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}t["a"]=Object(s["a"])(i["a"],o["a"],r["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},outlined:Boolean,raised:Boolean,shaped:Boolean},computed:{classes:function(){return l({"v-card":!0},o["a"].options.computed.classes.call(this),{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.loading||this.disabled,"v-card--outlined":this.outlined,"v-card--raised":this.raised,"v-card--shaped":this.shaped},r["a"].options.computed.classes.call(this))},styles:function(){var e=l({},r["a"].options.computed.styles.call(this));return this.img&&(e.background='url("'.concat(this.img,'") center center / cover no-repeat')),e}},methods:{genProgress:function(){var e=i["a"].options.methods.genProgress.call(this);return e?this.$createElement("div",{staticClass:"v-card__progress"},[e]):null}},render:function(e){var t=this.generateRouteLink(),a=t.tag,n=t.data;return n.style=this.styles,this.isClickable&&(n.attrs=n.attrs||{},n.attrs.tabindex=0),e(a,this.setBackgroundColor(this.color,n),[this.genProgress(),this.$slots.default])}})},d272:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-card",[a("v-data-table",{staticClass:"elevation-1",attrs:{headers:e.headers,items:e.$store.state.shop.competitors,search:e.search},scopedSlots:e._u([{key:"item.ecom_name",fn:function(t){var n=t.item;return[a("v-chip",{attrs:{color:e.getColor(n.ecom_name),outlined:"",label:"",dark:""}},[e._v(e._s(n.ecom_name.toUpperCase()))])]}},{key:"item.shop_name",fn:function(t){var n=t.item;return[a("v-chip",{attrs:{color:e.getColor(n.ecom_name),href:n.url,target:"_blank",label:"",dark:""}},[e._v(e._s(n.shop_name))])]}},{key:"item.action",fn:function(t){var n=t.item;return[a("v-icon",{attrs:{small:""},on:{click:function(t){return e.deleteItem(n)}}},[e._v(" mdi-delete ")])]}},{key:"no-data",fn:function(){return[a("v-btn",{attrs:{color:"primary"},on:{click:e.initialize}},[e._v("Reset")])]},proxy:!0}])})],1)},r=[],i={data:function(){return{dialog:!1,search:"",headers:[{text:"Sàn Thương Mại",align:"left",sortable:!1,value:"ecom_name"},{text:"Cửa hàng đối thủ",value:"shop_name"},{text:"Thực hiện",value:"action",sortable:!1}]}},watch:{dialog:function(e){e||this.close()}},created:function(){this.initialize()},methods:{initialize:function(){this.$store.dispatch("shop/get-shop")},deleteItem:function(e){confirm("Bạn có chắc chắn muốn xóa cửa hàng này khỏi danh sách đối thủ ?")&&this.$store.dispatch("shop/delete-shop",e)},close:function(){var e=this;this.dialog=!1,setTimeout((function(){e.editedItem=Object.assign({},e.defaultItem),e.editedIndex=-1}),300)},getColor:function(e){return"lazada"===e?"orange lighten-1":"tiki"===e?"light-blue lighten-1":"shopee"===e?"amber darken-4":"sendo"===e?"pink":"adayroi"===e?"pink accent-3":void 0}}},o=i,s=a("2877"),c=a("6544"),l=a.n(c),d=a("8336"),h=a("b0af"),u=a("cc20"),p=a("8fea"),f=a("132d"),m=Object(s["a"])(o,n,r,!1,null,"9143c19a",null);t["default"]=m.exports;l()(m,{VBtn:d["a"],VCard:h["a"],VChip:u["a"],VDataTable:p["a"],VIcon:f["a"]})}}]);
//# sourceMappingURL=chunk-cd91b702.599b3c64.js.map