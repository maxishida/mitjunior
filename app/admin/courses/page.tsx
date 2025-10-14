'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { storage, db } from '@/lib/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

interface Course {
    id: string;
    title: string;
    coverURL: string;
}

export default function ManageCoursesPage() {
    // Estado para o formulário de criação
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado para a lista de cursos
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
            setCourses(coursesData);
        });
        return () => unsubscribe();
    }, []);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !cover) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        setIsSubmitting(true);
        try {
            const coverRef = ref(storage, `covers/${Date.now()}_${cover.name}`);
            await uploadBytes(coverRef, cover);
            const coverURL = await getDownloadURL(coverRef);

            await addDoc(collection(db, "courses"), {
                title, description, coverURL, createdAt: new Date(),
            });

            alert(`Curso "${title}" criado com sucesso!`);
            setTitle(''); setDescription(''); setCover(null);
            (document.getElementById('cover') as HTMLInputElement).value = '';
        } catch (error) {
            console.error("Erro ao criar curso: ", error);
            alert("Ocorreu um erro ao criar o curso.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCourse = async (course: Course) => {
        if (window.confirm(`Tem certeza que deseja excluir o curso "${course.title}"?`)) {
            try {
                // Excluir do Firestore
                await deleteDoc(doc(db, "courses", course.id));

                // Excluir capa do Storage
                const coverRef = ref(storage, course.coverURL);
                await deleteObject(coverRef);

                alert("Curso excluído com sucesso.");
            } catch (error) {
                console.error("Erro ao excluir curso: ", error);
                alert("Ocorreu um erro ao excluir o curso.");
            }
        }
    };

    return (
        <div className="bg-dark text-white min-vh-100">
            <header className="p-3 mb-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
                <h1 className="h4">Gerenciar Cursos</h1>
                <Link href="/admin" className="btn btn-secondary">Voltar ao Painel</Link>
            </header>
            <main className="container">
                {/* Formulário de Criação */}
                <div className="card bg-secondary p-4 mb-5">
                    <h2 className="h5 mb-4">Criar Novo Curso</h2>
                    <form onSubmit={handleCreateCourse}>{/* ... (inputs do formulário) ... */}</form>
                </div>

                {/* Lista de Cursos */}
                <div className="card bg-secondary p-4">
                    <h2 className="h5 mb-4">Cursos Existentes</h2>
                    <ul className="list-group">
                        {courses.map(course => (
                            <li key={course.id} className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
                                {course.title}
                                <div>
                                    <Link href={`/admin/courses/edit/${course.id}`} className="btn btn-primary btn-sm me-2">Editar</Link>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCourse(course)}>Excluir</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
