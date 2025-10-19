'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminModal, { ConfirmModal } from '@/components/admin/AdminModal';
import { db } from '@/lib/firebase.config';
import { collection, getDocs, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Users, Shield, Ban, CheckCircle, Clock, Calendar, Mail, MoreVertical } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'pending';
  createdAt: any;
  lastLoginAt?: any;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<User['role']>('user');
  const [selectedStatus, setSelectedStatus] = useState<User['status']>('active');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!db) return;

      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as User));

        // Sort by creation date (newest first)
        usersData.sort((a, b) => {
          const aDate = a.createdAt?.toDate?.() || new Date();
          const bDate = b.createdAt?.toDate?.() || new Date();
          return bDate.getTime() - aDate.getTime();
        });

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        role: selectedRole,
        updatedAt: serverTimestamp()
      });

      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        status: selectedStatus,
        updatedAt: serverTimestamp()
      });

      setShowStatusModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteDoc(doc(db, 'users', selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const openStatusModal = (user: User) => {
    setSelectedUser(user);
    setSelectedStatus(user.status);
    setShowStatusModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const getRoleBadge = (role: User['role']) => {
    const roleConfig = {
      admin: { label: 'Administrador', color: 'bg-[#EF4444]/10 text-[#EF4444]' },
      moderator: { label: 'Moderador', color: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
      user: { label: 'Usuário', color: 'bg-[#00C896]/10 text-[#00C896]' }
    };

    const config = roleConfig[role];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: User['status']) => {
    const statusConfig = {
      active: { label: 'Ativo', color: 'bg-[#00C896]/10 text-[#00C896]' },
      suspended: { label: 'Suspenso', color: 'bg-[#EF4444]/10 text-[#EF4444]' },
      pending: { label: 'Pendente', color: 'bg-[#F59E0B]/10 text-[#F59E0B]' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'name' as keyof User,
      label: 'Nome',
      sortable: true
    },
    {
      key: 'email' as keyof User,
      label: 'Email',
      render: (email: string) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#64748B]" />
          <span className="text-sm">{email}</span>
        </div>
      )
    },
    {
      key: 'role' as keyof User,
      label: 'Função',
      render: (role: User['role']) => getRoleBadge(role)
    },
    {
      key: 'status' as keyof User,
      label: 'Status',
      render: (status: User['status']) => getStatusBadge(status)
    },
    {
      key: 'createdAt' as keyof User,
      label: 'Registrado em',
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
      label: 'Alterar Função',
      icon: <Shield className="w-4 h-4" />,
      onClick: openRoleModal,
      variant: 'secondary' as const
    },
    {
      label: 'Alterar Status',
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: openStatusModal,
      variant: 'primary' as const
    },
    {
      label: 'Excluir',
      icon: <Ban className="w-4 h-4" />,
      onClick: openDeleteModal,
      variant: 'danger' as const
    }
  ];

  return (
    <AdminLayout title="Usuários">
      <AdminDataTable
        data={users}
        columns={columns}
        title="Gerenciar Usuários"
        searchPlaceholder="Pesquisar usuários..."
        searchableFields={['name', 'email']}
        actions={actions}
        loading={loading}
        emptyMessage="Nenhum usuário encontrado."
      />

      {/* Role Update Modal */}
      <AdminModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Alterar Função do Usuário"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#64748B] mb-4">
              Alterar função para: <span className="font-semibold text-[#F8FAFC]">{selectedUser?.name}</span>
            </p>
            <div className="space-y-3">
              {(['user', 'moderator', 'admin'] as const).map(role => (
                <label key={role} className="flex items-center gap-3 p-3 border border-[#2D333B] rounded-lg hover:bg-[#242931] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value as User['role'])}
                    className="text-[#00C896] focus:ring-[#00C896]"
                  />
                  <div>
                    <p className="font-medium text-[#F8FAFC]">
                      {role === 'admin' ? 'Administrador' : role === 'moderator' ? 'Moderador' : 'Usuário'}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {role === 'admin' ? 'Acesso total ao sistema' :
                       role === 'moderator' ? 'Pode moderar conteúdo' :
                       'Acesso básico à plataforma'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2D333B]">
            <button
              onClick={() => setShowRoleModal(false)}
              className="px-4 py-2 bg-[#242931] border border-[#2D333B] text-[#F8FAFC] rounded-lg hover:bg-[#2D333B] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpdateRole}
              className="px-4 py-2 bg-[#00C896] text-[#0F1419] rounded-lg hover:bg-[#00A67C] transition-colors font-semibold"
            >
              Salvar
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Status Update Modal */}
      <AdminModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Alterar Status do Usuário"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#64748B] mb-4">
              Alterar status para: <span className="font-semibold text-[#F8FAFC]">{selectedUser?.name}</span>
            </p>
            <div className="space-y-3">
              {(['active', 'suspended', 'pending'] as const).map(status => (
                <label key={status} className="flex items-center gap-3 p-3 border border-[#2D333B] rounded-lg hover:bg-[#242931] cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={selectedStatus === status}
                    onChange={(e) => setSelectedStatus(e.target.value as User['status'])}
                    className="text-[#00C896] focus:ring-[#00C896]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#F8FAFC]">
                        {status === 'active' ? 'Ativo' : status === 'suspended' ? 'Suspenso' : 'Pendente'}
                      </p>
                      {getStatusBadge(status)}
                    </div>
                    <p className="text-xs text-[#64748B]">
                      {status === 'active' ? 'Usuário pode acessar a plataforma' :
                       status === 'suspended' ? 'Acesso temporariamente bloqueado' :
                       'Aguardando aprovação'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2D333B]">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 bg-[#242931] border border-[#2D333B] text-[#F8FAFC] rounded-lg hover:bg-[#2D333B] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-[#00C896] text-[#0F1419] rounded-lg hover:bg-[#00A67C] transition-colors font-semibold"
            >
              Salvar
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário "${selectedUser?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir Usuário"
        variant="danger"
      />
    </AdminLayout>
  );
}
