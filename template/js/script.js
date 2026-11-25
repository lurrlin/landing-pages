const SITE_CONFIG = {
  nomeNegocio: "Confeitaria Dona Sonia",
  whatsapp: "5555999999999",
  instagramUrl: "https://instagram.com/confeitariadonasonia",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+J%C3%BAlio+de+Castilhos%2C+450+-+Centro%2C+Tr%C3%AAs+Passos+-+RS"
};

function buildWhatsAppUrl(itemName) {
  const text = itemName
    ? `Olá! Vi o site da ${SITE_CONFIG.nomeNegocio} e gostaria de encomendar: ${itemName}`
    : `Olá! Vi o site da ${SITE_CONFIG.nomeNegocio} e gostaria de fazer uma encomenda.`;

  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

function initExternalLinks() {
  const whatsappLinks = document.querySelectorAll("[data-whatsapp]");
  whatsappLinks.forEach((link) => {
    const item = link.getAttribute("data-item");
    link.setAttribute("href", buildWhatsAppUrl(item));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  const instagramLinks = document.querySelectorAll("[data-instagram]");
  instagramLinks.forEach((link) => {
    link.setAttribute("href", SITE_CONFIG.instagramUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  const mapsLinks = document.querySelectorAll("[data-maps]");
  mapsLinks.forEach((link) => {
    link.setAttribute("href", SITE_CONFIG.mapsUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
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
  initHeaderScroll();
  initScrollReveal();
});
