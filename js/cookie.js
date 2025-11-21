// 쿠키 설정 함수
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // 유효기간 (days일)
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

// 쿠키 가져오기 함수
function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  const key = name + "=";

  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(key) === 0) {
      return c.substring(key.length, c.length);
    }
  }
  return null;
}
