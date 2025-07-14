import { goToPage } from '../index.js';
import { POSTS_PAGE } from '../routes.js';
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = ""; 
  let description = ""; 

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <button class="button secondary-button" id="back-to-feed-btn" style="margin: 10px 0 0 0;">← В ленту</button>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <textarea 
            id="description-input" 
            class="input textarea" 
            placeholder="Описание"
            rows="4"
          >${description}</textarea>
          <div class="form-error"></div>
          <button 
            class="button" 
            id="add-button"
          >
            Опубликовать
          </button>
        </div>
      </div>
    </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    document.getElementById("back-to-feed-btn").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      goToPage(POSTS_PAGE);
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
          document.getElementById("add-button").disabled = !newImageUrl;
        },
      });
    }

    const descriptionInput = document.getElementById("description-input");
    descriptionInput.addEventListener("input", (e) => {
      description = e.target.value;
      document.querySelector(".form-error").textContent = "";
      descriptionInput.classList.remove("input-error");
    });

    document.getElementById("add-button").addEventListener("click", () => {
      description = description.trim();
      
      let hasError = false;
      let errorMessages = [];
      if (!description) {
        document.querySelector(".form-error").textContent = "Добавьте описание";
        descriptionInput.classList.add("input-error");
        hasError = true;
        errorMessages.push("Добавьте описание");
      } else {
        descriptionInput.classList.remove("input-error");
      }
      const addButton = document.getElementById("add-button");
      if (!imageUrl) {
        document.querySelector(".form-error").textContent = "Загрузите изображение";
        addButton.classList.add("input-error");
        hasError = true;
        errorMessages.push("Загрузите изображение");
      } else {
        addButton.classList.remove("input-error");
      }
      if (errorMessages.length > 0) {
        document.querySelector(".form-error").textContent = errorMessages.join(" и ");
      }
      if (hasError) return;
      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}
