this.marcomontalbano=this.marcomontalbano||{},this.marcomontalbano.netlifyCmsWidgetId=function(){"use strict";var a,i=new Uint8Array(16);var o=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var r=[],t=0;t<256;++t)r.push((t+256).toString(16).substr(1));function s(t,n){n=1<arguments.length&&void 0!==n?n:0,t=(r[t[n+0]]+r[t[n+1]]+r[t[n+2]]+r[t[n+3]]+"-"+r[t[n+4]]+r[t[n+5]]+"-"+r[t[n+6]]+r[t[n+7]]+"-"+r[t[n+8]]+r[t[n+9]]+"-"+r[t[n+10]]+r[t[n+11]]+r[t[n+12]]+r[t[n+13]]+r[t[n+14]]+r[t[n+15]]).toLowerCase();if("string"!=typeof(n=t)||!o.test(n))throw TypeError("Stringified UUID is invalid");return t}function n(t,n,o){var r=(t=t||{}).random||(t.rng||function(){if(!a&&!(a="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return a(i)})();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,n){o=o||0;for(var e=0;e<16;++e)n[o+e]=r[e];return n}return s(r)}return{name:"id",controlComponent:window.createClass({componentDidMount:function(){var t=this.props.value||n();this.props.onChange(t)},handleChange:function(t){this.props.onChange(t.target.value.trim())},render:function(){var t;return window.h("input",{style:{backgroundColor:"#f5f5f5",color:"#9E9E9E"},type:"text",disabled:!0,value:this.props.value,onChange:this.handleChange,className:null===(t=this.props)||void 0===t?void 0:t.classNameWrapper})}}),previewComponent:window.createClass({render:function(){return window.h("p",null,this.props.value)}})}}();