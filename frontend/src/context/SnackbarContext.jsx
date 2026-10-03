import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success', // 'success' | 'error' | 'info'
  });
  const timerRef = useRef(null);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showSnackbar = useCallback((message, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setSnackbar({ isOpen: true, message, type });

    timerRef.current = setTimeout(() => {
      setSnackbar(prev => ({ ...prev, isOpen: false }));
    }, 4000); // 4 seconds duration
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Theme styling based on type
  const getTheme = (type) => {
    switch (type) {
      case 'error':
        return {
          bg: '#0f172a',
          border: '1px solid #ef4444',
          accent: '#ef4444',
          iconBg: 'rgba(239, 68, 68, 0.15)',
          title: 'Error',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )
        };
      case 'info':
        return {
          bg: '#0f172a',
          border: '1px solid #3b82f6',
          accent: '#3b82f6',
          iconBg: 'rgba(59, 130, 246, 0.15)',
          title: 'Notice',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          )
        };
      case 'success':
      default:
        return {
          bg: '#0f172a',
          border: '1px solid #10b981',
          accent: '#10b981',
          iconBg: 'rgba(16, 185, 129, 0.15)',
          title: 'Success',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          )
        };
    }
  };

  const theme = getTheme(snackbar.type);

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      {snackbar.isOpen && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99999,
            backgroundColor: theme.bg,
            border: theme.border,
            color: '#f8fafc',
            padding: '14px 18px',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            maxWidth: '420px',
            minWidth: '320px',
            backdropFilter: 'blur(8px)',
            animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Status Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: theme.iconBg,
              flexShrink: 0
            }}
          >
            {theme.icon}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.accent, fontWeight: '700', marginBottom: '2px' }}>
              {theme.title}
            </div>
            <div style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: '500', lineHeight: '1.4', wordBreak: 'break-word' }}>
              {snackbar.message}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={hideSnackbar}
            aria-label="Dismiss notification"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s, background-color 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Global CSS animation */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </SnackbarContext.Provider>
  );
};
