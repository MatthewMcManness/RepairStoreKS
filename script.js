// Demo ticket data with plan information
const TICKETS = [
  { id: "T-001", device: "HP Laptop", problem: "Broken screen", status: "In Progress", plan: "silver" },
  { id: "T-002", device: "Dell Desktop", problem: "Won't boot", status: "Open", plan: "basic" },
  { id: "T-003", device: "MacBook Pro", problem: "Battery not charging", status: "Open", plan: "silver" },
  { id: "T-004", device: "Custom PC", problem: "Slow performance", status: "Closed", plan: "basic" },
  { id: "T-005", device: "Surface Laptop", problem: "Keyboard unresponsive", status: "In Progress", plan: "silver" },
  { id: "T-006", device: "Acer Chromebook", problem: "Screen flickering", status: "Open", plan: "basic" }
];

// Map status to badge class
const statusClass = (s) => {
  const key = s.toLowerCase();
  if (key.includes("progress")) return "progress";
  if (key.includes("closed")) return "closed";
  return "open";
};

// Render list
const list = document.getElementById("ticketList");
function renderRows(rows) {
  list.innerHTML = "";
  rows.forEach(t => {
    const row = document.createElement("div");
    row.className = `ticket ${t.plan === 'silver' ? 'silver' : ''}`;
    row.innerHTML = `
      <span>${t.id}</span>
      <span class="device">${t.device}</span>
      <span class="problem">${t.problem}</span>
      <span><span class="badge ${statusClass(t.status)}">${t.status}</span></span>
    `;
    
    list.appendChild(row);
  });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  renderRows(TICKETS);
  
  // Simple search functionality
  const search = document.getElementById("search");
  search.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = !q ? TICKETS : TICKETS.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.device.toLowerCase().includes(q) ||
      t.problem.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q) ||
      t.plan.toLowerCase().includes(q)
    );
    renderRows(filtered);
  });

  // Navigation button functionality
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      navButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
    });
  });

  // Action button functionality
  const actionButtons = document.querySelectorAll('.action-btn');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      alert(`${buttonText} functionality would be implemented here!`);
    });
  });
});