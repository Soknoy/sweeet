/**
 * 💜 Romantic Date Invitation — script.js
 * Modular vanilla JavaScript — no frameworks, no dependencies.
 */

/* ═══════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════ */
const PERSON_NAME = 'Name';

const state = {
  currentScreen: 1,
  food:          null,
  activity:      null,
  date:          null,
  time:          null,
};

const SCREEN_IDS = {
  1: 'screen-welcome',
  2: 'screen-question',
  3: 'screen-food',
  4: 'screen-activity',
  5: 'screen-calendar',
  6: 'screen-time',
  7: 'screen-final',
};

let handleQuestionScreenEnter = () => {};

function getPersonName() {
  return PERSON_NAME.trim();
}

function applyPersonName() {
  const name = getPersonName();
  const questionTitle = document.getElementById('question-title');
  const finalTitle = document.getElementById('final-title');
  const finalMessage = document.getElementById('final-message');

  if (questionTitle) {
    questionTitle.textContent = name
      ? `${name}, would you go on a date with me?`
      : 'Would you go on a date with me?';
  }

  if (finalTitle) {
    finalTitle.textContent = name ? `It's a Date, ${name}!` : "It's a Date!";
  }

  if (finalMessage) {
    finalMessage.textContent = name
      ? `I can't wait to spend this special day with you, ${name} ❤️`
      : "I can't wait to spend this special day with you ❤️";
  }
}

/* ═══════════════════════════════════════════════════════════
   SCREEN MANAGER
   ═══════════════════════════════════════════════════════════ */
function transitionTo(targetNum){

    if(targetNum===state.currentScreen) return;

    const current=document.getElementById(
        SCREEN_IDS[state.currentScreen]
    );

    const next=document.getElementById(
        SCREEN_IDS[targetNum]
    );

    current.classList.add("is-exiting");

    next.classList.add(
        "is-active",
        "is-entering"
    );

    requestAnimationFrame(()=>{

        requestAnimationFrame(()=>{

            next.classList.remove("is-entering");

        });

    });

    current.addEventListener("transitionend",function handler(e){

        if(e.propertyName!=="opacity") return;

        current.classList.remove(
            "is-active",
            "is-exiting"
        );

        current.removeEventListener(
            "transitionend",
            handler
        );

    });

    state.currentScreen=targetNum;

    onScreenEnter(targetNum);

}

function onScreenEnter(num) {
  switch (num) {
    case 2: handleQuestionScreenEnter(); break;
    case 7: populateFinal(); launchCelebration(); break;
  }
}

/* ═══════════════════════════════════════════════════════════
   RIPPLE EFFECT (shared)
   ═══════════════════════════════════════════════════════════ */
function addRipple(btn, e) {
  const existing = btn.querySelector('.ripple');
  if (existing) existing.remove();
  const circle = document.createElement('span');
  circle.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
  const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;
  circle.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
  btn.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove(), { once: true });
}

/* Attach ripple to any .btn */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('pointerdown', e => addRipple(btn, e));
});

applyPersonName();

/* ═══════════════════════════════════════════════════════════
   PARTICLE CANVAS BACKGROUND
   ═══════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let W, H, raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 2 + .5,
      dx:    (Math.random() - .5) * .35,
      dy:    -(Math.random() * .5 + .15),
      alpha: Math.random() * .5 + .1,
      color: ['#e9d5ff','#c084fc','#fbcfe8','#f9a8d4','#ffffff'][Math.floor(Math.random()*5)],
    };
  }

  function initParticleArray() {
    particles = Array.from({ length: 90 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  resize();
  initParticleArray();
  draw();
  window.addEventListener('resize', () => { resize(); });
})();

/* ═══════════════════════════════════════════════════════════
   FLOATING HEARTS
   ═══════════════════════════════════════════════════════════ */
