// src/components/Dashboard.tsx
import { Component } from 'solid-js';

interface IncomeData { income: number; currency: string; }
interface PercentageData { percentage: number; }
interface Goal { name: string; price: number; image: string; }

const Dashboard: Component = () => {
  const incomeData: IncomeData = JSON.parse(
    localStorage.getItem('sf-income') || '{"income":0,"currency":"USD"}'
  );
  const percData: PercentageData = JSON.parse(
    localStorage.getItem('sf-percentage') || '{"percentage":0}'
  );
  const goals: Goal[] = JSON.parse(
    localStorage.getItem('sf-goals') || '[]'
  );

  const monthlySave = incomeData.income * (percData.percentage / 100);
  const nextGoal = goals[0];
  const monthsNeeded =
    nextGoal && monthlySave > 0
      ? Math.ceil(nextGoal.price / monthlySave)
      : Infinity;

  return (
    <div class="min-h-screen p-4 bg-[var(--color-brand-bg)]">
      <div class="max-w-4xl mx-auto space-y-8">

        {/* Top row: Income & Saving Rate */}
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
        </div>

        {/* Bottom row: Goals list (left) & Months Until (right) */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Goals List */}
          <div class="space-y-4">
            {goals.map(goal => (
              <div class="p-4 bg-white rounded-xl shadow border-2 border-[var(--color-brand-primary)] flex items-center">
                <img
                  src={goal.image}
                  alt={goal.name}
                  class="h-12 w-12 rounded-md object-cover mr-4"
                />
                <div>
                  <span class="block font-semibold text-[var(--color-brand-primary)]">
                    {goal.name}
                  </span>
                  <span class="block text-sm text-[var(--color-brand-dark)]">
                    {goal.price} {incomeData.currency}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Months Until Next Goal */}
          <div class="self-start justify-self-end">
            <div class="w-24 h-24 bg-white rounded-lg shadow border-2 border-[var(--color-brand-primary)] flex flex-col items-center justify-center">
              <span class="text-xs font-medium text-[var(--color-brand-dark)]">
                Months Until
              </span>
              <span class="mt-1 text-xl font-bold text-[var(--color-brand-primary)]">
                {monthsNeeded === Infinity ? 'N/A' : monthsNeeded}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
