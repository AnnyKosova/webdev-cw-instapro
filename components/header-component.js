import { logout, user } from '../app-state.js'; 
import { goToPage } from '../index.js';
import { ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";

/**
 * Компонент заголовка страницы.
 * Этот компонент отображает шапку страницы с логотипом, кнопкой добавления постов/входа и кнопкой выхода (если пользователь авторизован).
 * 
 * @param {HTMLElement} params.element - HTML-элемент, в который будет рендериться заголовок.
 * @param {string} params.currentPage - Текущая страница (из routes.js)
 * @returns {HTMLElement} Возвращает элемент заголовка после рендеринга.
 */
export function renderHeaderComponent({ element, currentPage }) {
  if (currentPage === USER_POSTS_PAGE) {
    element.innerHTML = `
      <div class="page-header">
        <button class="back-button">&larr;</button>
        <h1 class="logo">instapro</h1>
      </div>
    `;
    
    element.querySelector(".back-button").addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });
    
    return element;
  }

  element.innerHTML = `
    <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button${user ? '' : ' login-header-btn'}">
        ${
          user
            ? `<div title="Добавить пост" class="add-post-sign"></div>`
            : "Войти"
        }
      </button>
      ${
        user
          ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>`
          : ""
      }  
    </div>
  `;

  element
    .querySelector(".add-or-login-button")
    .addEventListener("click", () => {
      if (user) {
        goToPage(ADD_POSTS_PAGE);
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  element.querySelector(".logout-button")?.addEventListener("click", () => {
    if (confirm("Вы уверены, что хотите выйти?")) {
      logout();
    }
  });

  return element;
}