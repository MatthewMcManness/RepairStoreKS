// Demo ticket data with plan information
const TICKETS = [
  { id: "T-001", device: "HP Laptop", problem: "Broken screen", status: "In Progress", plan: "silver" },
  { id: "T-002", device: "Dell Desktop", problem: "Won't boot", status: "New", plan: "basic" },
  { id: "T-003", device: "MacBook Pro", problem: "Battery not charging", status: "Diagnosing", plan: "silver" },
  { id: "T-004", device: "Custom PC", problem: "Slow performance", status: "Closed", plan: "basic" },
  { id: "T-005", device: "Surface Laptop", problem: "Keyboard unresponsive", status: "Waiting for Parts", plan: "silver" },
  { id: "T-006", device: "Acer Chromebook", problem: "Screen flickering", status: "Call Customer", plan: "basic" },
  { id: "T-007", device: "Gaming PC", problem: "Graphics card failure", status: "Escalated", plan: "silver" },
  { id: "T-008", device: "iPad Pro", problem: "Touch screen not responding", status: "Completed", plan: "basic" },
  { id: "T-009", device: "ThinkPad", problem: "Hard drive corrupted", status: "Waiting on Customer", plan: "silver" },
  { id: "T-010", device: "iMac", problem: "Won't turn on", status: "Done Shelf", plan: "silver" },
  { id: "T-011", device: "Dell Laptop", problem: "Previous repair failed", status: "Re-Work", plan: "basic" }
];

// Demo customer database
const CUSTOMERS = [
  { id: 1, firstName: "John", lastName: "Smith", phone: "(555) 123-4567", email: "john.smith@email.com", plan: "silver" },
  { id: 2, firstName: "Sarah", lastName: "Johnson", phone: "(555) 234-5678", email: "sarah.j@email.com", plan: "basic" },
  { id: 3, firstName: "Mike", lastName: "Davis", phone: "(555) 345-6789", email: "mike.davis@email.com", plan: "silver" },
  { id: 4, firstName: "Emily", lastName: "Brown", phone: "(555) 456-7890", email: "emily.brown@email.com", plan: "basic" },
  { id: 5, firstName: "David", lastName: "Wilson", phone: "(555) 567-8901", email: "david.wilson@email.com", plan: "silver" }
];

// App State
let currentPage = 'dashboard';
let activeFilters = new Set(['new', 'diagnosing', 'escalated', 'call-customer', 'waiting-parts', 'waiting-customer', 'progress', 'completed', 'done-shelf', 'closed', 're-work']);
let currentSearch = '';
let isDarkMode = false;
let ticketCounter = TICKETS.length;
let customerCounter = CUSTOMERS.length;
let selectedCustomer = null;
let pendingTicketData = null;

// DOM Elements
const subheader = document.getElementById('subheader');
const mainContent = document.getElementById('mainContent');

// Theme management
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  isDarkMode = savedTheme === 'dark';
  applyTheme();
}

function applyTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
  if (isDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  applyTheme();
}

// Map status to badge class
const statusClass = (s) => {
  const key = s.toLowerCase().replace(/\s+/g, '-');
  if (key === 'new') return 'new';
  if (key === 'diagnosing') return 'diagnosing';
  if (key === 'escalated') return 'escalated';
  if (key === 'call-customer') return 'call-customer';
  if (key === 'waiting-for-parts') return 'waiting-parts';
  if (key === 'waiting-on-customer') return 'waiting-customer';
  if (key === 'in-progress') return 'progress';
  if (key === 'completed') return 'completed';
  if (key === 'done-shelf') return 'done-shelf';
  if (key === 'closed') return 'closed';
  if (key === 're-work') return 're-work';
  return 'new';
};

