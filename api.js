const personalKey = "prod";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Ошибка при загрузке постов");
        });
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function getUserPosts({ token, userId }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Ошибка при загрузке постов пользователя");
        });
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Ошибка при регистрации");
        });
      }
      return response.json();
    });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Ошибка при входе");
        });
      }
      return response.json();
    });
}

export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Ошибка при загрузке изображения");
        });
      }
      return response.json();
    });
}

export function addPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description, imageUrl }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Ошибка при добавлении поста");
        });
      }
      return response.json();
    });
}

export function likePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Ошибка при установке лайка");
        });
      }
      return response.json();
    });
}

export function dislikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Ошибка при снятии лайка");
        });
      }
      return response.json();
    });
}
