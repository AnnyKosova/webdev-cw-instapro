console.log("Script loaded!"); 

import { addPost, getPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
  showToast
} from "./helpers.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";

export let user = getUserFromLocalStorage();
export let page = null; 
export let data = null;

import { getToken, posts, setUser as setAppStateUser, setPosts } from './app-state.js';

/**
 * Функция перехода между страницами
 */
export const goToPage = (newPage, newData) => {
  if (newPage === POSTS_PAGE && page !== LOADING_PAGE) {
    page = LOADING_PAGE;
    data = newData;
    renderApp();

    return getPosts({ token: getToken() })
      .then((newPosts) => {
        setPosts(newPosts);
        page = POSTS_PAGE;
        renderApp();
      })
      .catch((error) => {
        console.error(error);
        goToPage(POSTS_PAGE);
      });
  }
  
  page = newPage;
  data = newData;
  renderApp();
};

/**
 * Рендер приложения
 */
export const renderApp = () => {
  const appEl = document.getElementById("app");
  
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        setAppStateUser(newUser); 
        saveUserToLocalStorage(user);
        showToast("Успешный вход!", "success");
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick: ({ description, imageUrl }) => {
        goToPage(LOADING_PAGE);
        
        addPost({ token: getToken(), description, imageUrl })
          .then(() => getPosts({ token: getToken() }))
          .then((newPosts) => {
            setPosts(newPosts);
            console.log("Финальные посты:", posts);
            showToast("Пост успешно опубликован!", "success");
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            console.error(error);
            showToast(error.message || "Ошибка при добавлении поста", "error");
            goToPage(ADD_POSTS_PAGE);
          });
      }
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      isUserPage: true,
      userId: data.userId
    });
  }
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

goToPage(POSTS_PAGE);

const scrollBtn = document.getElementById("scroll-to-top-btn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});