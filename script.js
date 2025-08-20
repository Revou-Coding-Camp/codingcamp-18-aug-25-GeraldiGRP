document.addEventListener('DOMContentLoaded', function() {
            // DOM elements
            const todoForm = document.getElementById('todoForm');
            const todoInput = document.getElementById('todoInput');
            const dateInput = document.getElementById('dateInput');
            const filterSelect = document.getElementById('filterSelect');
            const todoList = document.getElementById('todoList');
            const todoError = document.getElementById('todoError');
            const dateError = document.getElementById('dateError');
            
            // Store todos
            let todos = JSON.parse(localStorage.getItem('todos')) || [];
            
            // Initialize the app
            function init() {
                renderTodos();
                
                // Set minimum date to today
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
            }
            
            // Form submission
            todoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateForm()) {
                    addTodo();
                    todoForm.reset();
                }
            });
            
            // Filter change
            filterSelect.addEventListener('change', function() {
                renderTodos();
            });
            
            // Validate form inputs
            function validateForm() {
                let isValid = true;
                
                // Validate todo text
                if (todoInput.value.trim() === '') {
                    todoError.style.display = 'block';
                    isValid = false;
                } else {
                    todoError.style.display = 'none';
                }
                
                // Validate date
                if (dateInput.value === '') {
                    dateError.style.display = 'block';
                    isValid = false;
                } else {
                    dateError.style.display = 'none';
                }
                
                return isValid;
            }
            
            // Add a new todo
            function addTodo() {
                const todoText = todoInput.value.trim();
                const todoDate = dateInput.value;
                
                const todo = {
                    id: Date.now(),
                    text: todoText,
                    date: todoDate,
                    completed: false
                };
                
                todos.push(todo);
                saveTodos();
                renderTodos();
            }
            
            // Delete a todo
            function deleteTodo(id) {
                todos = todos.filter(todo => todo.id !== id);
                saveTodos();
                renderTodos();
            }
            
            // Save todos to localStorage
            function saveTodos() {
                localStorage.setItem('todos', JSON.stringify(todos));
            }
            
            // Filter todos based on selection
            function filterTodos() {
                const filterValue = filterSelect.value;
                const today = new Date().toISOString().split('T')[0];
                
                switch(filterValue) {
                    case 'today':
                        return todos.filter(todo => todo.date === today);
                    case 'upcoming':
                        return todos.filter(todo => todo.date > today);
                    case 'past':
                        return todos.filter(todo => todo.date < today && !todo.completed);
                    default:
                        return todos;
                }
            }
            
            // Render todos to the DOM
            function renderTodos() {
                const filteredTodos = filterTodos();
                
                if (filteredTodos.length === 0) {
                    todoList.innerHTML = '<li class="empty-state">No tasks found. Add a task or change your filter!</li>';
                    return;
                }
                
                todoList.innerHTML = '';
                
                filteredTodos.forEach(todo => {
                    const li = document.createElement('li');
                    li.className = 'todo-item';
                    
                    // Format date for display
                    const formattedDate = formatDate(todo.date);
                    
                    li.innerHTML = `
                        <div class="todo-info">
                            <div class="todo-text">${todo.text}</div>
                            <div class="todo-date">Due: ${formattedDate}</div>
                        </div>
                        <button class="delete-btn" data-id="${todo.id}">Delete</button>
                    `;
                    
                    todoList.appendChild(li);
                });
                
                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        deleteTodo(id);
                    });
                });
            }
            
            // Format date for display
            function formatDate(dateString) {
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            }
            
            // Initialize the application
            init();
        });