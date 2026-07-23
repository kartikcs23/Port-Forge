import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Bell, CheckCheck, Trash2, Radio, Sparkles, AlertCircle, Award, Activity, Zap, Check, Eye } from 'lucide-react';

export const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [isLiveMode, setIsLiveMode] = useState(false);

  useEffect(() => {
    const sampleNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Portfolio Generated Successfully!',
        message: 'Your public portfolio is live and synced with your primary domain settings.',
        time: '2 MIN AGO',
        badge: 'SUCCESS',
        read: false,
        action: 'View Portfolio'
      },
      {
        id: 2,
        type: 'info',
        title: 'GitHub Sync Complete',
        message: 'Successfully synced 15 new repositories and 47 code commits from GitHub.',
        time: '15 MIN AGO',
        badge: 'SYNC',
        read: false,
        action: 'View Changes'
      },
      {
        id: 3,
        type: 'warning',
        title: 'Profile Headline Recommendation',
        message: 'Add your primary developer target role to boost portfolio ranking.',
        time: '1 HOUR AGO',
        badge: 'ALERT',
        read: true,
        action: 'Edit Profile'
      },
      {
        id: 4,
        type: 'achievement',
        title: 'Milestone Unlocked: 100 Views',
        message: 'Your portfolio has reached 100 unique recruiter and developer views.',
        time: '2 HOURS AGO',
        badge: 'ACHIEVEMENT',
        read: false,
        action: 'View Stats'
      },
      {
        id: 5,
        type: 'system',
        title: 'New Feature: Resume Creator',
        message: 'Check out our new ATS-friendly Resume Creator coming in v2.0.',
        time: '1 DAY AGO',
        badge: 'SYSTEM',
        read: true,
        action: 'Learn More'
      },
      {
        id: 6,
        type: 'social',
        title: 'Recruiter Visit Detected',
        message: 'A visitor from Google Tech Talent team inspected your project repositories.',
        time: '2 DAYS AGO',
        badge: 'VISITOR',
        read: false,
        action: 'View Insights'
      }
    ];

    setNotifications(sampleNotifications);
  }, []);

  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      const liveEvents = [
        { type: 'success', title: 'New Visitor Ping', message: 'Anonymous developer checked your Brutalist theme portfolio.', badge: 'LIVE' },
        { type: 'info', title: 'Repository Star Recalculated', message: 'GitHub star metric updated across 4 pinned projects.', badge: 'METRIC' },
        { type: 'achievement', title: 'Code Streak Maintained', message: '3-day continuous commit activity recorded.', badge: 'STREAK' }
      ];
      const picked = liveEvents[Math.floor(Math.random() * liveEvents.length)];

      const newNotification = {
        id: Date.now(),
        ...picked,
        time: 'JUST NOW',
        read: false,
        action: 'Inspect'
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const filters = [
    { id: 'all', name: 'ALL LOGS', count: notifications.length },
    { id: 'unread', name: 'UNREAD', count: notifications.filter(n => !n.read).length },
    { id: 'success', name: 'SUCCESS', count: notifications.filter(n => n.type === 'success').length },
    { id: 'warning', name: 'ALERTS', count: notifications.filter(n => n.type === 'warning').length },
    { id: 'achievement', name: 'BADGES', count: notifications.filter(n => n.type === 'achievement').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'success': return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-accent" />;
      case 'achievement': return <Award className="w-4 h-4 text-amber-400" />;
      case 'system': return <Sparkles className="w-4 h-4 text-sky-400" />;
      case 'social': return <Eye className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-20">
        
        {/* Top Header */}
        <section className="mb-10 border-b-2 border-border pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/40 text-accent px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-3">
                <Bell className="w-3.5 h-3.5" /> SYSTEM LOG & NOTIFICATION HUB
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                ALERTS & ACTIVITY
              </h1>
              <p className="text-muted-foreground font-sans text-sm md:text-base mt-2 max-w-2xl">
                Real-time tracking of portfolio views, GitHub synchronization, system badges, and profile diagnostics.
              </p>
            </div>

            {/* Live Mode Toggle & Mass Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`px-4 py-2.5 border-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_#141822] ${
                  isLiveMode
                    ? 'border-accent bg-accent/20 text-accent animate-pulse'
                    : 'border-border bg-card text-muted-foreground hover:text-white'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isLiveMode ? 'text-accent' : ''}`} />
                {isLiveMode ? 'LIVE STREAM: ON' : 'LIVE STREAM: OFF'}
              </button>

              <button
                onClick={markAllAsRead}
                disabled={notifications.every(n => n.read)}
                className="bg-card border-2 border-border text-foreground hover:bg-secondary px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-40"
              >
                <CheckCheck className="w-3.5 h-3.5" /> MARK ALL READ
              </button>

              <button
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="bg-card border-2 border-border text-accent hover:bg-accent hover:text-white px-3 py-2.5 text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-40"
                title="Clear All Logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap gap-2 border-b-2 border-border pb-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 ${
                activeFilter === filter.id
                  ? 'border-accent bg-accent text-white shadow-[4px_4px_0px_0px_#141822]'
                  : 'border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-white'
              }`}
            >
              <span>{filter.name}</span>
              <span className={`px-1.5 py-0.5 text-[10px] font-bold ${
                activeFilter === filter.id ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4 mb-12">
          {filteredNotifications.length === 0 ? (
            <div className="bg-card border-2 border-border p-12 text-center shadow-[6px_6px_0px_0px_#141822]">
              <div className="w-12 h-12 bg-background border-2 border-border flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-black uppercase text-white mb-2">NO LOGS FOUND</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                No active events matching the selected filter query.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-card border-2 p-5 transition-all relative cursor-pointer shadow-[5px_5px_0px_0px_#141822] hover:-translate-y-0.5 ${
                  !notification.read
                    ? 'border-accent/80 bg-card'
                    : 'border-border opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2.5 bg-background border-2 border-border shrink-0 mt-0.5">
                      {getBadgeIcon(notification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-border bg-background text-accent">
                          {notification.badge}
                        </span>
                        <h3 className={`text-base font-black uppercase tracking-tight ${!notification.read ? 'text-white' : 'text-foreground'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-accent animate-ping ml-1" />
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground font-sans leading-relaxed mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span>{notification.time}</span>
                        {notification.read && <span className="flex items-center gap-1 text-emerald-400"><Check className="w-3 h-3" /> READ</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                      className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-accent p-1 transition-colors"
                      title="Dismiss Event"
                    >
                      DISMISS ×
                    </button>

                    {notification.action && (
                      <button className="bg-secondary text-white border border-border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors">
                        {notification.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* System Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'TOTAL LOGS', value: notifications.length },
            { label: 'UNREAD', value: notifications.filter(n => !n.read).length },
            { label: 'RECENT (24H)', value: notifications.filter(n => n.time.includes('MIN') || n.time.includes('HOUR')).length },
            { label: 'ACHIEVEMENTS', value: notifications.filter(n => n.type === 'achievement').length }
          ].map((stat) => (
            <div key={stat.label} className="bg-card border-2 border-border p-5 text-center shadow-[4px_4px_0px_0px_#141822]">
              <div className="text-3xl font-black text-accent mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Notification Preferences Settings */}
        <div className="bg-card border-2 border-border p-6 md:p-8 shadow-[8px_8px_0px_0px_#141822]">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-6 border-b-2 border-border pb-3">
            SYSTEM DISPATCH PREFERENCES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { type: 'Portfolio Traffic Alerts', desc: 'Notify when recruiters or visitors view your public portfolio' },
              { type: 'GitHub Sync Diagnostics', desc: 'Log automated sync completions and repository updates' },
              { type: 'Milestones & Badges', desc: 'Receive real-time alerts when activity thresholds are unlocked' },
              { type: 'System & Feature Updates', desc: 'Critical platform announcements and new template releases' }
            ].map((setting) => (
              <div
                key={setting.type}
                className="flex items-center justify-between p-4 bg-background border-2 border-border gap-4"
              >
                <div>
                  <h4 className="font-black uppercase text-xs text-white tracking-wide">{setting.type}</h4>
                  <p className="text-[11px] text-muted-foreground font-sans mt-0.5">{setting.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-10 h-5 bg-muted rounded-none peer border border-border peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
export default Notifications;