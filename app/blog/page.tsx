"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import styles from "./blog.module.css";

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
      <h1>Welcome to the Blog Page</h1>
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
          <label htmlFor="authorId">Author ID</label>
          <input
            type="number"
            id="authorId"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            placeholder="Enter your user ID here"
            required
            disabled={loading}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give a title"
            required
            disabled={loading}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Write your content here..."
            required
            disabled={loading}
          ></textarea>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="type">Content Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            disabled={loading}
          >
            <option value="" disabled>
              -- Select Content Type --
            </option>
            <option value="Review">Review</option>
            <option value="Question">Question</option>
            <option value="Article">Article</option>
            <option value="Tips/Guide">Tips/Guide</option>
          </select>
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
