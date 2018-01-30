import Vue from 'vue';
import BaseMessage from './BaseMessage.vue';

const MessageConstructor = Vue.extend(BaseMessage);

let count = 0;
const messages = [];

const Message = function (option) {
  if (Vue.prototype.$isServer) return;

  const id = count++;
  option = option || {};
  option.onClose = () => {
    Message.removeMessage(id);
  };
  
  const message = new MessageConstructor({
    data: option
  });
  message.id = id;
  if (messages.length >= 5) {
    messages[0].close();
  }
  messages.push(message);
  message.$mount();
  document.body.appendChild(message.$el);
  message.show = true;
};

Message.removeMessage = function (id) {
  let idx;
  messages.some((ele, i) => {
    if (id === ele.id) {
      idx = i;
      return true;
    }
    return false;
  });
  messages.splice(idx, 1);
};

Message.closeAll = function () {
  messages.forEach(msg => {
    msg.close();
  });
};

export default Message;
