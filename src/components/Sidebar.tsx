import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useLogin } from '@/context/LoginContext'
import { Mic, Users, UserPlus, Phone, Settings } from 'lucide-react'

const SIDEBAR_WIDTH = 256; // 64 * 4 = 256px (w-64)

export default function Sidebar() {
  const { username, logout, isSubaccount } = useLogin()
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    // Update the active state styling to match new design
    return pathname === path ? "bg-purple-100 text-purple-600" : "hover:bg-gray-50"
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 flex flex-col shadow-md z-10">
      {/* Logo Section */}
      <div className="p-6 flex items-center border-b">
        <div className="bg-purple-100 p-2 rounded-lg inline-block">
          <Mic className="w-6 h-6 text-purple-600" />
        </div>
        <span className="ml-3 text-xl font-semibold text-gray-900">Wavii</span>
      </div>

      {/* Navigation Links */}
      <div className="p-4">
        <nav className="space-y-1">
          <Link 
            href="/agents" 
            className={`flex items-center py-2.5 px-3 rounded-lg transition-colors duration-200 ${isActive('/agents')}`}
          >
            <Users className="w-5 h-5 mr-3" />
            <span>All Agents</span>
          </Link>
          {!isSubaccount && (
            <>
              <Link 
                href={`/subaccounts/?username=${username}`} 
                className={`flex items-center py-2.5 px-3 rounded-lg transition-colors duration-200 ${isActive('/subaccounts/create')}`}
              >
                <UserPlus className="w-5 h-5 mr-3" />
                <span>Create Subaccounts</span>
              </Link>
              <Link 
                href="/phone-numbers" 
                className={`flex items-center py-2.5 px-3 rounded-lg transition-colors duration-200 ${isActive('/phone-numbers')}`}
              >
                <Phone className="w-5 h-5 mr-3" />
                <span>Phone Numbers</span>
              </Link>
            </>
          )}
          <div className="flex items-center py-2.5 px-3 rounded-lg opacity-50 cursor-not-allowed">
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
            <span className="ml-auto text-xs text-gray-400">Coming Soon</span>
          </div>
        </nav>
      </div>

      {/* User Info Section */}
      <div className="mt-auto p-4 border-t">
        <div className="flex flex-col p-2 mb-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <div className="flex items-center">
            <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-medium">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="ml-3 font-medium text-gray-900">{username}</span>
          </div>
          {isSubaccount && (
            <span className="mt-1 text-xs text-gray-500 ml-11">Subaccount</span>
          )}
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-all duration-200 font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export { SIDEBAR_WIDTH }; 