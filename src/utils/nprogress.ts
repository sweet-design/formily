import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.inc().configure({
  speed: 200,
  trickle: false,
  trickleSpeed: 200,
  showSpinner: false,
});

export default {
  start: () => {
    NProgress.start();
  },
  done: () => {
    NProgress.done(true);
  },
};
