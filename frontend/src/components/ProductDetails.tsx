interface ProductDetailsProps {
  condition: string;
  category: string;
  postedDate: string;
}

export function ProductDetails({ condition, category, postedDate }: ProductDetailsProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#1C3D51' }}>
        Details
      </h3>
      <div className="flex-col gap-sm">
        <div className="detail-row">
          <span className="text-muted">Condition</span>
          <span style={{ color: '#1C3D51', fontWeight: '500' }}>{condition}</span>
        </div>
        <div className="detail-row">
          <span className="text-muted">Category</span>
          <span style={{ color: '#1C3D51', fontWeight: '500' }}>{category}</span>
        </div>
        <div className="detail-row">
          <span className="text-muted">Posted</span>
          <span style={{ color: '#1C3D51', fontWeight: '500' }}>{postedDate}</span>
        </div>
      </div>
    </div>
  );
}
