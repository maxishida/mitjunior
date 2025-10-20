'use client';

import { useState, useRef, useEffect } from 'react';
import InternalNavigation from '@/components/layout/InternalNavigation';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Calendar,
  Users,
  Hash,
  Image,
  Send,
  MoreHorizontal,
  Award,
  Target,
  Lightbulb,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Star,
  Filter,
  Search
} from 'lucide-react';

// Mock data types
interface User {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  rank: string;
  isFollowing?: boolean;
}

interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  tags?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  category: 'discussion' | 'achievement' | 'tip' | 'question' | 'milestone';
  mentions?: User[];
}

interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

// Mock data
const mockCurrentUser: User = {
  id: 'current_user',
  name: 'João Aluno',
  avatar: '/avatars/joao.jpg',
  level: 12,
  rank: 'Bronze III'
};

const mockUsers: User[] = [
  { id: '1', name: 'Mitsuo Ishida', avatar: '/instructors/mitsuo.jpg', level: 50, rank: 'Mestre Financeiro' },
  { id: '2', name: 'Ana Silva', avatar: '/avatars/ana.jpg', level: 25, rank: 'Prata I' },
  { id: '3', name: 'Carlos Souza', avatar: '/avatars/carlos.jpg', level: 18, rank: 'Bronze I' },
  { id: '4', name: 'Mariana Costa', avatar: '/avatars/mariana.jpg', level: 32, rank: 'Ouro II' },
  { id: '5', name: 'Pedro Santos', avatar: '/avatars/pedro.jpg', level: 15, rank: 'Bronze II' }
];

const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[1], // Ana Silva
    content: 'Acabei de completar o curso de Investimentos do Zero ao Milhão! 🎉 A jornada foi incrível e já comecei a aplicar os ensinamentos na prática. Obrigado Mitsuo pela didática fantástica! 🙏\n\nMinha primeira carteira já está montada e diversificada. Alguma dica para quem está começando agora? 🤔',
    images: ['/posts/portfolio-1.jpg', '/posts/certificate-1.jpg'],
    tags: ['investimentos', 'conquista', 'carteira'],
    likes: 147,
    comments: 23,
    shares: 12,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-10-19T14:30:00Z',
    category: 'achievement'
  },
  {
    id: '2',
    author: mockUsers[0], // Mitsuo Ishida
    content: 'Dica rápida do dia: Nunca invista dinheiro que você não pode perder. Parece óbvio, mas é o erro mais comum que vejo iniciantes cometendo.\n\n💡 Crie sua reserva de emergência primeiro (3-6 meses de despesas)\n💡 Depois comece a investir com consistência\n\nFinanças pessoais são uma maratona, não uma corrida! 🏃‍♂️',
    tags: ['dica', 'iniciantes', 'planejamento'],
    likes: 523,
    comments: 67,
    shares: 89,
    isLiked: true,
    isBookmarked: true,
    createdAt: '2024-10-19T10:15:00Z',
    category: 'tip'
  },
  {
    id: '3',
    author: mockUsers[2], // Carlos Souza
    content: 'Pessoal, tô na dúvida sobre FIIs. Vale a pena investir agora com as taxas de juros tão altas? Ou seria melhor focar em Tesouro Direto? 👇\n\nJá pesquisei bastante mas tô inseguro sobre a distribuição de rendimentos e a liquidez.',
    tags: ['dúvida', 'fiis', 'tesouro-direto'],
    likes: 34,
    comments: 45,
    shares: 2,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-10-18T19:45:00Z',
    category: 'question'
  },
  {
    id: '4',
    author: mockUsers[3], // Mariana Costa
    content: 'Alguém mais notou a oportunidade nas Small Caps esse ano? 📈\n\nMinha estratégia tem sido:\n1️⃣ Análise fundamentalista rigorosa\n2️⃣ Diversificação entre setores\n3️⃣ Paciência de longo prazo\n\nResultados: +35% no semestre!\n\nCompartilhem suas estratégias também! 🤝',
    tags: ['small-caps', 'estratégia', 'resultados'],
    likes: 89,
    comments: 34,
    shares: 15,
    isLiked: true,
    isBookmarked: false,
    createdAt: '2024-10-18T16:20:00Z',
    category: 'discussion'
  }
];

const mockComments: Comment[] = [
  {
    id: 'c1',
    author: mockUsers[4], // Pedro Santos
    content: 'Parabéns Ana! Eu também fiz esse curso e mudou minha visão sobre investimentos. Recomendo muito!',
    likes: 12,
    isLiked: false,
    createdAt: '2024-10-19T15:00:00Z'
  },
  {
    id: 'c2',
    author: mockUsers[0], // Mitsuo Ishida
    content: 'Fico muito feliz com seu progresso, Ana! Continue dedicada e os resultados virão. 🚀',
    likes: 45,
    isLiked: true,
    createdAt: '2024-10-19T15:15:00Z'
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: TrendingUp },
  { id: 'discussion', name: 'Discussões', icon: MessageCircle },
  { id: 'achievement', name: 'Conquistas', icon: Award },
  { id: 'tip', name: 'Dicas', icon: Lightbulb },
  { id: 'question', name: 'Dúvidas', icon: HelpCircle },
  { id: 'milestone', name: 'Metas', icon: Target }
];

