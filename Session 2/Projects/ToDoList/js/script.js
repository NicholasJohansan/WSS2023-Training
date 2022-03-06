(function() {

  const todoStorage = (function() {
    const TODOS_KEY = 'todos';
    const SORT_TYPE_KEY = 'sortType';

    const getTodos = function() {
      let todos = localStorage.getItem(TODOS_KEY) || '[]';
      return JSON.parse(todos);
    };

    const setTodos = function(todos) {
      localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    };

    const getSortType = function() {
      let sortType = localStorage.getItem(SORT_TYPE_KEY) || 'alphabetical';
      return sortType;
    };

    const setSortType = function(sortType) {
      localStorage.setItem(SORT_TYPE_KEY, sortType);
    };

    return { getTodos, setTodos, getSortType, setSortType };
  })();

  const todoManager = (function() {
    let todos = [];
    let sortType = 'alphabetical';

    const generateId = function() {
      return Math.floor(Math.random()*100000);
    };

    const makeTodo = function(task, date, category, done) {
      let id;
      do {
        id = generateId();
        console.log('s')
      } while (todos.filter(todo => todo.id === id).length !== 0);
      task = task || 'task';
      date = date || null;
      category = category || null;
      return {
        id,
        task,
        date,
        category,
        done
      };
    };

    const getIndex = function(id) {
      return todos.indexOf(getTodo(id));
    };

    const getTodo = function(id) {
      return todos.filter(todo => todo.id === id)[0] || null;
    };

    const sortTodos = function() {
      // unimplemented
      let sortFunction;
      switch (sortType) {
        case 'alphabetical':
          sortFunction = (todo1, todo2) => {
            if (todo1.task < todo2.task) {
              return -1;
            } else {
              return 1;
            }
          };
          break;
        case 'category':
          sortFunction = (todo1, todo2) => {
            if (todo1.category === null) return 1;
            if (todo2.category === null) return -1;
            if (todo1.category < todo2.category) {
              return -1;
            } else {
              return 1;
            }
          };
          break;
        case 'deadline':
          sortFunction = (todo1, todo2) => {
            if (todo1.date === null) return 1;
            if (todo2.date === null) return -1;
            return (new Date(todo1.date)).getTime() - (new Date(todo2.date)).getTime();
          };
          break;
        default:
          break;
      }
      todos.sort(sortFunction);
    };

    const updateTodos = function() {
      sortTodos();
      todoStorage.setTodos(todos);
      todoStorage.setSortType(sortType);
    };

    const addTodo = function(task, date, category) {
      todos.unshift(makeTodo(task, date, category, false));
      updateTodos();
    };

    const deleteTodo = function(id) {
      todos.splice(getIndex(id), 1);
      updateTodos();
    };

    const updateTodo = function(id, todoObject) {
      todos[getIndex(id)] = {...todoObject};
      updateTodos();
    }

    const getTodos = () => todos;

    const setSortType = (value) => {
      sortType = value;
      updateTodos();
    };

    (function() {
      todos = todoStorage.getTodos();
      sortType = todoStorage.getSortType();
      updateTodos();
    })();

    return { getTodo, getTodos, deleteTodo, addTodo, updateTodo, setSortType };
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

    const showModalOverlay = function() {
      modalOverlay.fadeIn(300);
    };

    const closeModalOverlay = function() {
      modalForm.off('submit');
      modalOverlay.fadeOut(300, function() {
        clearInputs();
      });
    };

    const openAddTodo = function() {
      formButton.text('Add');
      formHeading.text('Add Todo');
      modalForm.on('submit', function(e) {
        e.preventDefault();
        todoManager.addTodo(inputs.task.val(), inputs.date.val(), inputs.category.val());
        todoRenderer.renderTodos();
        closeModalOverlay();
      });
      showModalOverlay();
    };

    const openEditTodo = function(todo_id) {
      formButton.text('Edit');
      formHeading.text('Edit Todo');
      let todo = todoManager.getTodo(todo_id);
      inputs.category.val(todo.category);
      inputs.task.val(todo.task);
      inputs.date.val(todo.date);
      modalForm.on('submit', function(e) {
        e.preventDefault();
        todo.category = inputs.category.val();
        todo.task = inputs.task.val();
        todo.date = inputs.date.val();
        todoManager.updateTodo(todo_id, todo);
        todoRenderer.renderTodos();
        closeModalOverlay();
      });
      showModalOverlay();
    };

    const showAddTodo = () => openAddTodo();
    const showEditTodo = (todo_id) => openEditTodo(todo_id);
    
    (function() {
      // set modalOverlay to flex display and hide initially
      modalOverlay.css('display', 'flex');
      modalOverlay.hide(0);
      // close modalOverlay when clicked
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
      for (let todo of todos) {
        let id = todo.id;
        let wrapper = $('<label>', {
          'for': `todo-${id}`,
          'class': 'todo'
        });
        let dateElement = todo.date ? `<p class="date">${escapeHTML(formatDate(todo.date))}</p>` : '';
        let categoryElement = todo.category ? `<p class="category">${escapeHTML(todo.category)}</p>` : '';
        wrapper.html(`
        <div class="left-section">
          <input type="checkbox" id="todo-${id}" ${todo.done ? 'checked' : ''}>
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
          modalFormHandler.showEditTodo(id);
        });
        wrapper.find('.delete').click(function() {
          todoManager.deleteTodo(id);
          renderTodos();
        })
        wrapper.find('[type=checkbox]').click(function() {
          let todo = todoManager.getTodo(id);
          todo.done = !todo.done;
          todoManager.updateTodo(id, todo);
        })
        todoListElement.append(wrapper);
      }
    };

    return { renderTodos };
  })();

  (function() {
    $('#add-todo').click(modalFormHandler.showAddTodo);
    todoRenderer.renderTodos();
    $('#sort-by').change(function() {
      todoManager.setSortType($(this).val());
      todoRenderer.renderTodos();
    });
    $('#sort-by').val(todoStorage.getSortType());
  })();
})();