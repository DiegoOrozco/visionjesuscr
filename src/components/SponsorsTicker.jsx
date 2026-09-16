import React from 'react';

const SPONSORS = [
  { id: 1, name: 'Patrocinador 1', src: '/media/patrocinios/Photoroom_20260915_215501.png' },
  { id: 2, name: 'Patrocinador 2', src: '/media/patrocinios/Photoroom_20260915_215532.png' },
  { id: 3, name: 'Patrocinador 3', src: '/media/patrocinios/Photoroom_20260915_215746.png' },
  { id: 4, name: 'Patrocinador 4', src: '/media/patrocinios/Photoroom_20260915_215812.png' },
  { id: 5, name: 'Patrocinador 5', src: '/media/patrocinios/Photoroom_20260915_220237.png' },
  { id: 6, name: 'Patrocinador 6', src: '/media/patrocinios/Photoroom_20260915_220310.png' },
  { id: 7, name: 'Patrocinador 7', src: '/media/patrocinios/Photoroom_20260915_220439.png' }
];

export default function SponsorsTicker({ title = 'NUESTROS PATROCINADORES' }) {
  // Multiply items for seamless smooth infinite loop
  const multiSponsors = [...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS];

  return (
    <div className="sponsors-ticker-wrapper">
      {title && (
        <div className="sponsors-header">
          <span className="sponsors-badge">{title}</span>
        </div>
      )}
      
      <div className="sponsors-marquee-container">
        <div className="sponsors-marquee-track">
          {multiSponsors.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="sponsor-item">
              <img 
                src={item.src} 
                alt={item.name} 
                className="sponsor-logo" 
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .sponsors-ticker-wrapper {
          width: 100%;
          background: linear-gradient(135deg, #FAF4F0 0%, #F5EAE4 50%, #EFE1D8 100%);
          border-top: 1px solid rgba(157, 60, 114, 0.12);
          border-bottom: 1px solid rgba(157, 60, 114, 0.12);
          padding: 24px 0 28px 0;
          overflow: hidden;
          position: relative;
          z-index: 10;
        }

        .sponsors-header {
          text-align: center;
          margin-bottom: 18px;
        }

        .sponsors-badge {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 2px;
          color: #8C2D63;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(140, 45, 99, 0.2);
          padding: 5px 22px;
          border-radius: 50px;
          box-shadow: 0 2px 8px rgba(140, 45, 99, 0.06);
        }

        .sponsors-marquee-container {
          display: flex;
          width: 100%;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }

        .sponsors-marquee-track {
          display: flex;
          align-items: center;
          gap: 48px;
          white-space: nowrap;
          animation: marquee 28s linear infinite;
          will-change: transform;
        }

        .sponsors-marquee-container:hover .sponsors-marquee-track {
          animation-play-state: paused;
        }

        .sponsor-item {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          height: 70px;
          transition: transform 0.3s ease;
        }

        .sponsor-item:hover {
          transform: scale(1.08);
        }

        .sponsor-logo {
          max-height: 64px;
          max-width: 170px;
          object-fit: contain;
          filter: drop-shadow(0 4px 10px rgba(140, 45, 99, 0.12));
          transition: filter 0.3s ease;
        }

        .sponsor-item:hover .sponsor-logo {
          filter: drop-shadow(0 6px 16px rgba(140, 45, 99, 0.22));
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        @media (max-width: 768px) {
          .sponsors-ticker-wrapper {
            padding: 18px 0 22px 0;
          }
          .sponsor-item {
            height: 54px;
            padding: 4px 8px;
          }
          .sponsor-logo {
            max-height: 48px;
            max-width: 130px;
          }
          .sponsors-marquee-track {
            gap: 28px;
            animation-duration: 20s;
          }
        }
      `}</style>
    </div>
  );
}
