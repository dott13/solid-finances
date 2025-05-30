import { Component, createSignal, createEffect, createMemo, For } from 'solid-js';
import SavingsChart from './SavingsChart';
import GoalModal, { Goal } from './GoalModal';

interface IncomeData { income: number; currency: string; }
interface PercentageData { percentage: number; }
type StoredGoal = Goal & { starred: boolean };

const Dashboard: Component = () => {
  // load income & saving rate
  const incomeData: IncomeData = JSON.parse(
    localStorage.getItem('sf-income') || '{"income":0,"currency":"USD"}'
  );
  const percData: PercentageData = JSON.parse(
    localStorage.getItem('sf-percentage') || '{"percentage":0}'
  );

  // load goals & starred flags
  const storedRaw = JSON.parse(localStorage.getItem('sf-goals') || '[]') as any[];
  const initialGoals: StoredGoal[] = storedRaw.map(g => ({
    name: g.name,
    price: g.price,
    image: g.image,
    starred: !!g.starred
  }));
  const [goals, setGoals] = createSignal<StoredGoal[]>(initialGoals);

  // persist goals
  createEffect(() => {
    localStorage.setItem('sf-goals', JSON.stringify(goals()));
  });

  // modal & edit state
  const [showModal, setShowModal] = createSignal(false);
  const [editIdx, setEditIdx] = createSignal<number | null>(null);
  const openAdd = () => { setEditIdx(null); setShowModal(true); };
  const openEdit = (idx: number) => { setEditIdx(idx); setShowModal(true); };
  const handleSave = (g: Goal) => {
    const idx = editIdx();
    if (idx === null) {
      setGoals([...goals(), { ...g, starred: false }]);
    } else {
      setGoals(goals().map((old, i) =>
        i === idx ? { ...g, starred: old.starred } : old
      ));
    }
  };

  // star toggling: only one at a time
  const toggleStar = (idx: number) => {
    setGoals(goals().map((g, i) => ({
      ...g,
      starred: i === idx ? !g.starred : false
    })));
  };

  // build sorted list with indices preserved
  const sortedList = createMemo(() => {
    const arr = goals();
    const starredIdx = arr.findIndex(g => g.starred);
    const withIdx = arr.map((g, i) => ({ goal: g, idx: i }));
    if (starredIdx < 0) return withIdx;
    return [
      withIdx[starredIdx],
      ...withIdx.filter((_, i) => i !== starredIdx)
    ];
  });

  // calculate monthly save & months to goal
  const monthlySave = incomeData.income * (percData.percentage / 100);
  const monthsNeeded = createMemo(() => {
    const primary = sortedList()[0]?.goal;
    return primary && monthlySave > 0
      ? Math.ceil(primary.price / monthlySave)
      : Infinity;
  });
  const starredGoal = createMemo(() => goals().find(g => g.starred));

  return (
    <div class="min-h-screen p-4 bg-[var(--color-brand-bg)] dark:bg-[var(--color-card-bg)]">
      <div class="max-w-4xl mx-auto space-y-8">

        {/* top row: income, saving rate, chart */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* income widget */}
          <div class="p-6 rounded-2xl shadow border-2 border-[var(--color-border)]
                      bg-[var(--color-card-bg)] dark:bg-[var(--color-card-bg)] flex flex-col">
            <span class="font-semibold text-[var(--color-brand-primary)] dark:text-[var(--color-brand-accent)]">
              Income
            </span>
            <span class="mt-2 text-3xl font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]">
              {incomeData.income} {incomeData.currency}
            </span>
          </div>
          {/* saving rate widget */}
          <div class="p-6 rounded-2xl shadow border-2 border-[var(--color-border)]
                      bg-[var(--color-card-bg)] dark:bg-[var(--color-card-bg)] flex flex-col">
            <span class="font-semibold text-[var(--color-brand-primary)] dark:text-[var(--color-brand-accent)]">
              Saving Rate
            </span>
            <span class="mt-2 text-3xl font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]">
              {percData.percentage}% ({monthlySave.toFixed(2)} {incomeData.currency}/mo)
            </span>
          </div>
          {/* chart spans both columns */}
          {starredGoal() && monthlySave > 0 && (
            <div class="md:col-span-2">
              <SavingsChart
                monthlySave={monthlySave}
                goalAmount={starredGoal()!.price}
                goalName={starredGoal()!.name}
                currency={incomeData.currency}
              />
            </div>
          )}
          {/* prompt to star a goal */}
          {!starredGoal() && goals().length > 0 && (
            <div class="md:col-span-2 p-6 rounded-lg shadow border-2 border-[var(--color-border)]
                        bg-[var(--color-card-bg)] dark:bg-[var(--color-card-bg)] text-center">
              <p class="text-[var(--color-text-secondary)] dark:text-[var(--color-text-primary)]">
                ⭐ Star a goal to see your savings projection
              </p>
            </div>
          )}
        </div>

        {/* bottom row: goals list & months until */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* goals list + add button */}
          <div class="flex flex-col space-y-4">
            <For each={sortedList()} fallback={<div class="text-[var(--color-text-secondary)] dark:text-[var(--color-text-primary)]">No goals yet</div>}>
              {({ goal, idx }) => (
                <div
                  class="relative p-4 rounded-xl shadow transition-all duration-300
                          bg-[var(--color-card-bg)] dark:bg-[var(--color-card-bg)]"
                  classList={{
                    'border-2 border-[var(--color-brand-accent)] scale-105': goal.starred,
                    'border-2 border-[var(--color-border)]': !goal.starred
                  }}
                >
                  <button
                    onClick={() => toggleStar(idx)}
                    class="absolute top-2 right-10 text-xl transition-colors duration-200"
                    classList={{
                      'text-[var(--color-brand-accent)] animate-pulse': goal.starred,
                      'text-[var(--color-border)] hover:text-[var(--color-brand-accent)]': !goal.starred
                    }}
                  >
                    {goal.starred ? '★' : '☆'}
                  </button>
                  <button
                    onClick={() => openEdit(idx)}
                    class="absolute top-2 right-2 text-[var(--color-border)] hover:text-[var(--color-text-primary)] dark:hover:text-[var(--color-text-secondary)]"
                  >
                    ✎
                  </button>
                  <img
                    src={goal.image}
                    alt={goal.name}
                    class="h-12 w-12 rounded-md object-cover mr-4 border-2 border-[var(--color-border)]"
                  />
                  <div>
                    <span class="block font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]">
                      {goal.name}
                    </span>
                    <span class="block text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-text-primary)]">
                      {goal.price} {incomeData.currency}
                    </span>
                  </div>
                </div>
              )}
            </For>
            <button
              onClick={openAdd}
              class="w-full px-4 py-3 rounded-lg transition
                     bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)]
                     dark:bg-[var(--color-brand-accent)] dark:hover:bg-[var(--color-brand-primary)]
                     text-white"
            >
              + Add New Goal
            </button>
          </div>

          {/* months until widget */}
          <div class="self-start justify-self-end">
            <div class="w-24 h-24 rounded-lg shadow border-2 border-[var(--color-border)]
                        bg-[var(--color-card-bg)] dark:bg-[var(--color-card-bg)]
                        flex flex-col items-center justify-center">
              <span class="text-xs font-medium text-[var(--color-text-secondary)] dark:text-[var(--color-text-primary)]">
                Months Until
              </span>
              <span class="mt-1 text-xl font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]">
                {monthsNeeded() === Infinity ? 'N/A' : monthsNeeded()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* goal creation/edit modal */}
      <GoalModal
        show={showModal()}
        initial={editIdx() !== null ? goals()[editIdx()!] : undefined}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Dashboard;
