
class ToDo {
  constructor(form, input, todoList, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
  }

  addToStorage() {
    localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createElement, this);
    this.addToStorage();
  }

  createElement(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.setAttribute('data-key', todo.key);
    li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
          <button class="todo-edit"></button>
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
    `);

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(e) {
    e.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey()
      };
      this.todoData.set(newTodo.key, newTodo);
      this.input.value = '';
      this.render();
    } else {
      alert('Нельзя добавить пустое дело!');
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(item) {
    const key = item.getAttribute('data-key');
    this.todoData.delete(key);
    item.style.opacity = 1;
    item.style.backgroundColor = '#FFE4E1';
    let reqID = 0;
    const animate = () => {
      if (item.style.opacity > 0) {
        item.style.opacity = -0.05 + parseFloat(item.style.opacity);
        reqID = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(reqID);
        this.render();
        return;
      }
    };
    animate();
  }

  completeItem(item) {
    const key = item.getAttribute('data-key');
    this.todoData.forEach(todo => {
      if (todo.key === key) {
        todo.completed = !todo.completed;
      }
    });
    item.style.opacity = 1;
    item.style.backgroundColor = 'rgba(33, 150, 243, 0.5)';
    let reqID = 0;
    const animate = () => {
      if (item.style.opacity > 0) {
        item.style.opacity = -0.05 + parseFloat(item.style.opacity);
        reqID = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(reqID);
        this.render();
        return;
      }
    };
    animate();
  }

  editItem(item) {
    const key = item.getAttribute('data-key');
    this.todoData.forEach(todo => {
      if (todo.key === key) {
        const newValue = prompt('Введите новое значение:', todo.value);
        todo.value = newValue ? newValue : todo.value;
        this.render();
      }
    });
  }

  hendler() {
    const todoContainer = document.querySelector('.todo-container');
    todoContainer.addEventListener('click', event => {
      const target = event.target;
      if (target.tagName === "BUTTON") {
        if (target.className === 'todo-remove') {
          this.deleteItem(target.closest('.todo-item'));
        } else if (target.className === 'todo-complete') {
          this.completeItem(target.closest('.todo-item'));
        } else if (target.className === 'todo-edit') {
          this.editItem(target.closest('.todo-item'));
        }
      }
      return;
    });
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
  }
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();
todo.hendler();
