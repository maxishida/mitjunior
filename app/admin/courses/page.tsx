'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal, { ModalForm, ConfirmModal } from '@/components/admin/AdminModal';
import AdminFileUpload from '@/components/admin/AdminFileUpload';
import { storage, db } from '@/lib/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { BookOpen, Edit, Trash2, Eye, Image as ImageIcon, Calendar, MoreVertical } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  coverURL: string;
  createdAt: any;
  videosCount?: number;
  status?: 'draft' | 'published' | 'archived';
}

interface CourseFormData {
  title: string;
  description: string;
  coverFile: File | null;
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    coverFile: null
  });
  const [formErrors, setFormErrors] = useState<Partial<CourseFormData>>({});

  useEffect(() => {
    const fetchCourses = async () => {
      if (!db) return;

      try {
        const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const coursesData = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const courseData = { id: docSnapshot.id, ...docSnapshot.data() } as Course;

              // Count videos for each course
              try {
                const videosQuery = query(collection(db, `courses/${courseData.id}/videos`));
                const videosSnapshot = await getDocs(videosQuery);
                courseData.videosCount = videosSnapshot.size;
              } catch (error) {
                console.error("Error counting videos:", error);
                courseData.videosCount = 0;
              }

              return courseData;
            })
          );
          setCourses(coursesData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<CourseFormData> = {};

    if (!formData.title.trim()) {
      errors.title = 'O título é obrigatório';
    }

    if (!formData.description.trim()) {
      errors.description = 'A descrição é obrigatória';
    }

    if (!formData.coverFile) {
      errors.coverFile = 'A imagem de capa é obrigatória';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !formData.coverFile) return;

    setIsSubmitting(true);

    try {
      // Upload cover image
      const coverRef = ref(storage, `covers/${Date.now()}_${formData.coverFile.name}`);
      await uploadBytes(coverRef, formData.coverFile);
      const coverURL = await getDownloadURL(coverRef);

      // Create course document
      await addDoc(collection(db, "courses"), {
        title: formData.title,
        description: formData.description,
        coverURL,
        createdAt: serverTimestamp(),
        status: 'draft'
      });

      // Reset form and close modal
      setFormData({ title: '', description: '', coverFile: null });
      setShowCreateModal(false);
      setFormErrors({});
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!selectedCourse) return;

    setIsSubmitting(true);

    try {
      const courseRef = doc(db, "courses", selectedCourse.id);
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        updatedAt: serverTimestamp()
      };

      // Update cover if new file provided
      if (formData.coverFile) {
        const coverRef = ref(storage, `covers/${Date.now()}_${formData.coverFile.name}`);
        await uploadBytes(coverRef, formData.coverFile);
        const coverURL = await getDownloadURL(coverRef);
        updateData.coverURL = coverURL;

        // Delete old cover
        if (selectedCourse.coverURL) {
          try {
            const oldCoverRef = ref(storage, selectedCourse.coverURL);
            await deleteObject(oldCoverRef);
          } catch (error) {
            console.error("Error deleting old cover:", error);
          }
        }
      }

      await updateDoc(courseRef, updateData);

      // Reset form and close modal
      setFormData({ title: '', description: '', coverFile: null });
      setShowEditModal(false);
      setSelectedCourse(null);
      setFormErrors({});
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      // Delete course document
      await deleteDoc(doc(db, "courses", selectedCourse.id));

      // Delete cover image
      if (selectedCourse.coverURL) {
        try {
          const coverRef = ref(storage, selectedCourse.coverURL);
          await deleteObject(coverRef);
        } catch (error) {
          console.error("Error deleting cover:", error);
        }
      }

      setShowDeleteModal(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      coverFile: null
    });
    setShowEditModal(true);
    setFormErrors({});
  };

  const openDeleteModal = (course: Course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const columns = [
    {
      key: 'coverURL' as keyof Course,
      label: 'Capa',
      render: (url: string) => (
        <div className="w-16 h-10 rounded-lg overflow-hidden">
          {url ? (
            <img src={url} alt="Course cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#242931] flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-[#64748B]" />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'title' as keyof Course,
      label: 'Título',
      sortable: true
    },
    {
      key: 'description' as keyof Course,
      label: 'Descrição',
      render: (description: string) => (
        <span className="line-clamp-2 max-w-xs">
          {description}
        </span>
      )
    },
    {
      key: 'videosCount' as keyof Course,
      label: 'Vídeos',
      render: (count: number = 0) => (
        <span className="inline-flex items-center px-2 py-1 bg-[#00C896]/10 text-[#00C896] text-xs font-medium rounded-lg">
          {count} vídeos
        </span>
      )
    },
    {
      key: 'createdAt' as keyof Course,
      label: 'Criado em',
      sortable: true,
      render: (date: any) => (
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <Calendar className="w-4 h-4" />
          {date?.toDate ? date.toDate().toLocaleDateString('pt-BR') : '-'}
        </div>
      )
    }
  ];

  const actions = [
    {
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      onClick: (course: Course) => window.open(`/course/${course.id}`, '_blank'),
      variant: 'secondary' as const
    },
    {
      label: 'Editar',
      icon: <Edit className="w-4 h-4" />,
      onClick: openEditModal,
      variant: 'primary' as const
    },
    {
      label: 'Excluir',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: openDeleteModal,
      variant: 'danger' as const
    }
  ];

  return (
    <AdminLayout title="Cursos">
      <AdminDataTable
        data={courses}
        columns={columns}
        title="Gerenciar Cursos"
        searchPlaceholder="Pesquisar cursos..."
        searchableFields={['title', 'description']}
        actions={actions}
        loading={loading}
        onAdd={() => {
          setFormData({ title: '', description: '', coverFile: null });
          setFormErrors({});
          setShowCreateModal(true);
        }}
        addLabel="Novo Curso"
        emptyMessage="Nenhum curso encontrado. Crie seu primeiro curso!"
      />

      {/* Create Course Modal */}
      <AdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Criar Novo Curso"
        size="lg"
      >
        <ModalForm
          title=""
          onSubmit={handleCreateCourse}
          onCancel={() => setShowCreateModal(false)}
          submitLabel="Criar Curso"
          loading={isSubmitting}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Título do Curso
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-[#242931] border border-[#2D333B] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00C896]"
                placeholder="Digite o título do curso"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-[#EF4444]">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 bg-[#242931] border border-[#2D333B] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00C896] resize-none"
                placeholder="Descreva o conteúdo do curso"
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-[#EF4444]">{formErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Imagem de Capa
              </label>
              <AdminFileUpload
                onFileSelect={(file) => setFormData(prev => ({ ...prev, coverFile: file }))}
                accept="image/*"
                maxSize={5}
                disabled={isSubmitting}
              />
              {formErrors.coverFile && (
                <p className="mt-1 text-sm text-[#EF4444]">{formErrors.coverFile}</p>
              )}
            </div>
          </div>
        </ModalForm>
      </AdminModal>

      {/* Edit Course Modal */}
      <AdminModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Curso"
        size="lg"
      >
        <ModalForm
          title=""
          onSubmit={handleUpdateCourse}
          onCancel={() => setShowEditModal(false)}
          submitLabel="Salvar Alterações"
          loading={isSubmitting}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Título do Curso
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-[#242931] border border-[#2D333B] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00C896]"
                placeholder="Digite o título do curso"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-[#EF4444]">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 bg-[#242931] border border-[#2D333B] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00C896] resize-none"
                placeholder="Descreva o conteúdo do curso"
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-[#EF4444]">{formErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Nova Imagem de Capa (opcional)
              </label>
              <AdminFileUpload
                onFileSelect={(file) => setFormData(prev => ({ ...prev, coverFile: file }))}
                accept="image/*"
                maxSize={5}
                disabled={isSubmitting}
              />
              {selectedCourse?.coverURL && !formData.coverFile && (
                <p className="mt-2 text-sm text-[#64748B]">
                  Mantendo a capa atual. Envie uma nova imagem para substituí-la.
                </p>
              )}
            </div>
          </div>
        </ModalForm>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCourse}
        title="Excluir Curso"
        message={`Tem certeza que deseja excluir o curso "${selectedCourse?.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir Curso"
        variant="danger"
      />
    </AdminLayout>
  );
}
