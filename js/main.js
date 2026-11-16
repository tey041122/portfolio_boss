/**
 * ==========================================================================
 * CINEMATIC GOLDEN SIGNATURE WRITING ANIMATION ENGINE
 * Client: Srey ArunRatha — Chairman & Founder
 * 
 * Features:
 *   • Exact SVG Mask Progressive Reveal over original pristine signature
 *   • Golden spark pen tip tracking true SVG letterform path via getPointAtLength()
 *   • Realistic acceleration, deceleration, and natural cursive pacing
 *   • Sparkling golden ember particle trail fading naturally
 *   • Sequential 5-Phase Reveal:
 *       Phase 1: Dark Cinematic Atmosphere
 *       Phase 2: Writing "Srey"
 *       Phase 3: Writing "ArunRatha" & Baseline flourish
 *       Phase 4: Golden sparkle finale
 *       Phase 5: Elegant Reveal of "CHAIRMAN & FOUNDER"
 * ==========================================================================
 */
'use strict';

const portfolioConfig = {
  name: 'Srey ArunRatha',
  position: 'CHAIRMAN & FOUNDER',
  tagline: 'Your speech makes people trust you in a while but your character makes people trust you forever.',
  images: { portrait: 'assets/portrait.jpg', signature: 'assets/signature.png' },
  social: {
    telegram: 'https://t.me/arunratha',
    linkedin: '',
    facebook: 'https://www.facebook.com/share/19figcq498/?mibextid=wwXIfr',
    youtube: '',
    email: 'office@arunratha.com'
  },
  office: { ventures: 'LBC • Magic Iron • BG • Statesman • Saravan', role: 'Chairman & Founder' }
};

document.addEventListener('DOMContentLoaded', () => {
  applyPortfolioConfiguration();
  initCinematicSignatureEngine();
  initExecutiveModal();
  initActionButtons();
  initVCardDownload();
});

function applyPortfolioConfiguration() {
  document.querySelectorAll('.brand-signature, .modal-signature').forEach(el => {
    el.textContent = portfolioConfig.name;
  });

  const exTitleEl = document.getElementById('executiveTitle');
  if (exTitleEl) {
    const parts = portfolioConfig.position.split('&');
    exTitleEl.innerHTML = parts.length === 2
      ? `${parts[0].trim()} <span class="gold-amp">&amp;</span> ${parts[1].trim()}`
      : portfolioConfig.position;
  }

  const modalTitle = document.querySelector('.modal-title');
  if (modalTitle) modalTitle.textContent = portfolioConfig.position;

  const taglineEl = document.getElementById('heroTagline');
  if (taglineEl) taglineEl.textContent = portfolioConfig.tagline.replace(/^"|"$/g, '');

  const modalQuote = document.querySelector('.modal-bio-quote');
  if (modalQuote) modalQuote.textContent = `"${portfolioConfig.tagline.replace(/^"|"$/g, '')}"`;

  if (portfolioConfig.images.portrait) {
    const cp = portfolioConfig.images.portrait.startsWith('../')
      ? portfolioConfig.images.portrait
      : `../${portfolioConfig.images.portrait.replace(/^\.\//, '')}`;
    document.documentElement.style.setProperty('--portrait-image', `url("${cp}")`);
  }

  bindSocialLinks();
}

/* ══════════════════════════════════════════════════════════════════════════
   CINEMATIC SIGNATURE ENGINE
   ══════════════════════════════════════════════════════════════════════════ */
