(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-999b6374"],{"169a":function(t,e,i){"use strict";i("a4d3"),i("4de4"),i("caad"),i("a9e3"),i("e439"),i("dbb4"),i("b64b"),i("2532"),i("498a"),i("159b");var n=i("ade3"),s=(i("368e"),i("4ad4")),a=i("b848"),o=i("75eb"),r=i("e707"),c=i("e4d3"),l=i("21be"),d=i("f2e7"),u=i("a293"),h=i("80d2"),v=i("bfc5"),f=i("58df"),m=i("d9bd");function g(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function b(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?g(Object(i),!0).forEach((function(e){Object(n["a"])(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):g(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}var p=Object(f["a"])(s["a"],a["a"],o["a"],r["a"],c["a"],l["a"],d["a"]);e["a"]=p.extend({name:"v-dialog",directives:{ClickOutside:u["a"]},props:{dark:Boolean,disabled:Boolean,fullscreen:Boolean,light:Boolean,maxWidth:{type:[String,Number],default:"none"},noClickAnimation:Boolean,origin:{type:String,default:"center center"},persistent:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,transition:{type:[String,Boolean],default:"dialog-transition"},width:{type:[String,Number],default:"auto"}},data:function(){return{activatedBy:null,animate:!1,animateTimeout:-1,isActive:!!this.value,stackMinZIndex:200}},computed:{classes:function(){var t;return t={},Object(n["a"])(t,"v-dialog ".concat(this.contentClass).trim(),!0),Object(n["a"])(t,"v-dialog--active",this.isActive),Object(n["a"])(t,"v-dialog--persistent",this.persistent),Object(n["a"])(t,"v-dialog--fullscreen",this.fullscreen),Object(n["a"])(t,"v-dialog--scrollable",this.scrollable),Object(n["a"])(t,"v-dialog--animated",this.animate),t},contentClasses:function(){return{"v-dialog__content":!0,"v-dialog__content--active":this.isActive}},hasActivator:function(){return Boolean(!!this.$slots.activator||!!this.$scopedSlots.activator)}},watch:{isActive:function(t){t?(this.show(),this.hideScroll()):(this.removeOverlay(),this.unbind())},fullscreen:function(t){this.isActive&&(t?(this.hideScroll(),this.removeOverlay(!1)):(this.showScroll(),this.genOverlay()))}},created:function(){this.$attrs.hasOwnProperty("full-width")&&Object(m["d"])("full-width",this)},beforeMount:function(){var t=this;this.$nextTick((function(){t.isBooted=t.isActive,t.isActive&&t.show()}))},beforeDestroy:function(){"undefined"!==typeof window&&this.unbind()},methods:{animateClick:function(){var t=this;this.animate=!1,this.$nextTick((function(){t.animate=!0,window.clearTimeout(t.animateTimeout),t.animateTimeout=window.setTimeout((function(){return t.animate=!1}),150)}))},closeConditional:function(t){var e=t.target;return!(this._isDestroyed||!this.isActive||this.$refs.content.contains(e)||this.overlay&&e&&!this.overlay.$el.contains(e))},hideScroll:function(){this.fullscreen?document.documentElement.classList.add("overflow-y-hidden"):r["a"].options.methods.hideScroll.call(this)},show:function(){var t=this;!this.fullscreen&&!this.hideOverlay&&this.genOverlay(),this.$nextTick((function(){t.$refs.content.focus(),t.bind()}))},bind:function(){window.addEventListener("focusin",this.onFocusin)},unbind:function(){window.removeEventListener("focusin",this.onFocusin)},onClickOutside:function(t){this.$emit("click:outside",t),this.persistent?this.noClickAnimation||this.animateClick():this.activeZIndex>=this.getMaxZIndex()&&(this.isActive=!1)},onKeydown:function(t){if(t.keyCode===h["u"].esc&&!this.getOpenDependents().length)if(this.persistent)this.noClickAnimation||this.animateClick();else{this.isActive=!1;var e=this.getActivator();this.$nextTick((function(){return e&&e.focus()}))}this.$emit("keydown",t)},onFocusin:function(t){if(t&&this.retainFocus){var e=t.target;if(e&&![document,this.$refs.content].includes(e)&&!this.$refs.content.contains(e)&&this.activeZIndex>=this.getMaxZIndex()&&!this.getOpenDependentElements().some((function(t){return t.contains(e)}))){var i=this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');i.length&&i[0].focus()}}}},render:function(t){var e=[],i={class:this.classes,ref:"dialog",directives:[{name:"click-outside",value:this.onClickOutside,args:{closeConditional:this.closeConditional,include:this.getOpenDependentElements}},{name:"show",value:this.isActive}],on:{click:function(t){t.stopPropagation()}},style:{}};this.fullscreen||(i.style={maxWidth:"none"===this.maxWidth?void 0:Object(h["g"])(this.maxWidth),width:"auto"===this.width?void 0:Object(h["g"])(this.width)}),e.push(this.genActivator());var n=t("div",i,this.showLazyContent(this.getContentSlot()));return this.transition&&(n=t("transition",{props:{name:this.transition,origin:this.origin}},[n])),e.push(t("div",{class:this.contentClasses,attrs:b({role:"document",tabindex:this.isActive?0:void 0},this.getScopeIdAttrs()),on:{keydown:this.onKeydown},style:{zIndex:this.activeZIndex},ref:"content"},[this.$createElement(v["a"],{props:{root:!0,light:this.light,dark:this.dark}},[n])])),t("div",{staticClass:"v-dialog__container",class:{"v-dialog__container--attached":""===this.attach||!0===this.attach||"attach"===this.attach},attrs:{role:"dialog"}},e)}})},"368e":function(t,e,i){},"418c":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-row",t._l(t.$store.state.share.members,(function(e){return i("v-col",{key:e.name_invite,attrs:{cols:"12",sm:"6",md:"6",lg:"3"}},[i("v-card",[i("v-card-title",{staticClass:"subheading font-weight-bold"},[t._v(" "+t._s(e.name_invite)+" "),i("v-spacer"),i("v-menu",{attrs:{bottom:"",left:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return[i("v-btn",t._g({attrs:{dark:"",icon:"",color:"grey"}},n),[i("v-icon",[t._v("mdi-dots-vertical")])],1)]}}],null,!0)},[i("v-list",[i("v-list-item",{on:{click:function(e){e.stopPropagation(),t.dialog_remove=!0}}},[i("v-list-item-title",[t._v("Xóa")])],1)],1),i("v-dialog",{attrs:{"max-width":"350"},model:{value:t.dialog_remove,callback:function(e){t.dialog_remove=e},expression:"dialog_remove"}},[i("v-card",[i("v-card-title",{staticClass:"headline"},[t._v("Xóa liên kết")]),i("v-card-text",[t._v(" Bạn có chắc chắn muốn ngắt kết nối tới "+t._s(e.name_invite)+"? ")]),i("v-card-actions",[i("v-spacer"),i("v-btn",{attrs:{color:"green darken-1",text:""},on:{click:function(e){t.dialog_remove=!1}}},[t._v(" Cancel ")]),i("v-btn",{attrs:{color:"green darken-1",text:""},on:{click:function(i){t.dialog_remove=!1,t.remove_item(e)}}},[t._v(" Đồng ý ")])],1)],1)],1)],1)],1),i("v-divider"),i("v-list",{attrs:{dense:""}},t._l(t.filteredKeys,(function(n,s){var a=n.key,o=n.text;return i("v-list-item",{key:s},[i("v-list-item-content",{class:{"blue--text":t.sortBy===a}},[t._v(t._s(o)+": ")]),i("v-list-item-content",{class:{"blue--text":t.sortBy===a}},["status_invite"!==a?i("span",[t._v(t._s(e[a]))]):t._e(),i("div",{staticClass:"text-center"},["status_invite"===a?i("v-chip",{attrs:{color:e[a]?"green":"orange","text-color":"white"}},[t._v(" "+t._s(0==e[a]?"Đang đợi chờ":"Đã kết nối ")+" ")]):t._e()],1)])],1)})),1)],1)],1)})),1)},s=[],a=(i("4de4"),i("d3b7"),i("ddb0"),i("96cf"),{data:function(){return{add_user:!1,itemsPerPageArray:[4,8,12],search:"",filter:{},sortDesc:!1,page:1,itemsPerPage:4,sortBy:"name",options:[{title:"Xoá"}],keys:[{text:"Email",key:"email_invite"},{text:"Tình trạng",key:"status_invite"}],user:{emailAddress:""},user_default:{emailAddress:""},dialog_remove:!1}},created:function(){return regeneratorRuntime.async((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,regeneratorRuntime.awrap(this.initialize());case 2:case"end":return t.stop()}}),null,this)},computed:{filteredKeys:function(){return this.keys.filter((function(t){return"Name"!==t}))}},methods:{initialize:function(){return regeneratorRuntime.async((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,regeneratorRuntime.awrap(this.$store.dispatch("share/get-member"));case 2:case"end":return t.stop()}}),null,this)},remove_item:function(t){return regeneratorRuntime.async((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,regeneratorRuntime.awrap(this.$store.dispatch("share/remove-member",t));case 2:case"end":return e.stop()}}),null,this)},close:function(){var t=this;this.add_user=!1,setTimeout((function(){t.user=Object.assign({},t.user_default)}),300)}}}),o=a,r=i("2877"),c=i("6544"),l=i.n(c),d=i("8336"),u=i("b0af"),h=i("99d9"),v=i("cc20"),f=i("62ad"),m=i("169a"),g=i("ce7e"),b=i("132d"),p=i("8860"),_=i("da13"),y=i("5d23"),w=i("e449"),O=i("0fd9"),k=i("2fa4"),x=Object(r["a"])(o,n,s,!1,null,"eeb05a78",null);e["default"]=x.exports;l()(x,{VBtn:d["a"],VCard:u["a"],VCardActions:h["a"],VCardText:h["b"],VCardTitle:h["c"],VChip:v["a"],VCol:f["a"],VDialog:m["a"],VDivider:g["a"],VIcon:b["a"],VList:p["a"],VListItem:_["a"],VListItemContent:y["a"],VListItemTitle:y["b"],VMenu:w["a"],VRow:O["a"],VSpacer:k["a"]})},"99d9":function(t,e,i){"use strict";i.d(e,"a",(function(){return a})),i.d(e,"b",(function(){return r})),i.d(e,"c",(function(){return c}));var n=i("b0af"),s=i("80d2"),a=Object(s["h"])("v-card__actions"),o=Object(s["h"])("v-card__subtitle"),r=Object(s["h"])("v-card__text"),c=Object(s["h"])("v-card__title");n["a"]}}]);
//# sourceMappingURL=chunk-999b6374.d99fca99.js.map