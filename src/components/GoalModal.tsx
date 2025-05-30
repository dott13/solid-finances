// src/components/GoalModal.tsx
import { Component, createSignal, createEffect, JSX } from 'solid-js';

export interface Goal {
  name: string;
  price: number;
  image: string;
}

interface GoalModalProps {
  show: boolean;
  initial?: Goal;
  onClose: () => void;
  onSave: (goal: Goal) => void;
}

const GoalModal: Component<GoalModalProps> = (props) => {
  // if editing, seed with initial; otherwise empty
  const [name, setName] = createSignal(props.initial?.name || '');
  const [price, setPrice] = createSignal(props.initial?.price || 0);
  const [image, setImage] = createSignal(props.initial?.image || '');

  // whenever initial changes (opening for edit), reset fields
  createEffect(() => {
    if (props.initial) {
      setName(props.initial.name);
      setPrice(props.initial.price);
      setImage(props.initial.image);
    }
  });

  const handleFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submit: JSX.EventHandler<HTMLFormElement, Event> = (e) => {
    e.preventDefault();
    if (!name().trim() || price() <= 0 || !image()) return;
    props.onSave({ name: name().trim(), price: price(), image: image() });
    props.onClose();
  };

  return (
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
      style={{ display: props.show ? 'flex' : 'none' }}
    >
      <form
        onSubmit={submit}
        class="bg-[var(--color-brand-bg)] p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 class="text-2xl font-bold text-[var(--color-brand-primary)] mb-4">
          {props.initial ? 'Edit Goal' : 'New Goal Item'}
        </h2>
        <input
          type="text"
          placeholder="Name"
          value={name()}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          class="w-full mb-4 border-b-2 border-[var(--color-brand-primary)] bg-transparent focus:outline-none"
        />
        <input
          type="number"
          placeholder="Price"
          value={price()}
          onInput={(e) => setPrice(parseFloat((e.target as HTMLInputElement).value) || 0)}
          class="w-full mb-4 border-b-2 border-[var(--color-brand-primary)] bg-transparent focus:outline-none"
          min="0"
        />
        <input
          type="file"
          accept="image/*"
          onInput={handleFile}
          class="mb-4"
        />
        {image() && (
          <img
            src={image()}
            alt="preview"
            class="h-24 w-24 object-cover mb-4 rounded-md"
          />
        )}
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-[var(--color-brand-dark)] text-[var(--color-brand-dark)]"
            onClick={props.onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-[var(--color-brand-primary)] text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalModal;
