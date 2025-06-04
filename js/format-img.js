function supportsAvif() {
  return new Promise((resolve) => {
    const img = new Image();
    img.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAG1pZjFtYWlmAAACAGF2MDEAAACkAAABG2F2aWZtMAAAADxhdmlmAAABeGF2MDFtZGF0EgAKB/gAAABAAABEhAA=";
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
  });
}

function supportsWebp() {
  return new Promise((resolve) => {
    const img = new Image();
    img.src =
      "data:image/webp;base64,UklGRhYAAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSAwAAAAQUxQSAwAAAAQUxQSAA==";
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
  });
}

(async () => {
  const link = document.querySelector(".categories__link-img");
  const basePath = "./images/categories/sale";
  console.log("basePath", basePath);

  if (await supportsAvif()) {
    link.style.backgroundImage = `image-set(
      url('${basePath}@1x.avif') 1x,
      url('${basePath}@2x.avif') 2x,
      url('${basePath}@3x.avif') 3x
    )`;
  } else if (await supportsWebp()) {
    link.style.backgroundImage = `image-set(
      url('${basePath}@1x.webp') 1x,
      url('${basePath}@2x.webp') 2x,
      url('${basePath}@3x.webp') 3x
    )`;
  } else {
    link.style.backgroundImage = `image-set(
      url('${basePath}@1x.jpg') 1x,
      url('${basePath}@2x.jpg') 2x,
      url('${basePath}@3x.jpg') 3x
    )`;
  }
})();
