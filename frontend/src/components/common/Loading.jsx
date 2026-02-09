import React from 'react';

const Loading = ({ text = 'Đang tải...' }) => {
  return (
    <div className="loading">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>{text}</p>
      </div>
    </div>
  );
};

export default Loading;
