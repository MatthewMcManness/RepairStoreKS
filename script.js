// Demo ticket data (static)
const TICKETS = [
  { id: "T-001", device: "HP Laptop",      problem: "Broken screen",     status: "In Progress" },
  { id: "T-002", device: "Dell Desktop",    problem: "Won’t boot",        status: "Open" },
  { id: "T-003", device: "Lenovo Laptop",   problem: "Battery not charging", status: "Open" },
  { id: "T-004", device: "Custom PC",       problem: "Slow performance",  status: "Closed" },
  { id: "T-005", device: "Acer Chromebook", problem: "Keyboard unresponsive", status: "In Progress" }
];

// Map status to badge class
const statusClass = (s) => {
  const key = s.toLowerCase();
  if (key.includes("progress")) return "progress";
  if (key.includes("closed"))   return "closed";
  return "open";
};

// Render list
const list = document.getElementById("ticketList");
function renderRows(rows){
  list.innerHTML = "";
  rows.forEach(t => {
    const row = document.createElement("div");
    row.className = "ticket";
    row.innerHTML = `
      <span>${t.id}</span>
      <span class="device">${t.device}</span>
      <span class="problem">${t.problem}</span>
      <span><span class="badge ${statusClass(t.status)}">${t.status}</span></span>
    `;
    list.appendChild(row);
  });
}
renderRows(TICKETS);

// Simple search
const search = document.getElementById("search");
search.addEventListener("input", (e)=>{
  const q = e.target.value.trim().toLowerCase();
  const filtered = !q ? TICKETS : TICKETS.filter(t =>
    t.id.toLowerCase().includes(q) ||
    t.device.toLowerCase().includes(q) ||
    t.problem.toLowerCase().includes(q) ||
    t.status.toLowerCase().includes(q)
  );
  renderRows(filtered);
});
