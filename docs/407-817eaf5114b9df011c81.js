!function(){var e,t,n={2992:function(e,t,n){"use strict";var r=n(9062),i=n(5861),a=n(7757),o=n.n(a),c=n(6657),u=n.n(c),s=n(6768),f=n(3144),l=n(5671),p=n(4942),d=n(6269),h="metadata",v="tile",g=(0,f.Z)((function e(t){(0,l.Z)(this,e),(0,p.Z)(this,"type","registerTileset/progress"),this.payload=t})),b=(0,f.Z)((function e(t){(0,l.Z)(this,e),(0,p.Z)(this,"type","registerTileset/fulfilled"),this.payload=t})),w=(0,f.Z)((function e(t){(0,l.Z)(this,e),(0,p.Z)(this,"type","registerTileset/rejected"),this.payload=t})),m=function(){var e=(0,i.Z)(o().mark((function e(){var t;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d.X3("tilesets",1,{upgrade:function(e){e.createObjectStore(h,{keyPath:"id"}),e.createObjectStore(v,{keyPath:"id"})}});case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),x=function(){var e=(0,i.Z)(o().mark((function e(t){var n,r;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u()({locateFile:function(){return s}});case 2:return n=e.sent,e.next=5,fetch(t).then((function(e){return e.arrayBuffer()}));case 5:return r=e.sent,e.abrupt("return",new n.Database(new Uint8Array(r)));case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),y=function(){var e=(0,i.Z)(o().mark((function e(t,n){var i,a,c,u,s,f;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.put(h,{id:n,date:(new Date).toISOString()});case 2:return e.next=4,t.getAllKeys(h);case 4:return i=e.sent,a=t.transaction(v,"readwrite"),e.next=8,a.store.getAllKeys();case 8:return c=e.sent,u=i.filter((function(e){return e!==n})),s=new RegExp("^(".concat(u.join("|"),")/")),f=c.filter((function(e){return!s.test(e)})),e.next=14,Promise.all([].concat((0,r.Z)(f.map((function(e){return a.store.delete(e)}))),[a.done]));case 14:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),k=function(e,t,n,r){var i=e.exec("SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles ORDER BY zoom_level, tile_column, tile_row LIMIT $limit OFFSET $offset",{$limit:r,$offset:n}),a=i&&i[0]&&i[0].values;if(a)return a.map((function(e){return{id:"".concat(t,"/").concat(e[0],"/").concat(e[1],"/").concat(e[2],".pbf"),data:e[3]}}))},O=function(){var e=(0,i.Z)(o().mark((function e(t,n,i){var a,c;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=0,c=o().mark((function e(){var c,u;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c=k(i,n,a,5e3)){e.next=3;break}return e.abrupt("return","break");case 3:return u=t.transaction(v,"readwrite"),e.next=6,Promise.all([].concat((0,r.Z)(c.map((function(e){return u.store.add(e)}))),[u.done]));case 6:a+=5e3;case 7:case"end":return e.stop()}}),e)}));case 2:return e.delegateYield(c(),"t0",4);case 4:if("break"!==e.t0){e.next=7;break}return e.abrupt("break",9);case 7:e.next=2;break;case 9:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}(),Z=function(e,t){self.postMessage(new g({tilesetId:e,message:t,date:(new Date).toISOString()}))},P=function(){var e=(0,i.Z)(o().mark((function e(t){var n,r,i,a,c,u;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=t.payload,r=n.url,i=n.tilesetId,Z(i,"start"),e.next=5,m();case 5:return a=e.sent,Z(i,"initMbtiles:begin"),e.next=9,x(r);case 9:return c=e.sent,Z(i,"initMbtiles:end"),Z(i,"tilesetPut:begin"),e.next=14,y(a,i);case 14:return Z(i,"tilesetPut:end"),Z(i,"tilesPut:begin"),e.next=18,O(a,i,c);case 18:Z(i,"tilesPut:end"),self.postMessage(new b({tilesetId:t.payload.tilesetId})),e.next=26;break;case 22:e.prev=22,e.t0=e.catch(0),u="string"==typeof e.t0?e.t0:e.t0 instanceof Error?"".concat(e.t0.name,": ").concat(e.t0.message):"Failed to register tileset",self.postMessage(new w({error:u}));case 26:case"end":return e.stop()}}),e,null,[[0,22]])})));return function(t){return e.apply(this,arguments)}}();self.onmessage=function(e){if("registerTileset"===e.data.type)return P(e.data);throw new Error("Unhandled event type")}},7607:function(){},803:function(){},9547:function(){}},r={};function i(e){var t=r[e];if(void 0!==t)return t.exports;var a=r[e]={id:e,loaded:!1,exports:{}};return n[e](a,a.exports,i),a.loaded=!0,a.exports}i.m=n,i.x=function(){var e=i.O(void 0,[594],(function(){return i(2992)}));return i.O(e)},e=[],i.O=function(t,n,r,a){if(!n){var o=1/0;for(f=0;f<e.length;f++){n=e[f][0],r=e[f][1],a=e[f][2];for(var c=!0,u=0;u<n.length;u++)(!1&a||o>=a)&&Object.keys(i.O).every((function(e){return i.O[e](n[u])}))?n.splice(u--,1):(c=!1,a<o&&(o=a));if(c){e.splice(f--,1);var s=r();void 0!==s&&(t=s)}}return t}a=a||0;for(var f=e.length;f>0&&e[f-1][2]>a;f--)e[f]=e[f-1];e[f]=[n,r,a]},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,{a:t}),t},i.d=function(e,t){for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.f={},i.e=function(e){return Promise.all(Object.keys(i.f).reduce((function(t,n){return i.f[n](e,t),t}),[]))},i.u=function(e){return e+"-"+i.h()+".js"},i.h=function(){return"817eaf5114b9df011c81"},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e},function(){var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e}(),function(){var e={407:1};i.f.i=function(t,n){e[t]||importScripts(i.p+i.u(t))};var t=self.webpackChunkmbtiles_protocol=self.webpackChunkmbtiles_protocol||[],n=t.push.bind(t);t.push=function(t){var r=t[0],a=t[1],o=t[2];for(var c in a)i.o(a,c)&&(i.m[c]=a[c]);for(o&&o(i);r.length;)e[r.pop()]=1;n(t)}}(),t=i.x,i.x=function(){return i.e(594).then(t)},i.x()}();