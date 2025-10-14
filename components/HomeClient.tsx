'use client';

import { useRef } from 'react';
import CourseCarousel from '@/components/CourseCarousel';

// Definindo a interface aqui para ser usada pelo componente
interface Course {
    id: string;
    title: string;
    description: string;
    coverURL: string;
}

interface HomeClientProps {
    popularCourses: Course[];
    newCourses: Course[];
}

export default function HomeClient({ popularCourses, newCourses }: HomeClientProps) {
    const firstCarouselRef = useRef<HTMLDivElement>(null);

    const handleScrollToContent = () => {
        firstCarouselRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="container-fluid">
            {/* Seção para o banner principal */}
            <div className="p-5 mb-4 bg-secondary rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Bem-vindo à sua Comunidade</h1>
                    <p className="col-md-8 fs-4">O lugar para aprender e interagir.</p>
                    <button className="btn btn-primary btn-lg" type="button" onClick={handleScrollToContent}>
                        Navegar pelos cursos
                    </button>
                </div>
            </div>

            {/* Seções de Carrossel */}
            <div ref={firstCarouselRef}>
                <CourseCarousel title="Cursos Populares" courses={popularCourses} />
            </div>
            <CourseCarousel title="Adicionados Recentemente" courses={newCourses} />
        </main>
    );
}
