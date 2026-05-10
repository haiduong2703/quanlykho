import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Calendar, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import api from '../../config/api';

const AlertBanner = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/alerts/summary').then(r => setSummary(r.data)).catch(() => {});
  }, []);

  if (!summary) return null;
  const hasAny = summary.low_stock > 0 || summary.over_stock > 0 || summary.expiring_soon_30d > 0 || summary.expired > 0;
  if (!hasAny) return null;

  const cards = [
    { label: 'Dưới tồn tối thiểu', value: summary.low_stock, color: '#f59e0b', icon: TrendingDown, link: '/stocks?low_stock=true' },
    { label: 'Vượt tồn tối đa', value: summary.over_stock, color: '#3b82f6', icon: TrendingUp, link: '/stocks' },
    { label: 'Lô sắp hết hạn (30d)', value: summary.expiring_soon_30d, color: '#f59e0b', icon: Calendar, link: '/batches' },
    { label: 'Lô đã hết hạn', value: summary.expired, color: '#ef4444', icon: AlertTriangle, link: '/batches' }
  ].filter(c => c.value > 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`, gap: 12, marginBottom: 16 }}>
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Link key={c.label} to={c.link} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ padding: 16, borderLeft: `4px solid ${c.color}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: c.color + '22', color: c.color, padding: 10, borderRadius: 8 }}>
                <Icon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: c.color }}>{c.value}</div>
              </div>
              <ChevronRight size={18} color="var(--text-secondary)" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default AlertBanner;
