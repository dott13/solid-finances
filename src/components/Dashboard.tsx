import { Component, createSignal, createEffect, createMemo, For } from 'solid-js';
import SavingsChart from './SavingsChart';
import GoalModal, { Goal } from './GoalModal';

interface IncomeData { income: number; currency: string; }
interface PercentageData { percentage: number; }
type StoredGoal = Goal & { starred: boolean };

const Dashboard: Component = () => {
  // Load income & saving rate
  const incomeData: IncomeData = JSON.parse(
    localStorage.getItem('sf-income') || '{"income":0,"currency":"USD"}'
  );
  const percData: PercentageData = JSON.parse(
    localStorage.getItem('sf-percentage') || '{"percentage":0}'
  );

  // Load goals & starred flags
  const storedRaw = JSON.parse(localStorage.getItem('sf-goals') || '[]') as any[];
  const initialGoals: StoredGoal[] = storedRaw.map(g => ({
    name: g.name,
    price: g.price,
    image: g.image,
    starred: !!g.starred
  }));
  const [goals, setGoals] = createSignal<StoredGoal[]>(initialGoals);

  // Persist goals
  createEffect(() => {
    localStorage.setItem('sf-goals', JSON.stringify(goals()));
  });

  // Modal & edit state
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

  // Star toggling: only one at a time
  const toggleStar = (idx: number) => {
    setGoals(goals().map((g, i) => ({
      ...g,
      starred: i === idx ? !g.starred : false
    })));
  };

  // Build sorted list with indices preserved
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

  // Calculate monthly save & months to goal
  const monthlySave = incomeData.income * (percData.percentage / 100);
  const monthsNeeded = createMemo(() => {
    const primary = sortedList()[0]?.goal;
    return primary && monthlySave > 0
      ? Math.ceil(primary.price / monthlySave)
      : Infinity;
  });
  const primaryGoal = createMemo(() => sortedList()[0]?.goal);

  // Get the starred goal specifically for the chart
  const starredGoal = createMemo(() => goals().find(g => g.starred));

  return (
    <div class="min-h-screen p-4 bg-[var(--color-brand-bg)]">
      <div class="max-w-4xl mx-auto space-y-8">

        {/* Top row: Income, Saving Rate & Chart */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income */}
          <div class="p-6 bg-white rounded-2xl shadow border-2 border-[var(--color-brand-primary)] flex flex-col">
            <span class="font-semibold text-[var(--color-brand-primary)]">Income</span>
            <span class="mt-2 text-3xl font-bold text-[var(--color-brand-primary)]">
              {incomeData.income} {incomeData.currency}
            </span>
          </div>
          {/* Saving Rate */}
          <div class="p-6 bg-white rounded-2xl shadow border-2 border-[var(--color-brand-primary)] flex flex-col">
            <span class="font-semibold text-[var(--color-brand-primary)]">Saving Rate</span>
            <span class="mt-2 text-3xl font-bold text-[var(--color-brand-primary)]">
              {percData.percentage}% ({monthlySave.toFixed(2)} {incomeData.currency}/mo)
            </span>
          </div>
          {/* Chart spans both columns - shows starred goal */}
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
          {/* Show message when no goal is starred */}
          {!starredGoal() && goals().length > 0 && (
            <div class="md:col-span-2 p-6 bg-white rounded-lg shadow border-2 border-[var(--color-brand-primary)] text-center">
              <p class="text-[var(--color-brand-dark)]">
                ⭐ Star a goal to see your savings projection
              </p>
            </div>
          )}
        </div>

        {/* Bottom row: Goals & Months Until */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goals list + Add button */}
          <div class="flex flex-col space-y-4">
            <For each={sortedList()} fallback={<div>No goals yet</div>}>
              {({ goal, idx }) => (
                <div
                  class="relative p-4 bg-white rounded-xl shadow border-2 transition-all duration-300"
                  classList={{ 
                    'border-[var(--color-brand-accent)] bg-gradient-to-r from-white to-[var(--color-brand-bg)] scale-105 shadow-lg': goal.starred,
                    'border-[var(--color-brand-primary)]': !goal.starred
                  }}
                >
                  <button
                    class="absolute top-2 right-10 text-xl transition-colors duration-200"
                    classList={{
                      'text-[var(--color-brand-accent)] animate-pulse': goal.starred,
                      'text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]': !goal.starred
                    }}
                    onClick={() => toggleStar(idx)}
                  >
                    {goal.starred ? '★' : '☆'}
                  </button>
                  <button
                    class="absolute top-2 right-2 text-[var(--color-brand-primary)] hover:text-[var(--color-brand-dark)]"
                    onClick={() => openEdit(idx)}
                  >
                    ✎
                  </button>
                  <img
                    src={goal.image}
                    alt={goal.name}
                    class="h-12 w-12 rounded-md object-cover mr-4"
                  />
                  <div>
                    <span class="block font-semibold text-[var(--color-brand-primary)]">
                      {goal.name}
                      {goal.starred && <span class="ml-2 text-[var(--color-brand-accent)]">⭐ Active Goal</span>}
                    </span>
                    <span class="block text-sm text-[var(--color-brand-dark)]">
                      {goal.price} {incomeData.currency}
                    </span>
                  </div>
                </div>
              )}
            </For>
            <button
              class="w-full px-4 py-3 bg-[var(--color-brand-primary)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition"
              onClick={openAdd}
            >
              + Add New Goal
            </button>
          </div>

          {/* Months Until Next Goal */}
          <div class="self-start justify-self-end">
            <div class="w-24 h-24 bg-white rounded-lg shadow border-2 border-[var(--color-brand-primary)] flex flex-col items-center justify-center">
              <span class="text-xs font-medium text-[var(--color-brand-dark)]">Months Until</span>
              <span class="mt-1 text-xl font-bold text-[var(--color-brand-primary)]">
                {monthsNeeded() === Infinity ? 'N/A' : monthsNeeded()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Goal creation/edit modal */}
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