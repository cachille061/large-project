export function ProductCardSkeleton() {
  return (
    <div className="profile-product-card" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      <div className="image-container" style={{ backgroundColor: '#E3DED7' }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: '#CBCAC7' }} />
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ height: '20px', backgroundColor: '#E3DED7', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '24px', backgroundColor: '#CBCAC7', borderRadius: '4px', marginBottom: '8px', width: '60%' }} />
        <div style={{ height: '16px', backgroundColor: '#E3DED7', borderRadius: '4px', width: '80%' }} />
      </div>
    </div>
  );
}
