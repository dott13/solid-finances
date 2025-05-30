import { Component, createSignal, createEffect } from 'solid-js';

type Currency = 'USD' | 'MDL' | 'ROM' | 'EUR';
interface IncomeFormProps {
  onNext: () => void;
}

const STORAGE_KEY = 'sf-income';

const IncomeForm: Component<IncomeFormProps> = (props) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const initial = stored
    ? JSON.parse(stored)
    : { income: 0, currency: 'USD' as Currency };

  const [income, setIncome] = createSignal<number>(initial.income);
  const [currency, setCurrency] = createSignal<Currency>(initial.currency);

  createEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ income: income(), currency: currency() })
    );
  });

  return (
    <div
      class="
        min-h-screen flex flex-col items-center justify-center
        bg-[var(--color-brand-bg)] dark:bg-[var(--color-card-bg)]
        px-4
      "
    >
      <h2
        class="
          text-3xl font-bold mb-8
          text-[var(--color-brand-primary)] dark:text-[var(--color-brand-accent)]
        "
      >
        Enter Your Income
      </h2>

      <div class="flex space-x-4 mb-8">
        <input
          type="number"
          placeholder="Monthly Income"
          value={income()}
          onInput={(e) =>
            setIncome(parseFloat((e.target as HTMLInputElement).value) || 0)
          }
          min="0"
          class="
            w-40 border-b-2
            border-[var(--color-brand-primary)] dark:border-[var(--color-border)]
            bg-transparent
            text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]
            focus:outline-none
          "
        />
        <select
          value={currency()}
          onChange={(e) =>
            setCurrency((e.target as HTMLSelectElement).value as Currency)
          }
          class="
            w-24 border-b-2
            border-[var(--color-brand-primary)] dark:border-[var(--color-border)]
            bg-transparent
            text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]
            focus:outline-none
          "
        >
          <option value="USD">USD</option>
          <option value="MDL">MDL</option>
          <option value="ROM">ROM</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <button
        onClick={props.onNext}
        class="
          px-8 py-3 rounded-full transition
          bg-[var(--color-brand-primary)]
          hover:bg-[var(--color-brand-dark)]
          text-white
          dark:bg-[var(--color-brand-accent)]
          dark:text-[var(--color-text-primary)]
          dark:hover:bg-[var(--color-brand-primary)]
        "
      >
        Next
      </button>
    </div>
  );
};

export default IncomeForm;
