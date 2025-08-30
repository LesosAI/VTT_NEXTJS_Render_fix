"use client";

import { useState } from 'react';
import { 
  UsersIcon, 
  CreditCardIcon, 
  MapIcon, 
  UserCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  stats: {
    total_users: number;
    subscribed_users: number;
    total_campaigns: number;
    total_maps: number;
    total_characters: number;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  created_at: string;
  subscription: {
    plan_name: string;
    status: string;
    current_period_end: string;
  };
}

interface Map {
  id: number;
  image_url: string;
  description: string;
  style: string;
  tone: string;
  created_at: string;
  user: {
    username: string;
    email: string;
  };
}

interface Character {
  id: number;
  image_url: string;
  description: string;
  style: string;
  tags: string[];
  created_at: string;
  user: {
    username: string;
    email: string;
  };
}

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const [selectedView, setSelectedView] = useState<'stats' | 'users' | 'maps' | 'characters'>('stats');
  const [users, setUsers] = useState<User[]>([]);
  const [maps, setMaps] = useState<Map[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (type: 'users' | 'maps' | 'characters', page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const endpoint = type === 'users' ? 'subscribed-users' : type;
      // TODO: Move this to environment variable NEXT_PUBLIC_API_BASE_URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiBaseUrl}/admin/dashboard/${endpoint}?page=${page}&per_page=${type === 'users' ? 10 : 12}&search=${encodeURIComponent(search)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (type === 'users') {
          setUsers(data.users);
        } else if (type === 'maps') {
          setMaps(data.maps);
        } else if (type === 'characters') {
          setCharacters(data.characters);
        }
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (type: 'users' | 'maps' | 'characters') => {
    console.log(`🖱️ Card clicked: ${type}`);
    setSelectedView(type);
    setSearchQuery('');
    setCurrentPage(1);
    await fetchData(type, 1, '');
  };

  const handleSearch = async () => {
    await fetchData(selectedView as 'users' | 'maps' | 'characters', 1, searchQuery);
  };

  const handlePageChange = async (page: number) => {
    await fetchData(selectedView as 'users' | 'maps' | 'characters', page, searchQuery);
  };

  const renderUsersList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Subscribed Users</h3>
        <button
          onClick={() => setSelectedView('stats')}
          className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
          Close
        </button>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#2a2f3e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="bg-[#2a2f3e] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">
                    {user.first_name} {user.last_name}
                  </h4>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.is_verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {user.is_verified ? 'Verified' : 'Unverified'}
                  </span>
                  {user.subscription && (
                    <div className="mt-2">
                      <p className="text-sm text-blue-400">{user.subscription.plan_name}</p>
                      <p className="text-xs text-gray-500">{user.subscription.status}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.has_prev}
            className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.has_next}
            className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors disabled:opacity-50"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const renderMapsGrid = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">All Maps</h3>
        <button
          onClick={() => setSelectedView('stats')}
          className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
          Close
        </button>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search maps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#2a2f3e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {maps.map((map) => (
            <div key={map.id} className="bg-[#2a2f3e] rounded-lg overflow-hidden">
              <img
                src={map.image_url}
                alt={map.description}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-medium text-white mb-2">{map.description}</h4>
                <p className="text-sm text-gray-400 mb-2">Style: {map.style}</p>
                <p className="text-sm text-gray-400 mb-2">Tone: {map.tone}</p>
                <p className="text-xs text-gray-500 mb-2">
                  Created by: {map.user?.username || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(map.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.has_prev}
            className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.has_next}
            className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors disabled:opacity-50"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const renderCharactersGrid = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">All Characters</h3>
        <button
          onClick={() => setSelectedView('stats')}
          className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
          Close
        </button>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#2a2f3e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div key={character.id} className="bg-[#2a2f3e] rounded-lg overflow-hidden">
              <img
                src={character.image_url}
                alt={character.description}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-medium text-white mb-2">{character.description}</h4>
                <p className="text-sm text-gray-400 mb-2">Style: {character.style}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {character.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Created by: {character.user?.username || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(character.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.has_prev}
            className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.has_next}
            className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] rounded-lg hover:bg-[#3a3f4e] transition-colors disabled:opacity-50"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  if (selectedView === 'users') {
    return renderUsersList();
  }

  if (selectedView === 'maps') {
    return renderMapsGrid();
  }

  if (selectedView === 'characters') {
    return renderCharactersGrid();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {/* Total Users Card */}
      <div 
        onClick={() => handleCardClick('users')}
        className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6 cursor-pointer hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white mb-2">{stats.total_users}</div>
            <div className="text-[#a0a0a0] text-sm font-medium">Total Users</div>
          </div>
          <UsersIcon className="w-8 h-8 text-blue-400" />
        </div>
        <div className="text-xs text-blue-300 mt-2">Click to view subscribed users</div>
      </div>

      {/* Subscribed Users Card */}
      <div 
        onClick={() => handleCardClick('users')}
        className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6 cursor-pointer hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white mb-2">{stats.subscribed_users}</div>
            <div className="text-[#a0a0a0] text-sm font-medium">Subscribed Users</div>
          </div>
          <CreditCardIcon className="w-8 h-8 text-green-400" />
        </div>
        <div className="text-xs text-green-300 mt-2">Click to view details</div>
      </div>

      {/* Total Campaigns Card */}
      <div 
        onClick={() => window.location.href = '/admin?tab=users'}
        className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6 cursor-pointer hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white mb-2">{stats.total_campaigns}</div>
            <div className="text-[#a0a0a0] text-sm font-medium">Total Campaigns</div>
          </div>
          <MapIcon className="w-8 h-8 text-purple-400" />
        </div>
        <div className="text-xs text-purple-300 mt-2">Click to go to user management</div>
      </div>

      {/* Total Maps Card */}
      <div 
        onClick={() => handleCardClick('maps')}
        className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-6 cursor-pointer hover:from-orange-500/30 hover:to-orange-600/30 transition-all duration-300 hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white mb-2">{stats.total_maps}</div>
            <div className="text-[#a0a0a0] text-sm font-medium">Total Maps</div>
          </div>
          <MapIcon className="w-8 h-8 text-orange-400" />
        </div>
        <div className="text-xs text-orange-300 mt-2">Click to view all maps</div>
      </div>

      {/* Total Characters Card */}
      <div 
        onClick={() => handleCardClick('characters')}
        className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 rounded-xl p-6 cursor-pointer hover:from-pink-500/30 hover:to-pink-600/30 transition-all duration-300 hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white mb-2">{stats.total_characters}</div>
            <div className="text-[#a0a0a0] text-sm font-medium">Total Characters</div>
          </div>
          <UserCircleIcon className="w-8 h-8 text-pink-400" />
        </div>
        <div className="text-xs text-pink-300 mt-2">Click to view all characters</div>
      </div>
    </div>
  );
}
