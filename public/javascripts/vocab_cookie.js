var vocabCookie = {
  set: function(value) {
    var expiry = new Date(new Date().getTime() + (1000*60*60*24*7*2));
    document.cookie = 'vocab=' + value + '; expires=' + expiry.toUTCString() + '; path=/';
  },
}
