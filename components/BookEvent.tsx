"use client";

import {useState} from "react";

const BookEvent = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const hundleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    }

  return (
    <div id="book-event">
        {submitted ? (
            <p className="text-sm">Thank you for sining up!</p>
        ) : (
            <form onSubmit={hundleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                    />

                    <button type="submit" className="button-submit">Submit</button>
                </div>
            </form>
        ) }
    </div>
  )
}

export default BookEvent