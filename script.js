// Estado de la aplicación
let products = [];
let editingId = null;

// Elementos del DOM
const productForm = document.getElementById("productForm");
const productGrid = document.getElementById("productGrid");
const inputs = {
  nombre: document.getElementById("nombre"),
  precio: document.getElementById("precio"),
  imagen: document.getElementById("imagen"),
};
const btnLimpiar = document.querySelector(".btn-limpiar");

// Funciones de validación
const validations = {
  nombre: (value) => {
    if (!value.trim()) return "El nombre es requerido";
    if (value.length < 3) return "El nombre debe tener al menos 3 caracteres";
    return "";
  },
  precio: (value) => {
    if (!value) return "El precio es requerido";
    if (isNaN(value) || value <= 0) return "El precio debe ser mayor a 0";
    return "";
  },
  imagen: (value) => {
    if (!value.trim()) return "La URL de la imagen es requerida";
    try {
      new URL(value);
      return "";
    } catch {
      return "URL inválida";
    }
  },
};

// Función para mostrar errores
function showError(input, message) {
  input.classList.add("error");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

// Función para limpiar errores
function clearErrors() {
  document.querySelectorAll(".error-message").forEach((err) => err.remove());
  Object.values(inputs).forEach((input) => input.classList.remove("error"));
}

// Función para validar el formulario
function validateForm() {
  clearErrors();
  let isValid = true;

  Object.entries(inputs).forEach(([key, input]) => {
    const errorMessage = validations[key](input.value);
    if (errorMessage) {
      showError(input, errorMessage);
      isValid = false;
    }
  });

  return isValid;
}

// Función para limpiar el formulario
function clearForm() {
  productForm.reset();
  editingId = null;
  clearErrors();
  document.querySelector(".btn-enviar").textContent = "Enviar";
}

// Función para renderizar los productos
function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
            <img src="${product.imagen}" alt="${product.nombre}">
            <div class="product-info">
                <h3 class="product-title">${product.nombre}</h3>
                <p class="product-price pixelify-family">$ ${parseFloat(
                  product.precio
                ).toFixed(2)}</p>
                <div class="product-actions">
                    <button onclick="editProduct('${
                      product.id
                    }')" class="btn-edit">Editar</button>
                    <button onclick="deleteProduct('${
                      product.id
                    }')" class="btn-delete">Eliminar</button>
                </div>
            </div>
            <div class="cart-icon">🛒</div>
        </div>
    `
    )
    .join("");
}

// Función para crear/editar producto
function handleSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const productData = {
    nombre: inputs.nombre.value,
    precio: parseFloat(inputs.precio.value),
    imagen: inputs.imagen.value,
  };

  if (editingId) {
    // Editar producto existente
    const index = products.findIndex((p) => p.id === editingId);
    products[index] = { ...products[index], ...productData };
  } else {
    // Crear nuevo producto
    products.push({
      ...productData,
      id: Date.now().toString(),
    });
  }

  clearForm();
  renderProducts();
}

// Función para editar producto
function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  inputs.nombre.value = product.nombre;
  inputs.precio.value = product.precio;
  inputs.imagen.value = product.imagen;
  editingId = id;
  document.querySelector(".btn-enviar").textContent = "Actualizar";
}

// Función para eliminar producto
function deleteProduct(id) {
  if (!confirm("¿Estás seguro de eliminar este producto?")) return;

  products = products.filter((p) => p.id !== id);
  renderProducts();
}

// Event Listeners
productForm.addEventListener("submit", handleSubmit);
btnLimpiar.addEventListener("click", clearForm);

// Inicialización
renderProducts();
