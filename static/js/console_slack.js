var styles = {
  h1: "color: #336699; font-weight: bold; font-size:24px;",
  h2: "color: #336699; font-weight: bold;font-size:16px;",
  name: "color: #336699; font-weight:bold; font-size:16px;margin-left:10px;display:block;",
  text: "color: #336699;font-size:14px;",
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
    ConsoleChat.log('Hi there, welcome to FedsOnSlack.com!', "h1");
    ConsoleChat.log('The console here is interactive and you can actually chat with our community directly from here!');
    ConsoleChat.log('Type login("YOUR_USERNAME") to see it in action. (hint: use gravatar email as your nick for avatars)');
  },
  login: function(){
    if(ConsoleChat.is_loggedin){
      console.error("Bugger off, you're already logged in!");
      return false
    }

    ConsoleChat.inbox = io.connect('//' + document.domain + ':' + location.port + '/receive');
    ConsoleChat.outbox = io.connect('//' + document.domain + ':' + location.port + '/submit');

    ConsoleChat.inbox.on("message", function (message) {
      ConsoleChat.speak(message)
    });

    ConsoleChat.outbox.on("rtm_connected", function () {
      ConsoleChat.is_loggedin = true;
      ConsoleChat.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nYou are now connected to fedsonslack.com #console channel!");
      console.log("%cType %csay%c to speak with others.",styles.text, styles.h2, styles.text)
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
  ConsoleChat.login(ConsoleChat.username)
};
login.toString = function(username){
  ConsoleChat.login(); return " ";
};
say = function(message){
  ConsoleChat.outbox.send(JSON.stringify({username: ConsoleChat.username, text: text}));
};say.toString = function(){
  text = prompt("");
  if(!text){return ""}
  ConsoleChat.outbox.send(JSON.stringify({username: ConsoleChat.username, text: text}));
  return ""
}
//ConsoleChat.login()