// Filter tickets based on current filters
function getFilteredTickets() {
  let filtered = TICKETS;
  
  filtered = filtered.filter(ticket => {
    const statusKey = statusClass(ticket.status);
    return activeFilters.has(statusKey);
  });
  
  if (currentSearch) {
    const searchLower = currentSearch.toLowerCase();
    filtered = filtered.filter(ticket =>
      ticket.id.toLowerCase().includes(searchLower) ||
      ticket.device.toLowerCase().includes(searchLower) ||
      ticket.problem.toLowerCase().includes(searchLower) ||
      ticket.status.toLowerCase().includes(searchLower) ||
      ticket.plan.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
}

// Filter customers based on current filters
function getFilteredCustomers() {
  let filtered = CUSTOMERS;
  
  if (currentSearch) {
    const searchLower = currentSearch.toLowerCase();
    filtered = filtered.filter(customer =>
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.plan.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
}

// Render ticket list
function renderTickets(containerId) {
  const container = document.getElementById(containerId);
  const filtered = getFilteredTickets();
  
  container.innerHTML = "";
  
  if (filtered.length === 0) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "empty-state";
    emptyRow.innerHTML = `<p>No tickets found matching your criteria.</p>`;
    container.appendChild(emptyRow);
  } else {
    filtered.forEach(t => {
      const row = document.createElement("div");
      let ticketClass = `ticket`;
      if (t.plan === 'silver') ticketClass += ' silver';
      if (t.status === 'Re-Work' || t.status === 'Escalated') ticketClass += ' rework';
      
      row.className = ticketClass;
      row.innerHTML = `
        <span>${t.id}</span>
        <span class="device">${t.device}</span>
        <span class="problem">${t.problem}</span>
        <span><span class="badge ${statusClass(t.status)}">${t.status}</span></span>
      `;
      container.appendChild(row);
    });
  }
}

// Render customer list
function renderCustomers(containerId) {
  const container = document.getElementById(containerId);
  const filtered = getFilteredCustomers();
  
  container.innerHTML = "";
  
  if (filtered.length === 0) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "empty-state";
    emptyRow.innerHTML = `<p>No customers found matching your criteria.</p>`;
    container.appendChild(emptyRow);
  } else {
    filtered.forEach(c => {
      const row = document.createElement("div");
      let customerClass = `customer`;
      if (c.plan === 'silver') customerClass += ' silver';
      
      row.className = customerClass;
      row.innerHTML = `
        <span>C-${String(c.id).padStart(3, '0')}</span>
        <span class="customer-name">${c.firstName} ${c.lastName}</span>
        <span class="customer-contact">${c.phone}</span>
        <span class="customer-email">${c.email}</span>
        <span><span class="badge ${c.plan}">${c.plan}</span></span>
      `;
      container.appendChild(row);
    });
  }
}

// Update counters
function updateTicketCounter() {
  const filtered = getFilteredTickets();
  const counter = document.getElementById('ticketCount');
  if (counter) {
    counter.textContent = `${filtered.length} ticket${filtered.length !== 1 ? 's' : ''}`;
  }
}

function updateCustomerCounter() {
  const filtered = getFilteredCustomers();
  const counter = document.getElementById('customerCount');
  if (counter) {
    counter.textContent = `${filtered.length} customer${filtered.length !== 1 ? 's' : ''}`;
  }
}

// Customer search functionality
function searchCustomers(query) {
  if (!query || query.length < 2) return [];
  
  return CUSTOMERS.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return fullName.includes(query.toLowerCase());
  });
}

function showCustomerSuggestions(customers, query) {
  const suggestions = document.getElementById('customerSuggestions');
  suggestions.innerHTML = '';
  
  if (customers.length === 0) {
    const addOption = document.createElement('div');
    addOption.className = 'add-customer-suggestion';
    addOption.innerHTML = `+ Add "${query}" as new customer`;
    addOption.addEventListener('click', () => {
      hideCustomerSuggestions();
      openAddCustomerModal({ customerName: query });
    });
    suggestions.appendChild(addOption);
  } else {
    customers.forEach(customer => {
      const option = document.createElement('div');
      option.className = 'customer-suggestion';
      option.innerHTML = `
        <div class="customer-name">${customer.firstName} ${customer.lastName}</div>
        <div class="customer-plan">${customer.plan} plan • ${customer.phone}</div>
      `;
      option.addEventListener('click', () => {
        selectCustomer(customer);
        hideCustomerSuggestions();
      });
      suggestions.appendChild(option);
    });
    
    const addOption = document.createElement('div');
    addOption.className = 'add-customer-suggestion';
    addOption.innerHTML = `+ Add "${query}" as new customer`;
    addOption.addEventListener('click', () => {
      hideCustomerSuggestions();
      openAddCustomerModal({ customerName: query });
    });
    suggestions.appendChild(addOption);
  }
  
  suggestions.classList.add('active');
}

function hideCustomerSuggestions() {
  const suggestions = document.getElementById('customerSuggestions');
  suggestions.classList.remove('active');
}

function selectCustomer(customer) {
  selectedCustomer = customer;
  const input = document.getElementById('customerName');
  input.value = `${customer.firstName} ${customer.lastName}`;
}

