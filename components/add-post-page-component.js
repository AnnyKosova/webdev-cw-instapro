import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = ""; // Для хранения URL загруженного изображения
  let description = ""; // Для хранения текста описания

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
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
            ${!imageUrl ? 'disabled' : ''}
          >
            Опубликовать
          </button>
        </div>
      </div>
    </div>
    `;

    appEl.innerHTML = appHtml;

    // Рендерим шапку страницы
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Рендерим компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
          // Активируем кнопку, когда изображение загружено
          document.getElementById("add-button").disabled = !newImageUrl;
        },
      });
    }

    // Обработчик изменения текста описания
    const descriptionInput = document.getElementById("description-input");
    descriptionInput.addEventListener("input", (e) => {
      description = e.target.value;
      // Сбрасываем ошибку при изменении текста
      document.querySelector(".form-error").textContent = "";
    });

    // Обработчик клика на кнопку публикации
    document.getElementById("add-button").addEventListener("click", () => {
      description = description.trim();
      
      if (!description) {
        document.querySelector(".form-error").textContent = "Добавьте описание";
        return;
      }

      if (!imageUrl) {
        document.querySelector(".form-error").textContent = "Загрузите изображение";
        return;
      }

      // Вызываем callback с данными поста
      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}
