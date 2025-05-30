import { Component } from "solid-js";

interface LandingPage {
  onStart: () => void;
}

const Landing: Component<LandingPage> = (props) => {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center px-4">
      <h1
        class="
          text-5xl font-extrabold
          text-[var(--color-brand-primary)]
          dark:text-[var(--color-brand-accent)]
        "
      >
        Solid Finances
      </h1>
      <p
        class="
          mt-4 text-lg
          text-[var(--color-text-secondary)]
          dark:text-[var(--color-text-primary)]
          text-center
        "
      >
        Track your income, savings rate &amp; see how soon you can afford your next big purchase.
      </p>
      <button
        class="
          mt-6 px-8 py-3 rounded-full
          bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)]
          text-white
          dark:bg-[var(--color-brand-accent)] dark:hover:bg-[var(--color-brand-primary)]
          dark:text-[var(--color-text-secondary)]
          transition
        "
        onClick={props.onStart}
      >
        Let’s Start
      </button>
    </div>
  );
};

export default Landing;