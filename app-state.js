import { getUserFromLocalStorage, removeUserFromLocalStorage } from "./helpers.js";
import { goToPage } from "./index.js"; 
import { POSTS_PAGE } from "./routes.js";

export let user = getUserFromLocalStorage();
export let posts = [];
export function setPosts(newPosts) {
  posts = newPosts;
}
export let data = null;

export function setUser(newUser) {
  user = newUser;
}

export const getToken = () => {
  return user ? `Bearer ${user.token}` : undefined;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

