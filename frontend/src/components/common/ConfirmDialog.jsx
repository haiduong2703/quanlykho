import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'warning', loading = false }) => {
  const icons = {
    warning: AlertTriangle,
    danger: Trash2
  };

  const Icon = icons[type] || AlertTriangle;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="confirm-dialog">
        <div className={`icon ${type}`}>
          <Icon size={32} />
        </div>
        <h3>{title || 'Xác nhận'}</h3>
        <p>{message || 'Bạn có chắc chắn muốn thực hiện hành động này?'}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-warning'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
