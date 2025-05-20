import { createEffect, createSignal, type Component } from 'solid-js';
import Landing from './components/Landing';
import IncomeForm from './components/IncomeForm';

type Stage = 'landing' | 'income' | 'goals';
const STORAGE_KEY = 'sf-stage';

const App: Component = () => {

  const stored = localStorage.getItem(STORAGE_KEY) as Stage | null;
  const [stage, setStage] = createSignal<Stage>(stored ?? 'landing');

  createEffect(() => {
    localStorage.setItem(STORAGE_KEY, stage());
  });

  const goTo = (next: Stage) => setStage(next);

  return (
    <>
      {stage() === 'landing' && <Landing onStart={() => goTo('income')} />}
      {stage() === 'income' && (
        <IncomeForm onNext={() => goTo('goals')} />
      )}
      {stage() === 'goals' && (
        <div class="p-4 max-w-xl mx-auto">
        </div>
      )}
    </>
  );
};

export default App;
