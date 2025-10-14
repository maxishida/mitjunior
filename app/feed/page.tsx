'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase.config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Post {
    id: string;
    text: string;
    authorName: string;
    createdAt: any;
}

export default function FeedPage() {
    const [user] = useAuthState(auth);
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efeito para buscar os posts em tempo real
    useEffect(() => {
        if (!db) return;
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

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim() || !user) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "posts"), {
                text: newPost,
                authorName: user.displayName || user.email,
                authorId: user.uid,
                createdAt: serverTimestamp(),
            });
            setNewPost('');
        } catch (error) {
            console.error("Erro ao criar post: ", error);
            alert("Não foi possível criar o post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-dark text-white min-vh-100">
            <header className="p-3 mb-4 border-bottom border-secondary">
                <h1 className="h4">Feed da Comunidade</h1>
            </header>
            <main className="container">
                {/* Formulário de Novo Post */}
                <div className="card bg-secondary mb-4">
                    <div className="card-body">
                        <form onSubmit={handleCreatePost}>
                            <textarea 
                                className="form-control bg-dark text-white border-secondary" 
                                rows={3} 
                                placeholder={user ? "No que você está pensando?" : "Faça login para postar."}
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                disabled={!user || isSubmitting}
                            ></textarea>
                            <button type="submit" className="btn btn-primary mt-2" disabled={!user || isSubmitting}>
                                {isSubmitting ? 'Postando...' : 'Postar'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lista de Posts */}
                <div className="d-flex flex-column gap-3">
                    {posts.length > 0 ? posts.map(post => (
                        <div key={post.id} className="card bg-secondary">
                            <div className="card-body">
                                <p className="card-text">{post.text}</p>
                                <small className="text-white-50">Postado por {post.authorName}</small>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <p className="text-white-50">Ainda não há posts na comunidade. Que tal ser o primeiro?</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
