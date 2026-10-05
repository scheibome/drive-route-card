function t(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const n=t=>new r("string"==typeof t?t:t+"",void 0,i),a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)},l=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return n(e)})(t):t,{is:h,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:f}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",y=_.reactiveElementPolyfillSupport,$=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!h(t,e),w={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??b)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[$("elementProperties")]=new Map,A[$("finalized")]=new Map,y?.({ReactiveElement:A}),(_.reactiveElementVersions??=[]).push("2.1.2");const E=globalThis,x=t=>t,S=E.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+M,R=`<${P}>`,O=document,U=()=>O.createComment(""),L=t=>null===t||"object"!=typeof t&&"function"!=typeof t,H=Array.isArray,N="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,z=/>/g,D=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,B=/"/g,F=/^(?:script|style|textarea|title)$/i,q=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),W=q(1),K=q(2),G=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),J=new WeakMap,Q=O.createTreeWalker(O,129);function Z(t,e){if(!H(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const X=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=T;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,c=0;for(;c<s.length&&(n.lastIndex=c,l=n.exec(s),null!==l);)c=n.lastIndex,n===T?"!--"===l[1]?n=j:void 0!==l[1]?n=z:void 0!==l[2]?(F.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=D):void 0!==l[3]&&(n=D):n===D?">"===l[0]?(n=o??T,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?D:'"'===l[3]?B:I):n===B||n===I?n=D:n===j||n===z?n=T:(n=D,o=void 0);const d=n===D&&t[e+1].startsWith("/>")?" ":"";r+=n===T?s+R:h>=0?(i.push(a),s.slice(0,h)+k+s.slice(h)+M+d):s+M+(-2===h?e:d)}return[Z(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,h]=X(t,e);if(this.el=Y.createElement(l,s),Q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Q.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(k)){const e=h[r++],s=i.getAttribute(t).split(M),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?ot:"?"===n[1]?rt:"@"===n[1]?nt:it}),i.removeAttribute(t)}else t.startsWith(M)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(F.test(i.tagName)){const t=i.textContent.split(M),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],U()),Q.nextNode(),a.push({type:2,index:++o});i.append(t[e],U())}}}else if(8===i.nodeType)if(i.data===P)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(M,t+1));)a.push({type:7,index:o}),t+=M.length-1}o++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function tt(t,e,s=t,i){if(e===G)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=L(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=tt(t,o._$AS(t,e.values),o,i)),e}class et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);Q.currentNode=i;let o=Q.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new st(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new at(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=Q.nextNode(),r++)}return Q.currentNode=O,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class st{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),L(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>H(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new et(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new Y(t)),e}k(t){H(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new st(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=tt(this,t,e,0),r=!L(t)||t!==this._$AH&&t!==G,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=tt(this,i[s+n],e,n),a===G&&(a=this._$AH[n]),r||=!L(a)||a!==this._$AH[n],a===V?t=V:t!==V&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ot extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class rt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class nt extends it{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??V)===G)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const lt=E.litHtmlPolyfillSupport;lt?.(Y,st),(E.litHtmlVersions??=[]).push("3.3.3");const ht=(t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new st(e.insertBefore(U(),t),t,void 0,s??{})}return o._$AI(t),o},ct=globalThis;class dt extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ht(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}dt._$litElement$=!0,dt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:dt});const pt=ct.litElementPolyfillSupport;pt?.({LitElement:dt}),(ct.litElementVersions??=[]).push("4.2.2");const ut={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},ft=(t=ut,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function _t(t){return(e,s)=>"object"==typeof s?ft(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function gt(t){return _t({...t,state:!0,attribute:!1})}const mt={height:400,show_alternatives:!0,show_legend:!0,show_labels:!0};function yt(t){return Array.isArray(t)?3===t.length?`rgb(${t.join(", ")})`:void 0:t?.trim()||void 0}function $t(t){if("string"!=typeof t)return t;const e=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t.trim());if(!e)return t;const s=3===e[1].length?[...e[1]].map(t=>t+t).join(""):e[1];return[0,2,4].map(t=>parseInt(s.slice(t,t+2),16))}function vt(t){return!!t&&t.entity_id.startsWith("sensor.")&&Array.isArray(t.attributes.routes)}function bt(t){return Object.values(t.states).filter(vt).map(t=>t.entity_id).sort()}const wt={en:{route:"Route",min:"min",entity_missing:"Entity not found",no_entity:"Select a route sensor in the card editor.",no_api_key:"Enter a Google Maps JavaScript API key in the card editor.",auth_failed:"Google Maps rejected the API key. The exact reason is in the browser console (F12), e.g. RefererNotAllowedMapError or ApiNotActivatedMapError.",editor_entity:"Route",editor_entity_helper:'The "Fastest travel time" sensor of a Drive Route Card entry.',editor_api_key:"Google Maps JavaScript API key",editor_api_key_helper:"Browser key restricted to your Home Assistant URL. Changing the key requires a page reload.",editor_title:"Title",editor_height:"Map height",editor_show_alternatives:"Show alternative routes",editor_show_legend:"Show legend",editor_show_labels:"Show time and distance on the routes",editor_fastest_color:"Fastest route color",editor_alternative_color:"Alternative routes color",editor_no_sensors:"No route sensors found. Add a route under Settings → Devices & services → Drive Route Card first."},de:{route:"Route",min:"Min.",entity_missing:"Entität nicht gefunden",no_entity:"Wähle im Karteneditor einen Routen-Sensor aus.",no_api_key:"Gib im Karteneditor einen API-Key für die Google Maps JavaScript API ein.",auth_failed:"Google Maps hat den API-Key abgelehnt. Der genaue Grund steht in der Browser-Konsole (F12), z. B. RefererNotAllowedMapError oder ApiNotActivatedMapError.",editor_entity:"Route",editor_entity_helper:"Der Sensor „Schnellste Fahrzeit“ eines Drive-Route-Card-Eintrags.",editor_api_key:"Google-Maps-JavaScript-API-Key",editor_api_key_helper:"Browser-Key mit Einschränkung auf deine Home-Assistant-Adresse. Nach einem Key-Wechsel muss die Seite neu geladen werden.",editor_title:"Titel",editor_height:"Kartenhöhe",editor_show_alternatives:"Alternativrouten anzeigen",editor_show_legend:"Legende anzeigen",editor_show_labels:"Fahrzeit und Distanz an den Routen anzeigen",editor_fastest_color:"Farbe der schnellsten Route",editor_alternative_color:"Farbe der Alternativrouten",editor_no_sensors:"Keine Routen-Sensoren gefunden. Lege zuerst unter Einstellungen → Geräte & Dienste → Drive Route Card eine Route an."}};function At(t,e){const s=t.split("-")[0];return(wt[s]??wt.en)[e]??e}const Et="drive-route-card-editor";class xt extends dt{constructor(){super(...arguments),this._formReady=!!customElements.get("ha-form")}setConfig(t){this._config=t}connectedCallback(){super.connectedCallback(),this._formReady||async function(){if(customElements.get("ha-form"))return;const t=window.loadCardHelpers;if(!t)return;const e=await t(),s=await e.createCardElement({type:"tile",entity:"sun.sun"});await(s.constructor.getConfigElement?.())}().finally(()=>{this._formReady=!0})}_schema(t){return[{name:"entity",required:!0,selector:{entity:{include_entities:t}}},{name:"api_key",required:!0,selector:{text:{}}},{name:"title",selector:{text:{}}},{name:"height",selector:{number:{min:150,max:1200,step:10,mode:"box",unit_of_measurement:"px"}}},{name:"",type:"grid",schema:[{name:"show_alternatives",selector:{boolean:{}}},{name:"show_legend",selector:{boolean:{}}},{name:"show_labels",selector:{boolean:{}}}]},{name:"",type:"grid",schema:[{name:"fastest_color",selector:{color_rgb:{}}},{name:"alternative_color",selector:{color_rgb:{}}}]}]}render(){if(!this.hass||!this._config||!this._formReady)return V;const t=this.hass.language,e=bt(this.hass);return W`
      ${e.length?V:W`<div class="hint">${At(t,"editor_no_sensors")}</div>`}
      <ha-form
        .hass=${this.hass}
        .data=${{...mt,...this._config,fastest_color:$t(this._config.fastest_color),alternative_color:$t(this._config.alternative_color)}}
        .schema=${this._schema(e)}
        .computeLabel=${e=>At(t,`editor_${e.name}`)}
        .computeHelper=${e=>this._helper(t,e.name)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}_helper(t,e){if("entity"===e||"api_key"===e)return At(t,`editor_${e}_helper`)}_valueChanged(t){t.stopPropagation();const e=function(t){return Object.fromEntries(Object.entries(t).filter(([t,e])=>void 0!==e&&""!==e&&mt[t]!==e))}({...t.detail.value,type:this._config.type});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}}xt.styles=a`
    .hint {
      margin-bottom: 16px;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.12);
      color: var(--primary-text-color);
    }
  `,t([_t({attribute:!1})],xt.prototype,"hass",void 0),t([gt()],xt.prototype,"_config",void 0),t([gt()],xt.prototype,"_formReady",void 0),customElements.get(Et)||customElements.define(Et,xt);const St="__driveRouteCardMapsLoaded";let Ct,kt=!1;const Mt=new Set,Pt=window.gm_authFailure;window.gm_authFailure=()=>{kt=!0,Mt.forEach(t=>t()),Pt?.()};function Rt(t,e=0,s=1){const i=Math.floor(t.length*e),o=Math.max(i+1,Math.ceil(t.length*s)),r=t.slice(i,o),n=Math.max(1,Math.floor(r.length/150));return r.filter((t,e)=>e%n===0)}function Ot(t,e){const s=t.lat-e.lat,i=(t.lng-e.lng)*Math.cos(t.lat*Math.PI/180);return s*s+i*i}function Ut(t){const e=[];let s=0,i=0,o=0;const r=()=>{let e,i=0,o=0;do{e=t.charCodeAt(s++)-63,i|=(31&e)<<o,o+=5}while(e>=32);return 1&i?~(i>>1):i>>1};for(;s<t.length;)i+=r(),o+=r(),e.push({lat:i/1e5,lng:o/1e5});return e}let Lt;const Ht=[[{lat:0,lng:0},{lat:.3,lng:.4},{lat:.35,lng:1.2},{lat:.8,lng:1.6},{lat:1,lng:2}],[{lat:0,lng:0},{lat:-.2,lng:.7},{lat:.1,lng:1.4},{lat:.6,lng:2.1},{lat:1,lng:2}],[{lat:0,lng:0},{lat:.6,lng:.2},{lat:1.1,lng:.9},{lat:1.2,lng:1.6},{lat:1,lng:2}]];function Nt(t,e,s,i){const o=t?.length?t.map(Ut):Ht,r=t?.length?e:0,n=o.flat();if(!n.length)return{width:s,height:i,lines:[]};const a=n.reduce((t,e)=>t+e.lat,0)/n.length,l=Math.cos(a*Math.PI/180),h=n.map(t=>t.lng*l),c=n.map(t=>t.lat),d=Math.min(...h),p=Math.max(...c),u=Math.max(...h)-d||1e-9,f=p-Math.min(...c)||1e-9,_=Math.min((s-32)/u,(i-32)/f),g=(s-u*_)/2,m=(i-f*_)/2,y=t=>[Math.round(10*(g+(t.lng*l-d)*_))/10,Math.round(10*(m+(p-t.lat)*_))/10],$=o.map((t,e)=>({coords:t.map(y),fastest:e===r})).filter(({coords:t})=>t.length).map(({coords:t,fastest:e})=>({d:`M${t.map(([t,e])=>`${t},${e}`).join("L")}`,fastest:e,start:t[0],end:t[t.length-1]}));return $.sort((t,e)=>Number(t.fastest)-Number(e.fastest)),{width:s,height:i,lines:$}}const Tt="drive-route-card",jt="#9e9e9e",zt="#03a9f4",Dt={drive:"mdi:car",two_wheeler:"mdi:motorbike",bicycle:"mdi:bike",walk:"mdi:walk"};class It extends dt{constructor(){super(...arguments),this._authFailed=!1,this._mapLoading=!1,this._polylines=[],this._labels=[]}static getConfigElement(){return document.createElement(Et)}static getStubConfig(t){return{entity:bt(t)[0]??"",api_key:""}}setConfig(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration");this._config=t,this._error=void 0,this._drawnQuery=void 0}connectedCallback(){var t;super.connectedCallback(),this._unsubscribeAuth=(t=()=>{this._authFailed=!0},Mt.add(t),kt&&t(),()=>Mt.delete(t))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeAuth?.()}getCardSize(){return Math.ceil((this._config?.height??400)/50)+2}get _entity(){const t=this._config?.entity;return t?this.hass?.states[t]:void 0}get _routes(){return this._entity?.attributes.routes??[]}get _fastestIndex(){const t=this._entity?.attributes.route;return"number"==typeof t?t-1:0}updated(){this._config?.api_key&&(this._map?this._drawRoutes():this._mapLoading||this._error||this._initMap())}async _initMap(){const t=this.renderRoot.querySelector("#map");if(t&&this._config?.api_key){this._mapLoading=!0;try{await(e=this._config.api_key,"undefined"!=typeof google&&"function"==typeof google.maps?.importLibrary?Promise.resolve():(Ct??=new Promise((t,s)=>{window[St]=()=>t();const i=document.createElement("script"),o=new URLSearchParams({key:e,loading:"async",callback:St,v:"weekly"});i.src=`https://maps.googleapis.com/maps/api/js?${o}`,i.async=!0,i.onerror=()=>{Ct=void 0,i.remove(),s(new Error("Failed to load the Google Maps JavaScript API"))},document.head.append(i)}),Ct));const{Map:s}=await google.maps.importLibrary("maps");this._map=new s(t,{center:{lat:0,lng:0},zoom:2,disableDefaultUI:!0,zoomControl:!0,gestureHandling:"cooperative"}),new ResizeObserver(()=>{this._bounds&&this._map?.fitBounds(this._bounds,32)}).observe(t),this._error=void 0,this._drawRoutes()}catch(t){this._error=t.message}finally{this._mapLoading=!1}var e}}_drawRoutes(){const t=this._map,e=this._entity;if(!t||!e||!this._config)return;const{show_alternatives:s,show_labels:i}=this._config,o=yt(this._config.fastest_color),r=yt(this._config.alternative_color)??jt,n=[e.attributes.last_query,s,i,o,r].join("|");if(n===this._drawnQuery)return;this._drawnQuery=n,this._polylines.forEach(t=>t.setMap(null)),this._polylines=[],this._labels.forEach(t=>t.setMap(null)),this._labels=[];const a=o||getComputedStyle(this).getPropertyValue("--primary-color").trim()||zt,l=this._fastestIndex,h=s??!0,c=new google.maps.LatLngBounds,d=this._routes.map((t,e)=>({route:t,index:e,path:Ut(t.polyline)})).filter(({index:t})=>h||t===l),p=function(t){const e=t.map((e,s)=>t.flatMap((t,e)=>e===s?[]:Rt(t)));return t.map((t,s)=>{if(!t.length)return;const i=Rt(t,.2,.8);if(!e[s].length)return t[Math.floor(t.length/2)];let o=i[0],r=-1;for(const t of i){let i=1/0;for(const o of e[s])i=Math.min(i,Ot(t,o));i>r&&(r=i,o=t)}return o})}(d.map(({path:t})=>t)),u=this.hass?.language??"en",f=Dt[String(e.attributes.travel_mode)]??Dt.drive;if(d.forEach(({route:e,index:s,path:o},n)=>{const h=s===l;o.forEach(t=>c.extend(t));const d=p[n];if((i??!0)&&d){const s=function(t,e){return Lt??=class extends google.maps.OverlayView{constructor(t,e){super(),this._position=t,this._element=e}onAdd(){this.getPanes()?.floatPane.append(this._element)}draw(){const t=this.getProjection()?.fromLatLngToDivPixel(this._position);t&&(this._element.style.left=`${t.x}px`,this._element.style.top=`${t.y}px`)}onRemove(){this._element.remove()}},new Lt(t,e)}(d,this._labelElement(e,h,f,u));s.setMap(t),this._labels.push(s)}this._polylines.push(new google.maps.Polyline({map:t,path:o,strokeColor:h?a:r,strokeOpacity:h?1:.8,strokeWeight:h?6:4,zIndex:h?2:1,icons:h?Bt(a):void 0}))}),c.isEmpty())for(const t of["origin","destination"]){const s=e.attributes[t];s&&c.extend({lat:s.latitude,lng:s.longitude})}c.isEmpty()||(this._bounds=c,t.fitBounds(c,32))}_labelElement(t,e,s,i){const o=document.createElement("div");return o.classList.add("route-label"),o.classList.toggle("fastest",e),o.classList.toggle("delayed",t.delay>=300),ht(W`<ha-icon .icon=${s}></ha-icon>
        <div>
          <div class="time">${Ft(t.duration)} ${At(i,"min")}</div>
          <div class="distance">${qt(t.distance,i)} km</div>
        </div>`,o),o}_colorStyle(){const t=yt(this._config?.fastest_color),e=yt(this._config?.alternative_color);return[t?`--drc-fastest-color: ${t}`:"",e?`--drc-alternative-color: ${e}`:""].filter(Boolean).join("; ")}render(){if(!this._config||!this.hass)return V;const t=this._entity,e=this._config.height??400,s=this.hass.language,{entity:i,api_key:o}=this._config;return W`
      <ha-card .header=${this._config.title} style=${this._colorStyle()}>
        ${this._error?W`<div class="warning">${this._error}</div>`:V}
        ${this._authFailed?W`<div class="warning">${At(s,"auth_failed")}</div>`:V}
        ${i?t?V:W`<div class="warning">${At(s,"entity_missing")}: ${i}</div>`:W`<div class="hint">${At(s,"no_entity")}</div>`}
        ${i&&!o?W`<div class="hint">${At(s,"no_api_key")}</div>`:V}
        <div id="map" style="height: ${e}px" ?hidden=${!o}></div>
        ${o?V:this._renderSketch(e)}
        ${this._config.show_legend??!0?this._renderLegend(s):V}
      </ha-card>
    `}_renderSketch(t){const e=this._config?.show_alternatives??!0,s=this._fastestIndex,i=this._routes.map(t=>t.polyline),o=e?Nt(i,s,400,250):Nt(i[s]?[i[s]]:[],0,400,250),r=o.lines.find(t=>t.fastest);return W`
      <svg
        class="sketch"
        style="height: ${Math.min(t,250)}px"
        viewBox="0 0 ${o.width} ${o.height}"
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        ${o.lines.map(t=>K`<path d=${t.d} class=${t.fastest?"line fastest":"line"}></path>`)}
        ${r?K`
              <circle class="endpoint start" cx=${r.start[0]} cy=${r.start[1]} r="6"></circle>
              <circle class="endpoint end" cx=${r.end[0]} cy=${r.end[1]} r="6"></circle>`:V}
      </svg>
    `}_renderLegend(t){const e=this._fastestIndex,s=this._config?.show_alternatives??!0,i=this._routes.map((t,e)=>({route:t,index:e})).filter(({index:t})=>s||t===e);return i.length?W`
      <ul class="legend">
        ${i.map(({route:s,index:i})=>W`
            <li class=${i===e?"fastest":""}>
              <span class="swatch"></span>
              <span class="name">${s.description||`${At(t,"route")} ${i+1}`}</span>
              <span class="value">${Ft(s.duration)} ${At(t,"min")}</span>
              <span class="value">${qt(s.distance,t)} km</span>
              ${s.delay>=60?W`<span class="delay">+${Ft(s.delay)} ${At(t,"min")}</span>`:V}
            </li>
          `)}
      </ul>
    `:V}}function Bt(t){const e=t=>({path:google.maps.SymbolPath.CIRCLE,scale:7,fillColor:t,fillOpacity:1,strokeColor:"#ffffff",strokeWeight:2});return[{icon:e("#ffffff"),offset:"0%"},{icon:e(t),offset:"100%"}]}function Ft(t){return String(Math.round(t/60))}function qt(t,e){return(t/1e3).toLocaleString(e,{maximumFractionDigits:1})}if(It.styles=a`
    #map {
      width: 100%;
    }
    ha-card {
      overflow: hidden;
    }
    .warning,
    .hint {
      padding: 8px 16px;
      color: var(--error-color);
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    [hidden] {
      display: none;
    }
    /* Labels live inside the Google map, which is always light. */
    .route-label {
      position: absolute;
      transform: translate(-50%, calc(-100% - 10px));
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 6px;
      background: #ffffff;
      color: #202124;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      font: 12px/1.3 Roboto, Arial, sans-serif;
      white-space: nowrap;
      pointer-events: none;
    }
    .route-label::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -6px;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: #ffffff;
      border-bottom: 0;
    }
    .route-label.fastest {
      z-index: 1;
    }
    .route-label ha-icon {
      --mdc-icon-size: 18px;
      color: #5f6368;
    }
    .route-label .time {
      font-size: 13px;
      font-weight: 600;
    }
    .route-label.fastest .time {
      color: #188038;
    }
    .route-label.delayed:not(.fastest) .time {
      color: #d93025;
    }
    .route-label .distance {
      color: #5f6368;
    }
    .sketch {
      display: block;
      width: 100%;
      background: var(--secondary-background-color);
    }
    .sketch .line {
      fill: none;
      stroke: var(--drc-alternative-color, ${n(jt)});
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .sketch .line.fastest {
      stroke: var(--drc-fastest-color, var(--primary-color, ${n(zt)}));
      stroke-width: 6;
    }
    .sketch .endpoint {
      stroke: #ffffff;
      stroke-width: 2;
    }
    .sketch .start {
      fill: #ffffff;
      stroke: var(--drc-fastest-color, var(--primary-color, ${n(zt)}));
    }
    .sketch .end {
      fill: var(--drc-fastest-color, var(--primary-color, ${n(zt)}));
    }
    .legend {
      list-style: none;
      margin: 0;
      padding: 8px 16px 12px;
    }
    .legend li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      color: var(--secondary-text-color);
    }
    .legend li.fastest {
      color: var(--primary-text-color);
      font-weight: 500;
    }
    .swatch {
      flex: none;
      width: 16px;
      height: 4px;
      border-radius: 2px;
      background: var(--drc-alternative-color, ${n(jt)});
    }
    .fastest .swatch {
      background: var(--drc-fastest-color, var(--primary-color, ${n(zt)}));
    }
    .name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .value {
      white-space: nowrap;
    }
    .delay {
      white-space: nowrap;
      color: var(--warning-color);
    }
  `,t([_t({attribute:!1})],It.prototype,"hass",void 0),t([gt()],It.prototype,"_config",void 0),t([gt()],It.prototype,"_error",void 0),t([gt()],It.prototype,"_authFailed",void 0),!customElements.get(Tt)){customElements.define(Tt,It);(window.customCards??=[]).push({type:Tt,name:"Drive Route Card",description:"Shows the fastest route and alternatives between two zones.",preview:!0,documentationURL:"https://github.com/scheibome/drive-route-card"})}
