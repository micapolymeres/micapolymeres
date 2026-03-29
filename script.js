// Static site JS only (no external scripts, no popups/widgets).

function toggleMobileNav() {
  const btn = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");
  if (!btn || !nav) return;

  const isOpen = nav.getAttribute("data-open") === "true";
  const next = !isOpen;
  nav.setAttribute("data-open", String(next));
  btn.setAttribute("aria-expanded", String(next));
}

function setupMobileNav() {
  const btn = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => toggleMobileNav());

  // Close after clicking a nav link (mobile).
  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName !== "A") return;
    nav.setAttribute("data-open", "false");
    btn.setAttribute("aria-expanded", "false");
  });
}

function setupSmoothScroll() {
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const link = target.closest("a[href^='#']");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (href === "#") return;
    const el = document.querySelector(href);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setupProductPrefill() {
  const links = document.querySelectorAll("[data-product-link]");
  if (!links.length) return;

  links.forEach((a) => {
    a.addEventListener("click", () => {
      const productCard = a.closest(".product");
      const title = productCard ? productCard.querySelector("h3") : null;
      const productName = title ? title.textContent.trim() : "";

      const textarea = document.querySelector('textarea[name="message"]');
      if (!textarea) return;

      if (productName) {
        const prefix = `Produit: ${productName}\n`;
        textarea.value = textarea.value ? prefix + textarea.value : prefix;
      }
    });
  });
}

function setupProductModal() {
  const modal = document.getElementById("productModal");
  const image = document.getElementById("productModalImage");
  const title = document.getElementById("productModalTitle");
  const desc = document.getElementById("productModalDesc");
  if (!modal || !image || !title || !desc) return;

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const open = (productCard) => {
    const productTitle = productCard.dataset.productName || "";
    const productDesc = productCard.dataset.productDesc || "Produit de haute qualité destiné aux travaux de construction et finitions professionnelles.";
    const productImg = productCard.querySelector("img");
    if (!productImg) return;

    image.src = productImg.src;
    image.alt = productImg.alt || productTitle;
    title.textContent = productTitle || productImg.alt || "Détail produit";
    desc.textContent = productDesc;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  document.querySelectorAll("[data-product-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const card = link.closest(".product");
      if (!card) return;
      open(card);
    });
  });

  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      close();
    }
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form || !note) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // HTML5 validation UI.
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const company = String(data.get("company") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const topic = String(data.get("topic") || "");
    const message = String(data.get("message") || "");

    // Use a mailto link so the page works without a backend.
    const to = "contact@micapolymeres.com";
    const subject = encodeURIComponent(`Mica Polymères - ${topic} (site web)`);
    const body = encodeURIComponent(
      [
        `Nom: ${name}`,
        `Entreprise: ${company}`,
        `Email: ${email}`,
        `Téléphone: ${phone}`,
        `Type de demande: ${topic}`,
        "",
        "Message:",
        message,
      ].join("\n")
    );
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

    note.textContent = "Ouverture de votre client email pour finaliser l’envoi…";
    note.style.opacity = "1";

    // Open mail client; keep UI responsive.
    window.location.href = mailto;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNav();
  setupSmoothScroll();
  setupProductPrefill();
  setupProductModal();
  setupContactForm();
});

