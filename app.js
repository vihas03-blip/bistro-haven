// --- Client State Matrix ---
let cart = [];
let stampCounter = 3;

const reviewsData = [
    {
        quote: "The Truffle & Burrata salad is an absolute masterpiece. Bistro Haven represents the perfect marriage of casual, elegant hospitality and world-class fusion dining.",
        author: "Sarah Jenkins",
        role: "Food Critic, Culinary Chronicles"
    },
    {
        quote: "Incredible speed! The tracking map is remarkably accurate, and the Pan-Seared Wagyu arrived exactly as if it was served right at the chef's counter.",
        author: "Marcus Vance",
        role: "Premium Member Verified Guest"
    },
    {
        quote: "The digital stamp mechanics are phenomenal. Eating elite fusion dishes regularly and receiving a free prime tier course makes you feel like an elite club member.",
        author: "Elena Rostova",
        role: "Local Guide, Gastronomy Hub"
    }
];
let currentReviewIdx = 0;

// --- Sidebar Toggle Trigger ---
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
}

document.getElementById('cartToggleBtn').addEventListener('click', toggleCart);
document.getElementById('cartOverlay').addEventListener('click', toggleCart);

// --- Cart Addition Management ---
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    
    // Increment Digital Pass card stamp slot as an interactive visual bonus feature
    if (stampCounter < 10) {
        stampCounter++;
        updateStampUI();
    }

    renderCart();
    showToast(`Added ${name} to your basket!`);
}

function updateQuantity(name, amt) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        cart[index].qty += amt;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
    }
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const totalCountEl = document.getElementById('cartCount');
    
    let totalItemsCount = 0;
    let subtotal = 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-view">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Your basket is empty.<br>Explore our popular dishes to add items.</p>
            </div>`;
        totalCountEl.innerText = 0;
        document.getElementById('subtotalVal').innerText = '$0.00';
        document.getElementById('taxVal').innerText = '$0.00';
        document.getElementById('totalVal').innerText = '$0.00';
        return;
    }

    container.innerHTML = '';
    cart.forEach(item => {
        totalItemsCount += item.qty;
        subtotal += (item.price * item.qty);

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span style="font-size:14px; font-weight:700">${item.qty}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    totalCountEl.innerText = totalItemsCount;
    
    let tax = subtotal * 0.08; // 8% local state tier tax configuration
    let totalCombined = subtotal + tax;

    document.getElementById('subtotalVal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxVal').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('totalVal').innerText = `$${totalCombined.toFixed(2)}`;
}

// --- Loyalty Pass Card Stamp Renderer ---
function updateStampUI() {
    const slots = document.querySelectorAll('.stamp-slot');
    const textEl = document.getElementById('stampCountText');
    if (!textEl) return;
    
    textEl.innerText = `${stampCounter}/10 Stamped`;
    
    slots.forEach((slot, index) => {
        if (index < stampCounter) {
            slot.classList.add('active');
            if (index === 9) {
                slot.innerHTML = `<i class="fa-solid fa-gift"></i>`;
            } else {
                slot.innerHTML = `<i class="fa-solid fa-check"></i>`;
            }
        } else {
            slot.classList.remove('active');
            if (index === 9) {
                slot.innerHTML = `<i class="fa-solid fa-gift"></i>`;
            } else {
                slot.innerHTML = index + 1;
            }
        }
    });
}

// --- Grid Filter Handling ---
function filterMenu(category, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- Testimonial Sliders Engine ---
function displayReview() {
    const data = reviewsData[currentReviewIdx];
    document.getElementById('testimonialText').innerText = `"${data.quote}"`;
    document.getElementById('testimonialAuthor').innerText = data.author;
    document.getElementById('testimonialRole').innerText = data.role;
}

function nextTestimonial() {
    currentReviewIdx = (currentReviewIdx + 1) % reviewsData.length;
    displayReview();
}

function prevTestimonial() {
    currentReviewIdx = (currentReviewIdx - 1 + reviewsData.length) % reviewsData.length;
    displayReview();
}

// --- Mock Functional Form Intercept Handlers ---
function simulateTracking() {
    const val = document.getElementById('trackInput').value;
    if (!val) {
        alert('Please input an order confirmation string code.');
        return;
    }
    document.getElementById('pipelineStatus').innerHTML = `<strong>Order Status [${val.toUpperCase()}]:</strong> Courier Driver has left Downtown Hub. Thermal seal intact. ETA: 14 mins.`;
    document.getElementById('mapBanner').style.backgroundColor = 'rgba(225, 29, 72, 0.95)';
    showToast("Tracking telemetry linked!");
}

function handleReserve(e) {
    e.preventDefault();
    alert("Reservation Success! A table reservation confirmation code has been dispatched via SMS notification.");
}

function handleJoin(e) {
    e.preventDefault();
    alert("Welcome to the Elite Circle! Your 1st signature digital stamp has been officially registered.");
}

// Update this inside your app.js file to replace the placeholder alert
async function triggerCheckout() {
    if (cart.length === 0) {
        alert("Your basket is empty.");
        return;
    }

    const orderPayload = {
        customerEmail: "guest@example.com", // You'll replace this with data from an input field later
        cartItems: cart,
        totalAmount: document.getElementById('totalVal').innerText
    };

    try {
        const response = await fetch('http://localhost:3000/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });

        const data = await response.json();
        if (data.success) {
            showToast("Order transmitted to the database!");
            cart = [];
            renderCart();
            toggleCart();
        }
    } catch (err) {
        console.error("Network communication failed:", err);
        alert("Could not reach backend server.");
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Mobile Navigation System ---
document.getElementById('menuToggle').addEventListener('click', () => {
    const links = document.getElementById('navLinks');
    if (links.style.display === 'flex') {
        links.style.display = 'none';
    } else {
        links.style.display = 'flex';
        links.style.flexDirection = 'column';
        links.style.position = 'absolute';
        links.style.top = '70px';
        links.style.left = '0';
        links.style.width = '100%';
        links.style.backgroundColor = 'white';
        links.style.padding = '20px';
        links.style.borderBottom = '1px solid var(--border-color)';
    }
});
