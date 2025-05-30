
import { Component, createSignal, createEffect, createMemo, For } from 'solid-js';
import GoalModal, { Goal } from './GoalModal';

interface IncomeData { income: number; currency: string; }
interface PercentageData { percentage: number; }

type StoredGoal = Goal & { starred: boolean };

const Dashboard: Component = () => {
  // load income & save-rate
  const incomeData: IncomeData = JSON.parse(
    localStorage.getItem('sf-income') || '{"income":0,"currency":"USD"}'
  );
  const percData: PercentageData = JSON.parse(
    localStorage.getItem('sf-percentage') || '{"percentage":0}'
  );

  // load raw goals array (preserves original order/index)
  const storedRaw = JSON.parse(localStorage.getItem('sf-goals') || '[]') as StoredGoal[];
  const [goals, setGoals] = createSignal<StoredGoal[]>(storedRaw);

  // persist whenever goals change
  createEffect(() => {
    localStorage.setItem('sf-goals', JSON.stringify(goals()));
  });

  // modal & edit pointer
  const [showModal, setShowModal] = createSignal(false);
  const [editIdx, setEditIdx] = createSignal<number | null>(null);

  const openAdd = () => {
    setEditIdx(null);
    setShowModal(true);
  };
  const openEdit = (origIdx: number) => {
    setEditIdx(origIdx);
    setShowModal(true);
  };

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

  // star toggling: only one goal starred at a time
  const toggleStar = (origIdx: number) => {
    setGoals(goals().map((g, i) => ({
      ...g,
      starred: i === origIdx ? !g.starred : false
    })));
  };

  // build a sorted list of references to the same items, but keep original indices
  const sortedList = createMemo(() => {
    const arr = goals();
    const starred = arr.find(g => g.starred);
    if (!starred) return arr.map((g, i) => ({ goal: g, idx: i }));
    const rest = arr.filter(g => !g.starred);
    const restWithIdx = arr
      .map((g, i) => ({ goal: g, idx: i }))
      .filter(item => !item.goal.starred);
    return [{ goal: starred, idx: arr.indexOf(starred) } as {goal: StoredGoal, idx: number}]
      .concat(restWithIdx);
  });

  // months until primary goal
  const monthlySave = incomeData.income * (percData.percentage / 100);
  const monthsNeeded = createMemo(() => {
    const primary = sortedList()[0]?.goal;
    return primary && monthlySave > 0
      ? Math.ceil(primary.price / monthlySave)
      : Infinity;
  });

  return (
    <div class="min-h-screen p-4 bg-[var(--color-brand-bg)]">
      <div class="max-w-4xl mx-auto space-y-8">
        {/* Income & Saving Rate */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 bg-white rounded-2xl shadow border-2 border-[var(--color-brand-primary)]">
            <div class="font-semibold text-[var(--color-brand-primary)]">Income</div>
            <div class="mt-2 text-3xl font-bold text-[var(--color-brand-primary)]">
              {incomeData.income} {incomeData.currency}
            </div>
          </div>
          <div class="p-6 bg-white rounded-2xl shadow border-2 border-[var(--color-brand-primary)]">
            <div class="font-semibold text-[var(--color-brand-primary)]">Saving Rate</div>
            <div class="mt-2 text-3xl font-bold text-[var(--color-brand-primary)]">
              {percData.percentage}% ({monthlySave.toFixed(2)} {incomeData.currency}/mo)
            </div>
          </div>
        </div>

        {/* Goals list & Months Until */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goals */}
          <div class="flex flex-col space-y-4">
            <For each={sortedList()}>
              {({ goal, idx }) => (
                <div
                  class="relative p-4 bg-white rounded-xl shadow border-2 border-[var(--color-brand-primary)] flex items-center transition-transform duration-300"
                  classList={{ 'scale-105 animate-pulse': goal.starred }}
                >
                  <button
                    class="absolute top-2 right-10 text-[var(--color-brand-primary)] text-xl"
                    onClick={() => toggleStar(idx)}
                  >
                    {goal.starred ? '★' : '☆'}
                  </button>
                  <button
                    class="absolute top-2 right-2 text-[var(--color-brand-primary)]"
                    onClick={() => openEdit(idx)}
                  >
                    ✎
                  </button>
                  <img src={goal.image} alt={goal.name}
                       class="h-12 w-12 rounded-md object-cover mr-4" />
                  <div>
                    <div class="font-semibold text-[var(--color-brand-primary)]">{goal.name}</div>
                    <div class="text-sm text-[var(--color-brand-dark)]">
                      {goal.price} {incomeData.currency}
                    </div>
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

          {/* Months Until */}
          <div class="self-start justify-self-end">
            <div class="w-24 h-24 bg-white rounded-lg shadow border-2 border-[var(--color-brand-primary)] flex flex-col items-center justify-center">
              <div class="text-xs font-medium text-[var(--color-brand-dark)]">Months Until</div>
              <div class="mt-1 text-xl font-bold text-[var(--color-brand-primary)]">
                {monthsNeeded() === Infinity ? 'N/A' : monthsNeeded()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
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
