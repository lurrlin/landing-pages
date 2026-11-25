/* ==========================================================================
   CONFIGURAÇÃO CENTRALIZADA DO ESTABELECIMENTO (TEMPLATE CORINGA)
   Para adaptar a qualquer nicho (confeitaria, barbearia, clínica, oficina, pet),
   altere apenas as constantes abaixo.
   ========================================================================== */
const WHATSAPP_NUMBER = "5547992263903";

const SITE_CONFIG = {
  nomeNegocio: "Confeitaria Dona Sonia",
  whatsappExibicao: "(47) 99226-3903",
  // Textos de abertura no WhatsApp (ex. outros nichos: "gostaria de agendar um horário" / "gostaria de solicitar um orçamento")
  mensagemGeral: "gostaria de fazer uma encomenda.",
  mensagemItemPrefixo: "gostaria de encomendar",
  // Informe o endereço real do Instagram quando disponível (ex: "https://instagram.com/sualoja").
  // Enquanto permanecer vazio (""), nenhum link fictício será exibido na página.
  instagramUrl: "",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Prefeitura+Municipal+de+Brusque%2C+Pra%C3%A7a+das+Bandeiras%2C+77+-+Centro+I%2C+Brusque+-+SC"
};

function buildWhatsAppUrl(itemName) {
  const text = itemName
    ? `Olá! Vi o site da ${SITE_CONFIG.nomeNegocio} e ${SITE_CONFIG.mensagemItemPrefixo}: ${itemName}`
    : `Olá! Vi o site da ${SITE_CONFIG.nomeNegocio} e ${SITE_CONFIG.mensagemGeral}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function initExternalLinks() {
  const whatsappLinks = document.querySelectorAll("[data-whatsapp]");
  whatsappLinks.forEach((link) => {
    const item = link.getAttribute("data-item");
    link.setAttribute("href", buildWhatsAppUrl(item));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  const whatsappDisplays = document.querySelectorAll("[data-whatsapp-display]");
  whatsappDisplays.forEach((el) => {
    el.textContent = `WhatsApp: ${SITE_CONFIG.whatsappExibicao}`;
  });

  const mapsLinks = document.querySelectorAll("[data-maps]");
  mapsLinks.forEach((link) => {
    link.setAttribute("href", SITE_CONFIG.mapsUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  const instagramLinks = document.querySelectorAll("[data-instagram]");
  instagramLinks.forEach((link) => {
    const cleanUrl = SITE_CONFIG.instagramUrl.trim();
    if (cleanUrl) {
      link.setAttribute("href", cleanUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.classList.remove("hidden");
    } else {
      link.classList.add("hidden");
      link.removeAttribute("href");
    }
  });
}

function initImageFallbacks() {
  const images = document.querySelectorAll("img[data-fallback-label]");
  images.forEach((img) => {
    const applyFallback = () => {
      if (img.dataset.fallbackApplied === "true") return;
      img.dataset.fallbackApplied = "true";

      const wrapper = img.parentElement;
      if (!wrapper) return;

      const label = img.getAttribute("data-fallback-label") || img.getAttribute("alt") || SITE_CONFIG.nomeNegocio;
      const fallback = document.createElement("div");
      fallback.className = "img-fallback";
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", label);

      fallback.innerHTML = `
        <svg class="w-8 h-8 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="text-sm font-medium">${label}</span>
      `;

      img.replaceWith(fallback);
    };

    img.addEventListener("error", applyFallback);
    if (img.complete && img.naturalWidth === 0) {
      applyFallback();
    }
  });
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggleScrolled = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  toggleScrolled();
  window.addEventListener("scroll", toggleScrolled, { passive: true });
}

function initScrollReveal() {
  const staggerGroups = document.querySelectorAll("[data-stagger-group]");
  staggerGroups.forEach((group) => {
    const items = group.querySelectorAll(".reveal");
    items.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 70}ms`);
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -24px 0px"
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initExternalLinks();
  initImageFallbacks();
  initHeaderScroll();
  initScrollReveal();
});