function initCinematicSignatureEngine() {
  const sigWrap   = document.getElementById('signatureWrap');
  const guideSvg  = document.getElementById('sigDrawSvg');
  const penCursor = document.getElementById('penCursor');
  const emberCv   = document.getElementById('sigEmberCanvas');
  const execTitle = document.getElementById('executiveTitle');
  const goldDiv   = document.getElementById('heroGoldDivider');
  const tagline   = document.getElementById('heroTagline');
  const actions   = document.querySelector('.hero-actions');
  const socials   = document.querySelector('.hero-social-list');

  if (!sigWrap || !guideSvg) return;

  // Mask path elements
  const maskPaths = Array.from(document.querySelectorAll('#maskStrokes .sig-mask-path'));
  if (!maskPaths.length) return;

  // Measure and initialize each stroke
  const strokeData = maskPaths.map(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len} ${len}`;
    p.style.strokeDashoffset = `${len}`;
    return { el: p, len: len };
  });

  // Ember Canvas Setup
  const pctx = emberCv ? emberCv.getContext('2d') : null;
  function resizeEmber() {
    if (!emberCv) return;
    emberCv.width = sigWrap.offsetWidth || 360;
    emberCv.height = sigWrap.offsetHeight || 164;
  }
  resizeEmber();
  window.addEventListener('resize', resizeEmber);

  // Particles array
  const particles = [];
  function emitSparkle(x, y, count = 3) {
    if (!emberCv) return;
    const wr = sigWrap.getBoundingClientRect();
    const px = (x / 560) * wr.width;
    const py = (y / 260) * wr.height;

    for (let i = 0; i < count; i++) {
      if (particles.length > 90) break;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 1.5;
      particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3,
        size: 0.8 + Math.random() * 1.8,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        color: Math.random() > 0.3 ? '#ffd56b' : '#ffffff'
      });
    }
  }

  function renderParticles() {
    if (!pctx || !emberCv) return;
    pctx.clearRect(0, 0, emberCv.width, emberCv.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      pctx.save();
      pctx.globalAlpha = Math.max(0, p.life);
      pctx.beginPath();
      pctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pctx.fillStyle = p.color;
      pctx.shadowColor = '#e5a93b';
      pctx.shadowBlur = 8;
      pctx.fill();
      pctx.restore();
    }
  }

  // Position the Golden Pen Nib
  function setPen(x, y, opacity = 1) {
    if (!penCursor) return;
    const wr = sigWrap.getBoundingClientRect();
    const px = (x / 560) * wr.width;
    const py = (y / 260) * wr.height;
    penCursor.style.left = `${px}px`;
    penCursor.style.top = `${py}px`;
    penCursor.style.opacity = `${opacity}`;
    penCursor.style.display = opacity > 0.01 ? 'block' : 'none';
  }

  // Animation controller
  let isAnimating = false;

  function runCinematicWriting() {
    if (isAnimating) return;
    isAnimating = true;

    // Reset everything
    maskPaths.forEach(p => {
      const len = p.getTotalLength();
      p.style.strokeDashoffset = `${len}`;
    });
    setPen(0, 0, 0);

    // Initial delay for cinematic intro
    const TOTAL_WRITING_TIME = 4200; // ms (snappier, more realistic executive signature speed)
    const totalLength = strokeData.reduce((acc, s) => acc + s.len, 0);

    let startTimestamp = null;
    let particleLoop = null;

    function particleTicker() {
      renderParticles();
      particleLoop = requestAnimationFrame(particleTicker);
    }
    particleTicker();

    // Start pen writing
    setTimeout(() => {
      const startTime = performance.now();
      let strokeIndex = 0;
      let strokeStartTime = startTime;

      function frame(now) {
        if (strokeIndex >= strokeData.length) {
          // Finished all strokes!
          completeAnimation();
          return;
        }

        const current = strokeData[strokeIndex];
        // Dynamic duration based on stroke length, with humanized minimum
        const strokeDuration = Math.max(90, (current.len / totalLength) * TOTAL_WRITING_TIME);
        const elapsed = now - strokeStartTime;
        const progress = Math.min(1, elapsed / strokeDuration);

        // Smooth natural easing
        const ease = progress < 0.5 
          ? 2 * progress * progress 
          : -1 + (4 - 2 * progress) * progress;

        // Reveal the stroke
        const currentOffset = current.len * (1 - ease);
        current.el.style.strokeDashoffset = `${currentOffset}`;

        // Get coordinates of the writing tip directly on the letterform stroke
        const pt = current.el.getPointAtLength(ease * current.len);
        setPen(pt.x, pt.y, 1);
        emitSparkle(pt.x, pt.y, 3);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          // Advance to next stroke with brief organic pen lift
          strokeIndex++;
          // Snappy pen lift pause between strokes
          setTimeout(() => {
            strokeStartTime = performance.now();
            requestAnimationFrame(frame);
          }, 25);
        }
      }

      requestAnimationFrame(frame);
    }, 400);

    function completeAnimation() {
      // Golden sparkle flourish at the end of the signature
      const lastStroke = strokeData[strokeData.length - 1];
      const endPt = lastStroke.el.getPointAtLength(lastStroke.len);
      emitSparkle(endPt.x, endPt.y, 25);

      // Fade out pen cursor gracefully
      setTimeout(() => {
        if (penCursor) penCursor.style.opacity = '0';
      }, 350);

      // Phase 5: Reveal "CHAIRMAN & FOUNDER" and executive details
      setTimeout(() => {
        if (execTitle) {
          execTitle.style.opacity = '1';
          execTitle.style.transform = 'translateY(0)';
          execTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        if (goldDiv) {
          goldDiv.style.opacity = '1';
          goldDiv.style.transform = 'scaleX(1)';
          goldDiv.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
        }
        if (tagline) {
          tagline.style.opacity = '1';
          tagline.style.transition = 'opacity 0.8s ease 0.4s';
        }
        if (actions) {
          actions.style.opacity = '1';
          actions.style.transition = 'opacity 0.8s ease 0.6s';
        }
        if (socials) {
          socials.style.opacity = '1';
          socials.style.transition = 'opacity 0.8s ease 0.8s';
        }
        isAnimating = false;
      }, 600);
    }
  }

  // Tap/click to replay
  sigWrap.addEventListener('click', runCinematicWriting);
  sigWrap.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      runCinematicWriting();
    }
  });

  // Auto-play on load
  runCinematicWriting();
}

/* ══════════════════════════════════════════════════════════════════════════
   MODAL & UI CONTROLLERS
   ══════════════════════════════════════════════════════════════════════════ */
function initExecutiveModal() {
  const modal = document.getElementById('executiveModal');
  const btnClose = document.getElementById('modalCloseBtn');
  const backdrop = document.getElementById('modalBackdrop');
  const hamburger = document.getElementById('hamburgerBtn');
  const btnDesktopProfile = document.getElementById('btnDesktopProfile');

  function openModal() {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openModal);
  if (btnDesktopProfile) btnDesktopProfile.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function initActionButtons() {
  const btnExplore = document.getElementById('btnExploreJourney');
  const btnDesktopContact = document.getElementById('btnDesktopContact');
  const btnGetInTouch = document.getElementById('btnGetInTouch');
  const modal = document.getElementById('executiveModal');

  function openContactModal(e) {
    e.preventDefault();
    if (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  if (btnDesktopContact) btnDesktopContact.addEventListener('click', openContactModal);
  if (btnGetInTouch) btnGetInTouch.addEventListener('click', openContactModal);
}

function initVCardDownload() {
  document.querySelectorAll('.download-vcard-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Srey ArunRatha',
        'N:ArunRatha;Srey;;;',
        'TITLE:Chairman & Founder',
        'EMAIL;TYPE=INTERNET,WORK:office@arunratha.com',
        'URL:https://t.me/arunratha',
        'NOTE:Your speech makes people trust you in a while but your character makes people trust you forever.',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Srey_ArunRatha_Chairman.vcf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  });
}

function bindSocialLinks() {
  const s = portfolioConfig.social;
  document.querySelectorAll('.social-link-telegram').forEach(el => { if (s.telegram) el.href = s.telegram; });
  document.querySelectorAll('.social-link-facebook').forEach(el => { if (s.facebook) el.href = s.facebook; });
  document.querySelectorAll('.social-link-email').forEach(el => { if (s.email) el.href = `mailto:${s.email}`; });
}
