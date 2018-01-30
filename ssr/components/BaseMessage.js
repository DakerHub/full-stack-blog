import Vue from 'vue';
import BaseMessage from './BaseMessage.vue';

const MessageConstructor = Vue.extend(BaseMessage);

let count = 0;
const messages = [];

const Message = function (option) {
  if (Vue.prototype.$isServer) return;
  
  const message = new MessageConstructor();
  message.$data.message = option.message;
  message.$mount();
  message.id = count++;
  messages.push(message);
  document.body.appendChild(message.$el);
};

export default Message;
