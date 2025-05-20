import { createEffect, createSignal, type Component } from 'solid-js';
import Landing from './components/Landing';
import IncomeForm from './components/IncomeForm';
import SavePercentageForm from './components/SavePercentageForm';
import GoalsPage from './components/GoalsPage';
import Dashboard from './components/Dashboard';

type Stage = 'landing' | 'income' | 'percentage' | 'goals' | 'dashboard';
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
        <IncomeForm onNext={() => goTo('percentage')} />
      )}
      {stage() === 'percentage' && (
        <SavePercentageForm onNext={() => goTo('goals')} />
      )}
      {stage() === 'goals' && (
        <GoalsPage onNext={() => goTo('dashboard')}/>
      )}
      {stage() === 'dashboard' && <Dashboard />}
    </>
  );
};

export default App;
