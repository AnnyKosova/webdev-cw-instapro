import { dislikePost, likePost } from "../api.js";
import { getToken, posts, user } from '../app-state.js';
import { goToPage, renderApp } from '../index.js';
import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderPostsPageComponent({ appEl, isUserPage = false, userId = null }) {
    console.log("Старт рендера. Посты:", posts.length);
    
    appEl.innerHTML = '';
  const displayedPosts = isUserPage 
    ? posts.filter(post => post.user.id === userId)
    : posts;

  const headerHtml = isUserPage
    ? `<div class="header-container">
         <div class="page-header">
           <button class="back-button">&larr;</button>
           <h1>Посты пользователя</h1>
         </div>
       </div>`
    : `<div class="header-container"></div>`;

  let infoBannerHtml = '';
  if (!user && !isUserPage) {
    infoBannerHtml = `
      <div class="info-banner" style="background:#f0f4ff;padding:16px 20px;margin-bottom:16px;border-radius:8px;text-align:center;">
        <span style="font-size:16px;">Войдите или зарегистрируйтесь, чтобы делиться своими фото и ставить лайки!</span>
      </div>
    `;
  }

  const postsHtml = displayedPosts.map((post) => {
    console.log("Рендер поста:", post.id); 
    const createdAt = dayjs(post.createdAt).fromNow();

    return `
      <li class="post post-fade-in">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="./assets/images/${post.isLiked ? 'like-active' : 'like-not-active'}.svg">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${escapeHTML(post.description)}
        </p>
        <p class="post-date">
          ${createdAt}
        </p>
      </li>
    `;
  }).join('');

  const appHtml = `
    <div class="page-container">
      ${headerHtml}
      ${infoBannerHtml}
      <ul class="posts">
        ${postsHtml.length ? postsHtml : '<p class="no-posts-message">Пользователь пока не добавил постов</p>'}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  if (isUserPage) {
    document.querySelector(".back-button").addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });
  } else {
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
  }

  document.querySelectorAll(".post-header").forEach((userEl) => {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  });

  document.querySelectorAll(".like-button").forEach((likeButton) => {
    likeButton.addEventListener("click", () => {
      if (!user) {
        alert("Для лайков нужно авторизоваться");
        return;
      }

      const postId = likeButton.dataset.postId;
      const post = posts.find((post) => post.id === postId);
      const isLiked = post.isLiked;

      if (isLiked) {
        dislikePost({ token: getToken(), postId })
          .then((newPost) => {
            const postIndex = posts.findIndex((post) => post.id === postId);
            posts[postIndex] = newPost.post;
            renderApp();
          })
          .catch((error) => {
            console.error("Ошибка при снятии лайка:", error);
          });
      } else {
        likePost({ token: getToken(), postId })
          .then((newPost) => {
            const postIndex = posts.findIndex((post) => post.id === postId);
            posts[postIndex] = newPost.post;
            renderApp();
          })
          .catch((error) => {
            console.error("Ошибка при установке лайка:", error);
          });
      }
    });
  });

  if (!isUserPage && !user) {
    document.querySelector(".login-banner-btn")?.addEventListener("click", () => {
      goToPage("auth");
    });
    document.querySelector(".register-banner-btn")?.addEventListener("click", () => {
      goToPage("auth");
    });
  }
}