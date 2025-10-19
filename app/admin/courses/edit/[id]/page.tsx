'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase.config';

// Definindo uma interface explícita para as props da página
interface PageProps {
  params: {
    id: string;
  };
}

export default function EditCoursePage({ params }: PageProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [currentCoverURL, setCurrentCoverURL] = useState('');
    const [newCover, setNewCover] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!db) return;
            const courseRef = doc(db, "courses", params.id);
            const courseSnap = await getDoc(courseRef);
            if (courseSnap.exists()) {
                const courseData = courseSnap.data();
                setTitle(courseData.title);
                setDescription(courseData.description);
                setCurrentCoverURL(courseData.coverURL);
            }
            setLoading(false);
        };
        fetchCourse();
    }, [params.id]);

    const handleUpdateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let coverURL = currentCoverURL;

            // Se uma nova capa foi enviada, faz upload dela e exclui a antiga
            if (newCover) {
                const oldCoverRef = ref(storage, currentCoverURL);
                await deleteObject(oldCoverRef).catch(() => console.log("Antiga capa não encontrada, continuando..."));

                const newCoverRef = ref(storage, `covers/${Date.now()}_${newCover.name}`);
                await uploadBytes(newCoverRef, newCover);
                coverURL = await getDownloadURL(newCoverRef);
            }

            const courseRef = doc(db, "courses", params.id);
            await updateDoc(courseRef, {
                title,
                description,
                coverURL,
            });

            alert("Curso atualizado com sucesso!");
            router.push('/admin/courses');
        } catch (error) {
            console.error("Erro ao atualizar curso: ", error);
            alert("Ocorreu um erro ao atualizar o curso.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <p className="text-white">Carregando...</p>;

    return (
        <div className="bg-dark text-white min-vh-100">
            <header className="p-3 mb-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
                <h1 className="h4">Editar Curso</h1>
                <Link href="/admin/courses" className="btn btn-secondary">Cancelar</Link>
            </header>
            <main className="container">
                <div className="card bg-secondary p-4">
                    <form onSubmit={handleUpdateCourse}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Título do Curso</label>
                            <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Descrição</label>
                            <textarea className="form-control" id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Capa Atual</label>
                            <img src={currentCoverURL} alt="Capa atual" width={150} className="d-block rounded mb-2" />
                            <label htmlFor="cover" className="form-label">Substituir Capa (opcional)</label>
                            <input type="file" className="form-control" id="cover" accept="image/*" onChange={(e) => setNewCover(e.target.files?.[0] || null)} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
