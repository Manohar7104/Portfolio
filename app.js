// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initializeNavigation();
  initializeScrollAnimations();
  initializeContactForm();
  initializeBackToTop();
  initializeStatsCounter();
  initializeLoadingScreen();
  initializeSmoothScrolling();
});

// Navigation functionality
function initializeNavigation() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    });
  }

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu
      if (navToggle && navMenu) {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }

      // Smooth scroll to section
      const targetId = this.getAttribute("href");
      scrollToSection(targetId);
    });
  });

  // Navbar scroll effect
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // Active link highlighting
  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink();
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Smooth scrolling functionality
function initializeSmoothScrolling() {
  // Handle navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      scrollToSection(targetId);
    });
  });

  // Handle footer links
  document.querySelectorAll(".footer-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      scrollToSection(targetId);
    });
  });
}

// Global scroll to section function
function scrollToSection(targetId) {
  // Remove # if present
  const sectionId = targetId.replace("#", "");
  const targetSection = document.getElementById(sectionId);

  if (targetSection) {
    const offsetTop = targetSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

// Scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Trigger counter animation if it's a stat card
        if (entry.target.classList.contains("stat-card")) {
          const statNumber = entry.target.querySelector(".stat-number");
          if (statNumber) {
            animateCounter(statNumber);
          }
        }
      }
    });
  }, observerOptions);

  // Add fade-in class to elements that should animate
  const animatedElements = document.querySelectorAll(`
        .about-content,
        .stat-card,
        .timeline-item,
        .project-card,
        .skill-category,
        .experience-card,
        .achievement-card,
        .contact-content
    `);

  animatedElements.forEach((element) => {
    element.classList.add("fade-in");
    observer.observe(element);
  });

  // Add staggered animation delay to grid items
  document
    .querySelectorAll(".projects-grid .project-card")
    .forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });

  document
    .querySelectorAll(".skills-grid .skill-category")
    .forEach((category, index) => {
      category.style.animationDelay = `${index * 0.1}s`;
    });
}

// Statistics counter animation
function initializeStatsCounter() {
  // This will be triggered by the intersection observer
}

function animateCounter(element) {
  if (!element || element.classList.contains("animated")) return;

  element.classList.add("animated");
  const target = parseFloat(element.getAttribute("data-target"));
  const increment = target / 200;
  let current = 0;

  const timer = setInterval(function () {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    // Format the number based on the target
    if (target === 791) {
      element.textContent = (current / 100).toFixed(2);
    } else if (target >= 15) {
      element.textContent = Math.ceil(current) + "+";
    } else {
      element.textContent = Math.ceil(current);
    }
  }, 10);
}

