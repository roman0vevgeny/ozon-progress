const template = document.createElement("template");
template.innerHTML = `
<div id="progress-bar">
  <svg
    class="svg-container"
    width="200"
    height="200"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
  >
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke-width="10"
      stroke="#eeeeee"
    />
    <circle class="progress-circle"
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke-width="10"
      stroke="#2164f3"
      stroke-dasharray="251.2"
      stroke-dashoffset="251.2"
    />
  </svg>
  <div class="controls">
    <div class="button-container">
      <input
        id="value"
        type="number"
        min="0"
        max="100"
        value="75"
        placeholder="0"
      />
      <label for="value">Value</label>
    </div>
    <div class="button-container">
      <label class="switch">
        <input id="animate" type="checkbox" />
        <span class="slider round"></span>
      </label>
      <label for="animate">Animate</label>
    </div>
    <div class="button-container">
      <label class="switch">
        <input id="hide" type="checkbox" />
        <span class="slider round"></span>
      </label>
      <label for="hide">Hide</label>
    </div>
  </div>
  <style>
    @import url("components/progress/progress-bar.css");
  </style>
  </div>
`;

  customElements.define(
  "progress-bar",
  class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }

      connectedCallback() {
        this.svg = this.shadowRoot.querySelector(".svg-container");
   
        this.progress = this.shadowRoot.querySelector(".progress-circle");
 
        this.circles = this.shadowRoot.querySelectorAll("circle");
        this.circle = this.circles[1];
        this.valueInput = this.shadowRoot.getElementById("value");
        this.animateCheckbox = this.shadowRoot.getElementById("animate");
        this.hideCheckbox = this.shadowRoot.getElementById("hide");

        this.valueInput.value = this.getAttribute("data-value") || "75";
        this.animateCheckbox.checked = this.getAttribute("animated") === "true";
        this.hideCheckbox.checked = this.getAttribute("hide") === "true";
        
        this.addEventListeners();
        this.updateDashOffset(this.valueInput.value);
        this.updateFromAttributes();

        this.svg.classList.toggle("hidden", this.hideCheckbox.checked);
        this.progress.classList.toggle("animated", this.animateCheckbox.checked);
        this.progress.classList.toggle("animated-infinite", this.animateCheckbox.checked);
      }

      addEventListeners() {
        this.valueInput.addEventListener("change", () => {
          const value = this.valueInput.value;
          console.log("Value input: " + this.valueInput.value);
          this.updateDashOffset(value);
        });

        this.valueInput.addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
            const value = this.valueInput.value;
            console.log("Value input: " + this.valueInput.value);
            if (!this.progress.classList.contains("animated")) {
              this.progress.classList.add("animated");
              setTimeout(() => {
                this.progress.classList.remove("animated");
              }, 4000);
            }
            this.updateDashOffset(value);
          }
        });

        this.animateCheckbox.addEventListener("change", () => {
          console.log("Animate checkbox: " + this.animateCheckbox.checked);
          if (this.animateCheckbox.checked) {
            this.startAnimation();
          } else {
            this.stopAnimation();
          }
        });

        this.hideCheckbox.addEventListener("change", () => {
          console.log("Hide checkbox: " + this.hideCheckbox.checked);
          this.toggleVisibility();
        });
      }
    
      updateFromAttributes() {
        this.updateDashOffset(this.valueInput.value);
        this.animate = this.animateCheckbox.checked;
        this.hide = this.hideCheckbox.checked;
      }

      static get observedAttributes() {
        return ["data-value", "animated", "hide"];
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-value" && this.valueInput) {
          this.valueInput.value = newValue || "75";
          this.updateDashOffset(this.valueInput.value);
        } else if (name === "animated" && this.animateCheckbox) {
          this.animateCheckbox.checked = newValue === "true";
          this.progress.classList.toggle("animated", this.animateCheckbox.checked);
          this.progress.classList.toggle("animated-infinite", this.animateCheckbox.checked);
        } else if (name === "hide" && this.hideCheckbox) {
          this.hideCheckbox.checked = newValue === "true";
          this.svg.classList.toggle("hidden", this.hideCheckbox.checked);
        }
      }
    
      updateDashOffset(value) {
        value = Math.max(0, Math.min(100, Number(value)));
        const circumference = 251.2;
        const progressOffset = circumference * (1 - value / 100);
        this.svg.style.setProperty("--dash-offset", progressOffset);
      }

      startAnimation() {
        this.progress.classList.add("animated");
        this.progress.classList.add("animated-infinite");
      }

      stopAnimation() {
        this.progress.classList.remove("animated");
        this.progress.classList.remove("animated-infinite");
    }
    
      toggleVisibility() {
        if (this.hideCheckbox.checked) {
          this.svg.classList.add("hidden");
        } else {
          this.svg.classList.remove("hidden");
        }
      }

      get value() {
        return this.valueInput.value;
      }

      set value(value) {
        this.valueInput.value = value;
        this.updateDashOffset(value);
      }

      get animate() {
        return this.animateCheckbox.checked;
      }

      set animate(animate) {
        this.animateCheckbox.checked = animate;
        if (animate) {
          this.startAnimation();
        } else {
          this.stopAnimation();
        }
      }

      get hide() {
        return this.hideCheckbox.checked;
      }

      set hide(hide) {
        this.hideCheckbox.checked = hide;
        this.toggleVisibility();
      }
    })