(function initFloatingHearts() {
  const container = document.getElementById('hearts-container');
  const symbols   = ['❤️','💜','💖','💕','💗','🩷'];

  function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 1.2 + .8}rem;
      --dur: ${Math.random() * 6 + 6}s;
      --delay: ${Math.random() * 4}s;
      --drift: ${(Math.random() - .5) * 80}px;
    `;
    container.appendChild(heart);
    // Remove after 2 animation cycles to keep DOM lean
    setTimeout(() => heart.remove(), 24000);
  }

  // Initial batch
  for (let i = 0; i < 14; i++) {
    setTimeout(spawnHeart, i * 600);
  }
  // Continuous
  setInterval(spawnHeart, 1800);
})();

/* ═══════════════════════════════════════════════════════════
   SPARKLES
   ═══════════════════════════════════════════════════════════ */
(function initSparkles() {
  const container = document.getElementById('sparkles-container');
  const colors    = ['#e9d5ff','#c084fc','#fbcfe8','#ffffff','#f9a8d4'];

  function spawnSparkle() {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const size = Math.random() * 5 + 3;
    s.style.cssText = `
      left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --dur: ${Math.random() * 2 + 1.5}s;
      --delay: ${Math.random() * 3}s;
      border-radius: ${Math.random() > .5 ? '50%' : '2px'};
    `;
    container.appendChild(s);
    setTimeout(() => s.remove(), 6000);
  }

  for (let i = 0; i < 20; i++) setTimeout(spawnSparkle, i * 300);
  setInterval(spawnSparkle, 900);
})();

/* ═══════════════════════════════════════════════════════════
   SCREEN 1 — WELCOME
   ═══════════════════════════════════════════════════════════ */
(function initWelcome() {
  const titleEl  = document.getElementById('welcome-title');
  const btn      = document.getElementById('welcome-btn');
  const fullText = titleEl.textContent;

  // Typewriter
  titleEl.textContent = '';
  let index = 0;

  function type() {
    if (index < fullText.length) {
      titleEl.textContent += fullText[index++];
      setTimeout(type, 52);
    } else {
      titleEl.classList.add('done'); // stop cursor blink
      showBtn();
    }
  }

  function showBtn() {
    setTimeout(() => {
      btn.classList.remove('btn-hidden');
      btn.classList.add('visible');
    }, 400);
  }

  setTimeout(type, 400);

  // Continue → Screen 2
  btn.addEventListener('click', e => {
    addRipple(btn, e);
    transitionTo(2);
  });

  // Welcome mini hearts from card
  spawnCardHearts('screen-welcome');
})();

function spawnCardHearts(screenId) {
  const screen = document.getElementById(screenId);
  if (!screen) return;
  const container = document.getElementById('hearts-container');
  const symbols   = ['❤️','💜','💖'];

  function dropHeart() {
    const card = screen.querySelector('.card');
    if (!card || screen) return;
    const rect = card.getBoundingClientRect();
    const h = document.createElement('div');
    h.className  = 'floating-heart';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.cssText = `
      left: ${rect.left + Math.random() * rect.width}px;
      bottom: ${window.innerHeight - rect.bottom + 10}px;
      font-size: ${Math.random() * .8 + .7}rem;
      --dur: 4s; --delay: 0s;
      --drift: ${(Math.random() - .5) * 50}px;
    `;
    container.appendChild(h);
    setTimeout(() => h.remove(), 5000);
  }

  const id = setInterval(() => {
    if (state.currentScreen !== parseInt(document.getElementById(screenId)?.dataset.screen)) {
      clearInterval(id); return;
    }
    dropHeart();
  }, 1200);
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 2 — QUESTION
   ═══════════════════════════════════════════════════════════ */
(function initQuestion() {
  const yesBtn = document.getElementById('yes-btn');
  const noBtn  = document.getElementById('no-btn');
  const wrapper = document.getElementById('question-buttons');

  const noTexts = [
    'No','Really?','Please?','Wrong Button',
    'Try Again','Think Again','Don\'t Break My Heart','Nope!',
    'Are You Sure?','Bad Choice!','Hehe','Run Away!'
  ];
  let textIdx = 0;

  function setNoStartPosition() {
    noBtn.style.position = 'absolute';
    noBtn.style.left = 'calc(50% + 28px)';
    noBtn.style.top = '50%';
    noBtn.style.transform = 'translateY(-50%)';
    noBtn.style.transition = 'left .25s ease, top .25s ease, transform .25s ease';
  }

  /* Keep the NO button inside the question button area. */
  function positionNoRandomly() {
    const wRect = wrapper.getBoundingClientRect();
    const yRect = yesBtn.getBoundingClientRect();
    const noW   = noBtn.offsetWidth  || 110;
    const noH   = noBtn.offsetHeight || 46;
    const padding = 8;
    const maxX = Math.max(padding, wRect.width - noW - padding);
    const maxY = Math.max(padding, wRect.height - noH - padding);

    let tries = 0, rx, ry;

    do {
      rx = padding + Math.random() * (maxX - padding);
      ry = padding + Math.random() * (maxY - padding);
      tries++;

      const gap = 18;
      const noRect = {
        left: wRect.left + rx - gap,
        top: wRect.top + ry - gap,
        right: wRect.left + rx + noW + gap,
        bottom: wRect.top + ry + noH + gap,
      };
      const overlap = (
        noRect.left  < yRect.right  &&
        noRect.right > yRect.left   &&
        noRect.top   < yRect.bottom &&
        noRect.bottom > yRect.top
      );
      if (!overlap) break;
    } while (tries < 40);

    rx = Math.min(Math.max(rx, padding), maxX);
    ry = Math.min(Math.max(ry, padding), maxY);

    noBtn.style.position = 'absolute';
    noBtn.style.left     = `${rx}px`;
    noBtn.style.top      = `${ry}px`;
    noBtn.style.transform = `rotate(${(Math.random()-0.5)*20}deg)`;
    noBtn.style.transition = 'left .35s cubic-bezier(.68,-0.55,.27,1.55), top .35s cubic-bezier(.68,-0.55,.27,1.55), transform .35s ease';
  }

  function changeNoText() {
    textIdx = (textIdx + 1) % noTexts.length;
    noBtn.textContent = noTexts[textIdx];
  }

  handleQuestionScreenEnter = () => {
    textIdx = 0;
    noBtn.textContent = noTexts[textIdx];
    setNoStartPosition();
  };

  // Escape on pointer proximity (desktop)
  document.addEventListener('pointermove', e => {
    if (state.currentScreen !== 2) return;
    const rect = noBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (dist < 90) { positionNoRandomly(); changeNoText(); }
  });

  // Mobile: touchstart on the button moves it
  noBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    positionNoRandomly();
    changeNoText();
  }, { passive: false });

  noBtn.addEventListener('click', () => { positionNoRandomly(); changeNoText(); });

  // YES click
  yesBtn.addEventListener('click', e => {
    addRipple(yesBtn, e);
    heartExplosion(e.clientX, e.clientY);
    launchConfetti(80);
    setTimeout(() => transitionTo(3), 900);
  });
})();

/* ═══════════════════════════════════════════════════════════
   HEART EXPLOSION (Yes click)
   ═══════════════════════════════════════════════════════════ */
function heartExplosion(cx, cy) {
  const container = document.body;
  const count = 20;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'burst-heart';
    h.textContent = ['❤️','💖','💜','💕'][Math.floor(Math.random()*4)];
    const angle  = (i / count) * Math.PI * 2;
    const dist   = 80 + Math.random() * 80;
    h.style.cssText = `
      left:${cx}px; top:${cy}px;
      --tx:${Math.cos(angle)*dist}px;
      --ty:${Math.sin(angle)*dist}px;
      --dur:${Math.random()*.4+.6}s;
      --delay:${i*.03}s;
      font-size:${Math.random()*1.2+1}rem;
    `;
    container.appendChild(h);
    setTimeout(() => h.remove(), 1400);
  }
}

/* ═══════════════════════════════════════════════════════════
   CONFETTI
   ═══════════════════════════════════════════════════════════ */
function launchConfetti(count = 60) {
  const container = document.getElementById('confetti-container');
  const colors = ['#ec4899','#a855f7','#c084fc','#fbcfe8','#e9d5ff','#f9a8d4','#ffffff','#fbbf24'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const size   = Math.random() * 8 + 6;
    const isCircle = Math.random() > .6;
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${color};
      width: ${isCircle ? size : size * .6}px;
      height: ${size}px;
      border-radius: ${isCircle ? '50%' : '2px'};
      --dur: ${Math.random() * 2 + 2}s;
      --delay: ${Math.random() * 1.2}s;
      --drift: ${(Math.random() - .5) * 200}px;
      --spin: ${(Math.random() > .5 ? '' : '-')}${Math.floor(Math.random()*720+360)}deg;
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

/* ═══════════════════════════════════════════════════════════
   OPTION CARD SELECTION (shared for food / activity / time)
   ═══════════════════════════════════════════════════════════ */
function initOptionGrid(gridId, stateKey, btnId) {
  const grid = document.getElementById(gridId);
  const btn  = document.getElementById(btnId);
  const cards = grid.querySelectorAll('.option-card');

  // 3D tilt on hover (desktop)
  cards.forEach(card => {
    card.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateY(${dx*8}deg) rotateX(${-dy*8}deg) scale(1.04)`;
    });

    card.addEventListener('pointerleave', () => {
      if (!card.classList.contains('selected')) {
        card.style.transform = '';
      }
    });

    // Click / keyboard
    const activate = () => {
      // Deselect all
      cards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-selected', 'false');
        c.style.transform = '';
      });
      // Select this
      card.classList.add('selected');
      card.setAttribute('aria-selected', 'true');
      state[stateKey] = card.dataset.value;
      localStorage.setItem(stateKey, card.dataset.value);

      // Ripple effect on card
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(card.offsetWidth, card.offsetHeight) * 2;
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${card.offsetWidth/2-size/2}px;top:${card.offsetHeight/2-size/2}px;`;
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });

      // Enable continue
      btn.disabled = false;
      btn.removeAttribute('aria-disabled');
    };

    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
  });

  // Continue button
  btn.addEventListener('click', e => {
    if (btn.disabled) return;
    addRipple(btn, e);
    const next = { 'food': 4, 'activity': 5, 'date': 6, 'time': 7 }[stateKey];
    transitionTo(next);
  });
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 3 — FOOD
   ═══════════════════════════════════════════════════════════ */
initOptionGrid('food-grid', 'food', 'food-btn');

/* ═══════════════════════════════════════════════════════════
   SCREEN 4 — ACTIVITY
   ═══════════════════════════════════════════════════════════ */
initOptionGrid('activity-grid', 'activity', 'activity-btn');

/* ═══════════════════════════════════════════════════════════
   SCREEN 5 — CALENDAR
   ═══════════════════════════════════════════════════════════ */
(function initCalendar() {
  const grid      = document.getElementById('cal-grid');
  const label     = document.getElementById('cal-month-label');
  const prevBtn   = document.getElementById('cal-prev');
  const nextBtn   = document.getElementById('cal-next');
  const continueBtn = document.getElementById('calendar-btn');

  const MONTH_NAMES = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];
  const today = new Date();
  today.setHours(0,0,0,0);

  let viewYear  = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;

  function render(direction = 0) {
    // Animate grid out then in
    grid.style.opacity = '0';
    grid.style.transform = direction >= 0 ? 'translateX(10px)' : 'translateX(-10px)';

    setTimeout(() => {
      buildGrid();
      grid.style.transition = 'opacity .3s ease, transform .3s ease';
      grid.style.opacity = '1';
      grid.style.transform = 'none';
    }, 160);

    label.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

    // Disable prev if same month as today
    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
    prevBtn.disabled = isCurrentMonth;
  }

  function buildGrid() {
    grid.innerHTML = '';
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysIn   = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Empty leading cells
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      grid.appendChild(empty);
    }

    for (let d = 1; d <= daysIn; d++) {
      const cell  = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-day';
      cell.textContent = d;

      const cellDate = new Date(viewYear, viewMonth, d);
      cellDate.setHours(0,0,0,0);

      const isPast = cellDate < today;
      const isToday = cellDate.getTime() === today.getTime();

      if (isPast) { cell.disabled = true; }
      if (isToday) { cell.classList.add('today'); }

      if (
        selectedDate &&
        cellDate.getDate() === selectedDate.getDate() &&
        cellDate.getMonth() === selectedDate.getMonth() &&
        cellDate.getFullYear() === selectedDate.getFullYear()
      ) {
        cell.classList.add('selected');
      }

      cell.setAttribute('aria-label', cellDate.toDateString());

      cell.addEventListener('click', () => {
        selectedDate = cellDate;
        state.date   = cellDate.toDateString();
        localStorage.setItem('date', state.date);
        continueBtn.disabled = false;
        continueBtn.removeAttribute('aria-disabled');
        buildGrid(); // re-render to show selection
      });

      grid.appendChild(cell);
    }
  }

  prevBtn.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    render(-1);
  });

  nextBtn.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    render(1);
  });

  continueBtn.addEventListener('click', e => {
    if (continueBtn.disabled) return;
    addRipple(continueBtn, e);
    transitionTo(6);
  });

  render();
})();

/* ═══════════════════════════════════════════════════════════
   SCREEN 6 — TIME
   ═══════════════════════════════════════════════════════════ */
initOptionGrid('time-grid', 'time', 'time-btn');

/* ═══════════════════════════════════════════════════════════
   SCREEN 7 — FINAL
   ═══════════════════════════════════════════════════════════ */
function populateFinal() {
  document.getElementById('final-food').textContent     = state.food     || localStorage.getItem('food')     || '—';
  document.getElementById('final-activity').textContent = state.activity || localStorage.getItem('activity') || '—';
  document.getElementById('final-date').textContent     = state.date     || localStorage.getItem('date')     || '—';
  document.getElementById('final-time').textContent     = state.time     || localStorage.getItem('time')     || '—';
}

function launchCelebration() {
  launchConfetti(120);
  setTimeout(() => launchConfetti(80), 1200);
  setTimeout(() => launchConfetti(60), 2600);
}

/* Download invitation as PNG */
document.getElementById('download-btn').addEventListener('click', async () => {
  const card = document.querySelector('#screen-final .final-card');
  if (!window.html2canvas) { alert('Download ready — please try again in a moment.'); return; }
  try {
    const canvas = await html2canvas(card, {
      backgroundColor: '#2d1258',
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = 'date-invitation.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Download failed:', err);
  }
});

/* Start Again */
document.getElementById('restart-btn').addEventListener('click', () => {
  localStorage.clear();
  Object.assign(state, { food: null, activity: null, date: null, time: null });
  // Reset all option cards
  document.querySelectorAll('.option-card').forEach(c => {
    c.classList.remove('selected'); c.setAttribute('aria-selected','false'); c.style.transform = '';
  });
  // Disable all continue buttons
  ['food-btn','activity-btn','calendar-btn','time-btn'].forEach(id => {
    const b = document.getElementById(id);
    if (b) { b.disabled = true; b.setAttribute('aria-disabled','true'); }
  });
  // Reset welcome title typewriter
  const titleEl = document.getElementById('welcome-title');
  const btn     = document.getElementById('welcome-btn');
  const fullText = 'I have something special to ask you ❤️';
  titleEl.textContent = '';
  titleEl.classList.remove('done');
  btn.classList.remove('visible'); btn.classList.add('btn-hidden');

  transitionTo(1);

  // Restart typewriter
  let index = 0;
  function type() {
    if (index < fullText.length) { titleEl.textContent += fullText[index++]; setTimeout(type, 52); }
    else { titleEl.classList.add('done'); setTimeout(() => { btn.classList.remove('btn-hidden'); btn.classList.add('visible'); }, 400); }
  }
  setTimeout(type, 900);
});

/* ═══════════════════════════════════════════════════════════
   RESTORE STATE FROM LOCALSTORAGE
   ═══════════════════════════════════════════════════════════ */
(function restoreFromStorage() {
  ['food','activity','date','time'].forEach(key => {
    const val = localStorage.getItem(key);
    if (val) state[key] = val;
  });
})();
