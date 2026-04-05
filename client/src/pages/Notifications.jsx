import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';

export const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLiveMode, setIsLiveMode] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate sample notifications
  useEffect(() => {
    const sampleNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Portfolio Generated Successfully! 🎉',
        message: 'Your amazing portfolio is now live and ready to impress employers!',
        time: '2 minutes ago',
        icon: '✅',
        color: 'green',
        read: false,
        action: 'View Portfolio'
      },
      {
        id: 2,
        type: 'info',
        title: 'GitHub Sync Complete 🔄',
        message: 'Successfully synced 15 new repositories and 47 commits from your GitHub profile.',
        time: '15 minutes ago',
        icon: '📊',
        color: 'blue',
        read: false,
        action: 'View Changes'
      },
      {
        id: 3,
        type: 'warning',
        title: 'Profile Update Required ⚠️',
        message: 'Please update your LinkedIn profile link to get better portfolio recommendations.',
        time: '1 hour ago',
        icon: '🔧',
        color: 'yellow',
        read: true,
        action: 'Update Profile'
      },
      {
        id: 4,
        type: 'achievement',
        title: 'New Achievement Unlocked! 🏆',
        message: 'Congratulations! You\'ve reached 100 portfolio views. Keep up the great work!',
        time: '2 hours ago',
        icon: '🎯',
        color: 'purple',
        read: false,
        action: 'View Achievement'
      },
      {
        id: 5,
        type: 'system',
        title: 'New Feature Available 🚀',
        message: 'Check out our new AI-powered portfolio themes! Customize your portfolio like never before.',
        time: '1 day ago',
        icon: '✨',
        color: 'pink',
        read: true,
        action: 'Explore Themes'
      },
      {
        id: 6,
        type: 'social',
        title: 'Someone viewed your portfolio! 👀',
        message: 'A potential employer from Google just viewed your portfolio for 5 minutes.',
        time: '2 days ago',
        icon: '👁️',
        color: 'indigo',
        read: false,
        action: 'View Analytics'
      }
    ];

    setNotifications(sampleNotifications);
  }, []);

  // Simulate live notifications
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: ['success', 'info', 'warning', 'achievement'][Math.floor(Math.random() * 4)],
        title: 'Live Update! 🔴',
        message: 'Something exciting just happened in your PortForge account.',
        time: 'Just now',
        icon: '🔴',
        color: 'red',
        read: false,
        action: 'Check It Out'
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const filters = [
    { id: 'all', name: 'All', icon: '📬', count: notifications.length },
    { id: 'unread', name: 'Unread', icon: '🔵', count: notifications.filter(n => !n.read).length },
    { id: 'success', name: 'Success', icon: '✅', count: notifications.filter(n => n.type === 'success').length },
    { id: 'info', name: 'Info', icon: 'ℹ️', count: notifications.filter(n => n.type === 'info').length },
    { id: 'warning', name: 'Alerts', icon: '⚠️', count: notifications.filter(n => n.type === 'warning').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationStyle = (type, read) => {
    const baseStyle = "p-6 shadow-brutal border-4 border-ink transform hover:scale-102 transition-all duration-300 group relative overflow-hidden cursor-pointer";

    if (!read) {
      switch (type) {
        case 'success': return `${baseStyle} bg-green-50 border-green-500`;
        case 'info': return `${baseStyle} bg-blue-50 border-blue-500`;
        case 'warning': return `${baseStyle} bg-yellow-50 border-yellow-500`;
        case 'achievement': return `${baseStyle} bg-purple-50 border-purple-500`;
        case 'system': return `${baseStyle} bg-pink-50 border-pink-500`;
        case 'social': return `${baseStyle} bg-indigo-50 border-indigo-500`;
        default: return `${baseStyle} bg-surface`;
      }
    }

    return `${baseStyle} bg-surface opacity-75`;
  };

  return (
    <div className="min-h-screen bg-background text-ink font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-accent/4 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.01}%`,
            top: `${mousePosition.y * 0.01}%`,
            transition: 'all 0.5s ease-out'
          }}
        />
        <div
          className="absolute w-80 h-80 bg-accent/3 rounded-full blur-2xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.015}%`,
            bottom: `${mousePosition.y * 0.015}%`,
            animationDelay: '2s',
            transition: 'all 0.7s ease-out'
          }}
        />

        {/* Floating Notification Bubbles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-bounce"
            style={{
              left: `${10 + (i * 6)}%`,
              top: `${15 + (i % 5) * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.2}s`
            }}
          >
            {['🔔', '📬', '💬', '🔕', '📢'][i % 5]}
          </div>
        ))}
      </div>

      <Navbar />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-block border-4 border-ink px-8 py-3 mb-12 bg-surface shadow-brutal font-black text-xl uppercase tracking-widest text-accent transform hover:scale-110 transition-transform duration-500 animate-pulse relative">
            🔔 NOTIFICATION CENTER 🔔
            <div className="absolute -inset-1 border-2 border-accent rounded-lg animate-spin-slow opacity-60" />
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-8 leading-[0.85] relative">
            STAY IN THE
            <span className="block text-accent animate-bounce-gentle shadow-text-glow transform hover:scale-105 transition-transform duration-300">
              LOOP!
            </span>
          </h1>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`px-6 py-3 font-black text-lg uppercase tracking-wider border-4 border-ink shadow-brutal transform hover:scale-105 transition-all duration-300 ${
                isLiveMode ? 'bg-red-500 text-white animate-pulse' : 'bg-surface'
              }`}
            >
              {isLiveMode ? '🔴 LIVE MODE ON' : '⚪ LIVE MODE OFF'}
            </button>

            <div className="text-muted font-medium">
              {notifications.filter(n => !n.read).length} unread notifications
            </div>
          </div>

          <p className="text-2xl text-muted leading-relaxed max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300">
            Never miss a beat! Your <span className="text-accent font-black animate-pulse">personalized notification hub</span> keeps you updated on everything happening in your PortForge journey.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-4 border-4 border-ink shadow-brutal font-black text-lg uppercase tracking-wider transform hover:scale-110 transition-all duration-300 flex items-center space-x-2 ${
                activeFilter === filter.id
                  ? 'bg-accent text-ink shadow-brutal-hover'
                  : 'bg-surface hover:bg-accent/10'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.name}</span>
              <span className="bg-ink text-surface px-2 py-1 text-sm rounded">
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-8 animate-bounce">📭</div>
              <h3 className="text-4xl font-black mb-4">No notifications found</h3>
              <p className="text-xl text-muted">Try changing your filter or check back later!</p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={getNotificationStyle(notification.type, notification.read)}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    <div className="text-4xl group-hover:animate-bounce flex-shrink-0">
                      {notification.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-2xl font-black ${!notification.read ? 'text-accent' : 'text-ink'} group-hover:text-accent transition-colors duration-300`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                        )}
                      </div>

                      <p className="text-lg text-muted leading-relaxed mb-4">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted font-medium">
                          {notification.time}
                        </span>

                        {notification.action && (
                          <button className="px-4 py-2 bg-accent text-ink font-black text-sm uppercase tracking-wider shadow-brutal hover:shadow-brutal-hover transition-all duration-200 hover:-translate-y-1 hover:translate-x-1">
                            {notification.action}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notification.id);
                    }}
                    className="text-2xl opacity-50 hover:opacity-100 transform hover:scale-125 transition-all duration-300 ml-4"
                  >
                    ✕
                  </button>
                </div>

                {/* Animated border for unread */}
                {!notification.read && (
                  <div className="absolute inset-0 border-4 border-accent rounded-lg animate-ping opacity-10" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Notification Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total', value: notifications.length, icon: '📊', color: 'blue' },
            { label: 'Unread', value: notifications.filter(n => !n.read).length, icon: '🔵', color: 'red' },
            { label: 'This Week', value: notifications.filter(n => n.time.includes('day') || n.time.includes('hour')).length, icon: '📅', color: 'green' },
            { label: 'Achievements', value: notifications.filter(n => n.type === 'achievement').length, icon: '🏆', color: 'purple' }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-surface p-6 shadow-brutal border-4 border-ink text-center transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-black text-accent mb-1">{stat.value}</div>
              <div className="text-sm font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Settings Section */}
        <div className="mt-20 bg-surface p-10 shadow-brutal border-4 border-ink">
          <h3 className="text-4xl font-black mb-8 text-center text-accent">NOTIFICATION SETTINGS ⚙️</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { type: 'Portfolio Updates', desc: 'Get notified when your portfolio gets views or updates' },
              { type: 'GitHub Sync', desc: 'Alerts when your GitHub data is successfully synced' },
              { type: 'Achievements', desc: 'Celebrate milestones and unlock new features' },
              { type: 'System Updates', desc: 'Important announcements and platform changes' },
              { type: 'Social Activity', desc: 'When someone interacts with your portfolio' },
              { type: 'Marketing', desc: 'Tips, tricks, and special offers' }
            ].map((setting, index) => (
              <div
                key={setting.type}
                className="flex items-center justify-between p-4 border-2 border-ink bg-background transform hover:scale-102 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  <h4 className="font-black text-lg mb-1">{setting.type}</h4>
                  <p className="text-sm text-muted">{setting.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .shadow-text-glow {
          text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
        }
      `}</style>
    </div>
  );
};