function bindMethods(obj) {
    let proto = Object.getPrototypeOf(obj);
    while (proto && proto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        const desc = Object.getOwnPropertyDescriptor(proto, key);
        if (typeof desc.value === 'function') {
          obj[key] = desc.value.bind(obj);
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
}

function setCookie(name, value, expireMinutes) {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + expireMinutes);
  
  const cookieValue = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString() + '; path=/';
  
  document.cookie = cookieValue;
}

function getCookie(name) {
  const cookieArray = document.cookie.split('; ');
  for (const cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}
  

  
module.exports = {
    bindMethods,
    setCookie,
    getCookie
};