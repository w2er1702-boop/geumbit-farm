/* =========================================================================
   금빛농원 — 제품 데이터 + 카드 렌더러 (시안)
   가격·네이버 상품번호는 기존 운영값 기반. 별점/후기수는 [샘플].
   운영 전환 시 Cafe24 상품모듈/변수로 교체.
   ========================================================================= */
(function () {
  "use strict";

  // category → filter group. 선물세트 vs 단품 + 세부.
  var PRODUCTS = [
    {
      slug: "golden-sanghwang-jinaek",
      category: "진액",
      name: "유기농 황금상황버섯 진액 90ml × 30포",
      desc: "한 달 분량, 바로 마시는 진액 파우치",
      weight: "90ml × 30포",
      regular: 140000, sale: 112000,
      rating: 4.9, reviews: 38,
      naver: "9618082831", featured: true
    },
    {
      slug: "golden-sanghwang-fermented",
      category: "발효액",
      name: "유기농 황금상황버섯 발효액 1박스",
      desc: "오랜 시간 정성으로 발효한 프리미엄 발효액",
      weight: "1박스",
      regular: 275000, sale: 220000,
      rating: 4.8, reviews: 21,
      naver: "5082878950", featured: true
    },
    {
      slug: "golden-sanghwang-slice-250g",
      category: "슬라이스",
      name: "유기농 황금상황버섯 슬라이스 250g",
      desc: "한탄강 무농약 재배, 차로 우려내기 좋은 슬라이스",
      weight: "250g",
      regular: 125000, sale: 97500,
      rating: 4.9, reviews: 27,
      naver: "5698323054", featured: true
    },
    {
      slug: "golden-sanghwang-whole-250g",
      category: "원물",
      name: "유기농 황금상황버섯 원물 250g",
      desc: "황금빛이 진하게 도는 자연 그대로의 원물",
      weight: "250g",
      regular: 125000, sale: 97500,
      rating: 4.8, reviews: 19,
      naver: "5340102366"
    },
    {
      slug: "sanghwang-set-500g",
      category: "선물세트",
      name: "상황버섯 원물 + 슬라이스 세트 500g",
      desc: "원물과 슬라이스를 함께, 선물용 추천 구성",
      weight: "500g (원물+슬라이스)",
      regular: 240000, sale: 189600,
      rating: 5.0, reviews: 14,
      naver: "5698311824"
    },
    {
      slug: "oak-sanghwang-100g",
      category: "원물",
      name: "농장직송 국산 유기농 참나무 상황버섯 100g",
      desc: "넉넉한 100g, 가정 상비 용량",
      weight: "100g",
      regular: 47500, sale: 38000,
      rating: 4.7, reviews: 45,
      naver: "5340080202"
    },
    {
      slug: "golden-sanghwang-whole-500g",
      category: "원물",
      name: "유기농 황금상황버섯 원물 500g",
      desc: "장기 상비 원물, 황금색 진한 등급",
      weight: "500g",
      regular: 240000, sale: 189600,
      rating: 4.9, reviews: 11,
      naver: "5698300321"
    },
    {
      slug: "golden-sanghwang-slice-500g",
      category: "슬라이스",
      name: "유기농 황금상황버섯 슬라이스 500g",
      desc: "넉넉한 슬라이스 대용량, 가족 상비",
      weight: "500g",
      regular: 240000, sale: 189600,
      rating: 4.8, reviews: 9,
      naver: "5697907443"
    },
    {
      slug: "oak-sanghwang-30g",
      category: "원물",
      name: "농장직송 국산 유기농 참나무 상황버섯 30g",
      desc: "참나무 원목에서 자란 황금상황버섯 입문 용량",
      weight: "30g",
      regular: 14000, sale: 12000,
      rating: 4.6, reviews: 52,
      naver: "5278026194"
    }
  ];

  // 네이버 스마트스토어 fallback (식스샵/Cafe24 전환 전까지 구매 라우팅)
  var NAVER_STORE = "https://smartstore.naver.com/ycgoldenfarm";
  function buyUrl(p) {
    return p.naver
      ? "https://smartstore.naver.com/ycgoldenfarm/products/" + p.naver
      : NAVER_STORE;
  }

  function won(n) { return n.toLocaleString("ko-KR"); }
  function off(p) { return Math.round((1 - p.sale / p.regular) * 100); }

  function stars(rating, reviews) {
    var full = Math.round(rating);
    var row = "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
    return (
      '<span class="stars"><span class="star-row">' + row + "</span>" +
      '<span class="count">' + rating.toFixed(1) +
      (reviews != null ? " · 후기 " + reviews : "") + "</span></span>"
    );
  }

  // media box: placeholder block shows by default; a real photo fades in on top
  // when it successfully loads (SPEC 2-3). Missing file → placeholder stays.
  function media(p) {
    var file = "assets/img/photo/" + p.slug + ".jpg";
    return (
      '<div class="media">' +
        '<img class="media-img" src="' + file + '" alt="' + p.name +
          '" loading="lazy" onload="this.classList.add(\'loaded\')">' +
        '<div class="ph">' +
          '<span class="ph-slot">PHOTO · ' + p.slug + "</span>" +
          '<span class="ph-meta">/img/photo/' + p.slug + ".jpg · 1:1</span>" +
          '<span class="ph-note">실사 준비 중</span>' +
        "</div>" +
      "</div>"
    );
  }

  function card(p) {
    return (
      '<a class="card" href="product-detail.html?p=' + p.slug + '" data-cat="' + p.category + '">' +
      '<div style="position:relative">' +
        '<span class="card-tag">' + p.category + "</span>" +
        media(p) +
      "</div>" +
      '<div class="card-body">' +
        '<h3 class="card-name">' + p.name + "</h3>" +
        '<p class="card-desc">' + p.desc + "</p>" +
        stars(p.rating, p.reviews) +
        '<div class="card-foot"><div class="price">' +
          '<span class="regular">' + won(p.regular) + "원</span>" +
          '<span class="sale">' + won(p.sale) + '<span class="won">원</span></span>' +
          '<span class="off">' + off(p) + "%</span>" +
        "</div></div>" +
      "</div>" +
      "</a>"
    );
  }

  function render() {
    // grids
    document.querySelectorAll("[data-products-grid]").forEach(function (grid) {
      var list = PRODUCTS.slice();
      if (grid.hasAttribute("data-featured")) list = list.filter(function (p) { return p.featured; });
      var limit = parseInt(grid.getAttribute("data-limit"), 10);
      if (!isNaN(limit)) list = list.slice(0, limit);
      grid.innerHTML = list.map(card).join("");
    });

    // filter chips (제품 목록)
    var filterBar = document.querySelector("[data-product-filters]");
    var fullGrid = document.querySelector("[data-products-grid][data-filterable]");
    if (filterBar && fullGrid) {
      var cats = ["전체"].concat(
        PRODUCTS.map(function (p) { return p.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; })
      );
      filterBar.innerHTML = cats
        .map(function (c, i) {
          return '<button class="chip" aria-pressed="' + (i === 0) + '" data-filter="' + c + '">' + c + "</button>";
        })
        .join("");
      filterBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".chip");
        if (!btn) return;
        filterBar.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        var f = btn.getAttribute("data-filter");
        fullGrid.querySelectorAll(".card").forEach(function (card) {
          var show = f === "전체" || card.getAttribute("data-cat") === f;
          card.style.display = show ? "" : "none";
        });
      });
    }

    // PDP hydration (?p=slug)
    var pdp = document.querySelector("[data-pdp]");
    if (pdp) hydratePdp(pdp);
  }

  function hydratePdp(root) {
    var params = new URLSearchParams(location.search);
    var slug = params.get("p");
    var p = PRODUCTS.filter(function (x) { return x.slug === slug; })[0] || PRODUCTS[0];
    var set = function (sel, html) { var el = root.querySelector(sel); if (el) el.innerHTML = html; };
    set("[data-pdp-cat]", p.category);
    set("[data-pdp-name]", p.name);
    set("[data-pdp-stars]", stars(p.rating, p.reviews));
    set("[data-pdp-price]",
      '<div class="price"><span class="regular">' + won(p.regular) + "원</span>" +
      '<span class="sale">' + won(p.sale) + '<span class="won">원</span></span>' +
      '<span class="off">' + off(p) + "% 할인</span></div>");
    set("[data-pdp-weight]", p.weight);
    var crumb = root.querySelector("[data-pdp-crumb]");
    if (crumb) crumb.textContent = p.name;
    // buy button → naver fallback (stub buttons remain non-functional per SPEC)
    var buy = root.querySelector("[data-pdp-buy]");
    if (buy) { buy.href = buyUrl(p); buy.target = "_blank"; buy.rel = "noopener"; }
    document.title = p.name + " · 금빛농원";
  }

  window.GBProducts = { render: render, list: PRODUCTS };
})();
