/**
 * SocialNet - Main Application JavaScript
 * Premium Social Network Platform
 */

class SocialNet {
  constructor() {
    this.init();
  }

  init() {
    this.initTheme();
    this.initMobileMenu();
    this.initDropdowns();
    this.initModals();
    this.initTabs();
    this.initToasts();
    this.initReactions();
    this.initPasswordStrength();
    this.initFileUpload();
    this.initInfiniteScroll();
    this.initNotifications();
    this.initFormValidation();
    this.initTooltips();
    this.initSmoothScroll();
    this.initRippleEffect();
    this.initSearch();
    this.initPostCreation();
    this.initEmojiPicker();

    console.log(`%c SocialNet v1.0 `, 'background: #6C5CE7; color: white; font-size: 14px; padding: 4px 8px; border-radius: 4px;');
  }

  // ============================================================
  // THEME
  // ============================================================

  initTheme() {
    const savedTheme = localStorage.getItem('sn-theme') || 'system';

    this.applyTheme(savedTheme);

    document.querySelectorAll('[data-theme-toggle]').forEach(el => {
      el.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
        localStorage.setItem('sn-theme', next);
      });
    });
  }

  applyTheme(theme) {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // Update theme icons
    document.querySelectorAll('[data-theme-toggle] i').forEach(icon => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    });
  }

  // ============================================================
  // MOBILE MENU
  // ============================================================

  initMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');

    document.querySelectorAll('[data-toggle="sidebar"]').forEach(el => {
      el.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
        backdrop?.classList.toggle('show');
        document.body.style.overflow = sidebar?.classList.contains('open') ? 'hidden' : '';
      });
    });

    backdrop?.addEventListener('click', () => {
      sidebar?.classList.remove('open');
      backdrop.classList.remove('show');
      document.body.style.overflow = '';
    });
  }

  // ============================================================
  // DROPDOWNS
  // ============================================================

  initDropdowns() {
    document.addEventListener('click', (e) => {
      const dropdown = e.target.closest('.dropdown');
      const menu = dropdown?.querySelector('.dropdown-menu');

      if (menu) {
        const isOpen = menu.classList.contains('show');
        this.closeAllDropdowns();
        if (!isOpen) {
          menu.classList.add('show');
        }
        e.stopPropagation();
      } else {
        this.closeAllDropdowns();
      }
    });
  }

  closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  }

  // ============================================================
  // MODALS
  // ============================================================

  initModals() {
    document.querySelectorAll('[data-modal]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = el.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal) this.openModal(modal);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.closeModal(backdrop);
        }
      });

      const closeBtn = backdrop.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal(backdrop));
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.show').forEach(m => this.closeModal(m));
      }
    });
  }

  openModal(modalBackdrop) {
    modalBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalBackdrop) {
    modalBackdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  // ============================================================
  // TABS
  // ============================================================

  initTabs() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
      tabGroup.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;
          tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          if (target) {
            const container = tab.closest('[data-tab-container]') || tabGroup.parentElement;
            container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            const panel = container.querySelector(`#${target}`) || container.querySelector(`[data-tab-panel="${target}"]`);
            if (panel) panel.classList.add('active');
          }
        });
      });
    });
  }

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================

  initToasts() {
    // Auto-hide existing toasts
    document.querySelectorAll('.toast').forEach(toast => {
      this.scheduleToastRemoval(toast);
    });
  }

  showToast(message, type = 'info', title = '') {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    const titles = { success: 'Sucesso!', error: 'Erro!', warning: 'Atenção!', info: 'Informação' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></div>
      <div class="toast-content">
        <div class="toast-title">${title || titles[type] || ''}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="SocialNet.closeToast(this.parentElement)"><i class="fas fa-times"></i></button>
    `;

    container.appendChild(toast);
    this.scheduleToastRemoval(toast);
  }

  static closeToast(toast) {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }

  scheduleToastRemoval(toast) {
    setTimeout(() => {
      if (document.body.contains(toast)) {
        SocialNet.closeToast(toast);
      }
    }, 5000);

    toast.querySelector('.toast-close')?.addEventListener('click', () => {
      SocialNet.closeToast(toast);
    });
  }

  // ============================================================
  // REACTIONS
  // ============================================================

  initReactions() {
    document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        // Toggle reaction popup
        const existing = btn.querySelector('.reaction-picker');
        if (existing) {
          existing.remove();
          return;
        }

        // Remove any other open pickers
        document.querySelectorAll('.reaction-picker').forEach(p => p.remove());

        const picker = document.createElement('div');
        picker.className = 'reaction-picker animate__animated animate__bounceIn';
        picker.style.position = 'absolute';
        picker.style.bottom = '100%';
        picker.style.left = '50%';
        picker.style.transform = 'translateX(-50%)';
        picker.style.marginBottom = '8px';

        const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🤔', '💡'];
        emojis.forEach(emoji => {
          const button = document.createElement('button');
          button.textContent = emoji;
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.sendReaction(btn.dataset.type, btn.dataset.id, emoji);
            picker.remove();
          });
          picker.appendChild(button);
        });

        btn.appendChild(picker);
      });
    });
  }

  sendReaction(type, id, emoji) {
    // AJAX call would go here
    console.log(`Reaction: ${emoji} on ${type} #${id}`);
    this.showToast('Reação adicionada!', 'success');
  }

  // ============================================================
  // PASSWORD STRENGTH
  // ============================================================

  initPasswordStrength() {
    document.querySelectorAll('[data-password-strength]').forEach(input => {
      const container = input.parentElement.querySelector('.password-strength');
      if (!container) return;

      input.addEventListener('input', () => {
        const score = this.calculatePasswordScore(input.value);
        const bars = container.querySelectorAll('.strength-bar');
        const levels = ['weak', 'medium', 'strong', 'very-strong'];

        bars.forEach((bar, i) => {
          bar.className = 'strength-bar';
          if (i < score.level) {
            bar.classList.add('active', levels[Math.min(i, levels.length - 1)]);
          }
        });
      });
    });
  }

  calculatePasswordScore(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return {
      score: Math.min(score, 4),
      level: Math.min(score, 4),
    };
  }

  // ============================================================
  // FILE UPLOAD
  // ============================================================

  initFileUpload() {
    document.querySelectorAll('[data-file-upload]').forEach(wrapper => {
      const input = wrapper.querySelector('input[type="file"]');
      const preview = wrapper.querySelector('.upload-preview');
      const trigger = wrapper.querySelector('.upload-trigger');

      trigger?.addEventListener('click', () => input?.click());
      input?.addEventListener('change', () => this.handleFilePreview(input, preview));
    });
  }

  handleFilePreview(input, preview) {
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!preview) return;

    preview.innerHTML = '';

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="upload-preview-img">`;
      };
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = `
        <div class="upload-preview-file">
          <i class="fas fa-file"></i>
          <span>${file.name}</span>
          <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
        </div>
      `;
    }
  }

  // ============================================================
  // INFINITE SCROLL
  // ============================================================

  initInfiniteScroll() {
    const sentinel = document.querySelector('[data-infinite-scroll]');
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadMore(sentinel);
        }
      });
    }, { rootMargin: '200px' });

    observer.observe(sentinel);
  }

  loadMore(sentinel) {
    const url = sentinel.dataset.url || window.location.pathname;
    const page = parseInt(sentinel.dataset.page || '1') + 1;

    sentinel.dataset.page = page;

    fetch(`${url}?page=${page}`, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(response => response.text())
    .then(html => {
      const container = sentinel.closest('[data-feed-container]');
      if (container) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const items = temp.querySelectorAll('[data-post-item]');
        items.forEach(item => container.insertBefore(item, sentinel));
        sentinel.dataset.page = page;

        if (items.length === 0) {
          sentinel.remove();
        }
      }
    })
    .catch(() => {});
  }

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  initNotifications() {
    document.querySelectorAll('[data-notification]').forEach(notif => {
      notif.addEventListener('click', () => {
        const url = notif.dataset.url;
        if (url) window.location.href = url;
      });
    });
  }

  // ============================================================
  // FORM VALIDATION
  // ============================================================

  initFormValidation() {
    document.querySelectorAll('[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });

      form.querySelectorAll('[data-validate-field]').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => {
          if (field.dataset.touched) this.validateField(field);
        });
      });
    });
  }

  validateForm(form) {
    let valid = true;
    form.querySelectorAll('[data-validate-field]').forEach(field => {
      field.dataset.touched = 'true';
      if (!this.validateField(field)) valid = false;
    });
    return valid;
  }

  validateField(field) {
    const rules = (field.dataset.validateField || '').split('|');
    const value = field.value.trim();
    const errorEl = field.parentElement.querySelector('.form-error') || this.createErrorElement(field);
    let errors = [];

    rules.forEach(rule => {
      const [ruleName, ruleParam] = rule.split(':');

      switch (ruleName) {
        case 'required':
          if (!value) errors.push('Este campo é obrigatório.');
          break;
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            errors.push('E-mail inválido.');
          break;
        case 'min':
          if (value && value.length < parseInt(ruleParam))
            errors.push(`Mínimo de ${ruleParam} caracteres.`);
          break;
        case 'max':
          if (value && value.length > parseInt(ruleParam))
            errors.push(`Máximo de ${ruleParam} caracteres.`);
          break;
        case 'username':
          if (value && !/^[a-zA-Z0-9_.]{3,30}$/.test(value))
            errors.push('Usuário: 3-30 caracteres, letras, números, _ e .');
          break;
        case 'password':
          if (value && value.length < 8)
            errors.push('Mínimo de 8 caracteres.');
          break;
        case 'match':
          const matchField = document.querySelector(`[name="${ruleParam}"]`);
          if (matchField && value !== matchField.value)
            errors.push('Os campos não conferem.');
          break;
        case 'url':
          if (value && !/^https?:\/\/.+/.test(value))
            errors.push('URL inválida.');
          break;
      }
    });

    if (errors.length) {
      field.classList.add('error');
      errorEl.textContent = errors[0];
      return false;
    }

    field.classList.remove('error');
    errorEl.textContent = '';
    return true;
  }

  createErrorElement(field) {
    const el = document.createElement('div');
    el.className = 'form-error';
    field.parentElement.appendChild(el);
    return el;
  }

  // ============================================================
  // TOOLTIPS
  // ============================================================

  initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        // Built-in CSS tooltip handles this
      });
    });
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================================
  // RIPPLE EFFECT
  // ============================================================

  initRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        this.style.setProperty('--ripple-x', `${x}%`);
        this.style.setProperty('--ripple-y', `${y}%`);
      });
    });
  }

  // ============================================================
  // SEARCH
  // ============================================================

  initSearch() {
    const searchInput = document.querySelector('.navbar-search .form-input');
    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      const query = searchInput.value.trim();

      if (query.length < 2) {
        this.hideSearchResults();
        return;
      }

      searchTimeout = setTimeout(() => this.performSearch(query), 300);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim().length >= 2) {
        this.showSearchResults();
      }
    });

    // Close search on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar-search')) {
        this.hideSearchResults();
      }
    });
  }

  performSearch(query) {
    // AJAX call would go here
    console.log(`Search: ${query}`);
  }

  showSearchResults() {
    // Show results dropdown
  }

  hideSearchResults() {
    // Hide results dropdown
  }

  // ============================================================
  // POST CREATION
  // ============================================================

  initPostCreation() {
    const postTextarea = document.querySelector('.post-composer textarea');
    if (!postTextarea) return;

    postTextarea.addEventListener('input', () => {
      postTextarea.style.height = 'auto';
      postTextarea.style.height = Math.min(postTextarea.scrollHeight, 300) + 'px';
    });

    // Media preview handling
    document.querySelectorAll('.post-media-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = btn.dataset.accept || 'image/*';
        input.multiple = true;
        input.click();
      });
    });
  }

  // ============================================================
  // EMOJI PICKER
  // ============================================================

  initEmojiPicker() {
    document.querySelectorAll('[data-emoji-picker]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const existing = document.querySelector('.emoji-picker-popup');
        if (existing) {
          existing.remove();
          return;
        }

        const target = btn.dataset.target;
        const input = document.querySelector(target || 'textarea');
        if (!input) return;

        const picker = this.createEmojiPicker(input);
        btn.parentElement.appendChild(picker);
      });
    });
  }

  createEmojiPicker(input) {
    const emojis = ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','🥰','😘','😗','😙','😚','🙂','🤗','🤔','🤩','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','😴','😤','😡','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖','💋','💘','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💝','🎉','🎊','🎈','🔥','⭐','✨','💫','🌟','🌙','☀️','🌈','⛅','🌊','💧','❄️','🌺','🌸','🌹','🌻','🌷','🌿','🍀','🏆','🥇','🥈','🥉','⚽','🏀','🎯','🎮','🎵','🎶','🎤','🎧','📱','💻','⌚','📷','🎁','🎂','🍕','🍔','🌮','🍿','☕','🍺','🍻','🥂','👍','👎','👊','✊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','💪','✌️','🤟','🤘','👌','🤌','🤏','🫶','💅','👀','👁️','👄','👅','🗣️','👤','👥','🫂'];

    const picker = document.createElement('div');
    picker.className = 'emoji-picker-popup animate__animated animate__fadeIn';
    picker.style.cssText = `
      position: absolute; bottom: 100%; right: 0; margin-bottom: 8px;
      width: 320px; max-height: 280px; overflow-y: auto;
      background: var(--bg-elevated); border: 1px solid var(--border-color);
      border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
      padding: var(--space-3); display: flex; flex-wrap: wrap; gap: 4px;
      z-index: 100;
    `;

    emojis.forEach(emoji => {
      const btn = document.createElement('button');
      btn.textContent = emoji;
      btn.type = 'button';
      btn.style.cssText = `
        width: 36px; height: 36px; display: flex; align-items: center;
        justify-content: center; font-size: 20px; border: none;
        background: none; cursor: pointer; border-radius: var(--radius-xs);
        transition: background 0.15s;
      `;
      btn.addEventListener('mouseenter', () => btn.style.background = 'var(--bg-secondary)');
      btn.addEventListener('mouseleave', () => btn.style.background = 'none');
      btn.addEventListener('click', () => {
        const cursorPos = input.selectionStart;
        const text = input.value;
        input.value = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
        input.focus();
        input.selectionStart = input.selectionEnd = cursorPos + emoji.length;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      picker.appendChild(btn);
    });

    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', function closePicker(e) {
        if (!e.target.closest('.emoji-picker-popup') && !e.target.closest('[data-emoji-picker]')) {
          picker.remove();
          document.removeEventListener('click', closePicker);
        }
      });
    }, 0);

    return picker;
  }

  // ============================================================
  // AJAX HELPER
  // ============================================================

  async request(url, options = {}) {
    const defaults = {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': document.querySelector('[name="_csrf_token"]')?.value || '',
      },
    };

    const config = { ...defaults, ...options };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      this.showToast(error.message, 'error');
      throw error;
    }
  }

  // ============================================================
  // DOM READY
  // ============================================================

  static ready() {
    return new Promise(resolve => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', resolve);
      }
    });
  }
}

// Initialize on DOM ready
SocialNet.ready().then(() => {
  window.SocialNet = new SocialNet();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SocialNet;
}
