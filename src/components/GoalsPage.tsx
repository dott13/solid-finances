import { Component, createSignal, createEffect } from 'solid-js';

interface Goal {
  name: string;
  price: number;
  image: string;
}

interface GoalsPageProps {
  onNext: () => void;
}

const STORAGE_KEY = 'sf-goals';

const GoalsPage: Component<GoalsPageProps> = (props) => {
  // load existing goals or start empty
  const stored = localStorage.getItem(STORAGE_KEY);
  const initial: Goal[] = stored ? JSON.parse(stored) : [];

  const [view, setView] = createSignal<'ask' | 'form'>('ask');
  const [goals, setGoals] = createSignal<Goal[]>(initial);

  // persist whenever goals change
  createEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals()));
  });

  // form fields
  const [name, setName] = createSignal('');
  const [price, setPrice] = createSignal<number>(0);
  const [image, setImage] = createSignal<string>('');

  const handleFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addGoal = () => {
    if (!name().trim() || price() <= 0 || !image()) return;
    setGoals([...goals(), {
      name: name().trim(),
      price: price(),
      image: image()
    }]);
    props.onNext();
  };

  return (
    <div
      class="
        min-h-screen flex flex-col items-center justify-center px-4
        bg-[var(--color-brand-bg)] dark:bg-[var(--color-card-bg)]
      "
    >
      {view() === 'ask' && (
        <>
          <h2
            class="
              text-3xl font-bold mb-6
              text-[var(--color-brand-primary)] dark:text-[var(--color-brand-accent)]
            "
          >
            Add a savings goal now or later?
          </h2>
          <div class="flex space-x-4">
            <button
              type="button"
              onClick={() => setView('form')}
              class="
                px-6 py-2 rounded-full transition
                bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)]
                text-white
                dark:bg-[var(--color-brand-accent)] dark:hover:bg-[var(--color-brand-primary)]
                dark:text-[var(--color-text-primary)]
              "
            >
              Now
            </button>
            <button
              type="button"
              onClick={props.onNext}
              class="
                px-6 py-2 rounded-full transition
                border-2 border-[var(--color-brand-primary)]
                text-[var(--color-brand-primary)]
                hover:bg-[var(--color-brand-primary)]/10
                dark:border-[var(--color-border)]
                dark:text-[var(--color-text-secondary)]
                dark:hover:bg-[var(--color-border)]/20
              "
            >
              Later
            </button>
          </div>
        </>
      )}

      {view() === 'form' && (
        <>
          <h2
            class="
              text-3xl font-bold mb-6
              text-[var(--color-brand-primary)] dark:text-[var(--color-brand-accent)]
            "
          >
            New Goal Item
          </h2>
          <div class="flex flex-col items-center space-y-4 mb-6 w-full max-w-md">
            <input
              type="text"
              placeholder="Name"
              value={name()}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              class="
                w-full border-b-2
                border-[var(--color-brand-primary)] dark:border-[var(--color-border)]
                bg-transparent
                text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]
                focus:outline-none pb-1
              "
            />
            <input
              type="number"
              placeholder="Price"
              value={price()}
              onInput={(e) =>
                setPrice(parseFloat((e.target as HTMLInputElement).value) || 0)
              }
              min="0"
              class="
                w-full border-b-2
                border-[var(--color-brand-primary)] dark:border-[var(--color-border)]
                bg-transparent
                text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]
                focus:outline-none pb-1
              "
            />
            <input
              type="file"
              accept="image/*"
              onInput={handleFile}
              class="
                w-full text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]
              "
            />
            {image() && (
              <img
                src={image()}
                alt="Preview"
                class="
                  h-24 w-24 object-cover rounded-md
                  border-2 border-[var(--color-border)]
                "
              />
            )}
          </div>
          <button
            type="button"
            onClick={addGoal}
            class="
              px-8 py-3 rounded-full transition
              bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)]
              text-white
              dark:bg-[var(--color-brand-accent)] dark:hover:bg-[var(--color-brand-primary)]
              dark:text-[var(--color-text-primary)]
            "
          >
            Add Goal
          </button>
        </>
      )}
    </div>
  );
};

export default GoalsPage;
