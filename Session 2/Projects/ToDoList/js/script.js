(function() {

  const todoStorage = (function() {
    const TODOS_KEY = 'todos';

    const getTodos = function() {
      let todos = localStorage.getItem(TODOS_KEY) || '[]';
      return JSON.parse(todos);
    };

    const setTodos = function(todos) {
      localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    };

    return { getTodos, setTodos };
  })();

  const todoManager = (function() {
    let todos = [];

    const makeTodo = function(task, date, category, done) {
      task = task || 'task';
      date = date || null;
      category = category || null;
      return {
        task,
        date,
        category,
        done
      }
    };

    const updateTodos = function() {
      todoStorage.setTodos(todos);
    };

    const addTodo = function(task, date, category) {
      todos.unshift(makeTodo(task, date, category, false));
      updateTodos();
    };

    const deleteTodo = function(index) {
      todos.splice(index, 1);
      updateTodos();
    };

    const updateTodo = function(index, todoObject) {
      todos[index] = {...todoObject};
      updateTodos();
    }

    const getTodos = () => todos;

    (function() {
      todos = todoStorage.getTodos();
    })();

    return { getTodos, deleteTodo, addTodo, updateTodo };
  })();

  const modalFormHandler = (function() {
    let modalOverlay = $('#modal-overlay');
    let modalFormDiv = $('#modal-form');
    let modalForm = modalFormDiv.find('form');
    let formHeading = modalFormDiv.find('h2');
    let formButton = modalFormDiv.find('button');

    let inputs = {
      task: modalForm.find('#todo-task'),
      category: modalForm.find('#todo-category'),
      date: modalForm.find('#todo-date')
    };

    const clearInputs = function() {
      Object.values(inputs).forEach(input => input.val(''));
    };

    const showModalOverlay = function(openForm) {
      modalOverlay.fadeIn(300, function() {
        openForm();
      });
    };

    const closeModalOverlay = function() {
      clearInputs();
      modalForm.off('submit');
      modalOverlay.fadeOut(300);
    };

    const openAddTodo = function() {
      clearInputs();
      formButton.text('Add');
      formHeading.text('Add Todo');
      modalForm.on('submit', function(e) {
        e.preventDefault();
        todoManager.addTodo(inputs.task.val(), inputs.date.val(), inputs.category.val());
        todoRenderer.renderTodos();
        closeModalOverlay();
      });
    };

    const openEditTodo = function(todo_index) {
      clearInputs();
      formButton.text('Edit');
      formHeading.text('Edit Todo');
      let todo = todoManager.getTodos()[todo_index]
      inputs.category.val(todo.category);
      inputs.task.val(todo.task);
      inputs.date.val(todo.date);
      modalForm.on('submit', function(e) {
        e.preventDefault();
        todo.category = inputs.category.val();
        todo.task = inputs.task.val();
        todo.date = inputs.date.val();
        todoManager.updateTodo(todo_index, todo);
        todoRenderer.renderTodos();
        closeModalOverlay();
      });
    };

    const showAddTodo = () => showModalOverlay(openAddTodo);
    const showEditTodo = (todo_index) => showModalOverlay(() => openEditTodo(todo_index));

    // close modalOverlay when clicked
    (function() {
      closeModalOverlay();
      modalOverlay.click(function(e) {
        if (e.target === modalOverlay.get(0)) {
          closeModalOverlay();
        }
      });
    })();

    return { showAddTodo, showEditTodo };
  })();

  const todoRenderer = (function() {
    let todoListElement = $('#todos');

    const escapeHTML = function(text) {
      return $('<div>').text(text).text();
    };

    const formatDate = function(date) {
      date = new Date(date);
      date = [...date.toLocaleString()];
      date.splice(-3, 3);
      return date.join('');
    };

    const clearTodos = function() {
      todoListElement.html('');
    };

    const renderTodos = function() {
      clearTodos();
      let todos = todoManager.getTodos();
      for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        let wrapper = $('<label>', {
          'for': `todo-${i}`,
          'class': 'todo'
        });
        let dateElement = todo.date ? `<p class="date">${escapeHTML(formatDate(todo.date))}</p>` : '';
        let categoryElement = todo.category ? `<p class="category">${escapeHTML(todo.category)}</p>` : '';
        wrapper.html(`
        <div class="left-section">
          <input type="checkbox" id="todo-${i}" ${todo.done ? 'checked' : ''}>
          <div class="info">
            ${categoryElement}
            <p class="task">${escapeHTML(todo.task)}</p>
            ${dateElement}
          </div>
        </div>
        <div class="right-section">
          <button class="edit">edit</button>
          <button class="delete">x</button>
        </div>
        `);
        wrapper.find('.edit').click(function() {
          modalFormHandler.showEditTodo(i);
        });
        wrapper.find('.delete').click(function() {
          todoManager.deleteTodo(i);
          renderTodos();
        })
        wrapper.find('[type=checkbox]').click(function() {
          let todo = todoManager.getTodos()[i];
          todo.done = !todo.done;
          todoManager.updateTodo(i, todo);
        })
        todoListElement.append(wrapper);
      }
    };

    return { renderTodos };
  })();

  (function() {
    $('#add-todo').click(modalFormHandler.showAddTodo);
    todoRenderer.renderTodos();
  })();
})();