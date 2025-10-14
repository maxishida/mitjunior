import { db } from '@/lib/firebase.config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Navbar from '@/components/Navbar';

async function getAllCourses() {
  if (!db) return [];
  const coursesCol = collection(db, 'courses');
  const q = query(coursesCol, orderBy('createdAt', 'desc'));
  const courseSnapshot = await getDocs(q);
  const courseList = courseSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return courseList;
}

export default async function CursosPage() {
  const courses = await getAllCourses();

  return (
    <div className="bg-dark text-white min-vh-100">
      <Navbar />
      <main className="container py-5" style={{ marginTop: '80px' }}>
        <h1 className="mb-4">Todos os Cursos</h1>
        <div className="row g-4">
          {courses.map((course: any) => (
            <div key={course.id} className="col-md-4">
              <div className="card bg-secondary text-white">
                {course.coverURL && (
                  <img
                    src={course.coverURL}
                    className="card-img-top"
                    alt={course.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <a href={`/course/${course.id}`} className="btn btn-primary">
                    Ver Curso
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
