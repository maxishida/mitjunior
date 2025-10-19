'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InternalNavigation from '@/components/layout/InternalNavigation';
import VideoPlayer from '@/components/video/VideoPlayer';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Users,
  BookOpen,
  Download,
  Share2,
  FileText,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';
import type { Course, Video, VideoBookmark } from '@/types/course';

// Mock data - substituir com chamadas de API
const mockCourse: Course = {
  id: '1',
  title: 'Investimentos do Zero ao Milhão',
  description: 'Aprenda a construir uma carteira de investimentos sólida e rentável do zero',
  duration: 1200,
  level: 'iniciante',
  instructor: {
    id: '1',
    name: 'Mitsuo Ishida',
    avatar: '/instructors/mitsuo.jpg',
    bio: 'Especialista em finanças pessoais com 15 anos de experiência'
  },
  category: 'investimentos',
  tags: ['investimentos', 'Renda Variável', 'FIIs'],
  rating: 4.9,
  studentsCount: 15420,
  price: 297,
  promotionalPrice: 197,
  isFeatured: true,
  isNew: false,
  progress: 45,
  totalLessons: 45,
  completedLessons: 20,
  certificateAvailable: false,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15'
};

const mockVideos: Video[] = [
  {
    id: 'v1',
    title: 'Introdução ao Mercado de Ações',
    description: 'Entenda os fundamentos do mercado de ações brasileiro',
    duration: 1800,
    thumbnail: '/videos/intro-stock-market.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    courseId: '1',
    lessonNumber: 1,
    order: 1,
    isPreview: true,
    watchTime: 0,
    completed: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'v2',
    title: 'Tipos de Ações e Índices',
    description: 'Conheça os principais tipos de ações e índices do mercado',
    duration: 2400,
    thumbnail: '/videos/stock-types.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    courseId: '1',
    lessonNumber: 2,
    order: 2,
    isPreview: false,
    watchTime: 0,
    completed: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'v3',
    title: 'Como Abrir Conta em Corretora',
    description: 'Passo a passo para abrir sua conta em uma corretora de valores',
    duration: 1500,
    thumbnail: '/videos/brokerage-account.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    courseId: '1',
    lessonNumber: 3,
    order: 3,
    isPreview: false,
    watchTime: 0,
    completed: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

const mockBookmarks: VideoBookmark[] = [
  {
    id: 'b1',
    userId: 'user1',
    videoId: 'v1',
    timestamp: 300, // 5 minutos
    note: 'Ponto importante sobre fundamentos',
    createdAt: '2024-01-15'
  },
  {
    id: 'b2',
    userId: 'user1',
    videoId: 'v1',
    timestamp: 900, // 15 minutos
    note: 'Revisar este treino sobre análise',
    createdAt: '2024-01-15'
  }
];

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const videoId = params.videoId as string;

  const [course, setCourse] = useState<Course | null>(mockCourse);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [bookmarks, setBookmarks] = useState<VideoBookmark[]>(mockBookmarks);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    // Buscar vídeo atual
    const video = mockVideos.find(v => v.id === videoId);
    if (video) {
      setCurrentVideo(video);
    } else {
      // Vídeo não encontrado, redirecionar
      router.push('/app/cursos');
    }

    // Buscar curso
    // setCourse(courseData);

    // Buscar bookmarks do vídeo
    // setBookmarks(bookmarksData);
  }, [courseId, videoId, router]);

  const handleVideoProgress = (progress: { currentTime: number; duration: number; watched: number }) => {
    setVideoProgress(progress.currentTime);
  };

  const handleVideoComplete = () => {
    // Marcar vídeo como completo
    if (currentVideo) {
      setVideos(prev => prev.map(v =>
        v.id === currentVideo.id ? { ...v, completed: true } : v
      ));
    }
  };

  const handleAddBookmark = () => {
    if (currentVideo) {
      const newBookmark: VideoBookmark = {
        id: `b${Date.now()}`,
        userId: 'user1',
        videoId: currentVideo.id,
        timestamp: Math.floor(videoProgress),
        note: userNotes,
        createdAt: new Date().toISOString()
      };
      setBookmarks(prev => [...prev, newBookmark].sort((a, b) => a.timestamp - b.timestamp));
      setUserNotes('');
    }
  };

  const handleNextVideo = () => {
    const currentIndex = videos.findIndex(v => v.id === currentVideo?.id);
    if (currentIndex < videos.length - 1) {
      const nextVideo = videos[currentIndex + 1];
      router.push(`/app/aula/${courseId}/${nextVideo.id}`);
    }
  };

  const handlePreviousVideo = () => {
    const currentIndex = videos.findIndex(v => v.id === currentVideo?.id);
    if (currentIndex > 0) {
      const prevVideo = videos[currentIndex - 1];
      router.push(`/app/aula/${courseId}/${prevVideo.id}`);
    }
  };

  const currentVideoIndex = videos.findIndex(v => v.id === currentVideo?.id);

  if (!course || !currentVideo) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <InternalNavigation />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <VideoPlayer
                video={currentVideo}
                config={{
                  autoplay: false,
                  startTime: 0,
                  quality: 'auto',
                  playbackRate: 1,
                  subtitles: true,
                  pictureInPicture: true
                }}
                onProgress={handleVideoProgress}
                onComplete={handleVideoComplete}
                onBookmark={handleAddBookmark}
              />
            </div>

            {/* Video Info and Actions */}
            <div className="space-y-4">
              {/* Title and Basic Info */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">{currentVideo.title}</h1>
                <p className="text-neutral-300">{currentVideo.description}</p>

                <div className="flex items-center space-x-4 text-sm text-neutral-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(currentVideo.duration / 60)} min</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Aula {currentVideo.lessonNumber} de {videos.length}</span>
                  </span>
                  {currentVideo.completed && (
                    <span className="flex items-center space-x-1 text-green-400">
                      <Check className="w-4 h-4" />
                      <span>Concluído</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors">
                  <Check className="w-4 h-4" />
                  <span>Marcar como Concluído</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>Adicionar Bookmark</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Baixar Materiais</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar</span>
                </button>

                <div className="flex items-center space-x-2 ml-auto">
                  <button className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Between Videos */}
              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
                <button
                  onClick={handlePreviousVideo}
                  disabled={currentVideoIndex === 0}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${currentVideoIndex === 0
                      ? 'bg-neutral-700/30 text-neutral-600 cursor-not-allowed'
                      : 'bg-neutral-700 hover:bg-neutral-600 text-white'
                    }
                  `}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Aula Anterior</span>
                </button>

                <div className="text-sm text-neutral-400">
                  {currentVideoIndex + 1} / {videos.length}
                </div>

                <button
                  onClick={handleNextVideo}
                  disabled={currentVideoIndex === videos.length - 1}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${currentVideoIndex === videos.length - 1
                      ? 'bg-neutral-700/30 text-neutral-600 cursor-not-allowed'
                      : 'bg-neutral-700 hover:bg-neutral-600 text-white'
                    }
                  `}
                >
                  <span>Próxima Aula</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs Section */}
              <div className="bg-neutral-800/50 rounded-lg">
                <div className="flex border-b border-neutral-700">
                  <button
                    onClick={() => { setShowTranscript(false); setShowNotes(false); }}
                    className={`
                      flex items-center space-x-2 px-6 py-3 font-medium transition-colors
                      ${!showTranscript && !showNotes
                        ? 'text-brand-400 border-b-2 border-brand-400'
                        : 'text-neutral-400 hover:text-white'
                      }
                    `}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Descrição</span>
                  </button>
                  <button
                    onClick={() => { setShowTranscript(true); setShowNotes(false); }}
                    className={`
                      flex items-center space-x-2 px-6 py-3 font-medium transition-colors
                      ${showTranscript
                        ? 'text-brand-400 border-b-2 border-brand-400'
                        : 'text-neutral-400 hover:text-white'
                      }
                    `}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Transcrição</span>
                  </button>
                  <button
                    onClick={() => { setShowTranscript(false); setShowNotes(true); }}
                    className={`
                      flex items-center space-x-2 px-6 py-3 font-medium transition-colors
                      ${showNotes
                        ? 'text-brand-400 border-b-2 border-brand-400'
                        : 'text-neutral-400 hover:text-white'
                      }
                    `}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Anotações</span>
                  </button>
                </div>

                <div className="p-6">
                  {!showTranscript && !showNotes && (
                    <div className="prose prose-invert max-w-none">
                      <h3 className="text-lg font-semibold text-white mb-3">Descrição da Aula</h3>
                      <p className="text-neutral-300 leading-relaxed">
                        {currentVideo.description}
                      </p>
                      <div className="mt-4 p-4 bg-neutral-700/50 rounded-lg">
                        <h4 className="font-medium text-white mb-2">O que você vai aprender:</h4>
                        <ul className="space-y-2 text-neutral-300">
                          <li>• Conceitos fundamentais do mercado</li>
                          <li>• Estratégias práticas para iniciantes</li>
                          <li>• Como evitar erros comuns</li>
                          <li>• Próximos passos para sua jornada</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {showTranscript && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Transcrição da Aula</h3>
                      <div className="space-y-3 text-neutral-300">
                        <p className="hover:bg-neutral-700/50 p-3 rounded cursor-pointer transition-colors">
                          <span className="text-brand-400 font-mono text-sm">00:00</span> - Olá! Seja bem-vindo a esta aula sobre...
                        </p>
                        <p className="hover:bg-neutral-700/50 p-3 rounded cursor-pointer transition-colors">
                          <span className="text-brand-400 font-mono text-sm">00:30</span> - Hoje vamos falar sobre os conceitos mais importantes...
                        </p>
                        <p className="hover:bg-neutral-700/50 p-3 rounded cursor-pointer transition-colors">
                          <span className="text-brand-400 font-mono text-sm">01:15</span> - Primeiramente, é essencial entender que...
                        </p>
                      </div>
                    </div>
                  )}

                  {showNotes && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Suas Anotações</h3>

                      {/* Add Note */}
                      <div className="space-y-3">
                        <textarea
                          value={userNotes}
                          onChange={(e) => setUserNotes(e.target.value)}
                          placeholder="Adicione uma anotação sobre esta aula..."
                          className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                          rows={3}
                        />
                        <button
                          onClick={handleAddBookmark}
                          disabled={!userNotes.trim()}
                          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Adicionar Anotação
                        </button>
                      </div>

                      {/* Existing Bookmarks */}
                      <div className="space-y-2">
                        {bookmarks.map((bookmark) => (
                          <div key={bookmark.id} className="p-3 bg-neutral-700/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-brand-400 font-mono">
                                {Math.floor(bookmark.timestamp / 60)}:{(bookmark.timestamp % 60).toString().padStart(2, '0')}
                              </span>
                              <button className="text-neutral-400 hover:text-red-400 transition-colors">
                                Remover
                              </button>
                            </div>
                            <p className="text-sm text-neutral-300">{bookmark.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Course Content */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <div className="bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{course.title}</h3>
                  <p className="text-sm text-neutral-400">{course.instructor.name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-neutral-400">Progresso</span>
                <span className="text-white font-medium">{Math.round(course.progress || 0)}%</span>
              </div>

              <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-brand-500 transition-all duration-300"
                  style={{ width: `${course.progress || 0}%` }}
                />
              </div>

              <Link
                href={`/app/cursos/${course.id}`}
                className="w-full block text-center px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Ver Curso Completo
              </Link>
            </div>

            {/* Video List */}
            <div className="bg-neutral-800 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-4">Conteúdo do Curso</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {videos.map((video, index) => (
                  <Link
                    key={video.id}
                    href={`/app/aula/${courseId}/${video.id}`}
                    className={`
                      p-3 rounded-lg transition-all duration-200
                      ${video.id === currentVideo.id
                        ? 'bg-brand-500/20 border border-brand-500/50'
                        : 'bg-neutral-700/50 hover:bg-neutral-700 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-neutral-600 rounded flex items-center justify-center text-sm text-white">
                        {video.completed ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span>{video.lessonNumber}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {video.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-neutral-400">
                          <span>{Math.floor(video.duration / 60)} min</span>
                          {video.isPreview && (
                            <span className="px-2 py-0.5 bg-brand-500/20 text-brand-400 rounded">Grátis</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Comments */}
            <div className="bg-neutral-800 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-4">Comentários da Comunidade</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full"></div>
                  <input
                    type="text"
                    placeholder="Adicione um comentário..."
                    className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-white">João Silva</span>
                        <span className="text-xs text-neutral-400">há 2 horas</span>
                      </div>
                      <p className="text-sm text-neutral-300">
                        Excelente aula! A explicação sobre mercado de ações foi muito clara.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}