const reviewList = document.getElementById("reviewList");
const reviewForm = document.getElementById("reviewForm");
const demoForm = document.getElementById("demoForm");
const demoMsg = document.getElementById("demoMsg");

async function loadReviews() {
  try {
    const res = await fetch("/api/reviews");
    const reviews = await res.json();

    reviewList.innerHTML = "";

    if (reviews.length === 0) {
      const defaultReviews = [
        {
          company: "CloudOps Team",
          role: "DevOps Lead",
          review: "ZENTRIX gives clear root cause insights and reduces time spent checking logs manually."
        },
        {
          company: "FinTech Backend Team",
          role: "Backend Engineer",
          review: "The AI daemon concept is powerful for teams handling microservices and production issues."
        },
        {
          company: "SaaS Reliability Team",
          role: "SRE Engineer",
          review: "The workflow is simple, useful, and highly relevant for real-time debugging."
        }
      ];

      defaultReviews.forEach(addReviewCard);
      return;
    }

    reviews.forEach(addReviewCard);
  } catch (error) {
    console.log("Error loading reviews", error);
  }
}

function addReviewCard(item) {
  const card = document.createElement("div");
  card.className = "review-card";

  card.innerHTML = `
    <h3>${item.company}</h3>
    <p><strong>${item.role}</strong></p>
    <p>"${item.review}"</p>
  `;

  reviewList.appendChild(card);
}

reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const company = document.getElementById("company").value;
  const role = document.getElementById("role").value;
  const review = document.getElementById("review").value;

  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ company, role, review })
    });

    const data = await res.json();

    if (data.success) {
      reviewForm.reset();
      loadReviews();
      alert("Review added successfully!");
    }
  } catch (error) {
    alert("Something went wrong while adding review");
  }
});

demoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const company = document.getElementById("demoCompany").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  try {
    const res = await fetch("/api/book-demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, company, email, message })
    });

    const data = await res.json();

    if (data.success) {
      demoForm.reset();
      demoMsg.textContent = "Demo request submitted successfully!";
    }
  } catch (error) {
    demoMsg.textContent = "Something went wrong. Please try again.";
  }
});

loadReviews();