(function () {
  if (window.webxdc) {
    return;
  }

  window.webxdc = {
    __isFallback: true,
    sendToChat() {
      return Promise.reject(new Error('sendToChat is only available inside a webxdc host.'));
    }
  };
})();