"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalAnimation() {
  const pathname = usePathname();

  useEffect(() => {
    if (!document.getElementById('global-anim-styles')) {
      const style = document.createElement('style');
      style.id = 'global-anim-styles';
      style.innerHTML = `
        .global-fade-up {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .global-fade-up.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.12,
    });

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(
        'section:not(.reveal-section), footer, main > div > div > .grid, main > div > .grid'
      );

      elements.forEach((el) => {
        if (!el.classList.contains('global-fade-up') && !el.classList.contains('is-visible')) {
          el.classList.add('global-fade-up');
          observer.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
