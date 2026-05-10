import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { TrendingUp, Filter } from 'lucide-react';

const ABCAnalysis = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ from_date: '', to_date: '', metric: 'revenue' });
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => { fetchData(); }, [filters.metric, filters.from_date, filters.to_date]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        metric: filters.metric,
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date })
      });
      const res = await api.get(`/reports/abc-analysis?${params}`);
      setItems(res.data?.items || []);
      setSummary(res.data?.summary || null);
    } catch { toast.error('Không tải được phân tích ABC'); }
    finally { setLoading(false); }
  };

  const filtered = classFilter ? items.filter(x => x.abc_class === classFilter) : items;

  const classColor = (c) => c === 'A' ? '#10b981' : c === 'B' ? '#f59e0b' : '#ef4444';

  return (
    <Layout title="Phân tích ABC">
      <div className="page-header">
        <div>
          <h1 className="page-title">Phân tích ABC</h1>
          <p className="page-subtitle">Phân loại sản phẩm theo Pareto 70/20/10 từ doanh thu xuất</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Filter size={18} />
        <label>Tính theo:</label>
        <select className="form-control" style={{ maxWidth: 180 }} value={filters.metric}
          onChange={(e) => setFilters({ ...filters, metric: e.target.value })}>
          <option value="revenue">Doanh thu</option>
          <option value="quantity">Số lượng xuất</option>
        </select>
        <label>Từ:</label>
        <input type="date" className="form-control" style={{ maxWidth: 160 }} value={filters.from_date}
          onChange={(e) => setFilters({ ...filters, from_date: e.target.value })} />
        <label>đến:</label>
        <input type="date" className="form-control" style={{ maxWidth: 160 }} value={filters.to_date}
          onChange={(e) => setFilters({ ...filters, to_date: e.target.value })} />
      </div>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          {['A', 'B', 'C'].map(k => (
            <div key={k} className="card" style={{ padding: 16, borderLeft: `4px solid ${classColor(k)}`, cursor: 'pointer', opacity: !classFilter || classFilter === k ? 1 : 0.6 }}
              onClick={() => setClassFilter(classFilter === k ? '' : k)}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Nhóm {k} — {k === 'A' ? '70% ' + (filters.metric === 'revenue' ? 'doanh thu' : 'SL') : k === 'B' ? '20%' : '10%'}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: classColor(k) }}>{summary[k]}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>sản phẩm</div>
            </div>
          ))}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Tổng {filters.metric === 'revenue' ? 'doanh thu' : 'số lượng'}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-color)' }}>
              {filters.metric === 'revenue' ? `${Number(summary.grand_total).toLocaleString('vi-VN')} đ` : summary.grand_total}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{summary.total_products} sản phẩm đã xuất</div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nhóm</th><th>SKU</th><th>Sản phẩm</th><th>Danh mục</th>
                <th>Số lần xuất</th><th>Tổng SL</th><th>Doanh thu</th>
                <th>% đóng góp</th><th>% luỹ kế</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={9} className="text-center">Đang tải...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={9} className="text-center">Chưa có dữ liệu xuất kho để phân tích</td></tr>
                : filtered.map(r => (
                  <tr key={r.product_id}>
                    <td>
                      <span className="badge" style={{ background: classColor(r.abc_class), color: 'white', fontSize: 12, fontWeight: 700 }}>
                        {r.abc_class}
                      </span>
                    </td>
                    <td><code>{r.sku}</code></td>
                    <td>{r.name}</td>
                    <td>{r.category_name || '-'}</td>
                    <td>{r.export_count}</td>
                    <td>{r.total_quantity}</td>
                    <td>{Number(r.total_revenue).toLocaleString('vi-VN')} đ</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 60, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden', height: 6 }}>
                          <div style={{ width: `${Math.min(r.percentage, 100)}%`, background: classColor(r.abc_class), height: '100%' }} />
                        </div>
                        {r.percentage.toFixed(2)}%
                      </div>
                    </td>
                    <td>{r.cumulative_percentage.toFixed(2)}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ABCAnalysis;
