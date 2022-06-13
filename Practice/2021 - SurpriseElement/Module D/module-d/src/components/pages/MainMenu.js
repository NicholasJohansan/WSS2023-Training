import '../../styles/main-menu.css';

const MainMenu = ({ setAppState }) => {
  const setAppStateTo = (state) => () => {
    setAppState(state);
  };

  return (
    <div id="main-menu">
      <header>
        The Interactive Studio
      </header>
      <div id='links'>
        <button onClick={setAppStateTo('/mcq')}>
          Multiple Choice
        </button>
        <button onClick={setAppStateTo('/dnd')}>
          Drag n Drop
        </button>
        <button onClick={setAppStateTo('/fib')}>
          Fill in the Blanks
        </button>
      </div>
    </div>
  );
};

export default MainMenu;