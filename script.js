// Shopping cart functionality
let cart = [];
let cartTotal = 0;

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        calculateTotal();
    }
}

// Add item to cart
function addToCart(productId, price, quantity = 1) {
    const product = {
        id: productId,
        price: price,
        quantity: quantity,
        name: getProductName(productId)
    };

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push(product);
    }

    updateCartDisplay();
    calculateTotal();
    saveCart();
    
    // Show success message
    showNotification('Item added to cart!');
}

// Get product name by ID
function getProductName(productId) {
    const names = {
        'standard-rack': 'Mobile Drying Rack - Standard',
        'compact-rack': 'Compact Drying Rack',
        'pro-rack': 'Heavy Duty Drying Rack - Pro'
    };
    return names[productId] || 'Unknown Product';
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart modal content
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <div>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        <button onclick="removeFromCart('${item.id}')" style="margin-left: 10px; background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Calculate total
function calculateTotal() {
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = cartTotal.toFixed(2);
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    calculateTotal();
    saveCart();
    showNotification('Item removed from cart');
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartDisplay();
    calculateTotal();
    saveCart();
    showNotification('Cart cleared');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2d5a2d;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initCart();
    
    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => openModal('cart-modal'));
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Handle navigation links (no smooth scrolling needed for multi-page)
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        // Remove the click event listener for smooth scrolling
        // Links will now navigate to different pages normally
    });
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
    
    // Initialize checkout page
    if (window.location.pathname.includes('checkout.html')) {
        initCheckout();
    }
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }
    
    // Payment method toggle
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', togglePaymentMethod);
    });
    
    // Order form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmission);
    }

    function toggleCardFieldsRequired() {
        const isCard = document.querySelector('input[name="paymentMethod"]:checked').value === 'card';
        document.getElementById('cardNumber').required = isCard;
        document.getElementById('expiryDate').required = isCard;
        document.getElementById('cvv').required = isCard;
        document.getElementById('cardName').required = isCard;
    }

    document.querySelectorAll('input[name="paymentMethod"]').forEach(el => {
        el.addEventListener('change', toggleCardFieldsRequired);
    });

    toggleCardFieldsRequired(); // Set initial state
});

// Add some animations on scroll
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.product-card, .feature, .about-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Checkout functionality
function initCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty. Redirecting to products...');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 2000);
        return;
    }
    
    displayCheckoutItems();
    calculateCheckoutTotals();
}

function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity}</p>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
}

function calculateCheckoutTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 99; // Free shipping over $500
    const taxRate = 0.08; // 8% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function togglePaymentMethod() {
    const cardDetails = document.getElementById('card-details');
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (selectedMethod === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

function handleOrderSubmission(e) {
    e.preventDefault();

    // Validate cart
    if (cart.length === 0) {
        showNotification('Your cart is empty. Please add items before placing an order.');
        return;
    }

    // Validate form
    const form = e.target;
    if (!form.checkValidity()) {
        showNotification('Please fill in all required fields');
        return;
    }

    // Collect order details (same as before)
    const orderDetails = {
        customer: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        },
        shipping: {
            address: document.getElementById('address').value,
            address2: document.getElementById('address2').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value
        },
        payment: {
            method: document.querySelector('input[name="paymentMethod"]:checked').value
        },
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        })),
        orderSummary: {
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shipping: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 500 ? 0 : 99,
            tax: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08,
            total: (() => {
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const shipping = subtotal > 500 ? 0 : 99;
                const tax = subtotal * 0.08;
                return subtotal + shipping + tax;
            })()
        },
        orderNotes: document.getElementById('orderNotes').value,
        orderDate: new Date().toLocaleString(),
        orderId: 'ORD-' + Date.now()
    };

    // Simulate order processing
    const submitBtn = document.querySelector('.place-order-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Order...';

    const emailSubject = `New Order: ${orderDetails.orderId}`;
    const emailBody = `
New Order Received!

Order ID: ${orderDetails.orderId}
Order Date: ${orderDetails.orderDate}

CUSTOMER INFORMATION:
Name: ${orderDetails.customer.firstName} ${orderDetails.customer.lastName}
Email: ${orderDetails.customer.email}
Phone: ${orderDetails.customer.phone}

SHIPPING ADDRESS:
${orderDetails.shipping.address}
${orderDetails.shipping.address2 ? orderDetails.shipping.address2 + '\n' : ''}${orderDetails.shipping.city}, ${orderDetails.shipping.state} ${orderDetails.shipping.zipCode}

PAYMENT METHOD: ${orderDetails.payment.method.toUpperCase()}

ORDER ITEMS:
${orderDetails.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - $${item.total.toFixed(2)}`).join('\n')}

ORDER SUMMARY:
Subtotal: $${orderDetails.orderSummary.subtotal.toFixed(2)}
Shipping: $${orderDetails.orderSummary.shipping.toFixed(2)}
Tax: $${orderDetails.orderSummary.tax.toFixed(2)}
Total: $${orderDetails.orderSummary.total.toFixed(2)}

${orderDetails.orderNotes ? 'SPECIAL NOTES:\n' + orderDetails.orderNotes : ''}
    `.trim();

    setTimeout(() => {
        // Fallback to mailto for now
        const mailtoLink = `mailto:mdsorathiya56@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoLink);

        // Log order
        console.log('Order Details:', orderDetails);

        // Store order in localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderDetails);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        cart = [];
        saveCart();

        showNotification('Order placed successfully! Order details have been sent via email.');

        // Redirect to thank you page or home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }, 2000);
}

// Replace with your actual IDs from EmailJS
const serviceID = 'service_4t6tzpq';
const templateID = 'template_7kxrtoa';

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Build order summary string
    const orderSummary = cart.map(item =>
        `${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n') +
    `\n\nSubtotal: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;

    // Remove previous hidden input if exists
    let oldSummary = this.querySelector('input[name="orderSummary"]');
    if (oldSummary) oldSummary.remove();

    // Add hidden input for order summary
    const summaryInput = document.createElement('input');
    summaryInput.type = 'hidden';
    summaryInput.name = 'orderSummary';
    summaryInput.value = orderSummary;
    this.appendChild(summaryInput);

    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        alert('Order placed and email sent!');
        cart = [];
        saveCart();
        window.location.href = 'index.html';
      }, (err) => {
        alert('Failed to send email: ' + JSON.stringify(err));
      });
});