// Modal management
function openNewTicketModal() {
  const modal = document.getElementById('newTicketModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNewTicketModal() {
  const modal = document.getElementById('newTicketModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  const form = document.getElementById('newTicketForm');
  form.reset();
  selectedCustomer = null;
  hideCustomerSuggestions();
}

function openAddCustomerModal(ticketData) {
  pendingTicketData = ticketData;
  const modal = document.getElementById('addCustomerModal');
  modal.classList.add('active');
  
  if (ticketData && ticketData.customerName) {
    const nameParts = ticketData.customerName.split(' ');
    document.getElementById('customerFirstName').value = nameParts[0] || '';
    document.getElementById('customerLastName').value = nameParts.slice(1).join(' ') || '';
  }
}

function closeAddCustomerModal() {
  const modal = document.getElementById('addCustomerModal');
  modal.classList.remove('active');
  
  const form = document.getElementById('addCustomerForm');
  form.reset();
  pendingTicketData = null;
}

// Add new customer
function addNewCustomer(customerData) {
  customerCounter++;
  const newCustomer = {
    id: customerCounter,
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    phone: customerData.phone,
    email: customerData.email,
    plan: customerData.plan
  };
  
  CUSTOMERS.push(newCustomer);
  selectedCustomer = newCustomer;
  
  const customerNameInput = document.getElementById('customerName');
  customerNameInput.value = `${newCustomer.firstName} ${newCustomer.lastName}`;
  
  closeAddCustomerModal();
  
  if (pendingTicketData) {
    createNewTicket({
      ...pendingTicketData,
      customerName: `${newCustomer.firstName} ${newCustomer.lastName}`
    });
  }
}

// Create new ticket
function createNewTicket(formData) {
  if (!selectedCustomer) {
    openAddCustomerModal(formData);
    return;
  }
  
  ticketCounter++;
  
  const newTicket = {
    id: `T-${String(ticketCounter).padStart(3, '0')}`,
    device: `${formData.deviceBrand} ${formData.deviceType}`,
    problem: formData.problemDescription,
    status: 'New',
    plan: selectedCustomer.plan
  };
  
  TICKETS.unshift(newTicket);
  
  if (currentPage === 'dashboard') {
    initializePageFunctionality();
  } else if (currentPage === 'tickets') {
    renderTickets('ticketList');
    updateTicketCounter();
  }
  
  closeNewTicketModal();
  alert(`Ticket ${newTicket.id} created successfully for ${selectedCustomer.firstName} ${selectedCustomer.lastName}!`);
}

// Page Templates
const PAGE_TEMPLATES = {
  dashboard: {
    title: 'Dashboard',
    subheader: `
      <div class="subheader-content">
        <h1>Dashboard</h1>
        <div class="subheader-actions">
          <button class="action-btn primary" data-action="new-ticket">
            <span class="btn-icon">+</span>
            New Ticket
          </button>
          <button class="action-btn primary" data-action="new-customer">
            <span class="btn-icon">👤</span>
            New Customer
          </button>
          <button class="action-btn primary" data-action="new-invoice">
            <span class="btn-icon">📄</span>
            New Invoice
          </button>
          <button class="action-btn primary" data-action="new-estimate">
            <span class="btn-icon">💰</span>
            New Estimate
          </button>
        </div>
      </div>
    `,
    content: `
      <section class="panel">
        <div class="panel-head">
          <h2>Recent Tickets</h2>
          <div class="actions">
            <input id="dashboardSearch" type="search" placeholder="Search tickets…" />
          </div>
        </div>
        <div class="ticket-head">
          <span>ID</span>
          <span>Device</span>
          <span>Problem</span>
          <span>Status</span>
        </div>
        <div id="dashboardTicketList" class="ticket-list"></div>
      </section>
    `
  },
  
  tickets: {
    title: 'Tickets',
    subheader: `
      <div class="subheader-content">
        <h1>Tickets</h1>
        <button class="action-btn primary" data-action="new-ticket">
          <span class="btn-icon">+</span>
          New Ticket
        </button>
        <div class="subheader-actions">
          <div class="filter-buttons">
            <button class="filter-btn active" data-status="new">New</button>
            <button class="filter-btn active" data-status="diagnosing">Diagnosing</button>
            <button class="filter-btn active" data-status="escalated">Escalated</button>
            <button class="filter-btn active" data-status="call-customer">Call Customer</button>
            <button class="filter-btn active" data-status="waiting-parts">Waiting for Parts</button>
            <button class="filter-btn active" data-status="waiting-customer">Waiting on Customer</button>
            <button class="filter-btn active" data-status="progress">In Progress</button>
            <button class="filter-btn active" data-status="completed">Completed</button>
            <button class="filter-btn active" data-status="done-shelf">Done Shelf</button>
            <button class="filter-btn active" data-status="re-work">Re-Work</button>
            <button class="filter-btn active" data-status="closed">Closed</button>
          </div>
          <input id="ticketSearch" type="search" placeholder="Search tickets…" />
        </div>
      </div>
    `,
    content: `
      <section class="panel">
        <div class="panel-head">
          <h2>Tickets</h2>
          <div class="actions">
            <span id="ticketCount" class="ticket-counter">11 tickets</span>
          </div>
        </div>
        <div class="ticket-head">
          <span>ID</span>
          <span>Device</span>
          <span>Problem</span>
          <span>Status</span>
        </div>
        <div id="ticketList" class="ticket-list"></div>
      </section>
    `
  },
  
  customers: {
    title: 'Customers',
    subheader: `
      <div class="subheader-content">
        <h1>Customers</h1>
        <button class="action-btn primary" data-action="new-customer">
          <span class="btn-icon">+</span>
          New Customer
        </button>
        <div class="subheader-actions">
          <input id="customerSearch" type="search" placeholder="Search customers…" />
        </div>
      </div>
    `,
    content: `
      <section class="panel">
        <div class="panel-head">
          <h2>All Customers</h2>
          <div class="actions">
            <span id="customerCount" class="ticket-counter">5 customers</span>
          </div>
        </div>
        <div class="customer-head">
          <span>ID</span>
          <span>Name</span>
          <span>Phone</span>
          <span>Email</span>
          <span>Plan</span>
        </div>
        <div id="customerList" class="customer-list"></div>
      </section>
    `
  },
  
  invoices: {
    title: 'Invoices',
    subheader: `
      <div class="subheader-content">
        <h1>Invoices</h1>
        <div class="subheader-actions">
          <button class="action-btn primary" data-action="new-invoice">
            <span class="btn-icon">+</span>
            New Invoice
          </button>
          <input type="search" placeholder="Search invoices…" />
        </div>
      </div>
    `,
    content: `
      <section class="panel">
        <div class="panel-head">
          <h2>Invoice Management</h2>
        </div>
        <div class="coming-soon">
          <h3>📄 Invoice Management</h3>
          <p>Invoice management features coming soon!</p>
        </div>
      </section>
    `
  },
  
  estimates: {
    title: 'Estimates',
    subheader: `
      <div class="subheader-content">
        <h1>Estimates</h1>
        <div class="subheader-actions">
          <button class="action-btn primary" data-action="new-estimate">
            <span class="btn-icon">+</span>
            New Estimate
          </button>
          <input type="search" placeholder="Search estimates…" />
        </div>
      </div>
    `,
    content: `
      <section class="panel">
        <div class="panel-head">
          <h2>Estimate Management</h2>
        </div>
        <div class="coming-soon">
          <h3>💰 Estimate Management</h3>
          <p>Estimate management features coming soon!</p>
        </div>
      </section>
    `
  },
  
  inventory: {
    title: 'Inventory',
    subheader: `
      <div class="subheader-content">
        <h1>Inventory</h1>
        <div class="subheader-actions">
          <button class="action-btn primary" data-action="new-item">
            <span class="btn-icon">+</span>
            Add Item
          </button>
          <input type="search" placeholder="Search inventory…" />
        </div>
      </div>
    `,
    content: `
      <section class="panel">
        <div class="panel-head">
          <h2>Inventory Management</h2>
        </div>
        <div class="coming-soon">
          <h3>📦 Inventory Management</h3>
          <p>Inventory management features coming soon!</p>
        </div>
      </section>
    `
  }
};

// Navigate to a page
function navigateToPage(pageName) {
  if (!PAGE_TEMPLATES[pageName]) return;
  
  currentPage = pageName;
  const template = PAGE_TEMPLATES[pageName];
  
  document.title = `Repair Store KS — ${template.title}`;
  subheader.innerHTML = template.subheader;
  mainContent.innerHTML = template.content;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-page') === pageName) {
      btn.classList.add('active');
    }
  });
  
  initializePageFunctionality();
}

