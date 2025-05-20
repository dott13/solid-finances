import { Component } from "solid-js";

interface LandingPage {
    onStart: () => void;
}

const Landing: Component<LandingPage> = (props) => {
    return (
        <div class="min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4">
            <h1 class="text-5xl font-extrabold text-brand-primary">Solid Finances</h1>
            <p class="mt-4 text-lg text-gray-700 text-center">
                Track your income, savings rate & see how soon you can afford your next big purchase.
            </p>
            <button
                class="mt-6 px-8 py-3 rounded-full bg-brand-primary text-white hover:bg-brand-dark transition"
                onClick={props.onStart}
            >
                Let’s Start
            </button>
        </div>
    );
}

export default Landing;