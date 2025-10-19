'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal, { ModalForm, ConfirmModal } from '@/components/admin/AdminModal';
import { VideoUpload } from '@/components/admin/AdminFileUpload';
import { storage, db } from '@/lib/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs, addDoc, doc, query, onSnapshot, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { PlayCircle, Edit, Trash2, Eye, Clock, FileVideo, Calendar, MoreVertical } from 'lucide-react';

interface Course {
  id: string;
  title: string;
}

interface Video {
  id: string;
  title: string;
  videoURL: string;
  duration?: number;
  createdAt: any;
  courseId: string;
}

interface VideoFormData {
  title: string;
  courseId: string;
  videoFile: File | null;
}

export default function ManageVideosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    courseId: '',
    videoFile: null
  });
  const [formErrors, setFormErrors] = useState<Partial<VideoFormData>>({});

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!db) return;
      try {
        const courseSnapshot = await getDocs(collection(db, 'courses'));
        setCourses(courseSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title
        })));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch all videos from all courses
  useEffect(() => {
    if (!db || courses.length === 0) return;

    const unsubscribeFunctions: (() => void)[] = [];

    courses.forEach(course => {
      const videosQuery = query(collection(db, `courses/${course.id}/videos`));
      const unsubscribe = onSnapshot(videosQuery, (snapshot) => {
        const courseVideos = snapshot.docs.map(doc => ({
          id: doc.id,
          courseId: course.id,
          ...doc.data()
        } as Video));

        setVideos(prev => {
          // Remove old videos from this course and add new ones
          const filtered = prev.filter(v => v.courseId !== course.id);
          return [...filtered, ...courseVideos].sort((a, b) =>
            (b.createdAt?.toDate?.() || new Date()).getTime() - (a.createdAt?.toDate?.() || new Date()).getTime()
          );
        });
      });

      unsubscribeFunctions.push(unsubscribe);
    });

    setLoading(false);

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [courses]);

  const validateForm = (): boolean => {
    const errors: Partial<VideoFormData> = {};

    if (!formData.title.trim()) {
      errors.title = 'O título é obrigatório';
    }

    if (!formData.courseId) {
      errors.courseId = 'Selecione um curso';
    }

    if (!formData.videoFile) {
      errors.videoFile = 'O vídeo é obrigatório';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !formData.videoFile || !formData.courseId) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Upload video file
      const videoRef = ref(storage, `videos/${Date.now()}_${formData.videoFile.name}`);

      // Simulate progress (in a real implementation, you'd use onStateChanged)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await uploadBytes(videoRef, formData.videoFile);
      clearInterval(progressInterval);
      setUploadProgress(100);

      const videoURL = await getDownloadURL(videoRef);

      // Add video document
      await addDoc(collection(db, `courses/${formData.courseId}/videos`), {
        title: formData.title,
        videoURL,
        createdAt: serverTimestamp(),
        duration: 0 // You might want to get video duration from metadata
      });

      // Reset form and close modal
      setFormData({ title: '', courseId: '', videoFile: null });
      setShowCreateModal(false);
      setFormErrors({});
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!selectedVideo) return;

    try {
      // Delete video document
      await deleteDoc(doc(db, `courses/${selectedVideo.courseId}/videos`, selectedVideo.id));

      // Delete video file from storage
      if (selectedVideo.videoURL) {
        try {
          const videoRef = ref(storage, selectedVideo.videoURL);
          await deleteObject(videoRef);
        } catch (error) {
          console.error("Error deleting video file:", error);
        }
      }

      setShowDeleteModal(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const openDeleteModal = (video: Video) => {
    setSelectedVideo(video);
    setShowDeleteModal(true);
  };

  const formatDuration = (seconds: number = 0): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCourseTitle = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || 'Curso não encontrado';
  };

  const columns = [
    {
      key: 'title' as keyof Video,
      label: 'Título',
      sortable: true
    },
    {
      key: 'courseId' as keyof Video,
      label: 'Curso',
      render: (courseId: string) => (
        <span className="inline-flex items-center px-2 py-1 bg-[#00C896]/10 text-[#00C896] text-xs font-medium rounded-lg">
          {getCourseTitle(courseId)}
        </span>
      )
    },
    {
      key: 'duration' as keyof Video,
      label: 'Duração',
      render: (duration: number) => (
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <Clock className="w-4 h-4" />
          {formatDuration(duration)}
        </div>
      )
    },
    {
      key: 'createdAt' as keyof Video,
      label: 'Adicionado em',
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
      onClick: (video: Video) => window.open(video.videoURL, '_blank'),
      variant: 'secondary' as const
    },
    {
      label: 'Excluir',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: openDeleteModal,
      variant: 'danger' as const
    }
  ];

  return (
    <AdminLayout title="Vídeos">
      <AdminDataTable
        data={videos}
        columns={columns}
        title="Gerenciar Vídeos"
        searchPlaceholder="Pesquisar vídeos..."
        searchableFields={['title']}
        actions={actions}
        loading={loading}
        onAdd={() => {
          setFormData({ title: '', courseId: '', videoFile: null });
          setFormErrors({});
          setShowCreateModal(true);
        }}
        addLabel="Novo Vídeo"
        emptyMessage="Nenhum vídeo encontrado. Adicione seu primeiro vídeo!"
      />

      {/* Create Video Modal */}
      <AdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Adicionar Novo Vídeo"
        size="lg"
      >
        <ModalForm
          title=""
          onSubmit={handleUploadVideo}
          onCancel={() => setShowCreateModal(false)}
          submitLabel="Fazer Upload do Vídeo"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Curso
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                className="w-full px-4 py-2 bg-[#242931] border border-[#2D333B] rounded-lg text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#00C896]"
                disabled={isSubmitting}
              >
                <option value="">Selecione um curso</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {formErrors.courseId && (
                <p className="mt-1 text-sm text-[#EF4444]">{formErrors.courseId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Título do Vídeo
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-[#242931] border border-[#2D333B] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00C896]"
                placeholder="Digite o título do vídeo"
                disabled={isSubmitting}
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-[#EF4444]">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Arquivo de Vídeo
              </label>
              <VideoUpload
                onVideoSelect={(file) => setFormData(prev => ({ ...prev, videoFile: file }))}
                maxSize={500} // 500MB for videos
                disabled={isSubmitting}
                uploading={isSubmitting}
                uploadProgress={uploadProgress}
              />
              {formErrors.videoFile && (
                <p className="mt-1 text-sm text-[#EF4444]">{formErrors.videoFile}</p>
              )}
            </div>
          </div>
        </ModalForm>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteVideo}
        title="Excluir Vídeo"
        message={`Tem certeza que deseja excluir o vídeo "${selectedVideo?.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir Vídeo"
        variant="danger"
      />
    </AdminLayout>
  );
}