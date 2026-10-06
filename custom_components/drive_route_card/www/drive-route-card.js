function t(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,f=_.trustedTypes,g=f?f.emptyScript:"",m=_.reactiveElementPolyfillSupport,y=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&h(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??v)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,m?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,E=t=>t,S=A.trustedTypes,x=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+C,P=`<${k}>`,O=document,R=()=>O.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,U="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,H=/>/g,z=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,j=/"/g,B=/^(?:script|style|textarea|title)$/i,G=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),F=G(1),J=G(2),K=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=O.createTreeWalker(O,129);function Q(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const Z=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=L;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,c=0;for(;c<s.length&&(n.lastIndex=c,l=n.exec(s),null!==l);)c=n.lastIndex,n===L?"!--"===l[1]?n=I:void 0!==l[1]?n=H:void 0!==l[2]?(B.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=z):void 0!==l[3]&&(n=z):n===z?">"===l[0]?(n=o??L,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?z:'"'===l[3]?j:D):n===j||n===D?n=z:n===I||n===H?n=L:(n=z,o=void 0);const d=n===z&&t[e+1].startsWith("/>")?" ":"";r+=n===L?s+P:h>=0?(i.push(a),s.slice(0,h)+M+s.slice(h)+C+d):s+C+(-2===h?e:d)}return[Q(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class X{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,h]=Z(t,e);if(this.el=X.createElement(l,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(M)){const e=h[r++],s=i.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?it:"?"===n[1]?ot:"@"===n[1]?rt:st}),i.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],R()),V.nextNode(),a.push({type:2,index:++o});i.append(t[e],R())}}}else if(8===i.nodeType)if(i.data===k)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function Y(t,e,s=t,i){if(e===K)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=T(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Y(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);V.currentNode=i;let o=V.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=V.nextNode(),r++)}return V.currentNode=O,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),T(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==K&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=X.createElement(Q(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new X(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new et(this.O(R()),this.O(R()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=E(t).nextSibling;E(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=Y(this,t,e,0),r=!T(t)||t!==this._$AH&&t!==K,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Y(this,i[s+n],e,n),a===K&&(a=this._$AH[n]),r||=!T(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class ot extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class rt extends st{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===K)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const at=A.litHtmlPolyfillSupport;at?.(X,et),(A.litHtmlVersions??=[]).push("3.3.3");const lt=(t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(R(),t),t,void 0,s??{})}return o._$AI(t),o},ht=globalThis;class ct extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=lt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}}ct._$litElement$=!0,ct.finalized=!0,ht.litElementHydrateSupport?.({LitElement:ct});const dt=ht.litElementPolyfillSupport;dt?.({LitElement:ct}),(ht.litElementVersions??=[]).push("4.2.2");const pt={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:v},ut=(t=pt,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function _t(t){return(e,s)=>"object"==typeof s?ut(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function ft(t){return _t({...t,state:!0,attribute:!1})}const gt={height:400,show_alternatives:!0,show_legend:!0,show_labels:!0,fastest_color:[26,115,232],alternative_color:[138,180,248],map_type:"roadmap",show_traffic:!1,show_controls:!0};function mt(t){return Array.isArray(t)?3===t.length?`rgb(${t.join(", ")})`:void 0:t?.trim()||void 0}function yt(t){if("string"!=typeof t)return t;const e=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t.trim());if(!e)return t;const s=3===e[1].length?[...e[1]].map(t=>t+t).join(""):e[1];return[0,2,4].map(t=>parseInt(s.slice(t,t+2),16))}function $t(t){return!!t&&t.entity_id.startsWith("sensor.")&&Array.isArray(t.attributes.routes)}function vt(t){return Object.values(t.states).filter($t).map(t=>t.entity_id).sort()}const bt={en:{route:"Route",min:"min",entity_missing:"Entity not found",no_entity:"Select a route sensor in the card editor.",no_api_key:"Enter a Google Maps JavaScript API key in the card editor.",auth_failed:"Google Maps rejected the API key. The exact reason is in the browser console (F12), e.g. RefererNotAllowedMapError or ApiNotActivatedMapError.",editor_entity:"Route",editor_entity_helper:'The "Fastest travel time" sensor of a Drive Route Card entry.',editor_api_key:"Google Maps JavaScript API key",editor_api_key_helper:"Browser key restricted to your Home Assistant URL. Changing the key requires a page reload.",editor_title:"Title",editor_height:"Map height",editor_show_alternatives:"Show alternative routes",editor_show_legend:"Show legend",editor_show_labels:"Show time and distance on the routes",editor_fastest_color:"Fastest route color",editor_height_helper:"Ignored in panel view, where the card fills the whole height.",editor_map_type:"Map type",editor_map_style:"Map style (JSON)",editor_map_style_helper:"Google's JSON styling: a list of rules with featureType, elementType and stylers. Paste the JSON from Google's styling wizard or snazzymaps.com.",editor_map_id:"Map ID (cloud styling)",editor_map_id_helper:"Optional map ID from the Google Cloud console. When set, Google applies the cloud style and ignores the JSON style.",editor_show_traffic:"Show traffic",editor_show_controls:"Show map type and traffic buttons on the map",map_type_roadmap:"Map",map_type_satellite:"Satellite",map_type_hybrid:"Satellite with labels",map_type_terrain:"Terrain",traffic:"Traffic",editor_alternative_color:"Alternative routes color",editor_no_sensors:"No route sensors found. Add a route under Settings → Devices & services → Drive Route Card first."},de:{route:"Route",min:"Min.",entity_missing:"Entität nicht gefunden",no_entity:"Wähle im Karteneditor einen Routen-Sensor aus.",no_api_key:"Gib im Karteneditor einen API-Key für die Google Maps JavaScript API ein.",auth_failed:"Google Maps hat den API-Key abgelehnt. Der genaue Grund steht in der Browser-Konsole (F12), z. B. RefererNotAllowedMapError oder ApiNotActivatedMapError.",editor_entity:"Route",editor_entity_helper:"Der Sensor „Schnellste Fahrzeit“ eines Drive-Route-Card-Eintrags.",editor_api_key:"Google-Maps-JavaScript-API-Key",editor_api_key_helper:"Browser-Key mit Einschränkung auf deine Home-Assistant-Adresse. Nach einem Key-Wechsel muss die Seite neu geladen werden.",editor_title:"Titel",editor_height:"Kartenhöhe",editor_show_alternatives:"Alternativrouten anzeigen",editor_show_legend:"Legende anzeigen",editor_show_labels:"Fahrzeit und Distanz an den Routen anzeigen",editor_fastest_color:"Farbe der schnellsten Route",editor_height_helper:"Wird in der Panel-Ansicht ignoriert, dort füllt die Karte die volle Höhe.",editor_map_type:"Kartentyp",editor_map_style:"Kartenstil (JSON)",editor_map_style_helper:"Googles JSON-Styling: eine Liste von Regeln mit featureType, elementType und stylers. Füge das JSON aus Googles Styling-Assistent oder von snazzymaps.com ein.",editor_map_id:"Map-ID (Cloud-Styling)",editor_map_id_helper:"Optionale Map-ID aus der Google Cloud Console. Ist sie gesetzt, verwendet Google den Cloud-Stil und ignoriert den JSON-Stil.",editor_show_traffic:"Verkehrslage anzeigen",editor_show_controls:"Kartentyp- und Verkehr-Knöpfe auf der Karte anzeigen",map_type_roadmap:"Karte",map_type_satellite:"Satellit",map_type_hybrid:"Satellit mit Beschriftung",map_type_terrain:"Gelände",traffic:"Verkehr",editor_alternative_color:"Farbe der Alternativrouten",editor_no_sensors:"Keine Routen-Sensoren gefunden. Lege zuerst unter Einstellungen → Geräte & Dienste → Drive Route Card eine Route an."}};function wt(t,e){const s=t.split("-")[0];return(bt[s]??bt.en)[e]??e}const At="drive-route-card-editor",Et=["roadmap","satellite","hybrid","terrain"];class St extends ct{constructor(){super(...arguments),this._formReady=!!customElements.get("ha-form")}setConfig(t){this._config=t}connectedCallback(){super.connectedCallback(),this._formReady||async function(){if(customElements.get("ha-form"))return;const t=window.loadCardHelpers;if(!t)return;const e=await t(),s=await e.createCardElement({type:"tile",entity:"sun.sun"});await(s.constructor.getConfigElement?.())}().finally(()=>{this._formReady=!0})}_schema(t,e){return[{name:"entity",required:!0,selector:{entity:{include_entities:t}}},{name:"api_key",required:!0,selector:{text:{}}},{name:"title",selector:{text:{}}},{name:"height",selector:{number:{min:150,max:1200,step:10,mode:"box",unit_of_measurement:"px"}}},{name:"map_type",selector:{select:{mode:"dropdown",options:Et.map(t=>({value:t,label:wt(e,`map_type_${t}`)}))}}},{name:"",type:"grid",schema:[{name:"show_alternatives",selector:{boolean:{}}},{name:"show_legend",selector:{boolean:{}}},{name:"show_labels",selector:{boolean:{}}},{name:"show_traffic",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}}]},{name:"map_style",selector:{object:{}}},{name:"map_id",selector:{text:{}}},{name:"",type:"grid",schema:[{name:"fastest_color",selector:{color_rgb:{}}},{name:"alternative_color",selector:{color_rgb:{}}}]}]}render(){if(!this.hass||!this._config||!this._formReady)return W;const t=this.hass.language,e=vt(this.hass);return F`
      ${e.length?W:F`<div class="hint">${wt(t,"editor_no_sensors")}</div>`}
      <ha-form
        .hass=${this.hass}
        .data=${{...gt,...this._config,fastest_color:yt(this._config.fastest_color)??gt.fastest_color,alternative_color:yt(this._config.alternative_color)??gt.alternative_color}}
        .schema=${this._schema(e,t)}
        .computeLabel=${e=>wt(t,`editor_${e.name}`)}
        .computeHelper=${e=>this._helper(t,e.name)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}_helper(t,e){if(["entity","api_key","height","map_style","map_id"].includes(e))return wt(t,`editor_${e}_helper`)}_valueChanged(t){t.stopPropagation();const e=function(t){return Object.fromEntries(Object.entries(t).filter(([t,e])=>void 0!==e&&""!==e&&JSON.stringify(gt[t])!==JSON.stringify(e)))}({...t.detail.value,type:this._config.type});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}}St.styles=n`
    .hint {
      margin-bottom: 16px;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.12);
      color: var(--primary-text-color);
    }
  `,t([_t({attribute:!1})],St.prototype,"hass",void 0),t([ft()],St.prototype,"_config",void 0),t([ft()],St.prototype,"_formReady",void 0),customElements.get(At)||customElements.define(At,St);const xt="__driveRouteCardMapsLoaded";let Mt,Ct=!1;const kt=new Set,Pt=window.gm_authFailure;window.gm_authFailure=()=>{Ct=!0,kt.forEach(t=>t()),Pt?.()};function Ot(t,e=0,s=1){const i=Math.floor(t.length*e),o=Math.max(i+1,Math.ceil(t.length*s)),r=t.slice(i,o),n=Math.max(1,Math.floor(r.length/150));return r.filter((t,e)=>e%n===0)}function Rt(t,e){const s=t.lat-e.lat,i=(t.lng-e.lng)*Math.cos(t.lat*Math.PI/180);return s*s+i*i}function Tt(t){const e=[];let s=0,i=0,o=0;const r=()=>{let e,i=0,o=0;do{e=t.charCodeAt(s++)-63,i|=(31&e)<<o,o+=5}while(e>=32);return 1&i?~(i>>1):i>>1};for(;s<t.length;)i+=r(),o+=r(),e.push({lat:i/1e5,lng:o/1e5});return e}let Nt;const Ut=[[{lat:0,lng:0},{lat:.3,lng:.4},{lat:.35,lng:1.2},{lat:.8,lng:1.6},{lat:1,lng:2}],[{lat:0,lng:0},{lat:-.2,lng:.7},{lat:.1,lng:1.4},{lat:.6,lng:2.1},{lat:1,lng:2}],[{lat:0,lng:0},{lat:.6,lng:.2},{lat:1.1,lng:.9},{lat:1.2,lng:1.6},{lat:1,lng:2}]];function Lt(t,e,s,i){const o=t?.length?t.map(Tt):Ut,r=t?.length?e:0,n=o.flat();if(!n.length)return{width:s,height:i,lines:[]};const a=n.reduce((t,e)=>t+e.lat,0)/n.length,l=Math.cos(a*Math.PI/180),h=n.map(t=>t.lng*l),c=n.map(t=>t.lat),d=Math.min(...h),p=Math.max(...c),u=Math.max(...h)-d||1e-9,_=p-Math.min(...c)||1e-9,f=Math.min((s-32)/u,(i-32)/_),g=(s-u*f)/2,m=(i-_*f)/2,y=t=>[Math.round(10*(g+(t.lng*l-d)*f))/10,Math.round(10*(m+(p-t.lat)*f))/10],$=o.map((t,e)=>({coords:t.map(y),fastest:e===r})).filter(({coords:t})=>t.length).map(({coords:t,fastest:e})=>({d:`M${t.map(([t,e])=>`${t},${e}`).join("L")}`,fastest:e,start:t[0],end:t[t.length-1]}));return $.sort((t,e)=>Number(t.fastest)-Number(e.fastest)),{width:s,height:i,lines:$}}const It="drive-route-card",Ht={drive:"mdi:car",two_wheeler:"mdi:motorbike",bicycle:"mdi:bike",walk:"mdi:walk"};class zt extends ct{constructor(){super(...arguments),this.isPanel=!1,this.editMode=!1,this._authFailed=!1,this._trafficOn=!1,this._mapLoading=!1,this._polylines=[],this._labels=[]}static getConfigElement(){return document.createElement(At)}static getStubConfig(t){return{entity:vt(t)[0]??"",api_key:""}}setConfig(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration");this._config=t,this._trafficOn=t.show_traffic??!1,this._error=void 0,this._drawnQuery=void 0}connectedCallback(){var t;super.connectedCallback(),function(t){let e=t;for(let t=0;e&&t<10;t++){if(e instanceof Element&&jt.has(e.tagName))return!0;e=e.parentNode??(e instanceof ShadowRoot?e.host:null)}return!1}(this)&&(this.editMode=!0),this._unsubscribeAuth=(t=()=>{this._authFailed=!0},kt.add(t),Ct&&t(),()=>kt.delete(t))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeAuth?.()}getCardSize(){return Math.ceil((this._config?.height??400)/50)+2}get _entity(){const t=this._config?.entity;return t?this.hass?.states[t]:void 0}get _routes(){return this._entity?.attributes.routes??[]}get _fastestIndex(){const t=this._entity?.attributes.route;return"number"==typeof t?t-1:0}updated(){this._config?.api_key&&(this._map&&(this._config.map_id||void 0)!==this._mapId&&this._destroyMap(),this._map?this._drawRoutes():this._mapLoading||this._error||this._initMap())}async _initMap(){const t=this.renderRoot.querySelector("#map");if(t&&this._config?.api_key){this._mapLoading=!0;try{await(e=this._config.api_key,"undefined"!=typeof google&&"function"==typeof google.maps?.importLibrary?Promise.resolve():(Mt??=new Promise((t,s)=>{window[xt]=()=>t();const i=document.createElement("script"),o=new URLSearchParams({key:e,loading:"async",callback:xt,v:"weekly"});i.src=`https://maps.googleapis.com/maps/api/js?${o}`,i.async=!0,i.onerror=()=>{Mt=void 0,i.remove(),s(new Error("Failed to load the Google Maps JavaScript API"))},document.head.append(i)}),Mt));const{Map:s,TrafficLayer:i}=await google.maps.importLibrary("maps");this._mapId=this._config.map_id||void 0,this._map=new s(t,{mapId:this._mapId,center:{lat:0,lng:0},zoom:2,disableDefaultUI:!0,zoomControl:!0,gestureHandling:this._gestureHandling,mapTypeControlOptions:{position:google.maps.ControlPosition.TOP_LEFT,mapTypeIds:["roadmap","satellite"]}}),this._trafficLayer=new i,this._trafficButton=this._createTrafficButton(),this._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this._trafficButton),this._applyMapOptions(),this._resizeObserver=new ResizeObserver(()=>{this._bounds&&this._map?.fitBounds(this._bounds,32)}),this._resizeObserver.observe(t),this._error=void 0,this._drawRoutes()}catch(t){this._error=t.message}finally{this._mapLoading=!1}var e}}_destroyMap(){this._resizeObserver?.disconnect(),this._polylines.forEach(t=>t.setMap(null)),this._labels.forEach(t=>t.setMap(null)),this._trafficLayer?.setMap(null),this._polylines=[],this._labels=[],this._map=void 0,this._trafficLayer=void 0,this._trafficButton=void 0,this._bounds=void 0,this._appliedMapType=void 0,this._drawnQuery=void 0,this.renderRoot.querySelector("#map")?.replaceChildren()}get _gestureHandling(){return this.isPanel&&!this.editMode?"greedy":"cooperative"}willUpdate(t){this._map&&(t.has("isPanel")||t.has("editMode"))&&this._map.setOptions({gestureHandling:this._gestureHandling}),this._map&&(t.has("_config")||t.has("_trafficOn"))&&this._applyMapOptions()}_applyMapOptions(){const t=this._map;if(!t||!this._config)return;const e=this._config.show_controls??!0;let s;try{s=function(t){if(null==t||""===t)return;let e=t;if("string"==typeof t)try{e=JSON.parse(t)}catch(t){throw new Error(`map_style is not valid JSON: ${t.message}`)}if(!Array.isArray(e))throw new Error("map_style must be a list of style rules");return e.forEach((t,e)=>{if(!t||"object"!=typeof t||!Array.isArray(t.stylers))throw new Error(`map_style rule ${e+1} needs a "stylers" list`)}),e}(this._config.map_style),this._styleError=void 0}catch(t){this._styleError=t.message}t.setOptions({mapTypeControl:e,styles:s??null});const i=this._config.map_type??"roadmap";i!==this._appliedMapType&&(this._appliedMapType=i,t.setMapTypeId(i)),this._trafficLayer?.setMap(this._trafficOn?t:null),this._trafficButton&&(this._trafficButton.hidden=!e,this._trafficButton.setAttribute("aria-pressed",String(this._trafficOn)),this._trafficButton.textContent=wt(this.hass?.language??"en","traffic"))}_createTrafficButton(){const t=document.createElement("button");return t.type="button",t.className="map-control",t.addEventListener("click",()=>{this._trafficOn=!this._trafficOn}),t}_drawRoutes(){const t=this._map,e=this._entity;if(!t||!e||!this._config)return;const{show_alternatives:s,show_labels:i}=this._config,{fastest:o,alternative:r}=this._colors,n=[e.attributes.last_query,s,i,o,r].join("|");if(n===this._drawnQuery)return;this._drawnQuery=n,this._polylines.forEach(t=>t.setMap(null)),this._polylines=[],this._labels.forEach(t=>t.setMap(null)),this._labels=[];const a=this._fastestIndex,l=s??!0,h=new google.maps.LatLngBounds,c=this._routes.map((t,e)=>({route:t,index:e,path:Tt(t.polyline)})).filter(({index:t})=>l||t===a),d=function(t){const e=t.map((e,s)=>t.flatMap((t,e)=>e===s?[]:Ot(t)));return t.map((t,s)=>{if(!t.length)return;const i=Ot(t,.2,.8);if(!e[s].length)return t[Math.floor(t.length/2)];let o=i[0],r=-1;for(const t of i){let i=1/0;for(const o of e[s])i=Math.min(i,Rt(t,o));i>r&&(r=i,o=t)}return o})}(c.map(({path:t})=>t)),p=this.hass?.language??"en",u=Ht[String(e.attributes.travel_mode)]??Ht.drive;if(c.forEach(({route:e,index:s,path:n},l)=>{const c=s===a;n.forEach(t=>h.extend(t));const _=d[l];if((i??!0)&&_){const s=function(t,e){return Nt??=class extends google.maps.OverlayView{constructor(t,e){super(),this._position=t,this._element=e}onAdd(){this.getPanes()?.floatPane.append(this._element)}draw(){const t=this.getProjection()?.fromLatLngToDivPixel(this._position);t&&(this._element.style.left=`${t.x}px`,this._element.style.top=`${t.y}px`)}onRemove(){this._element.remove()}},new Nt(t,e)}(_,this._labelElement(e,c,u,p));s.setMap(t),this._labels.push(s)}const f=c?6:5,g=c?4:2;this._polylines.push(new google.maps.Polyline({map:t,path:n,strokeColor:"#000000",strokeOpacity:.25,strokeWeight:f+3,zIndex:g-1,clickable:!1}),new google.maps.Polyline({map:t,path:n,strokeColor:c?o:r,strokeOpacity:1,strokeWeight:f,zIndex:g,clickable:!1,icons:c?Dt(o):void 0}))}),h.isEmpty())for(const t of["origin","destination"]){const s=e.attributes[t];s&&h.extend({lat:s.latitude,lng:s.longitude})}h.isEmpty()||(this._bounds=h,t.fitBounds(h,32))}_labelElement(t,e,s,i){const o=document.createElement("div");return o.classList.add("route-label"),o.classList.toggle("fastest",e),o.classList.toggle("delayed",t.delay>=300),lt(F`<ha-icon .icon=${s}></ha-icon>
        <div>
          <div class="time">${Bt(t.duration)} ${wt(i,"min")}</div>
          <div class="distance">${Gt(t.distance,i)} km</div>
        </div>`,o),o}get _colors(){return{fastest:mt(this._config?.fastest_color)??"#1a73e8",alternative:mt(this._config?.alternative_color)??"#8ab4f8"}}_colorStyle(){const{fastest:t,alternative:e}=this._colors;return`--drc-fastest-color: ${t}; --drc-alternative-color: ${e}`}render(){if(!this._config||!this.hass)return W;const t=this._entity,e=this._config.height??400,s=this.hass.language,{entity:i,api_key:o}=this._config;return F`
      <ha-card .header=${this._config.title} style=${this._colorStyle()}>
        ${this._error?F`<div class="warning">${this._error}</div>`:W}
        ${this._styleError?F`<div class="warning">${this._styleError}</div>`:W}
        ${this._authFailed?F`<div class="warning">${wt(s,"auth_failed")}</div>`:W}
        ${i?t?W:F`<div class="warning">${wt(s,"entity_missing")}: ${i}</div>`:F`<div class="hint">${wt(s,"no_entity")}</div>`}
        ${i&&!o?F`<div class="hint">${wt(s,"no_api_key")}</div>`:W}
        <div
          id="map"
          style=${this.isPanel?"":`height: ${e}px`}
          ?hidden=${!o}
        ></div>
        ${o?W:this._renderSketch(e)}
        ${this._config.show_legend??!0?this._renderLegend(s):W}
      </ha-card>
    `}_renderSketch(t){const e=this._config?.show_alternatives??!0,s=this._fastestIndex,i=this._routes.map(t=>t.polyline),o=e?Lt(i,s,400,250):Lt(i[s]?[i[s]]:[],0,400,250),r=o.lines.find(t=>t.fastest);return F`
      <svg
        class="sketch"
        style=${this.isPanel?"":`height: ${Math.min(t,250)}px`}
        viewBox="0 0 ${o.width} ${o.height}"
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        ${o.lines.map(t=>J`<path d=${t.d} class=${t.fastest?"line fastest":"line"}></path>`)}
        ${r?J`
              <circle class="endpoint start" cx=${r.start[0]} cy=${r.start[1]} r="6"></circle>
              <circle class="endpoint end" cx=${r.end[0]} cy=${r.end[1]} r="6"></circle>`:W}
      </svg>
    `}_renderLegend(t){const e=this._fastestIndex,s=this._config?.show_alternatives??!0,i=this._routes.map((t,e)=>({route:t,index:e})).filter(({index:t})=>s||t===e);return i.length?F`
      <ul class="legend">
        ${i.map(({route:s,index:i})=>F`
            <li class=${i===e?"fastest":""}>
              <span class="swatch"></span>
              <span class="name">${s.description||`${wt(t,"route")} ${i+1}`}</span>
              <span class="value">${Bt(s.duration)} ${wt(t,"min")}</span>
              <span class="value">${Gt(s.distance,t)} km</span>
              ${s.delay>=60?F`<span class="delay">+${Bt(s.delay)} ${wt(t,"min")}</span>`:W}
            </li>
          `)}
      </ul>
    `:W}}function Dt(t){const e=t=>({path:google.maps.SymbolPath.CIRCLE,scale:7,fillColor:t,fillOpacity:1,strokeColor:"#ffffff",strokeWeight:2});return[{icon:e("#ffffff"),offset:"0%"},{icon:e(t),offset:"100%"}]}zt.styles=n`
    #map {
      width: 100%;
    }
    ha-card {
      overflow: hidden;
    }
    /* Panel view: fill the view; map (or sketch) takes the space left by title, hints and legend. */
    :host([ispanel]) {
      display: block;
      height: 100%;
    }
    :host([ispanel]) ha-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    /* Leave room for the edit buttons HA shows below the card while editing. */
    :host([ispanel][editmode]) ha-card {
      height: calc(100% - 64px);
    }
    :host([ispanel]) #map,
    :host([ispanel]) .sketch {
      flex: 1 1 auto;
      min-height: 200px;
    }
    :host([ispanel]) .legend {
      flex: none;
    }
    /* Matches Google's own map controls. */
    .map-control {
      margin: 10px;
      padding: 0 17px;
      height: 40px;
      border: none;
      border-radius: 2px;
      background: #ffffff;
      color: #565656;
      box-shadow: rgba(0, 0, 0, 0.3) 0 1px 4px -1px;
      font: 18px Roboto, Arial, sans-serif;
      cursor: pointer;
    }
    .map-control[aria-pressed="true"] {
      color: #000000;
      font-weight: 500;
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
      stroke: var(--drc-alternative-color);
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .sketch .line.fastest {
      stroke: var(--drc-fastest-color);
      stroke-width: 6;
    }
    .sketch .endpoint {
      stroke: #ffffff;
      stroke-width: 2;
    }
    .sketch .start {
      fill: #ffffff;
      stroke: var(--drc-fastest-color);
    }
    .sketch .end {
      fill: var(--drc-fastest-color);
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
      background: var(--drc-alternative-color);
    }
    .fastest .swatch {
      background: var(--drc-fastest-color);
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
  `,t([_t({attribute:!1})],zt.prototype,"hass",void 0),t([_t({type:Boolean,reflect:!0})],zt.prototype,"isPanel",void 0),t([_t({type:Boolean,reflect:!0})],zt.prototype,"editMode",void 0),t([ft()],zt.prototype,"_config",void 0),t([ft()],zt.prototype,"_error",void 0),t([ft()],zt.prototype,"_authFailed",void 0),t([ft()],zt.prototype,"_trafficOn",void 0),t([ft()],zt.prototype,"_styleError",void 0);const jt=new Set(["HUI-CARD-OPTIONS","HUI-CARD-EDIT-MODE"]);function Bt(t){return String(Math.round(t/60))}function Gt(t,e){return(t/1e3).toLocaleString(e,{maximumFractionDigits:1})}if(!customElements.get(It)){customElements.define(It,zt);const t=new URL(import.meta.url).searchParams.get("v")??"dev";console.info(`%c DRIVE-ROUTE-CARD %c ${t} `,"color: white; background: #1a73e8; font-weight: 700","color: #1a73e8; background: white; font-weight: 700");(window.customCards??=[]).push({type:It,name:"Drive Route Card",description:"Shows the fastest route and alternatives between two zones.",preview:!0,documentationURL:"https://github.com/scheibome/drive-route-card"})}
