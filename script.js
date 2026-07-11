document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.getElementById("siteHeader");
  const updateHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const chatToggle = document.getElementById("chatToggle");
  const assistantPanel = document.getElementById("assistantPanel");
  const assistantClose = document.getElementById("assistantClose");
  const assistantForm = document.getElementById("assistantForm");
  const assistantInput = document.getElementById("assistantInput");
  const assistantMessages = document.getElementById("assistantMessages");

  const addMessage = (text, type) => {
    if (!assistantMessages) return;
    const message = document.createElement("div");
    message.className = type === "user" ? "user-message" : "bot-message";
    message.textContent = text;
    assistantMessages.appendChild(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  };

  const getReply = (question) => {
    const q = question.toLowerCase();

    if (/(price|cost|how much|tarif|prix)/.test(q)) {
      return "Pricing depends on the number of pages and features. Send a short description of your project to receive a clear quote.";
    }
    if (/(delivery|how long|time|delay|days|délai|combien de temps)/.test(q)) {
      return "Most standard websites are delivered in 1 to 2 days. Larger projects may take longer.";
    }
    if (/(service|offer|website|redesign|landing|seo|mobile)/.test(q)) {
      return "NG Visuals creates custom business websites, redesigns, landing pages, portfolios and mobile-optimized, SEO-ready websites.";
    }
    if (/(revision|change|modify|modification)/.test(q)) {
      return "Yes. Revisions are included so the design, content and structure can be adjusted to your needs.";
    }
    if (/(contact|email|message|whatsapp|book|start)/.test(q)) {
      return "Email alexandar.ngoranov@gmail.com or use the Message and WhatsApp buttons in the contact section.";
    }
    if (/(free|proposal|concept)/.test(q)) {
      return "You can request a free, no-obligation proposal. Describe your business, preferred style and the main goal of the website.";
    }
    return "I can help with pricing, delivery, services, revisions and contact details. For a specific project, email alexandar.ngoranov@gmail.com.";
  };

  if (chatToggle && assistantPanel) {
    chatToggle.addEventListener("click", () => {
      assistantPanel.classList.toggle("open");
      if (assistantPanel.classList.contains("open") && assistantInput) assistantInput.focus();
    });
  }

  if (assistantClose && assistantPanel) {
    assistantClose.addEventListener("click", () => assistantPanel.classList.remove("open"));
  }

  document.querySelectorAll(".quick-questions button").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.getAttribute("data-question") || "";
      if (!question) return;
      addMessage(question, "user");
      window.setTimeout(() => addMessage(getReply(question), "bot"), 250);
    });
  });

  if (assistantForm && assistantInput) {
    assistantForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = assistantInput.value.trim();
      if (!question) return;
      addMessage(question, "user");
      assistantInput.value = "";
      window.setTimeout(() => addMessage(getReply(question), "bot"), 250);
    });
  }

  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursorGlow.classList.add("active");
    });
    document.addEventListener("mouseleave", () => cursorGlow.classList.remove("active"));
  }

  const reviewsTrack = document.getElementById("reviewsTrack");
  const reviewsPrev = document.querySelector(".review-arrow.prev");
  const reviewsNext = document.querySelector(".review-arrow.next");

  if (reviewsTrack && reviewsPrev && reviewsNext) {
    const reviewCards = Array.from(reviewsTrack.children);
    let reviewIndex = 0;

    const visibleReviews = () => {
      if (window.innerWidth <= 590) return 1;
      if (window.innerWidth <= 920) return 2;
      return 3;
    };

    const updateReviews = () => {
      const visible = visibleReviews();
      const maxIndex = Math.max(0, reviewCards.length - visible);
      reviewIndex = Math.min(reviewIndex, maxIndex);
      const gap = 18;
      const viewportWidth = reviewsTrack.parentElement.clientWidth;
      const cardWidth = (viewportWidth - gap * (visible - 1)) / visible;
      reviewsTrack.style.transform = `translateX(-${reviewIndex * (cardWidth + gap)}px)`;
    };

    reviewsPrev.addEventListener("click", () => {
      reviewIndex = Math.max(0, reviewIndex - 1);
      updateReviews();
    });

    reviewsNext.addEventListener("click", () => {
      const maxIndex = Math.max(0, reviewCards.length - visibleReviews());
      reviewIndex = Math.min(maxIndex, reviewIndex + 1);
      updateReviews();
    });

    window.addEventListener("resize", updateReviews);
    updateReviews();
  }

});
