import { Component, createSignal, onMount } from 'solid-js';
import { Moon, Sun, RefreshCw } from 'lucide-solid';
import { toggleTheme } from '../theme';

const NavBar: Component = () => {
  const [isDark, setIsDark] = createSignal(false);

  onMount(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  });

  const handleToggle = () => {
    toggleTheme();
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  const handleReset = () => {
    localStorage.clear();
    const html = document.documentElement;
    html.classList.remove('dark');
    html.classList.add('light');
    location.reload();
  };

  return (
    <nav class="w-full flex justify-end items-center p-4 bg-[#5FD068]  text-white">
      <button
        onClick={handleToggle}
        class="mr-4 p-2 hover:opacity-80 transition"
        aria-label="Toggle theme"
      >
        {isDark() 
          ? <Sun class="w-6 h-6 stroke-current" /> 
          : <Moon class="w-6 h-6 stroke-current" />}
      </button>
      <button
        onClick={handleReset}
        class="p-2 hover:opacity-80 transition"
        aria-label="Reset app"
      >
        <RefreshCw class="w-6 h-6 stroke-current" />
      </button>
    </nav>
  );
};

export default NavBar;
