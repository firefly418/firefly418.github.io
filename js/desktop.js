document.addEventListener("DOMContentLoaded", () => {
    const modules = document.querySelectorAll('.module');
    const scatterBtn = document.getElementById('scatter-btn');
    let zIndexCounter = 10;
    let activeModule = null;
    let startX, startY, initialLeft, initialTop;

    function scatterModules() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const padding = vw < 600 ? 16 : 40;
        const gap = 10;
        const maxRetries = 200;

        const moduleData = [];
        modules.forEach(mod => {
            if (mod.classList.contains('mod-profile')) {
                mod.style.left = `${padding}px`;
                mod.style.top = `${padding}px`;
                mod.dataset.rot = 0;
                mod.style.transform = 'rotate(0deg)';
                const rect = mod.getBoundingClientRect();
                moduleData.push({ mod, w: rect.width, h: rect.height, fixed: true });
                return;
            }
            const rect = mod.getBoundingClientRect();
            moduleData.push({ mod, w: rect.width, h: rect.height });
        });

        moduleData.sort((a, b) => (b.w * b.h) - (a.w * a.h));

        const placed = [];

        moduleData.forEach(({ mod, w, h, fixed }) => {
            if (fixed) {
                placed.push({ left: padding, top: padding, width: w, height: h });
                return;
            }
            let success = false;
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                const randomX = padding + Math.random() * Math.max(0, vw - w - padding * 2);
                const randomY = padding + Math.random() * Math.max(0, vh - h - padding * 2);

                let overlaps = false;
                for (const p of placed) {
                    if (
                        randomX < p.left + p.width + gap &&
                        randomX + w + gap > p.left &&
                        randomY < p.top + p.height + gap &&
                        randomY + h + gap > p.top
                    ) {
                        overlaps = true;
                        break;
                    }
                }

                if (!overlaps) {
                    mod.style.left = `${randomX}px`;
                    mod.style.top = `${randomY}px`;
                    const randomRot = (Math.random() - 0.5) * 8;
                    mod.dataset.rot = randomRot;
                    mod.style.transform = `rotate(${randomRot}deg)`;
                    placed.push({ left: randomX, top: randomY, width: w, height: h });
                    success = true;
                    break;
                }
            }

            if (!success) {
                const randomX = padding + Math.random() * Math.max(0, vw - w - padding * 2);
                const randomY = padding + Math.random() * Math.max(0, vh - h - padding * 2);
                mod.style.left = `${randomX}px`;
                mod.style.top = `${randomY}px`;
                const randomRot = (Math.random() - 0.5) * 8;
                mod.dataset.rot = randomRot;
                mod.style.transform = `rotate(${randomRot}deg)`;
                placed.push({ left: randomX, top: randomY, width: w, height: h });
            }
        });
    }

    setTimeout(scatterModules, 50);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(scatterModules, 200);
    });

    if (scatterBtn) scatterBtn.addEventListener('click', scatterModules);

    function startDrag(e, mod) {
        if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button') return;

        activeModule = mod;
        zIndexCounter++;
        mod.style.zIndex = zIndexCounter;

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        startX = clientX;
        startY = clientY;
        initialLeft = mod.offsetLeft;
        initialTop = mod.offsetTop;

        mod.classList.add('dragging');
        mod.style.transform = 'rotate(0deg) scale(1.02)';
    }

    function onDrag(e) {
        if (!activeModule) return;
        if (e.cancelable) e.preventDefault();

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        activeModule.style.left = `${initialLeft + (clientX - startX)}px`;
        activeModule.style.top = `${initialTop + (clientY - startY)}px`;
    }

    function stopDrag() {
        if (activeModule) {
            activeModule.classList.remove('dragging');
            const newRot = (Math.random() - 0.5) * 8;
            activeModule.dataset.rot = newRot;
            activeModule.style.transform = `rotate(${newRot}deg) scale(1)`;
            activeModule = null;
        }
    }

    document.addEventListener('mousemove', onDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);

    modules.forEach(mod => {
        mod.addEventListener('mousedown', (e) => startDrag(e, mod));
        mod.addEventListener('touchstart', (e) => startDrag(e, mod), { passive: false });
    });

    const clockTime = document.getElementById('clock-time');
    const clockDate = document.getElementById('clock-date');

    if (clockTime && clockDate) {
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

        function updateClock() {
            const now = new Date();
            const h = now.getHours();
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            const y = now.getFullYear();
            const mo = now.getMonth() + 1;
            const d = now.getDate();
            const w = weekDays[now.getDay()];

            clockTime.textContent = h + '时 ' + m + '分 ' + s + '秒';
            clockDate.textContent = y + '年 ' + mo + '月' + d + '日 ' + w;
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    const avatarWrap = document.getElementById('avatar-wrap');
    const avatarImg = document.getElementById('avatar-img');
    const avatarGif = document.getElementById('avatar-gif');

    if (avatarWrap && avatarImg && avatarGif) {
        avatarWrap.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            e.preventDefault();
            avatarGif.style.display = 'block';
            setTimeout(() => {
                avatarGif.style.display = 'none';
            }, 2000);
        });
    }
});