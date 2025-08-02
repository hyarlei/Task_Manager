import {
    ChartBarIcon,
    CheckCircleIcon,
    FolderIcon,
    HomeIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tarefas', href: '/tasks', icon: CheckCircleIcon },
  { name: 'Categorias', href: '/categories', icon: FolderIcon },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
  { name: 'Perfil', href: '/profile', icon: UserIcon },
];

export default function Sidebar() {
  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">
                Task Manager
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={clsx(
                      'mr-3 h-5 w-5',
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>Task Manager v1.0</p>
            <p className="mt-1">© 2025 Hyarlei Freitas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
