(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["create"],{4042:function(e,t,n){"use strict";var a=n("a2e5"),s=n.n(a);s.a},a2e5:function(e,t,n){},d879:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app"},[n("header",{staticClass:"navbar navbar-default",attrs:{id:"header"}},[n("div",{staticClass:"container-fluid header"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-sm-3 col-xs-12 navbar-header header--logo"},[n("h3",[n("router-link",{attrs:{to:{name:"home"}}},[e._v("Lucky Airdrop")])],1)]),n("div",{staticClass:"col-sm-6 hidden-xs header--thor-info"},[n("div",{staticClass:"header--thor-info--wrap text-center"},[n("div",[n("strong",[e._v("Account: ")]),n("span",[n("a",{attrs:{href:e.accountLink,target:"_blank"}},[e._v(e._s(e.account))])])]),e._v(" |\n            "),n("div",[n("strong",[e._v("Balance: ")]),e._v(e._s(e.balance)+" "+e._s(e.tokenName))])])])])])]),n("div",{staticClass:"container"},[e.account?n("div",[n("div",{staticClass:"container-fluid create-form",attrs:{id:"content-area"}},[e.hasErr?n("div",{staticClass:"alert envelope-alert"},[n("b",[e._v("Please correct the following error(s):")]),n("ul",e._l(e.errors,function(t,a){return n("li",{key:a},[e._v(e._s(t))])}),0)]):e._e(),e.created?n("div",[n("ShareCard",{attrs:{shareLink:e.shareLink}}),n("RedPacketInfo",{attrs:{visitor:e.envelope.creator,tokenName:e.tokenName,envelope:e.envelope}})],1):n("div",{staticClass:"container-fluid envelope-container envelope-container--create"},[n("div",{staticClass:"envelope--title"},[n("h4",[e._v("Create Your Red Envelope")])]),n("hr"),n("div",{staticClass:"envelope--content"},[n("div",{staticClass:"envelope--field"},[n("div",{staticClass:"envelope--input"},[n("div",{staticClass:"input-group"},[n("select",{directives:[{name:"model",rawName:"v-model",value:e.tokenName,expression:"tokenName"}],on:{change:[function(t){var n=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){var t="_value"in e?e._value:e.value;return t});e.tokenName=t.target.multiple?n:n[0]},e.onTokenChange]}},[n("option",{attrs:{value:"VET",selected:""}},[e._v("VET")]),n("option",{attrs:{value:"VTHO"}},[e._v("VTHO")]),n("option",{attrs:{value:"OCE"}},[e._v("OCE")]),n("option",{attrs:{value:"PLA"}},[e._v("PLA")]),n("option",{attrs:{value:"TIC"}},[e._v("TIC")])])])])])]),n("div",{staticClass:"envelope--content"},[n("div",{staticClass:"envelope--field"},[n("div",{staticClass:"envelope--input"},[n("div",{staticClass:"input-group"},[n("div",{staticClass:"input-addon"},[0==e.envelope.envelopeType?n("label",{attrs:{for:"amount"}},[e._v("Amount Each")]):1==e.envelope.envelopeType?n("label",{attrs:{for:"amount"}},[e._v("Total")]):e._e()]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.envelope.amount,expression:"envelope.amount"}],staticClass:"right-align",attrs:{id:"amount",type:"number",min:"0.006",placeholder:"1.0",value:"1.0"},domProps:{value:e.envelope.amount},on:{input:function(t){t.target.composing||e.$set(e.envelope,"amount",t.target.value)}}}),n("div",{staticClass:"input-addon"},[n("label",{attrs:{for:"amount"}},[e._v(e._s(e.tokenName))])])])]),0==e.envelope.envelopeType?n("p",[e._v("Identical Amount.\n                "),n("a",{on:{click:function(t){return e.togglePacketType()}}},[e._v("Change to Random Amount")])]):1==e.envelope.envelopeType?n("p",[e._v("Random Amount.\n                "),n("a",{on:{click:function(t){return e.togglePacketType()}}},[e._v("Change to Identical Amount")])]):e._e(),n("div",{staticClass:"envelope--input--disclaimer"},[n("p",[e._v("0.5% of the total is the tip. No tip for X Node holders.")])])])]),n("div",{staticClass:"envelope--content"},[n("div",{staticClass:"envelope--field"},[n("div",{staticClass:"envelope--input"},[n("div",{staticClass:"input-group"},[n("div",{staticClass:"input-addon"},[n("label",{attrs:{for:"quantity"}},[e._v("Quantity")])]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.envelope.claimers,expression:"envelope.claimers"}],staticClass:"right-align",attrs:{id:"quantity",type:"number",step:"1",min:"1",max:"100",placeholder:"Enter number",value:"1"},domProps:{value:e.envelope.claimers},on:{input:function(t){t.target.composing||e.$set(e.envelope,"claimers",t.target.value)}}})])]),n("p",[e._v("Enter the number of members between 1 and 100")])])]),n("div",{staticClass:"envelope--content"},[n("div",{staticClass:"envelope--field"},[n("div",{staticClass:"envelope--input"},[n("div",{staticClass:"input-group"},[n("textarea",{directives:[{name:"model",rawName:"v-model",value:e.envelope.message,expression:"envelope.message"}],attrs:{placeholder:"Best wishes 🐶"},domProps:{value:e.envelope.message},on:{input:function(t){t.target.composing||e.$set(e.envelope,"message",t.target.value)}}})])])]),n("div",{staticClass:"envelope--field"},[n("div",{staticClass:"envelope--input"},[n("div",{staticClass:"input-group"},[n("div",{staticClass:"input-addon"},[n("label",{attrs:{for:"sender"}},[e._v("From: ")])]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.envelope.nickname,expression:"envelope.nickname"}],attrs:{type:"text",name:"sender",placeholder:"Anonymous"},domProps:{value:e.envelope.nickname},on:{input:function(t){t.target.composing||e.$set(e.envelope,"nickname",t.target.value)}}})])])]),n("div",{staticClass:"envelope--input--disclaimer"},[n("p",[e._v("+ "+e._s(e.claimVTHO)+" VTHO fee")]),n("p",[e._v("This is used to pay for the transaction fee when your recipient claims the envelope.")])])]),n("div",{staticClass:"envelope--buttons"},[n("div",{staticClass:"envelope--buttons-row"},[n("div",{staticClass:"envelope--create-button"},[e._v(" ")]),n("button",{staticClass:"btn btn-env",attrs:{disabled:e.isCreating},on:{click:function(t){return e.createEnvelope()}}},[e._v(e._s(e.isCreating?"Creating..."+e.counter:"Create"))])])]),n("div",{staticClass:"envelope--input--disclaimer"},[n("p",[n("span",[e._v("You understand that you are using free software, provided under "),n("a",{attrs:{href:"https://mit-license.org/",target:"_blank"}},[e._v("MIT License")]),e._v(", at your own risk.")])])])])])]):n("CertModal")],1)])},s=[],o=n("2717"),i=(n("48fb"),n("1f10")),r=n.n(i),c=n("025e"),l=n("39b2"),u=n("81fc"),p=n("7886"),v=n("0d1e"),d=n.n(v),h=new d.a({host:"ipfs.infura.io",port:5001,protocol:"https"}),m=200,f={name:"Create",components:{CertModal:l["default"],ShareCard:u["a"],RedPacketInfo:p["a"]},beforeCreate:function(){var e=this;if(window.connex){var t=connex.vendor.sign("cert");t.request({purpose:"identification",payload:{type:"text",content:"Confirm that you would like this site to access your account"}}).then(function(t){e.account=t.annex.signer,e.accountLink=e.$config.accountBaseUrl+"/accounts"+e.account,e.onTokenChange()})}else location.href="https://env.vechain.org/r/#"+encodeURIComponent(location.href)},mounted:function(){this.$ticker=connex.thor.ticker()},destroyed:function(){this.$ticker=null,clearInterval(this.cTicker)},data:function(){return{showMsg:!1,hasErr:!1,errors:[],isCreating:!1,account:"",accountLink:"",tokenName:"VET",balance:"",created:!1,secretWallet:{},shareLink:"",counter:20,cTicker:null,envelope:{id:null,envelopeType:0,nickname:"",amount:1,claimers:10,duration:86400,initialBalance:"",message:"",messageLink:"",tokenAddress:"0x0000000000000000000000000000000000000000"}}},computed:{claimVTHO:function(){return m*this.envelope.claimers}},methods:{onTokenChange:function(){var e=this;if(this.balance="0",this.account){var t=this.$config.tokens[this.tokenName];if(this.envelope.tokenAddress=t,t){var n={constant:!0,inputs:[{name:"_owner",type:"address"}],name:"balanceOf",outputs:[{name:"balance",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"};connex.thor.account(t).method(n).call(this.account).then(function(t){e.balance=new r.a(t.decoded.balance).dividedBy(Math.pow(10,18)).toFixed(2)}).catch(function(t){console.error(t),e.errors=["fail to connect the blockchain network"],e.hasErr=!0})}else{this.envelope.tokenAddress="0x0000000000000000000000000000000000000000";var a=connex.thor.account(this.account);a.get().then(function(t){e.balance=new r.a(t.balance,16).dividedBy(Math.pow(10,18)).toFixed(2)}).catch(function(t){console.error(t),e.errors=["fail to connect the blockchain network"],e.hasErr=!0})}}},togglePacketType:function(){this.envelope.envelopeType=0==this.envelope.envelopeType?1:0},checkForm:function(){this.hasErr=!1,this.errors=[];var e=this.envelope;e.amount||this.errors.push("Amount: can not be empty"),this.calcAmountInEther().gt(1e6)&&this.errors.push("Total: must be less than 100W"),(e.claimers<0||e.claimers>100)&&this.errors.push("Quantity: must be between 1 and 100"),e.message.length>260&&this.errors.push("Message: must be less than 260 characters");var t=new r.a(this.balance);return t.isLessThanOrEqualTo(this.calcAmountInEther())&&this.errors.push("Balance: insufficient balance"),e.nickname.length>64&&this.errors.push("Nickname: must be less than 64 characters"),this.hasErr=this.errors.length>0,!this.hasErr},createEnvelope:function(){var e=this;this.checkForm()&&(this.created=!1,this.isCreating=!0,this.envelope.initialBalance=this.calcAmountInEther().toString(10),this.secretWallet=c["a"].createWallet(),this.cTicker=setInterval(this.refreshCounter,1e3),this.envelope.message?h.add(this.envelope.message).then(function(t){e.envelope.messageLink=t}).catch(function(t){console.error(t),e.errors=["Upload message failed!"],e.hasErr=!0}).then(function(){return e.sendCreateTx()}):this.sendCreateTx())},calcAmountInEther:function(){var e=0==this.envelope.envelopeType?this.envelope.amount*this.envelope.claimers:this.envelope.amount;return new r.a(e)},buildCreateClauses:function(){var e=this.envelope,t={constant:!1,inputs:[{name:"_envelopeType",type:"uint8"},{name:"_nickname",type:"string"},{name:"_duration",type:"uint64"},{name:"_messageLink",type:"string"},{name:"_maxClaims",type:"uint64"},{name:"_secretSigner",type:"address"}],name:"newEnvelope",outputs:[],payable:!0,stateMutability:"payable",type:"function"},n={constant:!1,inputs:[{name:"_envelopeType",type:"uint8"},{name:"_amount",type:"uint256"},{name:"_nickname",type:"string"},{name:"_duration",type:"uint64"},{name:"_messageLink",type:"string"},{name:"_maxClaims",type:"uint64"},{name:"_secretSigner",type:"address"},{name:"_tokenAddr",type:"address"}],name:"newVIP180Envelope",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},a=connex.thor.account(this.$config.contract),s=[],i=86400,r=this.calcAmountInEther(),c=r.multipliedBy(Math.pow(10,18));if("VET"==this.tokenName){var l=a.method(t).value(c.toString(10)).asClause(e.envelopeType,e.nickname,i,e.messageLink,e.claimers,this.secretWallet.address);s.push(Object(o["a"])({comment:"Create Your Red Envelope"},l))}else{var u=connex.thor.account(this.$config.tokens[this.tokenName]),p={constant:!1,inputs:[{name:"_spender",type:"address"},{name:"_value",type:"uint256"}],name:"approve",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},v=u.method(p).asClause(this.$config.contract,c.toString(10));s.push(Object(o["a"])({comment:"Approve Envelope Contract ".concat(r.toString(10)," ").concat(this.tokenName)},v));var d=a.method(n).asClause(e.envelopeType,c.toString(10),e.nickname,i,e.messageLink,e.claimers,this.secretWallet.address,e.tokenAddress);s.push(Object(o["a"])({comment:"Create Your Red Envelope"},d))}return s},buildEnergyClause:function(){var e={constant:!1,inputs:[{name:"_to",type:"address"},{name:"_amount",type:"uint256"}],name:"transfer",outputs:[{name:"success",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"},t=connex.thor.account(this.$config.tokens["VTHO"]).method(e),n=m*this.envelope.claimers,a=new r.a(n).multipliedBy(Math.pow(10,18)).toString(10);return Object(o["a"])({comment:"Pay ".concat(n," VTHO for your claimers")},t.asClause(this.secretWallet.address,a))},sendCreateTx:function(){var e=this,t=connex.vendor.sign("tx"),n=this.buildCreateClauses(),a=this.buildEnergyClause();return t.gas(5e5).signer(this.account).request(n.concat(a)).then(function(t){return e.getReceipt(t.txid).then(function(t){if(e.isCreating=!1,t.reverted)return e.errors=["transaction has been reverted"],void(e.hasErr=!0);var n=e.findCreateEvent(t),a=n.topics[1];console.log("Red Envelope Id:",a),e.envelope.id=parseInt(a),e.shareLink=window.location.origin+e.$config.pathPrefix+"/#/claim/".concat(e.envelope.id,"/").concat(btoa(e.secretWallet.privateKey)),localStorage.setItem("shareLink#".concat(e.envelope.id),e.shareLink),e.created=!0})}).catch(function(t){console.error(t),e.isCreating=!1,e.errors=["It seems you rejected the transaction. Try again?"],e.hasErr=!0})},getReceipt:function(e){var t=this;return this.$ticker.next().then(function(){return connex.thor.transaction(e).getReceipt().then(function(n){return n||t.getReceipt(e)})}).catch(function(e){console.error(e),t.errors=["fail to create the envelope"],t.hasErr=!0})},findCreateEvent:function(e){for(var t=0;t<e.outputs.length;t++)for(var n=e.outputs[t],a=0;a<n.events.length;a++)if(n.events[a].address==this.$config.contract)return n.events[a]},refreshCounter:function(){0==this.counter&&(this.counter=20),this.counter--}}},g=f,C=(n("4042"),n("17cc")),y=Object(C["a"])(g,a,s,!1,null,"7117424a",null);t["default"]=y.exports}}]);
//# sourceMappingURL=create.c1d134e0.js.map