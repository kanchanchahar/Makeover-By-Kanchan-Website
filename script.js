// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth scroll for anchor links (skip bare '#')
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  
    // Toggle Mobile Menu
const menuBtn = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

menuBtn.addEventListener('click', () => {
  navbar.classList.toggle('active');
  menuBtn.classList.toggle('active'); // Animate lines into 'X'
});

  
    // 3. Global scroll-reveal for <section> elements
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('section').forEach(sec => {
      sec.classList.add('hidden');
      revealObserver.observe(sec);
    });
  
    // 4. Contact form submission alert
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', e => {
        e.preventDefault();
        alert("Thank you for reaching out! We'll get back to you soon.");
        contactForm.reset();
      });
    }
  
    // 5. Hero slider (5s interval)
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    if (slides.length) {
      slides[currentSlide].classList.add('active');
      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 5000);
    }
  
    // About section animations + counter
const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
  const textEls = aboutSection.querySelectorAll('.about-text > *');
  const imageFrame = aboutSection.querySelector('.image-frame');

  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        textEls.forEach((el, i) => setTimeout(() => el.classList.add('fade-in'), 180 * i));
        setTimeout(() => imageFrame.classList.add('reveal'), 300);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 }).observe(aboutSection);

  const counters = aboutSection.querySelectorAll('.achievement-number');

  counters.forEach(el => {
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
  
      // Staggered fade-in
      new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => setTimeout(() => item.classList.add('fade-in'), 100 * i));
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 }).observe(gallerySection);
  
      // Lightbox
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
  
    // 8. Inject dynamic CSS for animations & lightbox
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
      /* About fade-in */
      .about-text > * {
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .about-text > *.fade-in {
        opacity: 1;
        transform: translateY(0);
      }
      .image-frame {
        opacity: 0;
        transform: translateX(20px) scale(0.95);
        transition: all 0.8s cubic-bezier(0.22,1,0.36,1);
      }
      .image-frame.reveal {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
  
      /* Gallery fade-in */
      .gallery-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .gallery-item.fade-in {
        opacity: 1;
        transform: translateY(0);
      }
  
      /* Lightbox */
      .lightbox {
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.3s ease;
        z-index: 1000;
      }
      .lightbox.active { opacity: 1; }
      .lightbox-content {
        position: relative;
        max-width: 90%; max-height: 90%;
        animation: lightboxIn 0.3s ease forwards;
      }
      .lightbox-content img {
        max-width: 100%; max-height: 80vh;
        object-fit: contain; border-radius: 4px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
      }
      .lightbox-close {
        position: absolute; top: -40px; right: 0;
        font-size: 30px; color: white; background: none; border: none;
        cursor: pointer;
      }
      .lightbox-caption {
        color: white; text-align: center; margin-top: 15px;
      }
      .lightbox-caption h3 { font-size: 18px; margin-bottom: 5px; }
      .lightbox-caption p { font-size: 14px; opacity: 0.8; }
  
      @keyframes lightboxIn {
        from { transform: scale(0.9); }
        to   { transform: scale(1);   }
      }
    `;
    document.head.append(dynamicStyles);
  });
  

//   About page 


// about-extended.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Counter animation (trigger once when in view)
    const counters = document.querySelectorAll('#about .achievement-number');
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
          let count = 0;
          const duration = 1400;
          const stepTime = Math.max(Math.floor(duration / target), 20);
          const timer = setInterval(() => {
            count++;
            el.textContent = count + '+';
            if (count >= target) clearInterval(timer);
          }, stepTime);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => counterObserver.observe(el));
  
    // 2. FAQ toggle
    document.querySelectorAll('#about .faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        item.classList.toggle('open');
      });
    });
  });
  

// services.js
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".btn-readmore").forEach(btn => {
      btn.addEventListener("click", () => {
        const extra = btn.nextElementSibling;    // .service-extra
        const opened = extra.classList.toggle("open");
        btn.classList.toggle("expanded", opened);
        btn.textContent = opened ? "Read Less" : "Read More";
      });
    });
  });
  


  // Fade-in / slide-up for service cards on scroll
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;
  
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // add reveal class
          entry.target.classList.add('reveal');
          // optional: unobserve so it only happens once
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
  
    cards.forEach((card, i) => {
      // optionally stagger by a few ms
      card.style.transitionDelay = `${i * 100}ms`;
      observer.observe(card);
    });
  });

//Portfolio js

document.addEventListener('DOMContentLoaded', () => {
    const imgs     = Array.from(document.querySelectorAll('.portfolio-item img'));
    const modal    = document.getElementById('portfolio-modal');
    const modalImg = document.getElementById('modal-img');
    const prevBtn  = document.getElementById('modal-prev');
    const nextBtn  = document.getElementById('modal-next');
    const closeBtn = document.getElementById('modal-close');
    let current    = 0;
  
    if (!imgs.length) {
      console.error("➡️ No `.portfolio-item img` found! Make sure your HTML matches.");
      return;
    }
  
    function show(idx) {
      current = (idx + imgs.length) % imgs.length;
      modalImg.src = imgs[current].src;
    }
  
    imgs.forEach((img, i) => {
      img.addEventListener('click', () => {
        show(i);
        modal.classList.add('open');
      });
    });
  
    prevBtn.addEventListener('click', () => show(current - 1));
    nextBtn.addEventListener('click', () => show(current + 1));
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  
  //reviews page js

  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.review-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  
    cards.forEach(card => observer.observe(card));
  });


  //contact page

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("Thank you! Your message has been sent.");
      form.reset();
    });
  });


  // Back to Top Functionality
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

  
  