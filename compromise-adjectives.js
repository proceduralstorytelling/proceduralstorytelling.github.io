!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(e="undefined"!=typeof globalThis?globalThis:e||self).compromiseAdjectives=r()}(this,(function(){"use strict";function e(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function r(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function t(e){return(t=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function n(e,r){return(n=Object.setPrototypeOf||function(e,r){return e.__proto__=r,e})(e,r)}function i(e,r){return!r||"object"!=typeof r&&"function"!=typeof r?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):r}function l(e){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,l=t(e);if(r){var o=t(this).constructor;n=Reflect.construct(l,arguments,o)}else n=l.apply(this,arguments);return i(this,n)}}var o=[/airs$/,/ll$/,/ee.$/,/ile$/,/y$/],u={bad:"badly",good:"well",icy:"icily",idle:"idly",male:"manly",public:"publicly",simple:"simply",single:"singly",special:"especially",straight:"straight",vague:"vaguely",whole:"wholly"},a=["best","early","hard","fast","wrong","well","late","latter","little","long","low"].reduce((function(e,r){return e[r]=!0,e}),{}),c=[{reg:/al$/i,repl:"ally"},{reg:/ly$/i,repl:"ly"},{reg:/(.{3})y$/i,repl:"$1ily"},{reg:/que$/i,repl:"quely"},{reg:/ue$/i,repl:"uly"},{reg:/ic$/i,repl:"ically"},{reg:/ble$/i,repl:"bly"},{reg:/l$/i,repl:"ly"}],s=function(e){if(!0===u.hasOwnProperty(e))return u[e];if(!0===a.hasOwnProperty(e))return e;for(var r=0;r<o.length;r++)if(!0===o[r].test(e))return null;for(var t=0;t<c.length;t++)if(!0===c[t].reg.test(e))return e.replace(c[t].reg,c[t].repl);return e+"ly"},f={clean:"cleanliness",naivety:"naivety",hurt:"hurt"},p=[{reg:/y$/,repl:"iness"},{reg:/le$/,repl:"ility"},{reg:/ial$/,repl:"y"},{reg:/al$/,repl:"ality"},{reg:/ting$/,repl:"ting"},{reg:/ring$/,repl:"ring"},{reg:/bing$/,repl:"bingness"},{reg:/sing$/,repl:"se"},{reg:/ing$/,repl:"ment"},{reg:/ess$/,repl:"essness"},{reg:/ous$/,repl:"ousness"}],h=function(e){if(f.hasOwnProperty(e))return f[e];var r=e.charAt(e.length-1);if("w"===r||"s"===r)return null;for(var t=0;t<p.length;t++)if(!0===p[t].reg.test(e))return e.replace(p[t].reg,p[t].repl);return e+"ness"},y=["c","e","g","l","n","r","w","y"].reduce((function(e,r){return e[r]=!0,e}),{}),d={ed:!0,nt:!0},g={random:!0,wild:!0},v={bored:"bore",red:"redden",sad:"sadden",fat:"fatten",small:"shrink",full:"fill",tired:"tire"},b=function(e){if(!0===v.hasOwnProperty(e))return v[e];if(e.length<=3)return null;if(!0===g.hasOwnProperty(e))return null;if(y.hasOwnProperty(e[e.length-1]))return null;var r=e.substr(e.length-2);return!0===d.hasOwnProperty(r)?null:!0===/e$/.test(e)?e+"n":e+"en"};return function(t){var i=function(t){!function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),r&&n(e,r)}(c,t);var i,o,u,a=l(c);function c(){return e(this,c),a.apply(this,arguments)}return i=c,(o=[{key:"json",value:function(e){var r=null;"number"==typeof e&&(r=e,e=null);var t=[];return this.forEach((function(r){var n=r.json(e)[0],i=r.text("reduced");n.toAdverb=s(i),n.toNoun=h(i),n.toVerb=b(i),t.push(n)})),null!==r?t[r]:t}},{key:"conjugate",value:function(e){var r=this.world.transforms.adjectives,t=[];return this.forEach((function(e){var n=e.text("reduced"),i=r(n);i.Adverb=s(n),i.Noun=h(n),i.Verb=b(n),t.push(i)})),"number"==typeof e?t[e]:t}},{key:"toSuperlative",value:function(){var e=this.world.transforms.adjectives;return this.forEach((function(r){var t=e(r.text("reduced"));r.replaceWith(t.Superlative,!0)})),this}},{key:"toComparative",value:function(){var e=this.world.transforms.adjectives;return this.forEach((function(r){var t=e(r.text("reduced"));r.replaceWith(t.Comparative,!0)})),this}},{key:"toAdverb",value:function(){return this.forEach((function(e){var r=s(e.text("reduced"));e.replaceWith(r,!0)})),this}},{key:"toVerb",value:function(){return this.forEach((function(e){var r=b(e.text("reduced"));e.replaceWith(r,!0)})),this}},{key:"toNoun",value:function(){return this.forEach((function(e){var r=h(e.text("reduced"));e.replaceWith(r,!0)})),this}}])&&r(i.prototype,o),u&&r(i,u),c}(t);t.prototype.adjectives=function(e){var r=this.match("#Adjective");return"number"==typeof e&&(r=r.get(e)),new i(r.list,this,this.world)}}}));