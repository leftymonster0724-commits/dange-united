/**
 * Dange United O-40 - メインJavaScript
 * ナビゲーション、アニメーション、インタラクション
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     ハンバーガーメニュー
     ============================================= */
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    // メニューリンクをクリックで閉じる
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* =============================================
     スクロール時ヘッダースタイル変更
     ============================================= */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* =============================================
     スクロールアニメーション (Intersection Observer)
     ============================================= */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // 少しずつ遅延させる
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach((el, i) => {
      if (!el.dataset.delay) {
        el.dataset.delay = i * 80;
      }
      io.observe(el);
    });
  }

  /* =============================================
     FAQ アコーディオン
     ============================================= */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const isOpen = q.classList.contains('open');
      // 全て閉じる
      faqQuestions.forEach(other => {
        other.classList.remove('open');
        const ans = other.nextElementSibling;
        if (ans) ans.classList.remove('open');
      });
      // クリックしたものを開く
      if (!isOpen) {
        q.classList.add('open');
        const ans = q.nextElementSibling;
        if (ans) ans.classList.add('open');
      }
    });
  });

  /* =============================================
     お問い合わせフォーム送信
     ============================================= */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '送信中...';
      btn.disabled = true;

      // 擬似送信（実際のバックエンドがない場合）
      setTimeout(() => {
        const successMsg = document.getElementById('formSuccess');
        if (successMsg) {
          contactForm.style.display = 'none';
          successMsg.style.display = 'block';
        } else {
          btn.innerHTML = '✅ 送信完了！';
          btn.style.background = '#009933';
          setTimeout(() => {
            contactForm.reset();
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.background = '';
          }, 3000);
        }
      }, 1200);
    });
  }

  /* =============================================
     ニュースティッカー (複製でループ)
     ============================================= */
  const tickerList = document.querySelector('.ticker-list');
  if (tickerList) {
    const clone = tickerList.cloneNode(true);
    tickerList.parentElement.appendChild(clone);
  }

  /* =============================================
     カウントアップアニメーション
     ============================================= */
  const counters = document.querySelectorAll('.count-up');
  if (counters.length) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current);
          }, 16);
          countIO.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countIO.observe(c));
  }

  /* =============================================
     試合結果タブ切り替え
     ============================================= */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* =============================================
     スムーススクロール（アンカーリンク）
     ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =============================================
     現在のページのナビリンクにactive付与
     ============================================= */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-pc a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.style.color = 'var(--red-light)';
    }
  });

});
