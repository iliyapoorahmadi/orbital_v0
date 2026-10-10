/**
 * ORBITAL CELESTIAL EDTECH | اوربیتال
 * Vanilla JavaScript Engine - Zero Dependencies
 * Drag-and-Drop Ready for GitHub Pages
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initFramelessImageReaction();
  initCTA3DReaction();
  initContactInteractions();
});

/**
 * 1. Celestial Starfield Background Canvas
 */
function initStarfield() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const starCount = Math.floor((width * height) / 4000);
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.85 ? '#5ce1e6' : Math.random() > 0.7 ? '#fef08a' : '#ffffff',
      driftSpeed: (Math.random() - 0.5) * 0.1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 1 || star.alpha < 0.2) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }
      star.y += star.driftSpeed;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
      ctx.shadowBlur = star.radius > 1 ? 6 : 0;
      ctx.shadowColor = star.color;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/**
 * 2. Interactive Reaction and Parallax for Frameless Image
 */
function initFramelessImageReaction() {
  const imageWrapper = document.getElementById('celestial-card');
  if (!imageWrapper) return;

  let isHovered = false;

  imageWrapper.addEventListener('mouseenter', () => {
    isHovered = true;
    imageWrapper.classList.remove('idle-floating');
  });

  imageWrapper.addEventListener('mousemove', (e) => {
    const rect = imageWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    imageWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  imageWrapper.addEventListener('mouseleave', () => {
    isHovered = false;
    imageWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    setTimeout(() => {
      if (!isHovered) {
        imageWrapper.classList.add('idle-floating');
      }
    }, 400);
  });
}

/**
 * 3. Interactive 3D Reaction & Dynamic Parallax for CTA Button
 */
function initCTA3DReaction() {
  const ctaBtn = document.getElementById('cta-btn');
  if (!ctaBtn) return;

  const glow = ctaBtn.querySelector('.cta-3d-glow');
  let isHovered = false;

  ctaBtn.addEventListener('mouseenter', () => {
    isHovered = true;
    ctaBtn.classList.remove('btn-3d-idle');
  });

  ctaBtn.addEventListener('mousemove', (e) => {
    const rect = ctaBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 3D rotation angles (-15deg to +15deg)
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    ctaBtn.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(16px) scale(1.04)`;

    // Move specular shine highlight to match cursor coordinates in 3D
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(92, 225, 230, 0.45) 0%, transparent 65%)`;
    }
  });

  ctaBtn.addEventListener('mouseleave', () => {
    isHovered = false;
    ctaBtn.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
    setTimeout(() => {
      if (!isHovered) {
        ctaBtn.classList.add('btn-3d-idle');
      }
    }, 350);
  });
}

/**
 * Telegram Bot Integration Config
 * آیدی ربات: @orbital_qa_bot
 */
const TELEGRAM_CONFIG = {
  botUsername: "@orbital_qa_bot",
  botToken: "", // برای ارسال مستقیم از تلگرام وب، توکن دریافتی از @BotFather را اینجا بگذارید
  chatId: ""    // آیدی عددی چت یا کانال جهت دریافت پیام
};

async function sendToTelegramBot({ name, phone, email, message }) {
  if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId) {
    return;
  }
  
  const text = `🪐 *پیام جدید از وبسایت اوربیتال*\n\n` +
    `👤 *نام:* ${name}\n` +
    `📞 *شماره تماس:* ${phone}\n` +
    `📧 *ایمیل:* ${email}\n` +
    `💬 *پیام:* ${message || '—'}\n\n` +
    `🤖 *مقصد:* @orbital_qa_bot`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: text,
        parse_mode: "Markdown"
      })
    });
  } catch (err) {
    console.warn("Telegram Bot API error:", err);
  }
}

/**
 * 3. CTA and Contact Modal Handling
 */
function initContactInteractions() {
  const ctaBtn = document.getElementById('cta-btn');
  const modal = document.getElementById('contact-modal');
  const modalClose = document.getElementById('modal-close');
  const form = document.getElementById('quick-contact-form');
  const toast = document.getElementById('toast-notify');
  const toastMsg = document.getElementById('toast-msg');

  if (ctaBtn && modal) {
    ctaBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  if (form && modal && toast) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submit-btn');
      const submitText = document.getElementById('submit-btn-text');
      const prevText = submitText ? submitText.textContent : 'ارسال پیام';

      if (submitBtn && submitText) {
        submitBtn.disabled = true;
        submitText.textContent = 'در حال ارسال پیام...';
      }

      const name = document.getElementById('user-name')?.value || '';
      const phone = document.getElementById('user-phone')?.value || '';
      const email = document.getElementById('user-email')?.value || '';
      const message = document.getElementById('user-msg')?.value || '';

      const payload = {
        "نام و نام خانوادگی": name,
        "شماره تماس": phone,
        "ایمیل": email,
        "متن پیام": message,
        "_cc": "ipoorahmadi@gmail.com",
        "_subject": "پیام جدید از وبسایت اوربیتال",
        "ربات تلگرام": "@orbital_qa_bot"
      };

      try {
        // 1. ارسال به ایمیل‌ها (iliyap.dev@gmail.com و ipoorahmadi@gmail.com)
        const emailPromise = fetch("https://formsubmit.co/ajax/iliyap.dev@gmail.com", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        // 2. ارسال خودکار به ربات تلگرام @orbital_qa_bot
        const telegramPromise = sendToTelegramBot({ name, phone, email, message });

        await Promise.allSettled([emailPromise, telegramPromise]);
      } catch (err) {
        console.warn("Form submission notice:", err);
      } finally {
        if (submitBtn && submitText) {
          submitBtn.disabled = false;
          submitText.textContent = prevText;
        }
        form.reset();
        modal.classList.remove('active');

        // Show Toast
        if (toastMsg) {
          toastMsg.textContent = 'پیام شما به ایمیل‌ها و ربات تلگرام (@orbital_qa_bot) ارسال شد.';
        }
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 5000);
      }
    });
  }
}
