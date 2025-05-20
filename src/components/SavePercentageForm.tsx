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
    <div class="min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4">
      <h2 class="text-3xl font-bold text-brand-primary mb-8">
        Saving Rate (%)
      </h2>

      <div class="flex space-x-4 mb-8">
        <input
          type="number"
          placeholder="0–100"
          minLength={0}
          maxLength={100}
          value={percentage()}
          onInput={handleInput}
          class="w-24 border-b-2 border-brand-primary bg-transparent text-gray-800 focus:outline-none"
          min="0"
          max="100"
        />
      </div>

      <button
        onClick={props.onNext}
        class="px-8 py-3 bg-brand-primary text-white rounded-full hover:bg-brand-dark transition"
      >
        Next
      </button>
    </div>
  );
};

export default SavePercentageForm;