// Contact form functionality
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

      // Basic validation
      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Simulate form submission
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;

      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.disabled = true;

      setTimeout(function () {
        showNotification(
          "Thank you! Your message has been sent successfully.",
          "success"
        );
        contactForm.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }, 2000);
    });
  }

  // Add input animation effects
  const formControls = document.querySelectorAll(".form-control");
  formControls.forEach((control) => {
    control.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    control.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused");
      }
    });
  });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "exclamation-circle"
                : "info-circle"
            }"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

  // Add styles if not already added
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: 10px;
                padding: 1rem;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                min-width: 300px;
                max-width: 500px;
                animation: slideInFromRight 0.3s ease;
            }
            
            .notification--success {
                border-left: 4px solid var(--color-success);
            }
            
            .notification--error {
                border-left: 4px solid var(--color-error);
            }
            
            .notification--info {
                border-left: 4px solid var(--color-info);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-content i {
                color: var(--color-primary);
                font-size: 1.2rem;
            }
            
            .notification--success .notification-content i {
                color: var(--color-success);
            }
            
            .notification--error .notification-content i {
                color: var(--color-error);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--color-text-secondary);
                cursor: pointer;
                font-size: 1rem;
                padding: 0.25rem;
                border-radius: 4px;
                transition: background-color 0.3s ease;
            }
            
            .notification-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }
            
            @media (max-width: 768px) {
                .notification {
                    right: 1rem;
                    left: 1rem;
                    min-width: auto;
                }
            }
        `;
    document.head.appendChild(styles);
  }

  // Add to DOM
  document.body.appendChild(notification);

  // Close button functionality
  const closeButton = notification.querySelector(".notification-close");
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      removeNotification(notification);
    });
  }

  // Auto remove after 5 seconds
  setTimeout(function () {
    removeNotification(notification);
  }, 5000);
}

function removeNotification(notification) {
  if (notification && notification.parentNode) {
    notification.style.animation = "slideOutToRight 0.3s ease forwards";
    setTimeout(function () {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

// Back to top button
function initializeBackToTop() {
  const backToTopButton = document.getElementById("back-to-top");

  if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    // Handle click event
    backToTopButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// Loading screen
function initializeLoadingScreen() {
  // Create loading screen if it doesn't exist
  if (!document.querySelector(".loading")) {
    const loadingScreen = document.createElement("div");
    loadingScreen.className = "loading";
    loadingScreen.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loadingScreen);
  }

  const loadingScreen = document.querySelector(".loading");

  // Hide loading screen after page load
  window.addEventListener("load", function () {
    setTimeout(function () {
      if (loadingScreen) {
        loadingScreen.classList.add("fade-out");
        setTimeout(function () {
          if (loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
          }
        }, 500);
      }
    }, 1000);
  });
}

// Hero button functionality
document.addEventListener("DOMContentLoaded", function () {
  // Handle "View My Work" button
  const viewWorkBtn = document.querySelector(".hero-btn");
  if (viewWorkBtn) {
    viewWorkBtn.addEventListener("click", function () {
      scrollToSection("projects");
    });
  }

  // Handle "Contact Me" button
  const contactBtn = document.querySelector(".btn--outline.hero-btn");
  if (contactBtn) {
    contactBtn.addEventListener("click", function () {
      scrollToSection("contact");
    });
  }
});

// Skill item hover effects
document.addEventListener("DOMContentLoaded", function () {
  const skillItems = document.querySelectorAll(".skill-item");

  skillItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05) translateY(-5px)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) translateY(0)";
    });
  });
});

// Project card hover effects
document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px)";
      this.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.15)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.1)";
    });
  });
});

// Timeline animation
document.addEventListener("DOMContentLoaded", function () {
  const timelineItems = document.querySelectorAll(".timeline-item");

  const timelineObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeInUp 0.8s ease forwards";
          entry.target.style.opacity = "1";
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  timelineItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.animationDelay = `${index * 0.2}s`;
    timelineObserver.observe(item);
  });
});

// Parallax effect for hero section
document.addEventListener("DOMContentLoaded", function () {
  const heroShapes = document.querySelectorAll(".shape");

  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    heroShapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.5;
      shape.style.transform = `translateY(${rate * speed}px)`;
    });
  });
});

// Add scroll progress indicator
document.addEventListener("DOMContentLoaded", function () {
  // Create progress bar
  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
    position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #7F00FF 0%, #00FFFF 100%); /* Updated gradient for hackathon theme */
        z-index: 10001;
        transition: width 0.3s ease;
    `;
  document.body.appendChild(progressBar);

  // Update progress on scroll
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
  });
});

// Handle reduced motion preference
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Disable animations for users who prefer reduced motion
  const style = document.createElement("style");
  style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
  document.head.appendChild(style);
}

// Error handling for missing elements
window.addEventListener("error", function (e) {
  console.warn("Portfolio Error:", e.error);
});

// Add additional CSS animations
const additionalStyles = `
    @keyframes slideOutToRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideInFromRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .no-scroll {
        overflow: hidden;
    }
    
    .nav-link.active {
        color: var(--color-primary);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;

// Add the additional styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
