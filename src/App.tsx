import { createSignal, type Component } from 'solid-js';
import Landing from './components/Landing';

const App: Component = () => {
  const [started, setStarted] = createSignal(false);
  return (
    <>
      {!started() ? (
        <Landing onStart={() => setStarted(true)}/>
      ) : (
        <div class="p-4 max-w-xl mx-auto">
          {/* Now pull in your other pieces: */}
          {/* <IncomeForm … /> */}
          {/* <GoalsList … /> */}
        </div>
      )
      }
    </>
  );
};

export default App;
