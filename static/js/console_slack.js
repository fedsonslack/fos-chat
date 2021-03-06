/*! console.js v0.0.1 */
Array.prototype.forEach||(Array.prototype.forEach=function(a){"use strict";if(void 0===this||null===this)throw new TypeError;var b=Object(this),c=b.length>>>0;if("function"!=typeof a)throw new TypeError;for(var d=arguments.length>=2?arguments[1]:void 0,e=0;c>e;e++)e in b&&a.call(d,b[e],e,b)}),Array.prototype.map||(Array.prototype.map=function(a){"use strict";if(void 0===this||null===this)throw new TypeError;var b=Object(this),c=b.length>>>0;if("function"!=typeof a)throw new TypeError;for(var d=new Array(c),e=arguments.length>=2?arguments[1]:void 0,f=0;c>f;f++)f in b&&(d[f]=a.call(e,b[f],f,b));return d});var Console=function(){function a(a,b){if(d.console&&(b=Array.prototype.slice.call(b),b=Console.styles.argumentsToConsoleArguments(b),d.consoleGroups||"groupEnd"!==a)){if(consoleMethodReferences[a]||(a="log"),d.consoleApply)return consoleMethodReferences[a].apply(g,b);var c=b.join(" ");return c.match("<STYLES:UNSUPPORTED>")?"<STYLES:UNSUPPORTED>":consoleMethodReferences[a](b.join(" "))}}function b(a){for(var b="",c=0;f>c;c++)b+="-";b&&(a=a.splice(0,0,b))}var c={};c.isFirefox=/firefox/i.test(navigator.userAgent),c.isIE=document.documentMode;var d={};d.consoleApply=!c.isIE||document.documentMode&&document.documentMode>9,d.functionGetters=d.consoleApply,d.console=!!window.console,d.modifiedConsole=!c.isIE&&d.console&&-1!==console.log.toString().indexOf("apply"),d.consoleStyles=!window.isIE||!(!c.isFirefox||!d.modifiedConsole),d.consoleGroups=!(!window.console||!console.group);var e=["log","group","groupCollapsed","groupEnd","warn","info"],f=0;d.console||(window.console={});var g=window.console;return consoleMethodReferences={},e.forEach(function(a){g[a]&&(consoleMethodReferences[a]=g[a])}),c.isFirefox&&!d.modifiedConsole&&(d.consoleGroups=!1,d.consoleApply=!0),{log:function(){return a("log",arguments)},group:function(){var c=Array.prototype.slice.call(arguments);return f++,d.consoleGroups||b(c),a("group",c)},groupCollapsed:function(){var c=Array.prototype.slice.call(arguments);return f++,d.consoleGroups||b(c),a("groupCollapsed",c)},groupEnd:function(){return f--,a("groupEnd",arguments)},warn:function(){return a("warn",arguments)},info:function(){return a("info",arguments)},attach:function(){e.forEach(function(a){d.console?(window.console["_"+a]=consoleMethodReferences[a],window.console[a]=this[a]):window.console[a]=function(){}},this)},detach:function(){d.console?e.forEach(function(a){delete window.console["_"+a],window.console[a]=consoleMethodReferences[a]},this):delete window.console},support:d,consoleMethodReferences:consoleMethodReferences,getFileAndLineNumber:function(a,b){var c=new Console.Stack,d=c.getLineByCaller(a,b);return d?d.fileName+":"+d.lineNumber+" ":""}}}();Console.styles=function(){function a(){k=!0}function b(){if("object"==typeof arguments[0]){var a=arguments[0];for(var b in a){if(!a.hasOwnProperty(b))return;c(b,a[b])}}else c(arguments[0],arguments[1])}function c(a,b){function c(){return d(this.toString(),a)}j[a]=b,k&&(Object.defineProperty&&Console.support.functionGetters?Object.defineProperty(String.prototype,a,{get:c}):String.prototype.__defineGetter__?String.prototype.__defineGetter__(a,c):String.prototype[a]="<STYLES:UNSUPPORTED>")}function d(a,b){return Console.support.consoleStyles&&b.split(",").forEach(function(b){var c=j[b];a=g.test(a)?a.replace(g,function(a,b){return b.match(c)?a:a.replace(h,'<span style="'+b+c+';">')}):'<span style="'+c+';">'+a+"</span>"}),a}function e(a){var b=[];return a=a.replace(i,function(a){var c=a.match(h);return b.push(c?c[1]:""),"%c"}),[a].concat(b)}function f(a){var b=[];return a.forEach(function(a){"string"==typeof a?b=b.concat(e(a)):b.push(a)}),b}var g=/^<span style="([^"]+)">.+<\/span>$/,h=/^<span style="([^"]+)">/,i=/<span style="[^"]+">|<\/span>/g,j={},k=!1;return{attach:a,format:d,register:b,argumentsToConsoleArguments:f}}(),Console.Stack=function(a){this._stackString=a||(new Error).stack||""},Console.Stack.prototype={_geckoStackWithMethodNameRegExp:/\b([a-z0-9_-]+)@.*\/([^\/]*)\:(\d*)$/i,_geckoStackWithoutMethodName:/@.*\/([^\/]+)\:(\d*)$/i,_webkitStackWithMethodNameRegExp:/.+\b([a-z0-9_-]+) \(.*\/([^\/]*)\:(\d*)\:(\d+)\)$/i,_webkitStackWithoutMethodName:/at .*\/([^\/]*)\:(\d*)\:(\d+)/i,parse:function(){var a=this._stackString;return a=a.split("\n"),a=a.slice(1),a=a.map(function(a){return this._parseStackLine(a)},this),a||null},_parseStackLine:function(a){var b,c=navigator.userAgent;return c.match(/Webkit/i)?b=this._webkitParseStackLine(a):c.match(/Gecko/i)&&(b=this._geckoParseStackLine(a)),b||{string:a}},_geckoParseStackLine:function(a){var b;return this._geckoStackWithMethodNameRegExp.test(a)?(b=a.match(this._geckoStackWithMethodNameRegExp),{methodName:b[1],fileName:b[2],lineNumber:b[3]}):this._geckoStackWithoutMethodName.test(a)?(b=a.match(this._geckoStackWithoutMethodName),{fileName:b[1],lineNumber:b[2]}):void 0},_webkitParseStackLine:function(a){var b;return this._webkitStackWithMethodNameRegExp.test(a)?(b=a.match(this._webkitStackWithMethodNameRegExp),{methodName:b[1],fileName:b[2],lineNumber:b[3],columnNumber:b[4]}):this._webkitStackWithoutMethodName.test(a)?(b=a.match(this._webkitStackWithoutMethodName),{fileName:b[1],lineNumber:b[2],columnNumber:b[3]}):void 0},getLineByCaller:function(a,b){b=b||0;var c=this.parse();if(!c)return"";for(var d=0;d<c.length;d++)if(c[d]&&a===c[d].methodName)return c[d+b];return null}};

Console.attach();
Console.styles.attach();

Console.styles.register({
    h1: 'color: #E21565; font-weight: bold; font-size:24px;',
    h2: "color: #E21565; font-weight: bold;font-size:16px;",
    name: "color: #E21565; font-weight:bold; font-size:16px;margin-left:10px;display:block;",
    text: 'color:#E21565; font-size:16px;',
    bold: 'font-weight:bold;font-size:16px;',
    underline: 'text-decoration:underline',

    red: 'color:#E21565',
    yellow: 'color:rgb(234, 168, 35);font-size:16px;',
    green: 'color:green',
    grey: 'color:grey',

    code: 'background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1); line-height: 18px; text-decoration:underline;'
});

var styles = {
  name: "color: #E21565; font-weight:bold; font-size:16px;margin-left:10px;display:block;",
  text: "color: #E21565;font-size:14px;",
  profile_pic: function (profile_pic) {
    return 'background-image: url("'+profile_pic+'"); background-size: cover; font-size:18px;';
  }
};

ConsoleChat = {
  log : function (text, style) {
    style = style || "text";
    console.log('%c ' + text, styles[style])
  },
  speak : function(message){
    if(message.real_name == "bot"){
      message.real_name = (message.username == ConsoleChat.username) ? "You" : message.username ;
    }
    console.log("%c  %c" + message.real_name + ": %c" + message["text"], styles.profile_pic(message.profile.image_32), styles.name, styles.text)
  },
  init: function () {
    console.log('Hi there, welcome to FedsOnSlack.com!'.h1);
    console.log("The console here is".text +" interactive ".yellow.bold + "and you can actually chat with our community directly from here!".text);
    console.log("Type login('".text + "YOUR_EMAIL_OR_NICKNAME".yellow.bold + "') to see it in action. (hint: use gravatar email as your nick for avatars)".text);
  },
  login: function(){
    if(ConsoleChat.is_loggedin){
      console.error("Bugger off, you're already logged in!");
      return false
    }
    var url;
    if(location.host.indexOf("fedsonslack.com") > -1){
      url = "//fos-chat.herokuapp.com:80"
    }else{
      url = '//' + document.domain + ':' + location.port
    }
    ConsoleChat.inbox = io.connect(url + '/receive');
    ConsoleChat.outbox = io.connect(url + '/submit');

    ConsoleChat.inbox.on("message", function (message) {
      ConsoleChat.speak(message)
    });

    ConsoleChat.outbox.on("rtm_connected", function (data) {
      ConsoleChat.is_loggedin = true;
      var members = "" + data.members;
      var connections = "" + data.connections;
      console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nYou are now connected to fedsonslack.com ".text + "#open_chat ".bold+ "channel!".text);
      console.log(members.bold +" members in channel and ".text + connections.bold + " visitors just like you!".text);
      console.log("Use".text + " say(\"\") ".bold.yellow + "to speak with others!".text)
    });

    return "Hang on, connecting you to slack"
  }
};

ConsoleChat.init();
login = function (username) {
  if(typeof username !== "string" || username.length == 0){
    console.error('Please use a good nickname!')
  }
  ConsoleChat.username = username;
  ConsoleChat.login(ConsoleChat.username);
  return "Ok, hang on, connecting you to fedsonslack #open_chat channel"
};
login.toString = function(username){
  ConsoleChat.login(); return " ";
};
say = function(text){
  ConsoleChat.outbox.send(JSON.stringify({username: ConsoleChat.username, text: text}));
  return ""
};say.toString = function(){
  text = prompt("");
  if(!text){return ""}
  ConsoleChat.outbox.send(JSON.stringify({username: ConsoleChat.username, text: text}));
  return ""
};

