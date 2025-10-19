'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal, { ConfirmModal } from '@/components/admin/AdminModal';
import { db } from '@/lib/firebase.config';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, Trash2, Eye, CheckCircle, X, Clock, Calendar, User, Flag } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  updatedAt?: any;
  reports?: number;
  reportReasons?: string[];
}

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [filterStatus, setFilterStatus] = useState<Post['status'] | 'all'>('all');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!db) return;

      try {
        let q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const postsData: Post[] = [];
          querySnapshot.forEach((doc) => {
            postsData.push({ id: doc.id, ...doc.data() } as Post);
          });
          setPosts(postsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleApprovePost = async () => {
    if (!selectedPost) return;

    try {
      await updateDoc(doc(db, "posts", selectedPost.id), {
        status: 'approved',
        moderatedAt: serverTimestamp(),
        moderatedBy: 'admin' // In a real app, this would be the admin user ID
      });

      setShowApproveModal(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const handleRejectPost = async () => {
    if (!selectedPost) return;

    try {
      await updateDoc(doc(db, "posts", selectedPost.id), {
        status: 'rejected',
        rejectionReason,
        moderatedAt: serverTimestamp(),
        moderatedBy: 'admin' // In a real app, this would be the admin user ID
      });

      setShowRejectModal(false);
      setSelectedPost(null);
      setRejectionReason('');
    } catch (error) {
      console.error("Error rejecting post:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    try {
      await deleteDoc(doc(db, "posts", selectedPost.id));
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const openApproveModal = (post: Post) => {
    setSelectedPost(post);
    setShowApproveModal(true);
  };

  const openRejectModal = (post: Post) => {
    setSelectedPost(post);
    setShowRejectModal(true);
  };

  const openDeleteModal = (post: Post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status: Post['status']) => {
    const statusConfig = {
      pending: { label: 'Pendente', color: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
      approved: { label: 'Aprovado', color: 'bg-[#00C896]/10 text-[#00C896]' },
      rejected: { label: 'Rejeitado', color: 'bg-[#EF4444]/10 text-[#EF4444]' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredPosts = filterStatus === 'all'
    ? posts
    : posts.filter(post => post.status === filterStatus);

  const columns = [
    {
      key: 'content' as keyof Post,
      label: 'Conteúdo',
      render: (content: string) => (
        <div className="max-w-md">
          <p className="text-sm text-[#F8FAFC] line-clamp-3">{content}</p>
          {content.length > 150 && (
            <span className="text-xs text-[#64748B]">Ver mais...</span>
          )}
        </div>
      )
    },
    {
      key: 'authorName' as keyof Post,
      label: 'Autor',
      render: (authorName: string, post: Post) => (
        <div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#64748B]" />
            <span className="font-medium text-sm text-[#F8FAFC]">{authorName}</span>
          </div>
          {post.authorEmail && (
            <span className="text-xs text-[#64748B]">{post.authorEmail}</span>
          )}
        </div>
      )
    },
    {
      key: 'status' as keyof Post,
      label: 'Status',
      render: (status: Post['status']) => getStatusBadge(status)
    },
    {
      key: 'reports' as keyof Post,
      label: 'Denúncias',
      render: (reports: number = 0) => (
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-[#EF4444]" />
          <span className="text-sm font-medium text-[#EF4444]">{reports}</span>
        </div>
      )
    },
    {
      key: 'createdAt' as keyof Post,
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
      label: 'Aprovar',
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: openApproveModal,
      variant: 'primary' as const,
      condition: (post: Post) => post.status === 'pending'
    },
    {
      label: 'Rejeitar',
      icon: <X className="w-4 h-4" />,
      onClick: openRejectModal,
      variant: 'secondary' as const,
      condition: (post: Post) => post.status === 'pending'
    },
    {
      label: 'Excluir',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: openDeleteModal,
      variant: 'danger' as const
    }
  ].filter(action => !action.condition || action.condition(selectedPost as Post));

  return (
    <AdminLayout title="Moderação de Posts">
      {/* Status Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#F8FAFC]">Filtrar por status:</span>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-3 py-1 text-sm font-medium rounded-lg transition-colors
                  ${filterStatus === status
                    ? 'bg-[#00C896] text-[#0F1419]'
                    : 'bg-[#242931] text-[#CBD5E1] hover:bg-[#2D333B]'
                  }
                `}
              >
                {status === 'all' ? 'Todos' :
                 status === 'pending' ? 'Pendentes' :
                 status === 'approved' ? 'Aprovados' : 'Rejeitados'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
            <span className="text-sm text-[#64748B]">
              {posts.filter(p => p.status === 'pending').length} pendentes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
            <span className="text-sm text-[#64748B]">
              {posts.filter(p => p.reports && p.reports > 0).length} denunciados
            </span>
          </div>
        </div>
      </div>

      <AdminDataTable
        data={filteredPosts}
        columns={columns}
        title="Posts para Moderação"
        searchPlaceholder="Pesquisar posts..."
        searchableFields={['content', 'authorName', 'authorEmail']}
        actions={actions}
        loading={loading}
        emptyMessage="Nenhum post encontrado."
      />

      {/* Approve Modal */}
      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprovePost}
        title="Aprovar Post"
        message="Tem certeza que deseja aprovar este post? Ele ficará visível para todos os usuários."
        confirmLabel="Aprovar"
        variant="primary"
      />

      {/* Reject Modal */}
      <AdminModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Rejeitar Post"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#64748B] mb-4">
              Informe o motivo da rejeição do post:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-[#242931] border border-[#2D333B] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00C896] resize-none"
              placeholder="Descreva o motivo da rejeição..."
            />
          </div>

          {/* Post Preview */}
          {selectedPost && (
            <div className="p-4 bg-[#242931] rounded-lg">
              <p className="text-sm text-[#F8FAFC] mb-2">Post:</p>
              <p className="text-sm text-[#CBD5E1]">{selectedPost.content}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2D333B]">
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 bg-[#242931] border border-[#2D333B] text-[#F8FAFC] rounded-lg hover:bg-[#2D333B] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleRejectPost}
              disabled={!rejectionReason.trim()}
              className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rejeitar Post
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePost}
        title="Excluir Post"
        message="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="danger"
      />
    </AdminLayout>
  );
}
