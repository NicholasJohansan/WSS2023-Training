(function() {

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

    const addTodo = function(task, date, category) {
      todos.push(makeTodo(task, date, category, false));
    }

    const getTodos = () => todos;

    // Make some placeholder todos
    (function() {
      for (let i = 0; i < 10; i++) {
        let date = Math.random() > 0.5 ? (new Date()).toISOString() : null;
        let category = Math.random() > 0.5 ? 'Some category' : null;
        let done = Math.random() > 0.5;
        console.log(done);
        let todo = makeTodo(`Task ${i}`, date, category, done);
        todos.push(todo)
      }
    })();

    return { getTodos };
  })();

  const todoRenderer = (function() {
    let todoListElement = $('#todos');

    const escapeHTML = function(text) {
      return $('<div>').text(text).text();
    };

    const formatDate = function(date) {
      date = new Date(date);
      return date.toLocaleString();
    };

    const renderTodos = function() {
      let todos = todoManager.getTodos();
      console.log(todos);
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
        todoListElement.append(wrapper);
      }
    };

    return { renderTodos };
  })();

  (function() {
    todoRenderer.renderTodos();
  })();
})();