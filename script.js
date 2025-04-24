// script.js

document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // 2. Mobile menu toggle
  const menuBtn = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', () => {
      navbar.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });
  }

  // 3. Global scroll-reveal for <section>
  const sections = document.querySelectorAll('section');
  if (sections.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    sections.forEach(sec => {
      sec.classList.add('hidden');
      revealObserver.observe(sec);
    });
  }

  // 4. Contact form submission alert
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert("Thank you for reaching out! We'll get back to you soon.");
      contactForm.reset();
    });
  }

  // 5. Hero slider (5s)
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length) {
    let currentSlide = 0;
    slides[currentSlide].classList.add('active');
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  // 6. About section animations + counter
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    const textEls = aboutSection.querySelectorAll('.about-text > *');
    const imageFrame = aboutSection.querySelector('.image-frame');

    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          textEls.forEach((el,i) => setTimeout(() => el.classList.add('fade-in'), 180 * i));
          if (imageFrame) setTimeout(() => imageFrame.classList.add('reveal'), 300);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 }).observe(aboutSection);

    aboutSection.querySelectorAll('.achievement-number').forEach(el => {
      new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
            const duration = 1800;
            const step = target / (duration / 16);
            let count = 0;
            const timer = setInterval(() => {
              count += step;
              if (count >= target) {
                el.textContent = `${target}+`;
                clearInterval(timer);
              } else {
                el.textContent = `${Math.floor(count)}+`;
              }
            }, 16);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.5 }).observe(el);
    });
  }

  // 7. Gallery fade-in + lightbox
  const gallerySection = document.querySelector('.gallery-section');
  if (gallerySection) {
    const items = gallerySection.querySelectorAll('.gallery-item');
    if (items.length) {
      new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            items.forEach((item,i) => setTimeout(() => item.classList.add('fade-in'), 100 * i));
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 }).observe(gallerySection);

      items.forEach(item => {
        item.addEventListener('click', () => {
          const img = item.querySelector('img');
          const titleEl = item.querySelector('.overlay-content h3');
          const descEl = item.querySelector('.overlay-content span');
          const lb = document.createElement('div');
          lb.className = 'lightbox';
          lb.innerHTML = `
            <div class="lightbox-content">
              <button class="lightbox-close">&times;</button>
              <img src="${img.src}" alt="${titleEl?.textContent||''}">
              <div class="lightbox-caption">
                <h3>${titleEl?.textContent||''}</h3>
                <p>${descEl?.textContent||''}</p>
              </div>
            </div>
          `;
          document.body.append(lb);
          document.body.style.overflow = 'hidden';
          setTimeout(() => lb.classList.add('active'), 10);

          lb.addEventListener('click', e => {
            if (e.target === lb || e.target.classList.contains('lightbox-close')) {
              lb.classList.remove('active');
              setTimeout(() => {
                document.body.removeChild(lb);
                document.body.style.overflow = '';
              }, 300);
            }
          });
        });
      });
    }
  }

  // 8. Inject dynamic CSS for animations & lightbox
  (function(){
    const style = document.createElement('style');
    style.textContent = `
      /* About fade-in */
      .about-text > * { opacity: 0; transform: translateY(15px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .about-text > *.fade-in { opacity: 1; transform: translateY(0); }
      .image-frame { opacity: 0; transform: translateX(20px) scale(0.95); transition: all 0.8s cubic-bezier(0.22,1,0.36,1); }
      .image-frame.reveal { opacity: 1; transform: translateX(0) scale(1); }

      /* Gallery fade-in */
      .gallery-item { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .gallery-item.fade-in { opacity: 1; transform: translateY(0); }

      /* Lightbox */
      .lightbox { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; z-index: 1000; }
      .lightbox.active { opacity: 1; }
      .lightbox-content { position: relative; max-width: 90%; max-height: 90%; animation: lightboxIn 0.3s ease forwards; }
      .lightbox-content img { max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 4px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
      .lightbox-close { position: absolute; top: -40px; right: 0; font-size: 30px; color: white; background: none; border: none; cursor: pointer; }
      .lightbox-caption { color: white; text-align: center; margin-top: 15px; }
      .lightbox-caption h3 { font-size: 18px; margin-bottom: 5px; }
      .lightbox-caption p { font-size: 14px; opacity: 0.8; }
      @keyframes lightboxIn { from { transform: scale(0.9); } to { transform: scale(1); } }

      /* Service card reveal */
      .service-card { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .service-card.reveal { opacity: 1; transform: translateY(0); }
    `;
    document.head.append(style);
  })();

  // 9. About-extended: counter & FAQ
  const aboutCounters = document.querySelectorAll('#about .achievement-number');
  if (aboutCounters.length) {
    const obs2 = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.textContent.replace(/\D/g, ''),10);
          let count = 0;
          const duration = 1400;
          const step = Math.max(Math.floor(duration/target), 20);
          const timer = setInterval(() => {
            count++;
            el.textContent = count+"+";
            if (count >= target) clearInterval(timer);
          }, step);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    aboutCounters.forEach(el => obs2.observe(el));
  }
  document.querySelectorAll('#about .faq-question').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.faq-item').classList.toggle('open'));
  });

  // 10. Services page Read More + reveal
  document.querySelectorAll('.btn-readmore').forEach(btn => {
    btn.addEventListener('click', () => {
      const extra = btn.nextElementSibling;
      if (!extra) return;
      const opened = extra.classList.toggle('open');
      btn.classList.toggle('expanded', opened);
      btn.textContent = opened ? 'Read Less' : 'Read More';
    });
  });
  const svcCards = document.querySelectorAll('.service-card');
  if (svcCards.length) {
    const svcObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    svcCards.forEach((card,i) => {
      card.style.transitionDelay = `${i*100}ms`;
      svcObs.observe(card);
    });
  }

  // 11. Portfolio modal
  const portfolioImgs = document.querySelectorAll('.portfolio-item img');
  if (portfolioImgs.length) {
    const modal = document.getElementById('portfolio-modal');
    const modalImg = document.getElementById('modal-img');
    const prevBtn  = document.getElementById('modal-prev');
    const nextBtn  = document.getElementById('modal-next');
    const closeBtn = document.getElementById('modal-close');
    let current = 0;
    const show = idx => {
      current = (idx + portfolioImgs.length) % portfolioImgs.length;
      if (modalImg) modalImg.src = portfolioImgs[current].src;
    };
    portfolioImgs.forEach((img,i) => img.addEventListener('click', () => {
      show(i);
      if (modal) modal.classList.add('open');
    }));
    if (prevBtn) prevBtn.addEventListener('click', () => show(current-1));
    if (nextBtn) nextBtn.addEventListener('click', () => show(current+1));
    if (closeBtn) closeBtn.addEventListener('click', () => modal?.classList.remove('open'));
    modal?.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // 12. Reviews fade-in
  const reviewCards = document.querySelectorAll('.review-card');
  if (reviewCards.length) {
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reviewCards.forEach(c => revObs.observe(c));
  }

  // 13. Back to Top
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('show', window.scrollY>300);
    });
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  }
});
