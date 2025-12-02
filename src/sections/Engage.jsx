// Engage.jsx (Modified Code)

import React, { useState } from 'react';

// 🚨 Define the FormSubmit endpoint here
// REPLACE 'your-owner-email@example.com' with the email you want the notification sent to.
const FORMSUBMIT_URL = "https://formsubmit.co/ajax/gsvibha26@gmail.com";

export default function Engage() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim()) {
      alert("Please enter an email.");
      return;
    }

    try {
      // 1. Create a FormData object for FormSubmit
      const formData = new FormData();
      formData.append("email", email);
      
      // OPTIONAL: Add a custom subject for the email you receive
      formData.append("_subject", "New Subscriber ID!");

      // 2. Send the request directly to the FormSubmit API
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        body: formData, // FormSubmit uses FormData, not JSON
      });

      // FormSubmit's AJAX endpoint returns a JSON response
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        alert("Subscribed Successfully! Thanks!");
        setEmail("");
      } else {
        // FormSubmit returns res.ok=true even on validation issues, but sets success: false.
        alert(data.message || "Subscription failed.");
      }
    } catch (error) {
      alert("Network error: Could not reach subscription service.");
      console.error(error);
    }
  };

  // ... (rest of your return block is the same)
  return (
    <section className="engage card">
      <h2>Engage With Me</h2>
      <p>
        If you love classical music or want to learn singing, you’re in the right place.
        Subscribe, comment, and follow — let’s learn together step by step.
      </p>
      <div className="engage-actions">
        <input
          placeholder="Your email"
          aria-label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn" onClick={handleSubscribe}>Subscribe</button>
      </div>
    </section>
  );
}