import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag, Share2, Sparkles, ExternalLink, ArrowRight, MessageCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function NewsArticleDetail({ articleId, onGoHome }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const idToFetch = articleId || window.location.pathname.replace('/noticia/', '');
    if (!idToFetch) {
      setError('Identificador de noticia no válido.');
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/news-articles/${idToFetch}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success && data.article) {
          setArticle(data.article);
        } else {
          setError(data.message || 'La noticia solicitada no existe o no está publicada.');
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError('Error al conectar con el servidor.');
      });
  }, [articleId]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#030812',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles className="animate-spin" size={32} color="#977DFF" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#94A3B8' }}>Cargando noticia...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#030812',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Noticia No Encontrada</h2>
        <p style={{ color: '#94A3B8', marginBottom: '24px' }}>{error || 'La noticia no está disponible.'}</p>
        <button
          onClick={onGoHome || (() => window.location.href = '/')}
          className="apple-btn apple-btn-primary"
          style={{ padding: '12px 24px' }}
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </button>
      </div>
    );
  }

  // Parse paragraphs and gallery
  let paragraphs = [];
  try {
    paragraphs = typeof article.content_paragraphs === 'string' ? JSON.parse(article.content_paragraphs) : (article.content_paragraphs || []);
  } catch (e) {
    paragraphs = [article.content_paragraphs];
  }

  let gallery = [];
  try {
    gallery = typeof article.gallery_images === 'string' ? JSON.parse(article.gallery_images) : (article.gallery_images || []);
  } catch (e) {
    gallery = [];
  }

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${API_URL}${url}`;
    return `${API_URL}/${url}`;
  };

  const heroBg = getImageUrl(article.hero_image) || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600';

  return (
    <div style={{
      backgroundColor: '#030812',
      color: '#FFFFFF',
      minHeight: '100vh',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* HERO BANNER LANDING */}
      <div style={{
        position: 'relative',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(180deg, rgba(3, 8, 18, 0.65) 0%, rgba(3, 8, 18, 0.98) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        padding: '120px 20px 60px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <button
            onClick={onGoHome || (() => window.location.href = '/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              color: '#EAEDF8',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '24px',
              backdropFilter: 'blur(12px)'
            }}
          >
            <ArrowLeft size={15} /> Volver al Inicio
          </button>

          {article.badge && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(151, 125, 255, 0.15)',
              border: '1px solid rgba(151, 125, 255, 0.35)',
              color: '#977DFF',
              padding: '6px 18px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '16px',
              marginLeft: '12px'
            }}>
              <Tag size={14} /> {article.badge}
            </div>
          )}

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            lineHeight: 1.15,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {article.title}
          </h1>

          {article.subtitle && (
            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
              color: '#94A3B8',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto 24px'
            }}>
              {article.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ARTICLE CONTENT BODY */}
      <main style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px 100px' }}>
        <div style={{
          backgroundColor: 'rgba(0, 3, 61, 0.45)',
          border: '1px solid rgba(151, 125, 255, 0.2)',
          borderRadius: '28px',
          padding: '40px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          {paragraphs.map((para, idx) => (
            <p key={idx} style={{
              fontSize: '1.12rem',
              lineHeight: 1.8,
              color: '#EAEDF8',
              marginBottom: '24px',
              fontWeight: 400
            }}>
              {para}
            </p>
          ))}

          {/* GALLERY IMAGES IF ANY */}
          {gallery && gallery.length > 0 && (
            <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', color: '#977DFF' }}>
                Galería de Fotos Relacionadas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {gallery.map((imgUrl, gIdx) => (
                  <img
                    key={gIdx}
                    src={getImageUrl(imgUrl)}
                    alt={`Galería ${gIdx + 1}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CALL TO ACTION BUTTON */}
          {article.cta_url && (
            <div style={{ marginTop: '44px', textAlign: 'center', paddingTop: '28px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <a
                href={article.cta_url}
                target={article.cta_url.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="apple-btn apple-btn-primary"
                style={{
                  display: 'inline-flex',
                  padding: '16px 36px',
                  fontSize: '1.05rem',
                  borderRadius: '50px'
                }}
              >
                <span>{article.cta_label || 'Ver Más Información'}</span>
                <ArrowRight size={18} />
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
