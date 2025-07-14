import { uploadImage } from "../api.js";

export function renderUploadImageComponent({ element, onImageUrlChange }) {
  let imageUrl = "";

  const render = () => {
    element.innerHTML = `
      <div class="upload-image" id="upload-drop-area" style="position:relative;">
        ${
          imageUrl
            ? `
            <div class="file-upload-image-container">
              <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
              <button class="file-upload-remove-button button">Заменить фото</button>
            </div>
            `
            : `
            <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                style="display:none"
              />
              Выберите фото или перетащите файл сюда
            </label>
          `
        }
        <div class="drop-overlay" style="display:none;position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(86,94,239,0.12);border:2px dashed #565eef;z-index:2;"></div>
      </div>
    `;

    const fileInputElement = element.querySelector(".file-upload-input");
    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      
      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Допустимы только JPG, PNG или GIF");
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert("Файл слишком большой (макс. 5MB)");
        return;
      }

      const labelEl = document.querySelector(".file-upload-label");
      labelEl.setAttribute("disabled", true);
      labelEl.textContent = "Загружаю файл...";
      
      uploadImage({ file })
        .then(({ fileUrl }) => {
          console.log("Загруженный URL изображения:", fileUrl);
          imageUrl = fileUrl;
          onImageUrlChange(imageUrl);
          render();
        })
        .catch((error) => {
          console.error("Upload failed:", error);
          const labelEl = document.querySelector(".file-upload-label");
          labelEl.textContent = "Ошибка загрузки";
          labelEl.style.color = "red";
          setTimeout(() => {
            labelEl.textContent = "Выберите фото или перетащите файл сюда";
            labelEl.style.color = "";
          }, 2000);
        });
    });

    const dropArea = element.querySelector("#upload-drop-area");
    const overlay = element.querySelector(".drop-overlay");
    if (dropArea) {
      dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        overlay.style.display = "block";
      });
      dropArea.addEventListener("dragleave", (e) => {
        e.preventDefault();
        overlay.style.display = "none";
      });
      dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        overlay.style.display = "none";
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
          alert("Допустимы только JPG, PNG или GIF");
          return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
          alert("Файл слишком большой (макс. 5MB)");
          return;
        }
        const labelEl = document.querySelector(".file-upload-label");
        labelEl.setAttribute("disabled", true);
        labelEl.textContent = "Загружаю файл...";
        uploadImage({ file })
          .then(({ fileUrl }) => {
            console.log("Загруженный URL изображения:", fileUrl);
            imageUrl = fileUrl;
            onImageUrlChange(imageUrl);
            render();
          })
          .catch((error) => {
            console.error("Upload failed:", error);
            const labelEl = document.querySelector(".file-upload-label");
            labelEl.textContent = "Ошибка загрузки";
            labelEl.style.color = "red";
            setTimeout(() => {
              labelEl.textContent = "Выберите фото или перетащите файл сюда";
              labelEl.style.color = "";
            }, 2000);
          });
      });
    }

    element
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        imageUrl = "";
        onImageUrlChange(imageUrl);
        render();
      });
  };

  render();
}