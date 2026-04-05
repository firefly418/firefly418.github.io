// R18 确认页面逻辑
window.addEventListener('load', function() {
  const r18Confirm = document.getElementById('r18-confirm');
  const adultBtn = document.getElementById('adult-btn');
  const underageBtn = document.querySelector('.r18-btn.underage');

  // 未满18按钮点击事件
  underageBtn.addEventListener('click', function() {
    // 跳转到百度
    window.location.href = 'https://www.baidu.com';
  });

  // 已满18按钮点击事件
  adultBtn.addEventListener('click', function() {
    // 隐藏R18确认页面
    r18Confirm.style.display = 'none';
    // 调用全屏功能
    fullScreen();
  });
});

// 全屏功能
function fullScreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen().then(() => hideFullscreenButton()).catch(() => showFullscreenButton());
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen().then(() => hideFullscreenButton()).catch(() => showFullscreenButton());
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen().then(() => hideFullscreenButton()).catch(() => showFullscreenButton());
  } else {
    showFullscreenButton();
  }
}

// 显示全屏按钮
function showFullscreenButton() {
  let fullscreenBtn = document.getElementById('fullscreen-btn');
  if (!fullscreenBtn) {
    fullscreenBtn = document.createElement('button');
    fullscreenBtn.id = 'fullscreen-btn';
    fullscreenBtn.innerHTML = '🔲 进入全屏';
    fullscreenBtn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 16px;
      background: #ff0000;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      z-index: 1000;
    `;
    fullscreenBtn.onclick = fullScreen;
    document.body.appendChild(fullscreenBtn);
  }
  fullscreenBtn.style.display = 'block';
}

// 隐藏全屏按钮
function hideFullscreenButton() {
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.style.display = 'none';
  }
}

// 监听全屏状态变化
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    // 退出全屏时显示按钮
    showFullscreenButton();
  }
}

// 流畅拖动
let win = document.getElementById('window');
let bar = document.getElementById('titlebar');
let isDrag = false, x, y;

bar.addEventListener('mousedown', (e) => {
  isDrag = true;
  x = e.clientX - win.offsetLeft;
  y = e.clientY - win.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (!isDrag) return;
  win.style.left = e.clientX - x + 'px';
  win.style.top = e.clientY - y + 'px';
});

document.addEventListener('mouseup', () => isDrag = false);

// 倒计时
let sec = 3600;
setInterval(() => {
  sec--;
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  document.getElementById('time').innerText = `${m}:${s}`;
}, 1000);

// 密钥错误提示
const input = document.querySelector('.decrypt-input');
const btn = document.querySelector('.decrypt-btn');
const err = document.getElementById('error');

function showError() {
  err.innerText = '密钥错误，请输入正确的解密密钥！';
  setTimeout(() => err.innerText = '', 1000);
}

btn.onclick = showError;
input.onkeydown = (e) => {
  if (e.key === 'Enter') showError();
};