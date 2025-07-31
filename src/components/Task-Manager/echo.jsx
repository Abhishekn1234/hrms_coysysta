import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'dd4a66b3ccfdbbd6e861',
  cluster: 'ap2',
  forceTLS: true,
  encrypted: true,
});

export default echo;
