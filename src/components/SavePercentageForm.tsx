import { Component, createSignal, createEffect } from 'solid-js';

interface SavePercentageFormProps {
  onNext: () => void;
}

const STORAGE_KEY = 'sf-percentage';

const SavePercentageForm: Component<SavePercentageFormProps> = (props) => {
  // load saved percentage or default to 0
  const stored = localStorage.getItem(STORAGE_KEY);
  const initial = stored ? JSON.parse(stored) : { percentage: 0 };
  const [percentage, setPercentage] = createSignal<number>(initial.percentage);

  // persist on every change
  createEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ percentage: percentage() })
    );
  });

  const handleInput = (e: Event) => {
    const raw = parseFloat((e.target as HTMLInputElement).value) || 0;
    // clamp between 0 and 100
    const clamped = Math.min(100, Math.max(0, raw));
    setPercentage(clamped);
  };

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
        Saving Rate (%)
      </h2>

      <div class="flex space-x-4 mb-8">
        <input
          type="number"
          placeholder="0–100"
          value={percentage()}
          onInput={handleInput}
          min="0"
          max="100"
          class="
            w-24 border-b-2
            border-[var(--color-brand-primary)] dark:border-[var(--color-border)]
            bg-transparent
            text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]
            focus:outline-none
          "
        />
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

export default SavePercentageForm;
