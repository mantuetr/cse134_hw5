const themeButton = document.querySelector("#theme-toggle");
const root = document.documentElement;
const themeKey = "portfolio-theme";

let currentTheme = "light";

try {
    const savedTheme = localStorage.getItem(themeKey);

    if (savedTheme === "light" || savedTheme === "dark") {
        currentTheme = savedTheme;
    }
} catch (error) {
}

function applyTheme(theme) {
    currentTheme = theme;
    root.dataset.theme = theme;

    if (themeButton) {
        themeButton.textContent =
            theme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode";
    }
}

applyTheme(currentTheme);

if (themeButton) {
    themeButton.hidden = false;

    themeButton.addEventListener("click", () => {
        const nextTheme =
            currentTheme === "light" ? "dark" : "light";

        function updateTheme() {
            applyTheme(nextTheme);

            try {
                localStorage.setItem(themeKey, nextTheme);
            } catch (error) {
            }
        }

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (
            !reducedMotion &&
            typeof document.startViewTransition === "function"
        ) {
            document.startViewTransition(updateTheme);
        } else {
            updateTheme();
        }
    });
}
