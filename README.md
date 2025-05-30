# Solid Finances

**Solid Finances** is a client-side financial planning web application built with [SolidJS](https://www.solidjs.com/) and styled using Tailwind CSS. It helps users track their income, set a monthly savings rate, define savings goals, and visualize how long it will take to achieve each goal.

## Features

* **Income & Currency**: Enter your monthly income and select your currency (USD, MDL, ROM, EUR).
* **Savings Rate**: Specify the percentage of your income you plan to save each month (0–100%).
* **Goals Management**: Add, edit, and star a savings goal with a name, price, and image.
* **Dashboard**:

  * Displays widgets for income and savings rate with the actual monthly savings amount.
  * Shows a projected savings chart for the starred goal, with month-by-month progress and a guide line at the target amount.
  * Lists all goals, highlighting the starred one and showing how many months remain until each goal is reached.
* **Persistence**: Uses `localStorage` to save state across reloads.
* **Dark / Light Theme**: Toggle between light and dark mode, with custom color palettes for both.
* **Clear & Reset**: Reset the application to its initial state by clearing `localStorage` and returning to the landing page.

## Application Flow

1. **Landing Page**

   * Title: **Solid Finances**
   * Description of app purpose.
   * **Let’s Start** button to proceed.

2. **Income Input**

   * Prompt: **Enter Your Income**
   * Fields: Monthly income (number), currency selector.
   * **Next** button saves data and navigates to savings rate.

3. **Savings Rate**

   * Prompt: **Saving Rate (%)**
   * Field: Percentage input (0–100).
   * **Next** button saves data and navigates to goals page.

4. **Goals Page**

   * Ask: **Add a savings goal now or later?**

     * **Now**: shows form to create a new goal.
     * **Later**: skips directly to the dashboard.
   * Goal Form:

     * Fields: Name, price, image upload (preview shown).
     * **Add Goal** button saves goal and proceeds to dashboard.

5. **Dashboard**

   * **Widgets**:

     * Income widget (amount & currency).
     * Savings Rate widget (% and actual monthly savings).
   * **Projected Savings Chart**:

     * Displays cumulative savings over time versus goal price.
     * X-axis labeled by months (1, 2, 3, ...).
   * **Goals List**:

     * All goals displayed; starred goal appears first with an animation.
     * Star button allows marking only one active goal.
     * Edit button updates name, price, or image in a modal.
   * **Months Until**:

     * Shows how many months remain to reach the starred goal.
   * **Add New Goal** button to open modal and create more goals.

## Getting Started

1. **Installation**

   ```bash
   git clone <repo-url>
   cd solid-finances
   npm install
   ```

2. **Development**

   ```bash
   npm run dev
   ```

   Opens `http://localhost:3000` by default.

3. **Build & Deployment**

   ```bash
   npm run build
   npm run preview   # to preview production build
   ```

   Deploy the `dist` folder to any static host (e.g., GitHub Pages).

## Technologies Used

* **SolidJS** (TypeScript)
* **Tailwind CSS**
* **Vite** (build tool)
* **localStorage** (state persistence)
* **lucide-solid** (icons)

## Customization

* Color variables are defined in **`index.css`** under `:root` (light) and `.dark` (dark) using CSS custom properties:

  ```css
  :root {
    --color-brand-bg: #F6FBF4;
    --color-brand-primary: #5FD068;
    /* ... */
  }
  .dark {
    --color-brand-bg: #1a1a1a;
    --color-brand-primary: #40b349;
    /* ... */
  }
  ```
* Tailwind config has `darkMode: 'class'` to enable class-based theming.

