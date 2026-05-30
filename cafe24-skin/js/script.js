/*  금빛농원 — 카페24 스킨 인터랙션
    §1.5: jQuery 사용 가능. 1차에선 단정한 토글/페이드만.
    의존성: jQuery (카페24 기본 로드 가정).                  */

(function ($) {
  'use strict';

  $(function () {

    /* ---- Mobile drawer ---- */
    var $drawer = $('#drawer');

    $('[data-drawer-open]').on('click', function () {
      $drawer.addClass('is-open').attr('aria-hidden', 'false');
      $('body').css('overflow', 'hidden');
    });

    $('[data-drawer-close], #drawer').on('click', function (e) {
      if (e.target !== this) { return; }
      $drawer.removeClass('is-open').attr('aria-hidden', 'true');
      $('body').css('overflow', '');
    });

    /* ---- ESC closes drawer ---- */
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $drawer.hasClass('is-open')) {
        $drawer.removeClass('is-open').attr('aria-hidden', 'true');
        $('body').css('overflow', '');
      }
    });

    /* ---- Smooth scroll for in-page anchors ---- */
    $('a[href^="#"]').on('click', function (e) {
      var href = $(this).attr('href');
      if (href.length <= 1) { return; }
      var $target = $(href);
      if ($target.length === 0) { return; }
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $target.offset().top - 60
      }, 320);
    });

    /* ---- Reveal on scroll (fade-in, 단정한 톤) ---- */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        io.observe(el);
      });
    }

  });
})(jQuery);
