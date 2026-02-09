import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../config/api';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  FileText,
  LogOut,
  Box,
  Truck,
  UserCheck,
  Search,
  X,
  History,
  ClipboardCheck
} from 'lucide-react';

const Layout = ({ children, title }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const [productsRes, suppliersRes, customersRes] = await Promise.all([
          api.get(`/products?search=${searchQuery}&limit=5`),
          api.get(`/suppliers?search=${searchQuery}&limit=5`),
          api.get(`/customers?search=${searchQuery}&limit=5`)
        ]);

        const results = [];

        (productsRes.data || []).forEach(p => {
          results.push({ type: 'product', label: p.name, sub: p.sku, link: '/products', id: p.id });
        });

        (suppliersRes.data || []).forEach(s => {
          results.push({ type: 'supplier', label: s.name, sub: s.code, link: '/suppliers', id: s.id });
        });

        (customersRes.data || []).forEach(c => {
          results.push({ type: 'customer', label: c.name, sub: c.code, link: '/customers', id: c.id });
        });

        setSearchResults(results);
        setShowSearchResults(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (result) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(result.link);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'product': return 'San pham';
      case 'supplier': return 'NCC';
      case 'customer': return 'Khach hang';
      default: return '';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'product': return 'var(--primary-color)';
      case 'supplier': return 'var(--success-color)';
      case 'customer': return 'var(--info-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'San pham' },
    { path: '/categories', icon: FolderTree, label: 'Danh muc' },
    { path: '/stocks', icon: Warehouse, label: 'Ton kho' },
    { path: '/imports', icon: ArrowDownToLine, label: 'Nhap kho' },
    { path: '/exports', icon: ArrowUpFromLine, label: 'Xuat kho' },
    { path: '/inventory-checks', icon: ClipboardCheck, label: 'Kiem ke kho' },
    { path: '/suppliers', icon: Truck, label: 'Nha cung cap' },
    { path: '/customers', icon: UserCheck, label: 'Khach hang' },
    { path: '/reports', icon: FileText, label: 'Bao cao' },
  ];

  const adminMenuItems = [
    { path: '/users', icon: Users, label: 'Nguoi dung' },
    { path: '/audit-logs', icon: History, label: 'Lich su hoat dong' },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>
            <div className="logo-icon">
              <Box size={22} color="white" />
            </div>
            Quản Lý Kho
          </h1>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Menu chính</div>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </div>

          {user?.role === 'ADMIN' && (
            <div className="nav-section">
              <div className="nav-section-title">Quản trị</div>
              {adminMenuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <h2 className="header-title">{title}</h2>
          </div>

          <div className="header-center" ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '400px', margin: '0 24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              padding: '8px 12px',
              border: '1px solid var(--border-color)'
            }}>
              <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Tim kiem san pham, NCC, khach hang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={16} style={{ color: 'var(--text-secondary)' }} />
                </button>
              )}
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                marginTop: '4px',
                zIndex: 1000,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleResultClick(result)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: getTypeColor(result.type),
                      color: 'white'
                    }}>
                      {getTypeLabel(result.type)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{result.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{result.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showSearchResults && searchResults.length === 0 && searchQuery.length >= 2 && !searchLoading && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                marginTop: '4px',
                padding: '16px',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}>
                Khong tim thay ket qua
              </div>
            )}
          </div>

          <div className="header-right">
            <div className="user-menu">
              <div className="user-avatar">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-info">
                <div className="user-name">{user?.full_name}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
