import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Generate sample notifications
  useEffect(() => {
    const sampleNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Portfolio Generated Successfully!',
        message: 'Your amazing portfolio is now live and ready to impress employers!',
        time: '2 MIN AGO',
        icon: '🎉',
        color: 'text-green-400',
        bg: 'bg-green-400/20',
        read: false,
        action: 'View Portfolio'
      },
      {
        id: 2,
        type: 'info',
        title: 'GitHub Sync Complete',
        message: 'Successfully synced 15 new repositories and 47 commits from your GitHub profile.',
        time: '15 MIN AGO',
        icon: '🔄',
        color: 'text-blue-400',
        bg: 'bg-blue-400/20',
        read: false,
        action: 'View Changes'
      },
      {
        id: 3,
        type: 'warning',
        title: 'Profile Update Required',
        message: 'Please update your LinkedIn profile link to get better portfolio recommendations.',
        time: '1 HOUR AGO',
        icon: '⚠️',
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/20',
        read: true,
        action: 'Update Profile'
      },
      {
        id: 4,
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        message: 'Congratulations! You\'ve reached 100 portfolio views. Keep up the great work!',
        time: '2 HOURS AGO',
        icon: '🏆',
        color: 'text-purple-400',
        bg: 'bg-purple-400/20',
        read: false,
        action: 'View Achievement'
      },
      {
        id: 5,
        type: 'system',
        title: 'New Feature Available',
        message: 'Check out our new AI-powered portfolio themes! Customize your portfolio like never before.',
        time: '1 DAY AGO',
        icon: '✨',
        color: 'text-pink-400',
        bg: 'bg-pink-400/20',
        read: true,
        action: 'Explore Themes'
      },
      {
        id: 6,
        type: 'social',
        title: 'Someone viewed your portfolio!',
        message: 'A potential employer from Google just viewed your portfolio for 5 minutes.',
        time: '2 DAYS AGO',
        icon: '👀',
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/20',
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
        title: 'Live Update!',
        message: 'Something exciting just happened in your PortForge account.',
        time: 'JUST NOW',
        icon: '⚡',
        color: 'text-purple-400',
        bg: 'bg-purple-400/20',
        read: false,
        action: 'Check it out'
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const filters = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'success', name: 'Success', count: notifications.filter(n => n.type === 'success').length },
    { id: 'info', name: 'Info', count: notifications.filter(n => n.type === 'info').length },
    { id: 'warning', name: 'Alerts', count: notifications.filter(n => n.type === 'warning').length }
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
    const baseStyle = "p-6 rounded-2xl transition-all duration-300 relative cursor-pointer border";

    if (!read) {
      return `${baseStyle} bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/15 hover:-translate-y-1`;
    }

    return `${baseStyle} bg-white/5 border-white/5 opacity-75 grayscale hover:grayscale-0 hover:opacity-100`;
  };

  return (
    <div className="min-h-screen font-sans overflow-hidden">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 relative">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Hero Section */}
        <div className="text-center mb-16 relative z-10 fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] text-sm font-medium text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-400 glow-pulse"></span>
            Notification Center
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
            <span className="block text-white">Stay in the</span>
            <span className="block text-gradient">loop.</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 border ${
                isLiveMode 
                  ? 'bg-red-500/20 text-red-300 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-red-400 glow-pulse' : 'bg-gray-500'}`}></span>
                {isLiveMode ? 'Live Mode: ON' : 'Live Mode: OFF'}
              </div>
            </button>

            <div className="text-purple-300 font-medium text-sm bg-purple-500/10 px-6 py-3 rounded-full border border-purple-500/20 shadow-inner">
              {notifications.filter(n => !n.read).length} Unread
            </div>
          </div>

          <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
            Never miss a beat! Your <span className="text-white font-medium">personalized notification hub</span> keeps you updated on everything happening in your PortForge journey.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10 fade-in-up stagger-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 border flex items-center gap-3 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-white/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span>{filter.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeFilter === filter.id
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4 relative z-10 fade-in-up stagger-2">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-24 glass-panel">
              <div className="text-6xl mb-6 opacity-50">📭</div>
              <h3 className="text-2xl font-semibold mb-3 text-white tracking-wide">No Notifications Found</h3>
              <p className="text-gray-400 font-light">Try changing your filter or check back later.</p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`${getNotificationStyle(notification.type, notification.read)} fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-start gap-5 flex-1">
                    <div className={`w-12 h-12 rounded-xl ${notification.bg} flex items-center justify-center text-xl shrink-0 ${!notification.read ? 'shadow-inner' : ''}`}>
                      {notification.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className={`text-lg font-semibold tracking-wide ${!notification.read ? notification.color : 'text-gray-300'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className={`text-[10px] font-bold px-2 py-1 rounded-md bg-white/10 border border-white/10 uppercase tracking-widest ${notification.color}`}>
                            New
                          </div>
                        )}
                      </div>

                      <p className="text-base text-gray-400 font-light leading-relaxed mb-4">
                        {notification.message}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="text-xs text-gray-500 font-medium tracking-wider">
                          {notification.time}
                        </span>

                        {notification.action && (
                          <button className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg transition-colors">
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
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 fade-in-up stagger-3">
          {[
            { label: 'Total', value: notifications.length },
            { label: 'Unread', value: notifications.filter(n => !n.read).length },
            { label: 'This Week', value: notifications.filter(n => n.time.includes('DAY') || n.time.includes('HOUR')).length },
            { label: 'Achievements', value: notifications.filter(n => n.type === 'achievement').length }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card text-center"
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-400 tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Settings Section */}
        <div className="mt-20 glass-panel p-10 relative z-10 fade-in-up stagger-4">
          <h3 className="text-3xl font-bold mb-10 text-center text-white tracking-tight">
            Notification Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl gap-4 hover:bg-white/10 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-white tracking-wide mb-1">{setting.type}</h4>
                  <p className="text-sm text-gray-400 font-light">{setting.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-12 h-6 bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};