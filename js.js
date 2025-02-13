const authButton = document.querySelector('a[href="#login"]');
const authOverlay = document.getElementById('authOverlay');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const closeBtns = document.querySelectorAll('.close-btn');
const switchForms = document.querySelectorAll('.switch-form');

class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.currentEditIndex = null;
        
        this.initEvents();
        this.renderProducts();
    }

    initEvents() {
        document.getElementById('addProductBtn').addEventListener('click', () => this.openModal());
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchProducts(e.target.value));
        document.getElementById('productForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.querySelectorAll('.cancel-btn').forEach(btn => btn.addEventListener('click', () => this.closeModal()));
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteProduct());
    }

    openModal(index = null) {
        this.currentEditIndex = index;
        const modal = document.getElementById('productModal');
        const deleteBtn = document.getElementById('deleteBtn');
        
        if (index !== null) {
            document.getElementById('modalTitle').textContent = 'Редактирование товара';
            const product = this.products[index];
            document.getElementById('productName').value = product.name;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productUnit').value = product.unit;
            deleteBtn.style.display = 'block';
        } else {
            document.getElementById('modalTitle').textContent = 'Новый товар';
            document.getElementById('productForm').reset();
            deleteBtn.style.display = 'none';
        }
        
        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('productModal').classList.remove('active');
        this.currentEditIndex = null;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const product = {
            name: document.getElementById('productName').value.trim(),
            quantity: parseInt(document.getElementById('productQuantity').value),
            unit: document.getElementById('productUnit').value
        };
        
        if (!product.name || isNaN(product.quantity)) {
            alert('Заполните все поля корректно!');
            return;
        }
        
        if (this.currentEditIndex !== null) {
            this.products[this.currentEditIndex] = product;
        } else {
            this.products.push(product);
        }
        
        this.saveProducts();
        this.renderProducts();
        this.closeModal();
    }

    deleteProduct() {
        if (this.currentEditIndex !== null && confirm('Удалить товар?')) {
            this.products.splice(this.currentEditIndex, 1);
            this.saveProducts();
            this.renderProducts();
            this.closeModal();
        }
    }

    searchProducts(query) {
        const filtered = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        this.renderProducts(filtered);
    }

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    renderProducts(products = this.products) {
        const list = document.getElementById('productsList');
        list.innerHTML = products.map((product, index) => `
            <div class="product-item">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.quantity} ${product.unit}</p>
                </div>
                <div class="product-actions">
                    <button class="button" onclick="productManager.openModal(${index})">✎</button>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productsList')) {
        window.productManager = new ProductManager();
    }
});


authButton.addEventListener('click', (e) => {
    e.preventDefault();
    authOverlay.classList.add('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        authOverlay.classList.remove('active');
    });
});



switchForms.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.toggle('active');
        registerForm.classList.toggle('active');
    });
});

function handleFormSubmit(e, isLogin) {
    e.preventDefault();
    const formData = {};
    const inputs = e.target.querySelectorAll('input');
    
    inputs.forEach(input => {
        formData[input.placeholder] = input.value;
    });

    authOverlay.classList.remove('active');
    alert(`${isLogin ? 'Вход выполнен' : 'Регистрация успешна'}!\nДанные: ${JSON.stringify(formData)}`);
}

loginForm.addEventListener('submit', (e) => handleFormSubmit(e, true));
registerForm.addEventListener('submit', (e) => handleFormSubmit(e, false));

authOverlay.addEventListener('click', (e) => {
    if (e.target === authOverlay) {
        authOverlay.classList.remove('active');
    }
});