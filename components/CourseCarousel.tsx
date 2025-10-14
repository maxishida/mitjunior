'use client';

import { useRef } from 'react';
import Link from 'next/link';

interface Course {
    id: string;
    title: string;
    description: string;
    coverURL: string;
}

interface CourseCarouselProps {
    title: string;
    courses: Course[];
}

export default function CourseCarousel({ title, courses }: CourseCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="mb-5">
            <h2 className="h4 mb-3">{title}</h2>
            <div className="position-relative">
                <div className="d-flex flex-row flex-nowrap overflow-auto pb-3 align-items-center" ref={scrollRef} style={{scrollBehavior: 'smooth', scrollbarWidth: 'none', minHeight: '200px'}}>
                    {courses.length > 0 ? courses.map(course => (
                        <div key={course.id} className="course-card-container">
                            <Link href={`/course/${course.id}`} className="text-decoration-none">
                                <div className="card bg-secondary me-3" style={{minWidth: '280px'}}>
                                    <img src={course.coverURL} className="card-img-top" alt={course.title} style={{height: '160px', objectFit: 'cover'}} />
                                    <div className="card-body">
                                        <h5 className="card-title text-white">{course.title}</h5>
                                        <p className="card-text text-white-50 text-truncate">{course.description}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )) : (
                        <div className="px-5">
                            <p className="text-white-50">Nenhum curso nesta categoria ainda.</p>
                        </div>
                    )}
                </div>
                <button className="btn btn-dark position-absolute top-50 start-0 translate-middle-y opacity-75" onClick={() => scroll('left')}>&lt;</button>
                <button className="btn btn-dark position-absolute top-50 end-0 translate-middle-y opacity-75" onClick={() => scroll('right')}>&gt;</button>
            </div>
        </section>
    );
}
