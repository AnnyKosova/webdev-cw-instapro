const personalKey = "anna-kosova";
const baseHost = "https://wedev-api.sky.pro";
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
      throw new Error("Ошибка при загрузке постов");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Получены посты:", data.posts); 
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

export function registerUser({ login, password, name }) { 
  return fetch(`${baseHost}/api/user`, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
    }),
  })
  .then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      console.error("Registration error details:", data);
      throw new Error(data.message || data.error || "Ошибка при регистрации");
    }
    return data;
  });
}

export function loginUser({ login, password }) {
  return fetch(`${baseHost}/api/user/login`, {  
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

  return fetch("https://wedev-api.sky.pro/api/upload/image", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Upload failed:", response.status, response.statusText);
        throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Upload error:", error);
      throw error;
    });
}

export function addPost({ token, description, imageUrl }) {
  console.log("Формируем запрос с:", { 
    token: token ? "есть" : "отсутствует",
    description, 
    imageUrl 
  });
  
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({ 
      description: description.trim(),
      imageUrl 
    }),
  })
  .then(async (response) => {
    const data = await response.json();
    console.log("Полный ответ сервера:", {
      status: response.status,
      statusText: response.statusText,
      data
    });
    
    if (!response.ok) {
      throw new Error(data.message || JSON.stringify(data) || "Ошибка при добавлении поста");
    }
    return data;
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
