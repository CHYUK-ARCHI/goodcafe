/**
 * contact.js - 연락처 폼 유효성 검사 및 제출 처리
 * Re-Archive | agents/02_find_skills.py 에 의해 생성됨
 */

(function ContactForm() {
  "use strict";

  const FORM_ID = "contact-form";
  const FIELDS = {
    name:    { required: true,  minLength: 2,   label: "이름" },
    email:   { required: true,  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: "이메일" },
    message: { required: true,  minLength: 10,  label: "메시지" },
  };

  function init() {
    const form = document.getElementById(FORM_ID);
    if (!form) return;

    form.addEventListener("submit", onSubmit);

    // 실시간 유효성 검사 (blur 이벤트)
    Object.keys(FIELDS).forEach((name) => {
      const input = form.elements[name];
      if (input) input.addEventListener("blur", () => validateField(name, input.value));
    });
  }

  function validateField(name, value) {
    const rule = FIELDS[name];
    if (!rule) return true;

    let error = null;
    const trimmed = value.trim();

    if (rule.required && !trimmed) {
      error = `${rule.label}을(를) 입력해 주세요.`;
    } else if (rule.minLength && trimmed.length < rule.minLength) {
      error = `${rule.label}은(는) ${rule.minLength}자 이상이어야 합니다.`;
    } else if (rule.pattern && !rule.pattern.test(trimmed)) {
      error = `올바른 ${rule.label} 형식이 아닙니다.`;
    }

    showFieldError(name, error);
    return !error;
  }

  function showFieldError(name, message) {
    const errorEl = document.getElementById(`${name}-error`);
    if (!errorEl) return;

    if (message) {
      errorEl.textContent = message;
      errorEl.removeAttribute("hidden");
    } else {
      errorEl.textContent = "";
      errorEl.setAttribute("hidden", "");
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;

    Object.keys(FIELDS).forEach((name) => {
      const input = form.elements[name];
      if (input && !validateField(name, input.value)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // 제출 시뮬레이션 (실제 백엔드 연동 필요)
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "전송 중...";
    }

    // Formspree / Netlify Forms 등 연동 지점
    // fetch("https://formspree.io/f/YOUR_ID", { method: "POST", body: new FormData(form) })
    setTimeout(() => {
      form.reset();
      showSuccess();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "보내기";
      }
    }, 1000);
  }

  function showSuccess() {
    const msg = document.createElement("p");
    msg.className = "form-success";
    msg.textContent = "메시지가 전송되었습니다. 감사합니다!";
    msg.setAttribute("role", "alert");
    document.getElementById(FORM_ID)?.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
