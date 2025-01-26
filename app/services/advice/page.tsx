"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import styles from "./advice.module.css";

const inter = Inter({ subsets: ["latin"] });

const BlogPage: React.FC = () => {
  const [authorId, setAuthorId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [SuccessMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setAuthorId("");
    setTitle("");
    setContent("");
    setType("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!authorId || !title || !content || !type) {
      alert("All fields are required!");
      return;
    }
    if (title.length < 5 || content.length < 20) {
      alert("Title must be at least 5 characters and content at least 20 characters.");
      return;
    }

    const blogData = { authorId, title, content, type };

    setLoading(true);
    try {
      const response = await fetch("/api/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Blog submitted successfully!");
        resetForm();
      } else {
        setErrorMessage(result.error || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Failed to submit the blog:", error);
      setErrorMessage("An error occurred while submitting the blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${inter.className} ${styles.container}`}>
      <h1 className={styles.topTitle}>Welcome to the Expert Advice Page</h1>
      {errorMessage && (
        <div className={styles.errorMessage} aria-live="polite">
          {errorMessage}
        </div>
      )}
      {SuccessMessage && (
        <div className={styles.successMessage} aria-live="polite">
          {SuccessMessage}
        </div>
      )}
      <form className={styles.blogForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Problem Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write..."
            required
            disabled={loading}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="content">Message</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Write your problem..."
            required
            disabled={loading}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default BlogPage;

function setSuccessMessage(arg0: null) {
  throw new Error("Function not implemented.");
}
