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
        const addBtn = document.getElementById('addProductBtn');
        const search = document.getElementById('searchInput');
        
        if(addBtn) addBtn.addEventListener('click', () => this.openModal());
        if(search) search.addEventListener('input', (e) => this.searchProducts(e.target.value));
        
        document.getElementById('productForm')?.addEventListener('submit', (e) => this.handleSubmit(e));
        document.querySelectorAll('.cancel-btn').forEach(btn => btn.addEventListener('click', () => this.closeModal()));
        document.getElementById('deleteBtn')?.addEventListener('click', () => this.deleteProduct());
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
        const filtered = this.products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        this.renderProducts(filtered);
    }

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    renderProducts(products = this.products) {
        const list = document.getElementById('productsList');
        if(!list) return;
        
        list.innerHTML = products.map((p, i) => `
            <div class="product-item">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.quantity} ${p.unit}</p>
                </div>
                <div class="product-actions">
                    <button class="button" onclick="productManager.openModal(${i})">✎</button>
                </div>
            </div>
        `).join('');
    }
}

class OrderManager {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('orders')) || this.getDemoOrders();
        this.currentEditIndex = null;
        this.initEvents();
        this.renderOrders();
        this.saveOrders();
    }

    getDemoOrders() {
        return [
            this.createDemoOrder("ООО 'СтройМаркет'", "Цемент М500 - 50 мешков, Плитка напольная - 200 кв.м", "В процессе"),
            this.createDemoOrder("ИП Петров", "Краска масляная - 30 банок, Кисти малярные - 15 шт", "Выполнен"),
            this.createDemoOrder("Магазин 'Теплый Дом'", "Радиаторы алюминиевые - 40 шт, Трубы полипропиленовые - 100 м", "Отклонен"),
            this.createDemoOrder("СкладХолод", "Холодильные камеры - 3 шт, Стеллажи металлические - 20 шт", "В процессе")
        ];
    }

    createDemoOrder(company, products, status) {
        return {
            number: this.generateOrderNumber(),
            company,
            products,
            status,
            date: new Date().toISOString().split('T')[0]
        };
    }

    generateOrderNumber() {
        const datePart = new Date().toISOString().slice(0,10).replace(/-/g, '');
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        return `${datePart}-${randomPart}`;
    }

    initEvents() {
        const addBtn = document.getElementById('addOrderBtn');
        const search = document.getElementById('orderSearch');
        
        if(addBtn) addBtn.addEventListener('click', () => this.openModal());
        if(search) search.addEventListener('input', (e) => this.searchOrders(e.target.value));
        
        document.getElementById('orderForm')?.addEventListener('submit', (e) => this.handleSubmit(e));
        document.querySelectorAll('.cancel-btn').forEach(btn => btn.addEventListener('click', () => this.closeModal()));
        document.getElementById('orderDeleteBtn')?.addEventListener('click', () => this.deleteOrder());
    }

    openModal(index = null) {
        this.currentEditIndex = index;
        const modal = document.getElementById('orderModal');
        const deleteBtn = document.getElementById('orderDeleteBtn');
        
        if (index !== null) {
            document.getElementById('orderModalTitle').textContent = 'Редактирование заказа';
            const order = this.orders[index];
            document.getElementById('orderNumber').value = order.number;
            document.getElementById('orderCompany').value = order.company;
            document.getElementById('orderProducts').value = order.products;
            document.getElementById('orderStatus').value = order.status;
            document.getElementById('orderDate').value = order.date;
            deleteBtn.style.display = 'block';
        } else {
            document.getElementById('orderModalTitle').textContent = 'Новый заказ';
            document.getElementById('orderForm').reset();
            document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('orderNumber').value = this.generateOrderNumber();
            deleteBtn.style.display = 'none';
        }
        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('orderModal').classList.remove('active');
        this.currentEditIndex = null;
    }

    handleSubmit(e) {
        e.preventDefault();
        const order = {
            number: document.getElementById('orderNumber').value.trim(),
            company: document.getElementById('orderCompany').value.trim(),
            products: document.getElementById('orderProducts').value.trim(),
            status: document.getElementById('orderStatus').value,
            date: document.getElementById('orderDate').value
        };
        
        if (!Object.values(order).every(field => field)) {
            alert('Заполните все поля!');
            return;
        }
        
        if (this.currentEditIndex !== null) {
            this.orders[this.currentEditIndex] = order;
        } else {
            this.orders.push(order);
        }
        
        this.saveOrders();
        this.renderOrders();
        this.closeModal();
    }

    deleteOrder() {
        if (this.currentEditIndex !== null && confirm('Удалить заказ?')) {
            this.orders.splice(this.currentEditIndex, 1);
            this.saveOrders();
            this.renderOrders();
            this.closeModal();
        }
    }

    searchOrders(query) {
        const filtered = this.orders.filter(o => o.company.toLowerCase().includes(query.toLowerCase()));
        this.renderOrders(filtered);
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    renderOrders(orders = this.orders) {
        const list = document.getElementById('ordersList');
        if(!list) return;
        
        list.innerHTML = orders.map((o, i) => `
            <div class="order-item">
                <div class="order-header">
                    <h3>Заказ #${o.number}</h3>
                    <span class="order-status status-${o.status.toLowerCase().replace(' ', '-')}">
                        ${o.status}
                    </span>
                </div>
                <div class="order-info">
                    <p><strong>Компания:</strong> ${o.company}</p>
                    <p><strong>Дата:</strong> ${o.date}</p>
                    <div class="order-products">
                        <p><strong>Состав:</strong></p>
                        <p>${o.products.replace(/,/g, '<br>')}</p>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="button" onclick="orderManager.openModal(${i})">✎ Редактировать</button>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.productManager = document.getElementById('productsList') ? new ProductManager() : null;
    window.orderManager = document.getElementById('ordersList') ? new OrderManager() : null;

    if(authButton) {
        authButton.addEventListener('click', (e) => {
            e.preventDefault();
            authOverlay.classList.add('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });
    }

    closeBtns.forEach(btn => btn.addEventListener('click', () => authOverlay.classList.remove('active')));
    switchForms.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.toggle('active');
        registerForm.classList.toggle('active');
    }));

    authOverlay.addEventListener('click', (e) => {
        if(e.target === authOverlay) authOverlay.classList.remove('active');
    });

    // Обработчики форм
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAuthForm(e, true);
        });
    }

    if(registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAuthForm(e, false);
        });
    }
});

function handleAuthForm(e, isLogin) {
    const formData = {};
    const inputs = e.target.querySelectorAll('input');
    inputs.forEach(input => formData[input.placeholder] = input.value);
    
    authOverlay.classList.remove('active');
    alert(`${isLogin ? 'Вход' : 'Регистрация'} успешна!\nДанные: ${JSON.stringify(formData)}`);
}