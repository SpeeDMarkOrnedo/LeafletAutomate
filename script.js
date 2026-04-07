const texts = document.querySelectorAll(".editable-text");
const container = document.getElementById("capture");

let selectedText = null;
let copiedTextData = null;
let selectedImage = null;
let copiedImageData = null;

// SELECT TEXT
function setupText(el) {
  el.addEventListener("click", (e) => {
    e.stopPropagation();

    document
      .querySelectorAll(".editable-text")
      .forEach((t) => t.classList.remove("selected"));
    el.classList.add("selected");

    selectedText = el;
  });

  makeDraggable(el);
}

// apply to existing texts
document.querySelectorAll(".editable-text").forEach(setupText);

// CLICK OUTSIDE = deselect
document.addEventListener("click", () => {
  document
    .querySelectorAll(".editable-text")
    .forEach((t) => t.classList.remove("selected"));
  selectedText = null;
});

// FONT SIZE
document
  .getElementById("fontSize")
  .addEventListener("input", function () {
    if (selectedText) selectedText.style.fontSize = this.value + "px";
  });

// ALIGNMENT
document
  .getElementById("textAlign")
  .addEventListener("change", function () {
    if (selectedText) selectedText.style.textAlign = this.value;
  });

// WIDTH
document
  .getElementById("textWidth")
  .addEventListener("input", function () {
    if (selectedText) {
      selectedText.style.width = this.value + "px";
      selectedText.style.whiteSpace = "normal";
    }
  });

// COPY TEXT
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "c") {
    if (selectedText) {
      copiedTextData = {
        content: selectedText.innerText,
        fontSize: selectedText.style.fontSize,
        top: selectedText.style.top,
        left: selectedText.style.left,
        width: selectedText.style.width,
        align: selectedText.style.textAlign,
      };
    }
  }
});

// PASTE TEXT
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "v") {
    if (copiedTextData) {
      const div = document.createElement("div");

      div.contentEditable = "true";
      div.className = "editable-text";
      div.innerText = copiedTextData.content;

      div.style.position = "absolute";
      div.style.fontWeight = "700";
      div.style.fontFamily = "Montserrat, sans-serif";
      div.style.color = "#1f6bcedc";

      div.style.fontSize = copiedTextData.fontSize;
      div.style.width = copiedTextData.width || "auto";
      div.style.textAlign = copiedTextData.align || "left";

      div.style.top = parseInt(copiedTextData.top) + 20 + "px";
      div.style.left = parseInt(copiedTextData.left) + 20 + "px";

      document.getElementById("capture").appendChild(div);

      setupText(div);
    }
  }
});
// ================= IMAGE =================

document
  .getElementById("imageUpload")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => createImage(event.target.result);
    reader.readAsDataURL(file);
  });

function createImage(src) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "user-image";

  img.style.top = "800px";
  img.style.left = "1200px";

  container.appendChild(img);
  makeDraggable(img);

  img.addEventListener("click", (e) => {
    e.stopPropagation();

    document
      .querySelectorAll(".user-image")
      .forEach((i) => i.classList.remove("selected"));
    img.classList.add("selected");

    selectedImage = img;
  });
}

// deselect image
document.addEventListener("click", () => {
  document
    .querySelectorAll(".user-image")
    .forEach((i) => i.classList.remove("selected"));
  selectedImage = null;
});

// resize image
document
  .getElementById("imageSize")
  .addEventListener("input", function () {
    if (selectedImage) {
      selectedImage.style.width = this.value + "px";
    }
  });

// COPY
document.addEventListener("keydown", (e) => {
  if (e.target.isContentEditable) return;

  if (e.ctrlKey && e.key === "c" && selectedImage) {
    copiedImageData = {
      src: selectedImage.src,
      width: selectedImage.style.width,
      top: selectedImage.style.top,
      left: selectedImage.style.left,
    };
  }
});

// PASTE
document.addEventListener("keydown", (e) => {
  if (e.target.isContentEditable) return;

  if (e.ctrlKey && e.key === "v" && copiedImageData) {
    createImage(copiedImageData.src);

    const newImg = container.lastChild;

    newImg.style.width = copiedImageData.width;
    newImg.style.top = parseInt(copiedImageData.top) + 20 + "px";
    newImg.style.left = parseInt(copiedImageData.left) + 20 + "px";
  }
});

// DRAG
function makeDraggable(el) {
  let isDragging = false;
  let offsetX, offsetY;

  el.addEventListener("mousedown", (e) => {
    isDragging = true;

    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const rect = container.getBoundingClientRect();

    el.style.left = e.clientX - rect.left - offsetX + "px";
    el.style.top = e.clientY - rect.top - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// ================= DOWNLOAD =================

function downloadImage() {
  html2canvas(document.getElementById("capture"), {
    useCORS: true,
    scale: 2,
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "MCGI_leaflet.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}