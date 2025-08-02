import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  PencilIcon,
  TrashIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  _count: {
    tasks: number;
    categories: number;
  };
}

interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
  const { clearAuth } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: '',
    avatar: '',
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/profile');
      const userData = response.data.user;
      setUser(userData);
      setProfileData({
        name: userData.name,
        avatar: userData.avatar || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Erro ao carregar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setUpdating(true);
      const updateData: UpdateProfileData = {};
      
      if (profileData.name !== user?.name) {
        updateData.name = profileData.name;
      }
      
      if (profileData.avatar !== (user?.avatar || '')) {
        updateData.avatar = profileData.avatar || undefined;
      }

      if (Object.keys(updateData).length === 0) {
        setShowEditProfile(false);
        return;
      }

      const response = await api.put('/users/profile', updateData);
      setUser(response.data.user);
      setSuccess('Perfil atualizado com sucesso!');
      setShowEditProfile(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setChangingPassword(true);
      await api.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess('Senha alterada com sucesso!');
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.error || 'Erro ao alterar senha');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/users/account');
      clearAuth();
      // Redirect will happen automatically due to clearAuth
    } catch (error: any) {
      console.error('Error deleting account:', error);
      setError(error.response?.data?.error || 'Erro ao excluir conta');
    }
  };

  const resetForms = () => {
    setError('');
    setSuccess('');
    setShowEditProfile(false);
    setShowChangePassword(false);
    setShowDeleteAccount(false);
    if (user) {
      setProfileData({
        name: user.name,
        avatar: user.avatar || '',
      });
    }
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
            <p className="text-gray-600">
              Gerencie suas informações pessoais e configurações da conta.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Carregando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
            <p className="text-gray-600">
              Gerencie suas informações pessoais e configurações da conta.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-center py-12">
              <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-500">Erro ao carregar perfil do usuário</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e configurações da conta.
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Information */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Informações Pessoais</h2>
            <button
              onClick={() => setShowEditProfile(true)}
              className="btn btn-secondary"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Editar
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Estatísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-indigo-600">{user._count.tasks}</div>
              <div className="text-sm text-gray-600">
                {user._count.tasks === 1 ? 'Tarefa criada' : 'Tarefas criadas'}
              </div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{user._count.categories}</div>
              <div className="text-sm text-gray-600">
                {user._count.categories === 1 ? 'Categoria criada' : 'Categorias criadas'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações de Segurança</h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowChangePassword(true)}
              className="btn btn-secondary w-full justify-start"
            >
              <KeyIcon className="w-4 h-4 mr-2" />
              Alterar Senha
            </button>
            <button
              onClick={() => setShowDeleteAccount(true)}
              className="btn w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Excluir Conta
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar Perfil</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL do Avatar
                </label>
                <input
                  type="url"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  className="input"
                  placeholder="https://exemplo.com/avatar.jpg"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForms}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-primary flex-1"
                >
                  {updating ? 'Atualizando...' : 'Atualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha Atual *
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha *
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nova Senha *
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForms}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="btn btn-primary flex-1"
                >
                  {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Excluir Conta</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Esta ação é permanente e não pode ser desfeita. Todos os seus dados, 
                incluindo tarefas e categorias, serão excluídos permanentemente.
              </p>
              <p className="text-sm text-red-600 font-medium">
                Tem certeza que deseja continuar?
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={resetForms}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="btn flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Sim, Excluir Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