// Initialize page-specific functionality
function initializePageFunctionality() {
  if (currentPage === 'dashboard') {
    const search = document.getElementById('dashboardSearch');
    if (search) {
      search.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderTickets('dashboardTicketList');
      });
    }
    
    const container = document.getElementById('dashboardTicketList');
    const recentTickets = TICKETS.slice(0, 6);
    container.innerHTML = "";
    recentTickets.forEach(t => {
      const row = document.createElement("div");
      let ticketClass = `ticket`;
      if (t.plan === 'silver') ticketClass += ' silver';
      if (t.status === 'Re-Work' || t.status === 'Escalated') ticketClass += ' rework';
      
      row.className = ticketClass;
      row.innerHTML = `
        <span>${t.id}</span>
        <span class="device">${t.device}</span>
        <span class="problem">${t.problem}</span>
        <span><span class="badge ${statusClass(t.status)}">${t.status}</span></span>
      `;
      container.appendChild(row);
    });
    
  } else if (currentPage === 'tickets') {
    const search = document.getElementById('ticketSearch');
    if (search) {
      search.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderTickets('ticketList');
        updateTicketCounter();
      });
    }
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const status = this.getAttribute('data-status');
        
        if (activeFilters.has(status)) {
          activeFilters.delete(status);
          this.classList.remove('active');
        } else {
          activeFilters.add(status);
          this.classList.add('active');
        }
        
        renderTickets('ticketList');
        updateTicketCounter();
      });
    });
    
    renderTickets('ticketList');
    updateTicketCounter();
    
  } else if (currentPage === 'customers') {
    const search = document.getElementById('customerSearch');
    if (search) {
      search.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderCustomers('customerList');
        updateCustomerCounter();
      });
    }
    
    renderCustomers('customerList');
    updateCustomerCounter();
  }
  
  // Action buttons
  const actionButtons = document.querySelectorAll('[data-action]');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      
      if (action === 'new-ticket') {
        openNewTicketModal();
      } else if (action === 'new-customer') {
        openAddCustomerModal();
      } else {
        const actionText = this.textContent.trim();
        alert(`${actionText} functionality would be implemented here!`);
      }
    });
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const page = this.getAttribute('data-page');
      navigateToPage(page);
      
      const mainNav = document.getElementById('mainNav');
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      mainNav.classList.remove('mobile-open');
      hamburgerBtn.classList.remove('active');
    });
  });

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', toggleTheme);

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  
  hamburgerBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    mainNav.classList.toggle('mobile-open');
  });

  document.addEventListener('click', function(e) {
    if (!hamburgerBtn.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('mobile-open');
      hamburgerBtn.classList.remove('active');
    }
  });

  // Modal functionality
  const modal = document.getElementById('newTicketModal');
  const closeModal = document.getElementById('closeModal');
  const cancelModal = document.getElementById('cancelModal');
  const newTicketForm = document.getElementById('newTicketForm');
  
  const customerModal = document.getElementById('addCustomerModal');
  const closeCustomerModal = document.getElementById('closeCustomerModal');
  const cancelCustomerModal = document.getElementById('cancelCustomerModal');
  const addCustomerForm = document.getElementById('addCustomerForm');

  closeModal.addEventListener('click', closeNewTicketModal);
  cancelModal.addEventListener('click', closeNewTicketModal);
  closeCustomerModal.addEventListener('click', closeAddCustomerModal);
  cancelCustomerModal.addEventListener('click', closeAddCustomerModal);
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeNewTicketModal();
    }
  });
  
  customerModal.addEventListener('click', function(e) {
    if (e.target === customerModal) {
      closeAddCustomerModal();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (customerModal.classList.contains('active')) {
        closeAddCustomerModal();
      } else if (modal.classList.contains('active')) {
        closeNewTicketModal();
      }
    }
  });

  // Customer search functionality
  const customerNameInput = document.getElementById('customerName');
  customerNameInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    selectedCustomer = null;
    
    if (query.length >= 2) {
      const results = searchCustomers(query);
      showCustomerSuggestions(results, query);
    } else {
      hideCustomerSuggestions();
    }
  });
  
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.form-group')) {
      hideCustomerSuggestions();
    }
  });

  newTicketForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      customerName: document.getElementById('customerName').value,
      deviceType: document.getElementById('deviceType').value,
      deviceBrand: document.getElementById('deviceBrand').value,
      problemDescription: document.getElementById('problemDescription').value
    };
    
    createNewTicket(formData);
  });
  
  addCustomerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const customerData = {
      firstName: document.getElementById('customerFirstName').value,
      lastName: document.getElementById('customerLastName').value,
      phone: document.getElementById('customerPhoneNumber').value,
      email: document.getElementById('customerEmailAddress').value,
      plan: document.getElementById('customerPlan').value
    };
    
    addNewCustomer(customerData);
  });

  navigateToPage('dashboard');
});