document.addEventListener("DOMContentLoaded", function () {
  initDarkMode();       
  initWelcome();       
  initFormValidation(); 
  initSizeGuide();      
  initCardSelector();
});


function initWelcome() {
  
  var target = document.getElementById("welcome-target");
  if (!target) return;

  
  var visitorName = sessionStorage.getItem("ww_visitor_name");

  if (!visitorName) {
    visitorName = prompt("👟 Welcome to Wonder Walks!\n\nMay we ask your name?");

  
    if (!visitorName || visitorName.trim() === "") {
      visitorName = "Shoe Lover";
    } else {
      visitorName = visitorName.trim();
    }
    sessionStorage.setItem("ww_visitor_name", visitorName);
  }

  
  var banner = document.createElement("div");
  banner.id = "welcome-banner";
  banner.setAttribute("role", "status");
  banner.innerHTML =
    "<span class='welcome-wave'>👋</span> " +
    "Welcome back, <strong>" + escapeHTML(visitorName) + "</strong>! " +
    "Step into comfort — your next favourite pair is waiting." +
    "<button class='welcome-dismiss' aria-label='Dismiss welcome message' " +
    "onclick='document.getElementById(\"welcome-banner\").remove()'>✕</button>";

  
  target.parentNode.insertBefore(banner, target);
}


function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


function initFormValidation() {
  var form = document.getElementById("reservation-form");
  if (!form) return;

  
  var fields = form.querySelectorAll("input, select, textarea");
  fields.forEach(function (field) {
    field.addEventListener("input", function () {
      clearError(field);
    });
    field.addEventListener("change", function () {
      clearError(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var isValid = true;

    
    var nameField = document.getElementById("username");
    if (!nameField.value.trim()) {
      showError(nameField, "Please enter your full name.");
      isValid = false;
    }

    
    var emailField = document.getElementById("useremail");
    if (!emailField.value.trim()) {
      showError(emailField, "Please enter your email address.");
      isValid = false;
    } else if (!isValidEmail(emailField.value.trim())) {
      showError(emailField, "Please enter a valid email address (e.g. you@example.com).");
      isValid = false;
    }

    
    var radioButtons = form.querySelectorAll('input[name="line"]');
    var radioChecked = false;
    radioButtons.forEach(function (rb) {
      if (rb.checked) radioChecked = true;
    });
    if (!radioChecked) {
      
      var radioFieldset = document.getElementById("model-fieldset");
      showError(radioFieldset, "Please select a design variant before submitting.");
      isValid = false;
    }

    if (!isValid) {
      
      var firstError = form.querySelector(".field-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    
    showConfirmation(nameField.value.trim());
  });
}


function showError(field, message) {
  
  if (field.nextElementSibling && field.nextElementSibling.classList.contains("field-error")) return;

  field.classList.add("input-error");

  var errorEl = document.createElement("p");
  errorEl.className = "field-error";
  errorEl.setAttribute("role", "alert");
  errorEl.innerHTML = "⚠ " + message;

  field.parentNode.insertBefore(errorEl, field.nextSibling);
}


function clearError(field) {
  field.classList.remove("input-error");
  if (field.nextElementSibling && field.nextElementSibling.classList.contains("field-error")) {
    field.nextElementSibling.remove();
  }
}


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function showConfirmation(name) {
  var form = document.getElementById("reservation-form");
  var container = document.getElementById("form-container");


  var card = document.createElement("div");
  card.id = "confirmation-card";
  card.setAttribute("role", "status");
  card.innerHTML =
    "<div class='confirm-icon'>✅</div>" +
    "<h2>Reservation Received!</h2>" +
    "<p>Thank you, <strong>" + escapeHTML(name) + "</strong>. " +
    "Your stock hold request has been submitted.</p>" +
    "<p>We'll confirm your reservation by email within 24 hours. " +
    "In the meantime, browse the rest of our collection.</p>" +
    "<a href='shop.html' class='btn'>Browse Collection</a>" +
    "<a href='index.html' class='btn btn-outline' style='margin-left:1rem'>Return Home</a>";

  container.replaceChild(card, form);
  card.scrollIntoView({ behavior: "smooth", block: "start" });
}


function initSizeGuide() {
  var btn = document.getElementById("size-guide-btn");
  var panel = document.getElementById("size-guide-panel");
  if (!btn || !panel) return;

  btn.addEventListener("click", function () {
    var isHidden = panel.classList.contains("sg-hidden");

    if (isHidden) {
      panel.classList.remove("sg-hidden");
      btn.textContent = "Hide Size Guide ▲";
    } else {
      panel.classList.add("sg-hidden");
      btn.textContent = "View Size Guide ▼";
    }
  });
}

function initCardSelector() {
  var cards = document.querySelectorAll(".product-card");
  if (cards.length === 0) return;

  // Build the sticky "Your Pick" bar and inject it after the product grid
  var grid = document.querySelector(".product-grid");
  if (!grid) return;

  var pickBar = document.createElement("div");
  pickBar.id = "pick-bar";
  pickBar.innerHTML =
    "<span id='pick-icon'>👟</span> " +
    "<span id='pick-text'>Click a shoe to select your pick</span>" +
    "<a href='order.html' id='pick-cta' class='btn' style='display:none'>Reserve This Pair</a>";
  grid.parentNode.insertBefore(pickBar, grid.nextSibling);

  cards.forEach(function (card) {
    card.style.cursor = "pointer";

    card.addEventListener("click", function () {
      var alreadySelected = card.classList.contains("card-selected");

      
      cards.forEach(function (c) {
        c.classList.remove("card-selected");
        var badge = c.querySelector(".selected-badge");
        if (badge) badge.remove();
      });

      if (!alreadySelected) {
        
        card.classList.add("card-selected");

        var badge = document.createElement("span");
        badge.className = "selected-badge";
        badge.textContent = "Selected ✓";
        card.appendChild(badge);

        
        var nameEl = card.querySelector("strong");
        var shoeName = nameEl ? nameEl.textContent : "This pair";

        document.getElementById("pick-text").innerHTML =
          "Your pick: <strong>" + escapeHTML(shoeName) + "</strong>";
        document.getElementById("pick-cta").style.display = "inline-block";
      } else {
        
        document.getElementById("pick-text").textContent = "Click a shoe to select your pick";
        document.getElementById("pick-cta").style.display = "none";
      }
    });
  });
}


function initDarkMode() {
  
  var footer = document.querySelector("footer");
  if (!footer) return;

  var toggleBtn = document.createElement("button");
  toggleBtn.id = "dark-mode-toggle";
  toggleBtn.setAttribute("aria-label", "Toggle dark/light mode");
  footer.appendChild(toggleBtn);

  
  var savedMode = localStorage.getItem("ww_dark_mode");
  if (savedMode === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀ Light Mode";
  } else {
    toggleBtn.textContent = "🌙 Dark Mode";
  }

  toggleBtn.addEventListener("click", function () {
    var isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("ww_dark_mode", isDark ? "dark" : "light");
    toggleBtn.textContent = isDark ? "☀ Light Mode" : "🌙 Dark Mode";
  });
}
