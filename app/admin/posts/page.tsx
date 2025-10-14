'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase.config';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

interface Post {
    id: string;
    text: string;
    authorName: string;
}

export default function ManagePostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData: Post[] = [];
            querySnapshot.forEach((doc) => {
                postsData.push({ id: doc.id, ...doc.data() } as Post);
            });
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    const handleDeletePost = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este post?")) {
            try {
                await deleteDoc(doc(db, "posts", id));
                alert("Post excluído com sucesso.");
            } catch (error) {
                console.error("Erro ao excluir post: ", error);
                alert("Não foi possível excluir o post.");
            }
        }
    };

    return (
        <div className="bg-dark text-white min-vh-100">
            <header className="p-3 mb-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
                <h1 className="h4">Moderar Posts</h1>
                <Link href="/admin" className="btn btn-secondary">Voltar ao Painel</Link>
            </header>
            <main className="container">
                <ul className="list-group">
                    {posts.map(post => (
                        <li key={post.id} className="list-group-item bg-secondary text-white d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-1">{post.text}</p>
                                <small>por: {post.authorName}</small>
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeletePost(post.id)}>Excluir</button>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
