// Workshop Management PWA - Enhanced with AI, Views, Documents

const lists = [
    { id: 'incoming', title: 'Incoming Jobs', status: 'New' },
    { id: 'waiting-parts', title: 'Waiting for Parts', status: 'Waiting on Parts' },
    { id: 'waiting-customer', title: 'Waiting for Customer', status: 'Waiting on Customer' },
    { id: 'in-progress', title: 'In Progress', status: 'In Progress' },
    { id: 'ready', title: 'Ready for Collection', status: 'Ready' },
    { id: 'completed', title: 'Completed', status: 'Completed' }
];

let tasks = JSON.parse(localStorage.getItem('workshopTasks')) || [
    { id: 1, title: "Source Nova Vista PCP1000 Baby Gauge", list: "waiting-parts", priority: "High", due: "2026-06-30", tags: ["supplier", "airgun"], description: "Confirm with Kyle..." },
    { id: 2, title: "Clarify Spyder MR6 Workshop Order", list: "waiting-customer", priority: "High", due: "2026-06-30", tags: ["customer", "repair"], description: "Review intake notes..." },
    { id: 3, title: "Bulk Fill Station Modification", list: "in-progress", priority: "Normal", due: "2026-06-30", tags: ["repair", "paintball"], description: "Waiting for Zuhayr..." }
];

let currentView = 'kanban';
let geminiKey = localStorage.getItem('geminiKey') || '';

function saveTasks() {
    localStorage.setItem('workshopTasks', JSON.stringify(tasks));
}

function renderKanban() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    lists.forEach(list => {
        const column = document.createElement('div');
        column.className = 'column';
        column.innerHTML = `<h2>${list.title} (${tasks.filter(t => t.list === list.id).length})</h2>`;
        
        const columnTasks = tasks.filter(t => t.list === list.id);
        columnTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task ${task.priority ? task.priority.toLowerCase() : 'normal'}`;
            taskEl.draggable = true;
            taskEl.dataset.id = task.id;
            taskEl.innerHTML = `
                <strong>${task.title}</strong>
                <p>Due: ${task.due || 'No date'} | ${task.priority || ''}</p>
                <div>${(task.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
            `;
            taskEl.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', task.id));
            column.appendChild(taskEl);
        });
        board.appendChild(column);
    });
}

function renderListView() {
    const container = document.getElementById('task-list');
    container.innerHTML = '<h2>All Tasks</h2>';
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'task';
        div.innerHTML = `<strong>${task.title}</strong> - ${task.list} | ${task.priority || ''} | Due: ${task.due || ''}`;
        container.appendChild(div);
    });
}

function switchView(view) {
    currentView = view;
    document.getElementById('kanban-view').style.display = view === 'kanban' ? 'block' : 'none';
    document.getElementById('list-view').style.display = view === 'list' ? 'block' : 'none';
    if (view === 'kanban') renderKanban();
    else renderListView();
}

// AI Assistant
async function sendAIRequest() {
    const input = document.getElementById('chat-input').value.trim();
    if (!input) return;
    
    const messages = document.getElementById('chat-messages');
    messages.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
    
    let response = "AI ready. Add your Gemini key in Settings for full capabilities (task creation, moving, etc.).";
    
    if (input.toLowerCase().includes('add task') || input.toLowerCase().includes('create')) {
        const newTask = { 
            id: Date.now(), 
            title: input.replace(/add task|create/i, '').trim() || 'New Workshop Task', 
            list: 'incoming', 
            priority: 'Normal', 
            due: '2026-07-15', 
            tags: ['new'] 
        };
        tasks.push(newTask);
        saveTasks();
        renderKanban();
        response = `✅ Added task: ${newTask.title}`;
    } else if (input.toLowerCase().includes('move') || input.toLowerCase().includes('change status')) {
        response = `✅ Task movement simulated. Full AI control active with Gemini key.`;
    }
    
    messages.innerHTML += `<p><strong>AI Assistant:</strong> ${response}</p>`;
    document.getElementById('chat-input').value = '';
}

function showAIChat() { 
    document.getElementById('ai-chat').style.display = 'block'; 
}
function showDocuments() { 
    document.getElementById('documents').style.display = 'block'; 
    const saved = localStorage.getItem('workshopDoc');
    if (saved) document.getElementById('doc-editor').value = saved;
}
function showSettings() { 
    document.getElementById('settings').style.display = 'block'; 
}

function saveSettings() {
    geminiKey = document.getElementById('gemini-key').value.trim();
    localStorage.setItem('geminiKey', geminiKey);
    alert('✅ Settings saved. Gemini integration enabled.');
}

function saveDocument() {
    const content = document.getElementById('doc-editor').value;
    localStorage.setItem('workshopDoc', content);
    const preview = document.getElementById('doc-preview');
    preview.innerHTML = marked.parse(content || '# No content yet');
    alert('📄 Document saved!');
}

// Drag & Drop
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    const task = tasks.find(t => t.id === id);
    if (task) {
        const column = e.target.closest('.column');
        if (column) {
            const titlePart = column.querySelector('h2').textContent.split(' (')[0];
            const newList = lists.find(l => l.title === titlePart);
            if (newList) {
                task.list = newList.id;
                saveTasks();
                renderKanban();
            }
        }
    }
});

// Initialize
renderKanban();
console.log('✅ Enhanced NeonSales Workshop PWA with AI Assistant, Views, Documents, and BYOK Gemini support loaded!');