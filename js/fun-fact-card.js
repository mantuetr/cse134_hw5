class FunFactCard extends HTMLElement{
    static get observedAttributes(){
        return ["compact"];
    }

    constructor(){
        super();

        this.facts = [
            {
                title: "Chinese-Vietnamese",
                fact: "I am actually half Chinese, half Vietnamese",
                detail: "My father's side is Chinese, and my mother's side is Vietnamese"
            },
            {
                title: "Business",
                fact: "My dream major is International Business",
                detail: "When I was young, I want to learn internatinal business to travel around the world"
            },
            {
                title: "Computer Science",
                fact: "I don't like coding",
                detail: "I prefer going talk with people and fix their problems more than coding"
            }
        ]
        this.currentIndex = 0;
    }

    connectedCallback(){
        if (this.initialized)
            return;
        this.initialized = true;

        const heading = document.createElement("h2");
        heading.textContent = "Little Fun Facts";

        this.factTitle = document.createElement("h3");

        this.factText = document.createElement("p");

        this.factDetail = document.createElement("p");
        this.factDetail.classList.add("fact-detail");

        this.status = document.createElement("p");
        this.status.setAttribute("role", "status");

        this.nextButton = document.createElement("button");
        this.nextButton.type = "button";
        this.nextButton.textContent = "Next Fact";

        this.nextButton.addEventListener("click", () => {
            this.currentIndex =
              (this.currentIndex + 1) % this.facts.length;
      
            this.updateFact();
        });

        this.apiButton = document.createElement("button");
        this.apiButton.type = "button";
        this.apiButton.textContent = "Get Random Fact";

        this.apiButton.addEventListener("click", () => {
            this.loadRandomFact();
        })

        this.appendChild(heading);
        this.appendChild(this.factTitle);
        this.appendChild(this.factText);
        this.appendChild(this.factDetail);
        this.appendChild(this.status);
        this.appendChild(this.nextButton);
        this.appendChild(this.apiButton);

        this.updateFact();
    }

    updateFact(){
        const fact = this.facts[this.currentIndex];

        this.factTitle.textContent = fact.title;
        this.factText.textContent = fact.fact;
        this.factDetail.textContent = fact.detail;

        this.status.textContent =
        `Fact ${this.currentIndex + 1} of ${this.facts.length}`;

        this.updateCompactMode();
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name === "compact" && oldValue !== newValue){
            this.updateCompactMode();
        }
    }

    updateCompactMode() {
        if (!this.factDetail) return;
    
        this.factDetail.hidden = this.hasAttribute("compact");
    }

    async loadRandomFact() {
        this.status.textContent = "Loading a new fact...";

        this.apiButton.disabled = true;
        this.nextButton.disabled = true;

        try {
            const response = await fetch(
                "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en",
                { cache: "no-store" }
            );

            // Check HTTP status
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            // Parse the JSON response
            const data = await response.json();

            // Validate the response field
            if (
                typeof data?.text !== "string" ||
                data.text.trim() === ""
            ) {
                throw new Error("Invalid fact data received.");
            }

            // Safely display the remote fact
            this.factTitle.textContent = "Random Fun Fact";
            this.factText.textContent = data.text;
            this.factDetail.textContent =
                "This fact comes from the Useless Facts API.";

            // Success message
            this.status.textContent = "New fact loaded!";

            // Preserve compact mode
            this.updateCompactMode();

        } catch (error) {
            console.error("Could not load fact:", error);

            this.status.textContent =
                "Couldn't load a fact. Please try again.";

        } finally {
            // Restore both buttons after success or failure
            this.apiButton.disabled = false;
            this.nextButton.disabled = false;
        }
    }
}



customElements.define("fun-fact-card", FunFactCard);

const funFactCard = document.querySelector("fun-fact-card");
const toggleDetailsButton = document.querySelector("#toggle-details");

const STORAGE_KEY = "fun-fact-card-mode";

if (funFactCard && toggleDetailsButton) {

    // Apply the preference to the component
    function applyPreference(mode) {
        const isCompact = mode === "compact";

        funFactCard.toggleAttribute("compact", isCompact);

        toggleDetailsButton.textContent =
            isCompact ? "Show Details" : "Hide Details";
    }

    // Default preference
    let savedMode = "expanded";

    // Restore the saved preference
    try {
        const storedMode = localStorage.getItem(STORAGE_KEY);

        if (
            storedMode === "compact" ||
            storedMode === "expanded"
        ) {
            savedMode = storedMode;
        }

    } catch (error) {
        console.warn("Could not read component preference:", error);
    }

    // Apply the restored or default preference
    applyPreference(savedMode);

    // Handle the external button
    toggleDetailsButton.addEventListener("click", () => {

        const newMode = funFactCard.hasAttribute("compact")
            ? "expanded"
            : "compact";

        // Apply immediately, even if storage fails
        applyPreference(newMode);

        // Save the new preference
        try {
            localStorage.setItem(STORAGE_KEY, newMode);

        } catch (error) {
            console.warn("Could not save component preference:", error);
        }
    });

    // Show the control only when JavaScript is working
    toggleDetailsButton.hidden = false;
}

