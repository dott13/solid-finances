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
  const stored = localStorage.getItem(STORAGE_KEY);
  const initial: Goal[] = stored ? JSON.parse(stored) : [];

  const [view, setView] = createSignal<'ask' | 'form'>('ask');
  const [goals, setGoals] = createSignal<Goal[]>(initial);

  // persist goals
  createEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals()));
  });

  // form signals
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
    setGoals([...goals(), { name: name().trim(), price: price(), image: image() }]);
    props.onNext(); // go to dashboard
  };

  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4">
      {view() === 'ask' && (
        <>
          <h2 class="text-3xl font-bold text-brand-primary mb-6">
            Add a savings goal now or later?
          </h2>
          <div class="flex space-x-4">
            <button
              onClick={() => setView('form')}
              class="px-6 py-2 bg-brand-primary text-white rounded-full hover:bg-brand-dark transition"
            >
              Now
            </button>
            <button
              onClick={() => props.onNext()} 
              class="px-6 py-2 border border-brand-primary text-brand-primary rounded-full hover:bg-brand-primary/10 transition"
            >
              Later
            </button>
          </div>
        </>
      )}

      {view() === 'form' && (
        <>
          <h2 class="text-3xl font-bold text-brand-primary mb-6">
            New Goal Item
          </h2>
          <div class="flex flex-col items-center space-y-4 mb-6">
            <input
              type="text"
              placeholder="Name"
              value={name()}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              class="w-64 border-b-2 border-brand-primary bg-transparent text-gray-800 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Price"
              value={price()}
              onInput={(e) =>
                setPrice(parseFloat((e.target as HTMLInputElement).value) || 0)
              }
              class="w-40 border-b-2 border-brand-primary bg-transparent text-gray-800 focus:outline-none"
              min="0"
            />
            <input
              type="file"
              accept="image/*"
              onInput={handleFile}
              class="text-gray-800"
            />
            {image() && (
              <img
                src={image()}
                alt="Preview"
                class="h-24 w-24 object-cover rounded-md"
              />
            )}
          </div>
          <button
            onClick={addGoal}
            class="px-8 py-3 bg-brand-primary text-white rounded-full hover:bg-brand-dark transition"
          >
            Add Goal
          </button>
        </>
      )}
    </div>
  );
};

export default GoalsPage;
