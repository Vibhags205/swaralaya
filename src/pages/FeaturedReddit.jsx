import React, { useEffect, useState } from "react";

export default function FeaturedReddit() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const redditURL =
    "https://www.reddit.com/r/icm/comments/7x74th/resources_on_indian_classical_music.json";

  useEffect(() => {
    async function fetchReddit() {
      try {
        const res = await fetch(redditURL);
        const data = await res.json();

        const mainPost = data[0].data.children[0].data;
        const comments = data[1].data.children.map((c) => c.data.body);

        setPost({
          title: mainPost.title,
          content: mainPost.selftext,
          comments: comments.filter((c) => c) // remove empty comments
        });

        setLoading(false);
      } catch (err) {
        console.error("Reddit fetch error:", err);
        setLoading(false);
      }
    }

    fetchReddit();
  }, []);

  if (loading) return <h2 style={{ padding: "2rem" }}>Loading Reddit posts...</h2>;
  if (!post) return <h2 style={{ padding: "2rem" }}>No content found.</h2>;

  return (
    <section className="reddit-wrapper">
      <h1 className="reddit-title">{post.title}</h1>

      <pre className="reddit-content">{post.content}</pre>

      <h2 className="reddit-subtitle">Top Comments</h2>

      {post.comments.slice(0, 5).map((c, i) => (
        <p key={i} className="reddit-comment">{c}</p>
      ))}
    </section>
  );
}
