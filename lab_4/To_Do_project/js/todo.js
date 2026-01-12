window.onload = function() { 
    // Инициализация статистики
    updateStats();
    
    // Обработчик добавления задачи
    document.querySelector('#push').addEventListener('click', function() {
        addTask();
    });

    // Обработчик нажатия Enter в поле ввода
    document.querySelector('#newtask input').addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            addTask();
        }
    });

    // Функция для добавления задачи
    function addTask() {
        const input = document.querySelector('#newtask input');
        const taskText = input.value.trim();
        
        if(taskText.length === 0) {
            showNotification("Пожалуйста, введите задачу!", "error");
            return;
        }

        // Создаем новую задачу
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.innerHTML = `
            <span id="taskname">
                ${taskText}
            </span>
            <button class="delete" title="Удалить задачу">
                <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        `;

        // Добавляем задачу в список
        document.querySelector('#tasks').appendChild(taskDiv);
        
        // Очищаем поле ввода
        input.value = "";
        
        // Фокусируемся обратно на поле ввода
        input.focus();
        
        // Добавляем обработчики для новой задачи
        addTaskListenersToElement(taskDiv);
        
        // Обновляем статистику
        updateStats();
        
        // Показываем уведомление
        showNotification("Задача добавлена!", "success");
    }

    // Функция для добавления обработчиков событий к конкретному элементу задачи
    function addTaskListenersToElement(taskElement) {
        // Обработчик для удаления задачи
        const deleteButton = taskElement.querySelector('.delete');
        if (deleteButton) {
            deleteButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Останавливаем всплытие, чтобы не сработал клик по задаче
                taskElement.remove();
                updateStats();
                showNotification("Задача удалена!", "warning");
            });
        }

        // Обработчик для отметки задачи как выполненной
        taskElement.addEventListener('click', function(e) {
            // Не переключаем состояние, если кликнули по кнопке удаления
            if (e.target.closest('.delete')) {
                return;
            }
            
            this.classList.toggle('completed');
            updateStats();
            
            if(this.classList.contains('completed')) {
                showNotification("Задача выполнена! ✓", "success");
            }
        });
    }

    // Функция для добавления обработчиков ко всем существующим задачам
    function addTaskListeners() {
        const tasks = document.querySelectorAll('.task');
        tasks.forEach(task => {
            addTaskListenersToElement(task);
        });
    }

    // Функция для обновления статистики
    function updateStats() {
        const totalTasks = document.querySelectorAll('.task').length;
        const completedTasks = document.querySelectorAll('.task.completed').length;
        
        document.querySelector('#total-tasks').textContent = `Всего задач: ${totalTasks}`;
        document.querySelector('#completed-tasks').textContent = `Выполнено: ${completedTasks}`;
    }

    // Функция для показа уведомлений
    function showNotification(message, type) {
        // Удаляем старое уведомление, если есть
        const oldNotification = document.querySelector('.notification');
        if(oldNotification) {
            oldNotification.remove();
        }
        
        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Добавляем уведомление в body
        document.body.appendChild(notification);
        
        // Анимируем появление
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // Функция для получения иконки уведомления
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    // Добавляем обработчики для существующих задач при загрузке
    addTaskListeners();
}