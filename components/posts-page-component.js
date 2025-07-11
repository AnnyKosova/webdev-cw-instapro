import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user, renderApp } from "../index.js";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { likePost, dislikePost } from "../api.js";

export function renderPostsPageComponent({ appEl, isUserPage = false, userId = null }) {
  // Фильтруем посты, если это страница пользователя
  const displayedPosts = isUserPage 
    ? posts.filter(post => post.user.id === userId)
    : posts;

  // Формируем заголовок
  const headerHtml = isUserPage
    ? `<div class="header-container">
         <div class="page-header">
           <button class="back-button">&larr;</button>
           <h1>Посты пользователя</h1>
         </div>
       </div>`
    : `<div class="header-container"></div>`;

  const postsHtml = displayedPosts.map((post) => {
    const createdAt = formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
      locale: ru,
    });

    return `
      <li class="post">
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
          ${post.description}
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
      <ul class="posts">
        ${postsHtml.length ? postsHtml : '<p class="no-posts-message">Пользователь пока не добавил постов</p>'}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  if (isUserPage) {
    // Обработка кнопки "Назад"
    document.querySelector(".back-button").addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });
  } else {
    // Обычный рендеринг хедера
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
  }

  // Обработка клика на пользователя (переход на страницу пользователя)
  document.querySelectorAll(".post-header").forEach((userEl) => {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  });

  // Обработка лайков
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
}