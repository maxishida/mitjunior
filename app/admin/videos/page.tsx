'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { storage, db } from '@/lib/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs, addDoc, doc, query, onSnapshot, deleteDoc } from 'firebase/firestore';

interface Course {
    id: string;
    title: string;
}

interface Video {
    id: string;
    title: string;
    videoURL: string;
}

export default function ManageVideosPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [videos, setVideos] = useState<Video[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoTitle, setVideoTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Busca a lista de cursos
    useEffect(() => {
        const fetchCourses = async () => {
            if (!db) return;
            const courseSnapshot = await getDocs(collection(db, 'courses'));
            setCourses(courseSnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title })));
        };
        fetchCourses();
    }, []);

    // Busca os vídeos do curso selecionado em tempo real
    useEffect(() => {
        if (!selectedCourse) {
            setVideos([]);
            return;
        }
        const videosQuery = query(collection(db, `courses/${selectedCourse}/videos`));
        const unsubscribe = onSnapshot(videosQuery, (snapshot) => {
            setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video)));
        });
        return () => unsubscribe();
    }, [selectedCourse]);

    const handleUploadVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse || !videoFile || !videoTitle) return alert('Preencha todos os campos.');
        setIsSubmitting(true);
        try {
            const videoRef = ref(storage, `videos/${Date.now()}_${videoFile.name}`);
            await uploadBytes(videoRef, videoFile);
            const videoURL = await getDownloadURL(videoRef);

            await addDoc(collection(db, `courses/${selectedCourse}/videos`), {
                title: videoTitle, videoURL, createdAt: new Date(),
            });

            alert(`Vídeo "${videoTitle}" adicionado!`);
            setVideoFile(null); setVideoTitle('');
            (document.getElementById('video') as HTMLInputElement).value = '';
        } catch (error) {
            console.error("Erro ao adicionar vídeo: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteVideo = async (video: Video) => {
        if (window.confirm(`Excluir o vídeo "${video.title}"?`)) {
            try {
                await deleteDoc(doc(db, `courses/${selectedCourse}/videos`, video.id));
                const videoRef = ref(storage, video.videoURL);
                await deleteObject(videoRef);
                alert("Vídeo excluído.");
            } catch (error) {
                console.error("Erro ao excluir vídeo: ", error);
            }
        }
    };

    return (
        <div className="bg-dark text-white min-vh-100">
            <header className="p-3 mb-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
                <h1 className="h4">Gerenciar Vídeos</h1>
                <Link href="/admin" className="btn btn-secondary">Voltar ao Painel</Link>
            </header>
            <main className="container">
                <div className="card bg-secondary p-4 mb-4">
                    <h2 className="h5 mb-4">Adicionar Novo Vídeo</h2>
                    <form onSubmit={handleUploadVideo}>{/* ... (form inputs) ... */}</form>
                </div>

                <div className="card bg-secondary p-4">
                    <h2 className="h5 mb-4">Vídeos do Curso</h2>
                    <select className="form-select mb-3" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option value="">-- Escolha um curso para ver os vídeos --</option>
                        {courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
                    </select>
                    {selectedCourse && (
                        <ul className="list-group">
                            {videos.map(video => (
                                <li key={video.id} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
                                    {video.title}
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteVideo(video)}>Excluir</button>
                                </li>
                            ))}
                            {videos.length === 0 && <li className="list-group-item bg-dark text-white">Nenhum vídeo neste curso.</li>}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}
