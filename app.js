// Demo ticket data with plan information
const TICKETS = [
  { id: "T-001", device: "HP Laptop", problem: "Broken screen", status: "In Progress", plan: "silver" },
  { id: "T-002", device: "Dell Desktop", problem: "Won't boot", status: "Open", plan: "basic" },
  { id: "T-003", device: "MacBook Pro", problem: "Battery not charging", status: "Open", plan: "silver" },
  { id: "T-004", device: "Custom PC", problem: "Slow performance", status: "Closed", plan: "basic" },
  { id: "T-005", device: "Surface Laptop", problem: "Keyboard unresponsive", status: "In Progress", plan: "silver" },
  { id: "T-006", device: "Acer Chromebook", problem: "Screen flickering", status: "Open", plan: "basic" },
  { id: "T-007", device: "Gaming PC", problem: "Graphics card failure", status: "Open", plan: "silver" },
  { id: "T-008", device: "iPad Pro", problem: "Touch screen not responding", status: "Closed", plan: "basic" },
  { id: "T-009", device: "ThinkPad", problem: "Hard drive corrupted", status: "In Progress", plan: "silver" },
  { id: "T-010", device: "iMac", problem: "Won't turn on", status: "Open", plan: "silver" }
];

// App State
let currentPage = 'dashboard';
let currentFilter = 'all';
let currentSearch = '';

// DOM Elements
const subheader = document.getElementById('subheader');
const mainContent = document.getElementById('mainContent');

// Map status to badge class
const statusClass = (s) => {
  const key = s.toLowerCase();
  if (key.includes("progress")) return "progress";
  if (key.includes("closed")) return "closed";
  return "open";
};

// Filter tickets based on current filters
function getFilteredTickets() {
  let filtered = TICKETS;
  
  // Apply status filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(ticket => {
      const statusKey = statusClass(ticket.status);
      return statusKey === currentFilter;
    });
  }
  
  // Apply search filter
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
      row.className = `ticket ${t.plan === 'silver' ? 'silver' : ''}`;
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

// Update ticket counter
function updateTicketCounter() {
  const filtered = getFilteredTickets();
  const counter = document.getElementById('ticketCount');
  if (counter) {
    counter.textContent = `${filtered.length} ticket${filtered.length !== 1 ? 's' : ''}`;
  }
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
    title: 'All Tickets',
    subheader: `
      <div class="subheader-content">
        <h1>All Tickets</h1>
        <div class="subheader-actions">
          <div class="filter-buttons">
            <button class="filter-btn active" data-status="all">All</button>
            <button class="filter-btn" data-status="open">Open</button>
            <button class="filter-btn" data-status="progress">In Progress</button>
            <button class="filter-btn" data-status="closed">Closed</button>
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
            <span id="ticketCount" class="ticket-counter">10 tickets</span>
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
        <div class="subheader-actions">
          <button class="action-btn primary" data-action="new-customer">
            <span class="btn-icon">+</span>
            New Customer
          </button>
          <input type="search" placeholder="Search customers…" />
        </div>
      </div>
    `,
    content: `
      <section class="panel">
        <div class="panel-head">
          <h2>Customer Management</h2>
        </div>
        <div class="coming-soon">
          <h3>👥 Customer Management</h3>
          <p>Customer management features coming soon!</p>
        </div>
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
  
  // Update page title
  document.title = `Repair Store KS — ${template.title}`;
  
  // Update subheader
  subheader.innerHTML = template.subheader;
  
  // Update main content
  mainContent.innerHTML = template.content;
  
  // Update navigation active state
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-page') === pageName) {
      btn.classList.add('active');
    }
  });
  
  // Initialize page-specific functionality
  initializePageFunctionality();
}

// Initialize page-specific functionality
function initializePageFunctionality() {
  if (currentPage === 'dashboard') {
    // Dashboard search
    const search = document.getElementById('dashboardSearch');
    if (search) {
      search.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderTickets('dashboardTicketList');
      });
    }
    
    // Render recent tickets (limit to 6)
    const container = document.getElementById('dashboardTicketList');
    const recentTickets = TICKETS.slice(0, 6);
    container.innerHTML = "";
    recentTickets.forEach(t => {
      const row = document.createElement("div");
      row.className = `ticket ${t.plan === 'silver' ? 'silver' : ''}`;
      row.innerHTML = `
        <span>${t.id}</span>
        <span class="device">${t.device}</span>
        <span class="problem">${t.problem}</span>
        <span><span class="badge ${statusClass(t.status)}">${t.status}</span></span>
      `;
      container.appendChild(row);
    });
    
  } else if (currentPage === 'tickets') {
    // Tickets search
    const search = document.getElementById('ticketSearch');
    if (search) {
      search.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderTickets('ticketList');
        updateTicketCounter();
      });
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-status');
        renderTickets('ticketList');
        updateTicketCounter();
      });
    });
    
    // Initial render
    renderTickets('ticketList');
    updateTicketCounter();
  }
  
  // Action buttons
  const actionButtons = document.querySelectorAll('[data-action]');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      const actionText = this.textContent.trim();
      alert(`${actionText} functionality would be implemented here!`);
    });
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  // Navigation functionality
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const page = this.getAttribute('data-page');
      navigateToPage(page);
      
      // Close mobile menu
      const mainNav = document.getElementById('mainNav');
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      mainNav.classList.remove('mobile-open');
      hamburgerBtn.classList.remove('active');
    });
  });

  // Hamburger menu functionality
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  
  hamburgerBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    mainNav.classList.toggle('mobile-open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburgerBtn.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('mobile-open');
      hamburgerBtn.classList.remove('active');
    }
  });

  // Initialize with dashboard page
  navigateToPage('dashboard');
});