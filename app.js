const lists = [
    { id: 'incoming', title: 'Incoming Jobs', status: 'New' },
    { id: 'waiting-parts', title: 'Waiting for Parts', status: 'Waiting on Parts' },
    { id: 'waiting-customer', title: 'Waiting for Customer', status: 'Waiting on Customer' },
    { id: 'in-progress', title: 'In Progress', status: 'In Progress' },
    { id: 'ready', title: 'Ready for Collection', status: 'Ready' },
    { id: 'completed', title: 'Completed', status: 'Completed' }
];

const sampleTasks = [
    {
        id: 1,
        title: "Source Nova Vista PCP1000 Baby Gauge",
        list: "waiting-parts",
        priority: "High",
        due: "2026-06-30",
        tags: ["supplier", "airgun"],
        description: "Confirm with Kyle whether the Micro Pressure Gauge SKU P-SY-PM8X1 is compatible..."
    },
    {
        id: 2,
        title: "Clarify Spyder MR6 Workshop Order",
        list: "waiting-customer",
        priority: "High",
        due: "2026-06-30",
        tags: ["customer", "repair"],
        description: "Review workshop intake notes..."
    },
    {
        id: 3,
        title: "Bulk Fill Station Modification",
        list: "in-progress",
        priority: "Normal",
        due: "2026-06-30",
        tags: ["repair", "paintball"],
        description: "Waiting for Zuhayr to provide the Dremel..."
    },
    // Add more as needed
];

let tasks = JSON.parse(localStorage.getItem('workshopTasks')) || sampleTasks;

function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    lists.forEach(list => {
        const column = document.createElement('div');
        column.className = 'column';
        column.innerHTML = `<h2>${list.title}</h2>`;
        
        const columnTasks = tasks.filter(t => t.list === list.id);
        
        columnTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task ${task.priority.toLowerCase()}`;
            taskEl.draggable = true;
            taskEl.dataset.id = task.id;
            taskEl.innerHTML = `
                <strong>${task.title}</strong>
                <p style="font-size:0.85rem; opacity:0.8;">Due: ${task.due} | ${task.priority}</p>
                <div>${task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
            `;
            taskEl.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', task.id);
            });
            column.appendChild(taskEl);
        });
        
        board.appendChild(column);
    });
}

document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    // Simple drop logic - improve in full version
    const column = e.target.closest('.column');
    if (column) {
        const newListId = lists.find(l => column.textContent.includes(l.title))?.id;
        if (newListId) task.list = newListId;
        saveTasks();
        renderBoard();
    }
});

function saveTasks() {
    localStorage.setItem('workshopTasks', JSON.stringify(tasks));
}

renderBoard();

// PWA install prompt etc. can be added
console.log('NeonSales Workshop PWA loaded');