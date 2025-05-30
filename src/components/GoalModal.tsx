import { Component, createSignal, createEffect } from 'solid-js';

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
  const [name, setName] = createSignal(props.initial?.name || '');
  const [price, setPrice] = createSignal(props.initial?.price || 0);
  const [image, setImage] = createSignal(props.initial?.image || '');

  // reset fields when editing a different goal
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

  const submit = () => {
    if (!name().trim() || price() <= 0 || !image()) return;
    props.onSave({ name: name().trim(), price: price(), image: image() });
    props.onClose();
  };

  return (
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
      style={{ display: props.show ? 'flex' : 'none' }}
    >
      <div
        class="
          bg-[var(--color-card-bg)] dark:bg-[var(--color-card-bg)]
          border-2 border-[var(--color-border)]
          p-6 rounded-xl shadow-lg
          w-full max-w-md
        "
      >
        <h2
          class="
            text-2xl font-bold mb-4
            text-[var(--color-brand-primary)] dark:text-[var(--color-brand-accent)]
          "
        >
          {props.initial ? 'Edit Goal' : 'New Goal Item'}
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name()}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          class="
            w-full mb-4 pb-1
            border-b-2 border-[var(--color-brand-primary)] dark:border-[var(--color-border)]
            bg-transparent
            text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]
            focus:outline-none
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
            w-full mb-4 pb-1
            border-b-2 border-[var(--color-brand-primary)] dark:border-[var(--color-border)]
            bg-transparent
            text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]
            focus:outline-none
          "
        />

        <input
          type="file"
          accept="image/*"
          onInput={handleFile}
          class="
            w-full mb-4
            text-[var(--color-text-primary)] dark:text-[var(--color-text-secondary)]
          "
        />

        {image() && (
          <img
            src={image()}
            alt="preview"
            class="
              h-24 w-24 object-cover mb-4 rounded-md
              border-2 border-[var(--color-border)]
            "
          />
        )}

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            onClick={props.onClose}
            class="
              px-4 py-2 rounded-lg
              border-2 border-[var(--color-border)]
              text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]
              hover:bg-[var(--color-border)]/20
              transition
            "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            class="
              px-4 py-2 rounded-lg
              bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)]
              text-white
              dark:bg-[var(--color-brand-accent)] dark:hover:bg-[var(--color-brand-primary)]
              dark:text-[var(--color-text-primary)]
              transition
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