const trendingTags = [
  { tag: 'investimentos', count: 1234 },
  { tag: 'fiis', count: 892 },
  { tag: 'criptomoedas', count: 756 },
  { tag: 'imposto-de-renda', count: 623 },
  { tag: 'renda-variável', count: 512 },
  { tag: 'tesouro-direto', count: 489 }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentContent, setCommentContent] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`;
    return `${Math.floor(diffInMinutes / 1440)} d`;
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleNewPost = () => {
    if (newPostContent.trim()) {
      const newPost: Post = {
        id: `post_${Date.now()}`,
        author: mockCurrentUser,
        content: newPostContent,
        tags: [],
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date().toISOString(),
        category: 'discussion'
      };

      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setShowNewPostModal(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <InternalNavigation />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h1 className="text-2xl font-bold text-white mb-2">Comunidade Mitsuo</h1>
              <p className="text-neutral-300">Conecte-se, aprenda e compartilhe com outros estudantes de finanças</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-400">2,847</div>
                  <div className="text-sm text-neutral-400">Membros</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">456</div>
                  <div className="text-sm text-neutral-400">Online</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">1,234</div>
                  <div className="text-sm text-neutral-400">Posts hoje</div>
                </div>
              </div>
            </div>

            {/* New Post Button */}
            <button
              onClick={() => setShowNewPostModal(true)}
              className="w-full p-4 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{mockCurrentUser.name.charAt(0)}</span>
                </div>
                <span className="text-neutral-400">Compartilhe algo com a comunidade...</span>
              </div>
            </button>

            {/* Category Filters */}
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Categorias</h3>
                <button className="text-brand-400 hover:text-brand-300 text-sm">Ver todas</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                      ${selectedCategory === category.id
                        ? 'bg-brand-500 text-white'
                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                      }
                    `}
                  >
                    <category.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLikePost(post.id)}
                  onBookmark={() => handleBookmarkPost(post.id)}
                  onComment={() => setSelectedPost(post)}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-6">
              <button className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
                Carregar mais posts
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar posts..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
              <h3 className="font-semibold text-white mb-3">Tópicos em Alta</h3>
              <div className="space-y-2">
                {trendingTags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-neutral-700 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-brand-400" />
                      <span className="text-sm text-neutral-300">{tag}</span>
                    </div>
                    <span className="text-xs text-neutral-500">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
              <h3 className="font-semibold text-white mb-3">Contribuidores Ativos</h3>
              <div className="space-y-3">
                {mockUsers.slice(0, 3).map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{user.name}</p>
                        <p className="text-xs text-neutral-400">{user.rank}</p>
                      </div>
                    </div>
                    <button className="text-xs text-brand-400 hover:text-brand-300">
                      Seguir
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Rules */}
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
              <h3 className="font-semibold text-white mb-3">Regras da Comunidade</h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li>• Seja respeitoso com todos</li>
                <li>• Compartilhe conteúdo relevante</li>
                <li>• Ajude outros membros</li>
                <li>• Não compartilhe informações privadas</li>
                <li>• Siga as diretrizes do grupo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-neutral-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Criar Novo Post</h2>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Content Input */}
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="O que você gostaria de compartilhar?"
                className="w-full p-4 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                rows={6}
              />

              {/* Image Upload */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                >
                  <Image className="w-4 h-4" alt="Upload de imagem" />
                  <span>Adicionar Imagem</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>

              {/* Category Selection */}
              <div>
                <p className="text-sm text-neutral-400 mb-2">Categoria:</p>
                <div className="grid grid-cols-3 gap-2">
                  {categories.filter(c => c.id !== 'all').map(category => (
                    <button
                      key={category.id}
                      className="flex items-center space-x-2 p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors text-sm"
                    >
                      <category.icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleNewPost}
                  disabled={!newPostContent.trim()}
                  className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Post Card Component
function PostCard({ post, onLike, onBookmark, onComment }: {
  post: Post;
  onLike: () => void;
  onBookmark: () => void;
  onComment: () => void;
}) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return Award;
      case 'tip': return Lightbulb;
      case 'question': return HelpCircle;
      case 'milestone': return Target;
      default: return MessageCircle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'achievement': return 'text-yellow-400';
      case 'tip': return 'text-green-400';
      case 'question': return 'text-blue-400';
      case 'milestone': return 'text-purple-400';
      default: return 'text-neutral-400';
    }
  };

  const CategoryIcon = getCategoryIcon(post.category);

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">{post.author.name.charAt(0)}</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">{post.author.name}</h3>
              <span className={`text-xs ${getCategoryColor(post.category)}`}>
                <CategoryIcon className="w-3 h-3 inline" />
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-neutral-400">
              <span>{post.author.rank}</span>
              <span>•</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <button className="p-1 hover:bg-neutral-700 rounded transition-colors">
          <MoreHorizontal className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-neutral-200 leading-relaxed whitespace-pre-line">{post.content}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map(tag => (
              <button
                key={tag}
                className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm rounded-full transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={`
          grid gap-2 mb-4
          ${post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-2 md:grid-cols-3'
          }
        `}>
          {post.images.map((image, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={onLike}
            className={`flex items-center space-x-2 transition-colors ${
              post.isLiked ? 'text-red-400' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likes}</span>
          </button>

          <button
            onClick={onComment}
            className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments}</span>
          </button>

          <button className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">{post.shares}</span>
          </button>
        </div>

        <button
          onClick={onBookmark}
          className={`p-2 transition-colors ${
            post.isBookmarked ? 'text-brand-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}

function formatRelativeTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) return `${diffInMinutes} min`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`;
  return `${Math.floor(diffInMinutes / 1440)} d`;
}