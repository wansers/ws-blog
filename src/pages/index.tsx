import React, { useEffect, useState } from 'react';
import { history } from "umi";

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>();

  const refresh = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.status !== 200) {
        console.error(await res.text());
      }
      const data = await res.json();
      setPosts(data.data);
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      {!posts && <p>Loading...</p>}
      {posts && <div>
        {posts.map(post => <div key={post.id}>
          <div onClick={() => history.push(`/posts/${post.id}`)}>
            <img src={post.avatarUrl} alt=""/>
            <p>{post.name}</p>
          </div>
        </div>)}
      </div>}
    </div>
  );
}