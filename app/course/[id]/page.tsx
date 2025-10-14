'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase.config';

interface Video {
    id: string;
    title: string;
    videoURL: string;
    createdAt: any; // Adicionado para ordenação
}

interface CourseData {
    title: string;
    description: string;
    coverURL: string;
}

// Definindo uma interface explícita para as props da página
interface PageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: PageProps) {
    const [course, setCourse] = useState<CourseData | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!db || !params.id) return;
            setLoading(true);
            try {
                // Buscar dados do curso
                const courseRef = doc(db, "courses", params.id);
                const courseSnap = await getDoc(courseRef);

                if (courseSnap.exists()) {
                    setCourse(courseSnap.data() as CourseData);

                    // Buscar vídeos do curso
                    const videosCol = collection(courseRef, "videos");
                    const q = query(videosCol, orderBy("createdAt", "asc"));
                    const videosSnapshot = await getDocs(q);
                    const videosList = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
                    setVideos(videosList);
                    if (videosList.length > 0) {
                        setSelectedVideo(videosList[0]);
                    }
                } else {
                    console.log("Curso não encontrado!");
                }
            } catch (error) {
                console.error("Erro ao buscar dados do curso:", error);
            }
            setLoading(false);
        };

        fetchCourseData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="bg-dark text-white min-vh-100 placeholder-glow">
                <header className="p-3 mb-4 border-bottom border-secondary">
                    <div className="h4 placeholder col-6"></div>
                </header>
                <main className="container-fluid">
                    <div className="row">
                        <div className="col-lg-9">
                            <div className='bg-black rounded placeholder' style={{aspectRatio: '16/9'}}></div>
                            <div className='h5 mt-3 placeholder col-8'></div>
                        </div>
                        <div className="col-lg-3">
                            <div className="list-group">
                                <div className="list-group-item placeholder col-12" style={{height: '50px'}}></div>
                                <div className="list-group-item placeholder col-12" style={{height: '50px'}}></div>
                                <div className="list-group-item placeholder col-12" style={{height: '50px'}}></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!course) {
        return <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center"><p>Curso não encontrado.</p></div>;
    }

    return (
        <div className="bg-dark text-white min-vh-100">
            <header className="p-3 mb-4 border-bottom border-secondary">
                <h1 className="h4">{course.title}</h1>
            </header>
            <main className="container-fluid">
                <div className="row">
                    {/* Player de Vídeo */}
                    <div className="col-lg-9">
                        {selectedVideo ? (
                            <div className='bg-black rounded' style={{aspectRatio: '16/9'}}>
                                <video key={selectedVideo.id} controls autoPlay className="w-100 h-100">
                                    <source src={selectedVideo.videoURL} type="video/mp4" />
                                    Seu navegador não suporta o player de vídeo.
                                </video>
                            </div>
                        ) : (
                             <div className='bg-black rounded d-flex justify-content-center align-items-center' style={{aspectRatio: '16/9'}}>
                                <p>{videos.length > 0 ? "Selecione um vídeo para assistir." : "Este curso ainda não tem vídeos."}</p>
                            </div>
                        )}
                        <h2 className='h5 mt-3'>{selectedVideo?.title}</h2>
                    </div>

                    {/* Lista de Vídeos */}
                    <div className="col-lg-3">
                        <div className="list-group">
                            {videos.map(video => (
                                <button
                                    key={video.id}
                                    onClick={() => setSelectedVideo(video)}
                                    className={`list-group-item list-group-item-action ${selectedVideo?.id === video.id ? 'active' : 'bg-secondary text-white'}`}
                                >
                                    {video.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
