'use strict';

const todoControl = document.querySelector('.todo-control'),
      headerInput = document.querySelector('.header-input'),
      todoList = document.querySelector('.todo-list'),
      todoCompleted = document.querySelector('.todo-completed');

const todoData = JSON.parse(localStorage.getItem('todoData'));

const render = function() {
  todoList.textContent = '';
  todoCompleted.textContent = '';

  todoData.forEach(function(item) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.innerHTML = '<span class="text-todo">' + item.value + '</span>' +
      '<div class="todo-buttons">' +
      '<button class="todo-remove"></button>' + 
      '<button class="todo-complete"></button>' +
			'</div>';

    if (item.completed) {
      todoCompleted.append(li);
    } else {
      todoList.append(li);
    }

    const todoCompleteButton = li.querySelector('.todo-complete');
    todoCompleteButton.addEventListener('click', function() {
      item.completed = !item.completed;
      render();
    });

    const todoRemoveButton = li.querySelector('.todo-remove');
    todoRemoveButton.addEventListener('click', function() {
      todoData.splice(todoData.indexOf(item), 1);
      localStorage.setItem('todoData', JSON.stringify(todoData));
      render();
    });
      
  });
};

todoControl.addEventListener('submit', function(event) {
  event.preventDefault();

  if (headerInput.value.trim() !== '') {
    const newTodo = {
      value: headerInput.value,
      completed: false
    };

    headerInput.value = '';

    todoData.push(newTodo);
    localStorage.setItem('todoData', JSON.stringify(todoData));

    render();
  }

});

render();