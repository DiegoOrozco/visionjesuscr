import React, { useState } from 'react';
import { RotateCcw, Check, MousePointerClick, Star, Ticket } from 'lucide-react';

export default function VenueMap({ zones, occupiedSeats = [], onSelectZone, onRefresh, highlightedZone }) {
  const [hoveredZoneId, setHoveredZoneId] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const formatCRC = (val) => `₡${Number(val).toLocaleString('es-CR')}`;

  const getZone = (id, name, price, color) => {
    const found = zones.find(z => z.id === id);
    return found || {
      id,
      name,
      price,
      available_capacity: 100,
      color_code: color
    };
  };

  const vipCentral = getZone('vip_central', 'Gold Central', 12000, '#DB2777');
  const vipIzquierda = getZone('vip_izquierda', 'Gold Izquierda', 12000, '#9333EA');
  const vipDerecha = getZone('vip_derecha', 'Gold Derecha', 12000, '#9333EA');
  
  const generalCentral = getZone('central_atras', 'General Central', 7500, '#10B981');
  const lateralIzquierda = getZone('lateral_izquierda', 'General Izquierda', 7500, '#F59E0B');
  const lateralDerecha = getZone('lateral_derecha', 'General Derecha', 7500, '#F59E0B');

  // Uniform 10 rows for all sections!
  const seatLayouts = {
    vip_izquierda: [
      { rowLabel: "Fila 1", seatsCount: 8 },
      { rowLabel: "Fila 2", seatsCount: 8 },
      { rowLabel: "Fila 3", seatsCount: 8 },
      { rowLabel: "Fila 4", seatsCount: 8 },
      { rowLabel: "Fila 5", seatsCount: 8 },
      { rowLabel: "Fila 6", seatsCount: 8 },
      { rowLabel: "Fila 7", seatsCount: 8 },
      { rowLabel: "Fila 8", seatsCount: 8 },
      { rowLabel: "Fila 9", seatsCount: 8 },
      { rowLabel: "Fila 10", seatsCount: 8 }
    ],
    vip_central: [
      { rowLabel: "Fila 1", seatsCount: 9 },
      { rowLabel: "Fila 2", seatsCount: 9 },
      { rowLabel: "Fila 3", seatsCount: 9 },
      { rowLabel: "Fila 4", seatsCount: 9 },
      { rowLabel: "Fila 5", seatsCount: 9 },
      { rowLabel: "Fila 6", seatsCount: 9 },
      { rowLabel: "Fila 7", seatsCount: 9 },
      { rowLabel: "Fila 8", seatsCount: 9 },
      { rowLabel: "Fila 9", seatsCount: 9 },
      { rowLabel: "Fila 10", seatsCount: 9 }
    ],
    vip_derecha: [
      { rowLabel: "Fila 1", seatsCount: 8 },
      { rowLabel: "Fila 2", seatsCount: 8 },
      { rowLabel: "Fila 3", seatsCount: 8 },
      { rowLabel: "Fila 4", seatsCount: 8 },
      { rowLabel: "Fila 5", seatsCount: 8 },
      { rowLabel: "Fila 6", seatsCount: 8 },
      { rowLabel: "Fila 7", seatsCount: 8 },
      { rowLabel: "Fila 8", seatsCount: 8 },
      { rowLabel: "Fila 9", seatsCount: 8 },
      { rowLabel: "Fila 10", seatsCount: 8 }
    ]
  };

  const zoneList = [
    {
      data: vipCentral,
      x: 270, y: 140, width: 360, height: 180, rx: 12,
      label: "GOLD CENTRAL",
      sublabel: "Frente al Altar",
      hoverColor: "#DB2777"
    },
    {
      data: vipIzquierda,
      x: 70, y: 140, width: 180, height: 180, rx: 12,
      label: "GOLD IZQUIERDA",
      sublabel: "10 Filas x 8 Asientos",
      hoverColor: "#9333EA"
    },
    {
      data: vipDerecha,
      x: 650, y: 140, width: 180, height: 180, rx: 12,
      label: "GOLD DERECHA",
      sublabel: "10 Filas x 8 Asientos",
      hoverColor: "#9333EA"
    },
    {
      data: generalCentral,
      x: 270, y: 340, width: 360, height: 180, rx: 12,
      label: "GENERAL CENTRAL",
      sublabel: "Área Central",
      hoverColor: "#10B981"
    },
    {
      data: lateralIzquierda,
      x: 70, y: 340, width: 180, height: 180, rx: 12,
      label: "GENERAL IZQUIERDA",
      sublabel: "Sector Lateral",
      hoverColor: "#F59E0B"
    },
    {
      data: lateralDerecha,
      x: 650, y: 340, width: 180, height: 180, rx: 12,
      label: "GENERAL DERECHA",
      sublabel: "Sector Lateral",
      hoverColor: "#F59E0B"
    }
  ];

  const activeHoverConfig = zoneList.find(z => z.data.id === hoveredZoneId);

  const handleZoneClick = (zoneConfig) => {
    setSelectedZone(zoneConfig);
    setSelectedSeats([]);
    setHoveredZoneId(null);
  };

  const handleResetZoom = () => {
    setSelectedZone(null);
    setSelectedSeats([]);
    setHoveredZoneId(null);
  };

  const toggleSeatSelection = (seatCode, isOccupied) => {
    if (isOccupied) return;

    const parts = seatCode.split(' - ');
    if (parts.length < 3) return;
    const zId = parts[0];
    const rLabel = parts[1];

    let maxSeats = 10;
    let rowIndex = 0;

    if (zId === 'vip_central') {
      const activeRow = seatLayouts.vip_central.find((r, idx) => {
        if (r.rowLabel === rLabel) { rowIndex = idx; return true; }
        return false;
      });
      maxSeats = activeRow ? activeRow.seatsCount : 9;
    } else if (zId === 'vip_izquierda' || zId === 'vip_derecha') {
      const row = seatLayouts[zId].find((r, idx) => {
        if (r.rowLabel === rLabel) { rowIndex = idx; return true; }
        return false;
      });
      maxSeats = row ? row.seatsCount : 8;
    } else {
      const rows = ["Fila A", "Fila B", "Fila C", "Fila D", "Fila E", "Fila F", "Fila G", "Fila H", "Fila I", "Fila J"];
      rowIndex = rows.indexOf(rLabel);
      maxSeats = (zId === 'central_atras') ? 15 : 10;
    }

    const proposedSelected = selectedSeats.includes(seatCode)
      ? selectedSeats.filter(s => s !== seatCode)
      : [...selectedSeats, seatCode];

    const rowState = [];
    for (let i = 0; i < maxSeats; i++) {
      const code = `${zId} - ${rLabel} - Asiento #${i + 1}`;
      rowState.push({
        index: i,
        isOccupied: checkSeatOccupied(zId, rLabel, rowIndex, i),
        isSelected: proposedSelected.includes(code)
      });
    }

    let currentBlock = [];
    const blocks = [];
    for (let i = 0; i < maxSeats; i++) {
      if (rowState[i].isOccupied || rowState[i].isSelected) {
        currentBlock.push(rowState[i]);
      } else {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock);
          currentBlock = [];
        }
      }
    }
    if (currentBlock.length > 0) blocks.push(currentBlock);

    let isValid = true;
    for (const block of blocks) {
      const hasAnchor = block.some(s => s.index === 0 || s.index === maxSeats - 1 || s.isOccupied);
      if (!hasAnchor) {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      alert("Por orden, debes empezar eligiendo los asientos de las orillas (el primero o el último) y luego continuar escogiendo los que están a la par.");
      return;
    }

    setSelectedSeats(proposedSelected);
  };

  const checkSeatOccupied = (zoneId, rowLabel, rowIndex, seatIndex) => {
    const seatNum = seatIndex + 1;
    const seatCode = `${zoneId} - ${rowLabel} - Asiento #${seatNum}`;

    const prefixMap = {
      'vip_central': 'VIP-CTR',
      'vip_izquierda': 'VIP-IZQ',
      'vip_derecha': 'VIP-DER',
      'central_atras': 'GEN-CTR',
      'lateral_izquierda': 'GEN-IZQ',
      'lateral_derecha': 'GEN-DER'
    };
    const prefix = prefixMap[zoneId] || 'TKT';

    let trueRowIndex = typeof rowIndex === 'number' ? rowIndex : 0;
    if (rowLabel) {
      const match = String(rowLabel).match(/\d+/);
      if (match) {
        trueRowIndex = parseInt(match[0], 10) - 1;
      }
    }

    let queueIndex = 1;
    if (zoneId === 'vip_central') {
      queueIndex = (trueRowIndex * 9) + seatNum;
    } else if (zoneId === 'vip_izquierda' || zoneId === 'vip_derecha') {
      queueIndex = (trueRowIndex * 8) + seatNum;
    } else if (zoneId === 'central_atras') {
      queueIndex = (trueRowIndex * 15) + seatNum;
    } else {
      queueIndex = (trueRowIndex * 10) + seatNum;
    }

    const queueCode = `${prefix}-${String(queueIndex).padStart(3, '0')}`;

    return occupiedSeats.some(occ => {
      if (!occ) return false;
      const s = String(occ).trim();

      // If backend reports VIP-CTR-010 to VIP-CTR-018 as auto-occupied due to legacy Fila 1 & 2 protocol block,
      // override for Fila 2 if Fila 2 is active and not explicitly reserved by attendee seatCode.
      if (zoneId === 'vip_central' && trueRowIndex === 1 && s.startsWith('VIP-CTR-')) {
        // Only mark occupied if the actual seatCode matching Fila 2 is present in occupiedSeats
        return s === seatCode;
      }

      return s === seatCode || s === queueCode;
    });
  };

  // Validación estricta de llenado (bordes a centro) manejada directamente en toggleSeatSelection

  const [holdingSeats, setHoldingSeats] = useState(false);

  const getOrCreateSessionId = () => {
    let sid = sessionStorage.getItem('seat_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('seat_session_id', sid);
    }
    return sid;
  };

  const handleConfirmSelectedSeats = async () => {
    if (!selectedZone) return;
    if (selectedSeats.length === 0) {
      alert("Por favor selecciona al menos un asiento.");
      return;
    }


    setHoldingSeats(true);
    const sessionId = getOrCreateSessionId();

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/seats/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seat_codes: selectedSeats,
          session_id: sessionId,
          zone_id: selectedZone.data.id
        })
      });
      const data = await res.json();

      if (data.success) {
        onSelectZone(selectedZone.data, selectedSeats.length, selectedSeats, sessionId, data.expires_at);
      } else if (data.code === 'SEATS_TAKEN') {
        alert(data.message);
        setSelectedSeats([]);
        handleResetZoom();
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Error al apartar los asientos.');
      }
    } catch (err) {
      console.error('Error holding seats:', err);
      alert('Error de conexión al verificar los asientos. Por favor intenta nuevamente.');
    } finally {
      setHoldingSeats(false);
    }
  };

  // Render SVG Labels with strictly unified typography and font size (12.5px)
  const renderSvgLabels = (cfg) => {
    const isSelected = selectedZone && selectedZone.data.id === cfg.data.id;
    const isHovered = !selectedZone && hoveredZoneId === cfg.data.id;
    const textColor = isHovered || isSelected ? '#FFFFFF' : '#E5E7EB';
    const priceColor = isHovered || isSelected ? 'rgba(255,255,255,0.9)' : '#9CA3AF';

    const words = cfg.label.split(' ');
    const isMultiWord = words.length > 1;

    const centerY = cfg.y + cfg.height / 2;

    const centerX = cfg.x + cfg.width / 2;

    return (
      <g style={{ pointerEvents: 'none' }}>
        {isMultiWord ? (
          <>
            <text 
              x={centerX} 
              y={centerY - 12} 
              fill={textColor} 
              fontSize="12.5" 
              fontWeight="900" 
              textAnchor="middle" 
              letterSpacing="0.5"
            >
              <tspan x={centerX} dy="0">{words[0]}</tspan>
              <tspan x={centerX} dy="15">{words[1]}</tspan>
            </text>
            <text 
              x={centerX} 
              y={centerY + 30} 
              fill={priceColor} 
              fontSize="12" 
              fontWeight="800" 
              textAnchor="middle"
            >
              {formatCRC(cfg.data.price)}
            </text>
          </>
        ) : (
          <>
            <text 
              x={centerX} 
              y={centerY - 4} 
              fill={textColor} 
              fontSize="12.5" 
              fontWeight="900" 
              textAnchor="middle" 
              letterSpacing="0.5"
            >
              {cfg.label}
            </text>
            <text 
              x={centerX} 
              y={centerY + 20} 
              fill={priceColor} 
              fontSize="12" 
              fontWeight="800" 
              textAnchor="middle"
            >
              {formatCRC(cfg.data.price)}
            </text>
          </>
        )}
      </g>
    );
  };

  const renderSeatBtn = (seatNum, seatCode, isOccupied, isSelected) => (
    <button
      key={seatNum}
      disabled={isOccupied}
      onClick={() => toggleSeatSelection(seatCode, isOccupied)}
      title={isOccupied ? 'Asiento Ocupado / Reservado' : `Seleccionar ${seatCode}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '11px',
        border: isOccupied 
          ? '1px solid rgba(255, 255, 255, 0.04)' 
          : isSelected ? '2px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.12)',
        backgroundColor: isOccupied 
          ? 'rgba(255, 255, 255, 0.03)' 
          : isSelected ? selectedZone.hoverColor : 'rgba(255, 255, 255, 0.07)',
        color: isOccupied 
          ? 'rgba(255, 255, 255, 0.2)' 
          : isSelected ? '#FFFFFF' : '#F5F5F7',
        fontWeight: 800,
        fontSize: '0.85rem',
        boxShadow: isSelected ? `0 0 16px ${selectedZone.hoverColor}` : 'none',
        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: isOccupied ? 'not-allowed' : 'pointer',
        opacity: isOccupied ? 0.45 : 1
      }}
    >
      {isOccupied ? '—' : seatNum}
    </button>
  );

  return (
    <div style={{
      width: '100%',
      maxWidth: '960px',
      margin: '0 auto',
      backgroundColor: '#0E0E14',
      borderRadius: '28px',
      padding: '28px 24px',
      boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      fontFamily: 'var(--apple-font)',
      color: '#F5F5F7'
    }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <span className="apple-kicker" style={{ marginBottom: '6px' }}>
            CONGRESO AUTÉNTICAS 2026
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '4px', color: '#F5F5F7' }}>
            Auditorio Visión Jesús
          </h2>
        </div>

        {selectedZone ? (
          <button 
            onClick={handleResetZoom}
            className="apple-btn apple-btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <RotateCcw size={16} />
            <span>Regresar al Mapa</span>
          </button>
        ) : (
          <div style={{ fontSize: '0.88rem', color: 'var(--apple-text-secondary)', fontWeight: 500 }}>
            Toca una zona para seleccionar asientos por fila
          </div>
        )}
      </div>

      {/* Active Hover Banner */}
      {!selectedZone && (
        <div style={{
          minHeight: '44px',
          backgroundColor: activeHoverConfig ? activeHoverConfig.hoverColor : 'rgba(255, 255, 255, 0.04)',
          color: activeHoverConfig ? '#FFFFFF' : 'var(--apple-text-secondary)',
          border: '1px solid ' + (activeHoverConfig ? activeHoverConfig.hoverColor : 'rgba(255, 255, 255, 0.08)'),
          borderRadius: '999px',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '20px',
          transition: 'all 0.25s var(--apple-ease)',
          boxShadow: activeHoverConfig ? '0 10px 25px rgba(0,0,0,0.3)' : 'none'
        }}>
          {activeHoverConfig ? (
            <>
              <MousePointerClick size={18} />
              <span>
                {activeHoverConfig.data.name} — {formatCRC(activeHoverConfig.data.price)} ({activeHoverConfig.data.available_capacity} cupos) — Haz clic para ver asientos
              </span>
            </>
          ) : (
            <span>Explora el auditorio pasando el cursor o tocando las zonas</span>
          )}
        </div>
      )}

      {/* SVG VIEWPORT */}
      <div 
        className="svg-viewport-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          borderRadius: '20px',
          backgroundColor: '#07070B',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)'
        }}
      >
        
        <div style={{
          transform: selectedZone 
            ? `scale(1.4) translate(${(450 - (selectedZone.x + selectedZone.width / 2)) * 0.5}px, ${(300 - (selectedZone.y + selectedZone.height / 2)) * 0.5}px)`
            : 'scale(1) translate(0px, 0px)',
          transformOrigin: 'center center',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 900 560"
            width="100%"
            height="100%"
          >
            {/* ALTAR / ESCENARIO */}
            <g id="altar-iglesia">
              <rect 
                x="220" 
                y="25" 
                width="460" 
                height="80" 
                rx="14" 
                fill="#161622" 
                stroke="rgba(255, 255, 255, 0.18)" 
                strokeWidth="1.5"
              />
              <text 
                x="450" 
                y="73" 
                fill="#F5F5F7" 
                fontSize="26" 
                fontWeight="800" 
                textAnchor="middle" 
                letterSpacing="4"
              >
                ALTAR / ESCENARIO
              </text>
            </g>

            {/* RECTANGULAR ZONES */}
            {zoneList.map((cfg) => {
              const isSelected = selectedZone && selectedZone.data.id === cfg.data.id;
              const isHovered = !selectedZone && hoveredZoneId === cfg.data.id;
              let isDimmed = selectedZone && !isSelected;

              const isGoldZone = cfg.data.id.includes('vip');
              let isHighlightedTarget = false;
              if (highlightedZone === 'gold' && isGoldZone) isHighlightedTarget = true;
              if (highlightedZone === 'general' && !isGoldZone) isHighlightedTarget = true;

              if (!selectedZone && highlightedZone && !isHighlightedTarget) {
                isDimmed = true;
              }

              const shouldHighlight = isHighlightedTarget && !selectedZone;

              return (
                <g
                  key={cfg.data.id}
                  onMouseEnter={() => !selectedZone && setHoveredZoneId(cfg.data.id)}
                  onMouseLeave={() => !selectedZone && setHoveredZoneId(null)}
                  onClick={() => handleZoneClick(cfg)}
                  style={{ 
                    cursor: selectedZone && !isSelected ? 'default' : 'pointer',
                    opacity: isDimmed ? 0.25 : 1,
                    transition: 'all 0.3s ease',
                    animation: shouldHighlight ? 'pulseHighlight 2s infinite' : 'none'
                  }}
                >
                  <rect
                    x={cfg.x}
                    y={cfg.y}
                    width={cfg.width}
                    height={cfg.height}
                    rx={14}
                    fill={isSelected || isHovered || shouldHighlight ? cfg.hoverColor : 'rgba(255, 255, 255, 0.08)'}
                    stroke={isSelected || isHovered ? '#FFFFFF' : (shouldHighlight ? cfg.hoverColor : 'rgba(255, 255, 255, 0.14)')}
                    strokeWidth={isSelected || isHovered ? "3" : "1.5"}
                    style={{ transition: 'all 0.25s ease' }}
                  />

                  {/* Render dynamic SVG Labels cleanly using <tspan> to wrap text */}
                  {renderSvgLabels(cfg)}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* DETAILED INTERACTIVE SEAT MATRIX WITH BLOCKED OCCUPIED SEATS */}
      {selectedZone && (
        <div style={{
          marginTop: '24px',
          backgroundColor: '#12121A',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '28px 24px',
          animation: 'fadeInUp 0.3s ease-out',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                backgroundColor: selectedZone.hoverColor,
                color: '#FFFFFF'
              }}>
                Zona Seleccionada
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F5F5F7', marginTop: '6px', letterSpacing: '-0.02em' }}>
                {selectedZone.label} <span style={{ color: 'var(--apple-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>({formatCRC(selectedZone.data.price)} / boleto)</span>
              </h3>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--apple-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Total Estimado:</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399', letterSpacing: '-0.02em' }}>
                {formatCRC((selectedSeats.length > 0 ? selectedSeats.length : 1) * selectedZone.data.price)}
              </div>
            </div>
          </div>

          {/* Seat Legend */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            fontWeight: 600,
            alignItems: 'center',
            color: 'var(--apple-text-secondary)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.18)' }} />
              <span>Disponible</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: selectedZone.hoverColor, border: '1px solid #FFFFFF' }} />
              <span style={{ color: '#F5F5F7' }}>Seleccionado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }} />
              <span>Ocupado</span>
            </div>
          </div>

          {/* Selected seats pills preview */}
          {selectedSeats.length > 0 && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F5F5F7' }}>
                Asientos Marcados ({selectedSeats.length}):
              </span>
              {selectedSeats.map(s => {
                const displayCode = s.includes(' - ') ? s.split(' - ').slice(1).join(' - ') : s;
                return (
                  <span key={s} style={{
                    backgroundColor: selectedZone.hoverColor,
                    color: '#FFFFFF',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    {displayCode}
                  </span>
                );
              })}
            </div>
          )}

          {/* Seat Layout Render */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', overflowX: 'auto' }}>
            {(() => {
              const isGen = selectedZone && (
                (selectedZone.data?.ticket_type || selectedZone.data?.ticketType || '').toLowerCase() === 'general' ||
                (selectedZone.label || selectedZone.data?.name || selectedZone.data?.label || '').toUpperCase().includes('GENERAL') ||
                (selectedZone.data?.id || '').toLowerCase().includes('general') ||
                (selectedZone.data?.id || '').toLowerCase().includes('lateral') ||
                ['general_central', 'central_atras', 'lateral_izquierda', 'lateral_derecha'].includes(selectedZone.data?.id)
              );

              const isRowVisible = (rLabel, idx) => {
                if (!isGen) return true;
                if (idx > 5) return false;
                if (rLabel && /FILA\s+[G-Z]/i.test(String(rLabel).trim().toUpperCase())) return false;
                return true;
              };

              // 1. Check if dynamic layout_config exists on zone
              const dynRows = selectedZone.data?.layout_config?.rows;
              if (dynRows && Array.isArray(dynRows) && dynRows.length > 0) {
                return dynRows
                  .map((r, origIdx) => ({ ...r, origIdx }))
                  .filter((r) => isRowVisible(r.rowLabel, r.origIdx))
                  .map((r) => {
                    const rIdx = r.origIdx;
                  if (r.isReserved) {
                    return (
                      <div key={r.rowLabel} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 16px',
                        backgroundColor: '#1E293B',
                        borderRadius: '10px',
                        border: '1px dashed #475569',
                        color: '#94A3B8',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}>
                        <span>{r.rowLabel}</span>
                        <span>🔒 {r.seatsCount} Asientos Reservados (Protocolo)</span>
                      </div>
                    );
                  }

                  return (
                    <div key={r.rowLabel} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '60px', fontWeight: 700, fontSize: '0.84rem', color: 'var(--apple-text-secondary)' }}>
                        {r.rowLabel}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {Array.from({ length: r.seatsCount }, (_, i) => {
                          const seatNum = i + 1;
                          const seatCode = `${selectedZone.data.id} - ${r.rowLabel} - Asiento #${seatNum}`;
                          const isOccupied = checkSeatOccupied(selectedZone.data.id, r.rowLabel, rIdx, i);
                          const isSelected = selectedSeats.includes(seatCode);
                          return renderSeatBtn(seatNum, seatCode, isOccupied, isSelected);
                        })}
                      </div>
                    </div>
                  );
                });
              }

              // Fallback to static seatLayouts
              if (seatLayouts[selectedZone.data.id]) {
                if (selectedZone.data.id === 'vip_central') {
                  return seatLayouts.vip_central.map((r, rIdx) => (
                    <div key={r.rowLabel} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '60px', fontWeight: 700, fontSize: '0.84rem', color: 'var(--apple-text-secondary)' }}>
                        {r.rowLabel}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {Array.from({ length: r.seatsCount }, (_, i) => {
                          const seatNum = i + 1;
                          const seatCode = `${selectedZone.data.id} - ${r.rowLabel} - Asiento #${seatNum}`;
                          const isOccupied = checkSeatOccupied(selectedZone.data.id, r.rowLabel, rIdx, i);
                          const isSelected = selectedSeats.includes(seatCode);
                          return renderSeatBtn(seatNum, seatCode, isOccupied, isSelected);
                        })}
                      </div>
                    </div>
                  ));
                } else {
                  return seatLayouts[selectedZone.data.id].filter((r, rIdx) => isRowVisible(r.rowLabel, rIdx)).map((r, rIdx) => (
                    <div key={r.rowLabel} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '60px', fontWeight: 700, fontSize: '0.84rem', color: 'var(--apple-text-secondary)' }}>
                        {r.rowLabel}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {Array.from({ length: r.seatsCount }, (_, i) => {
                          const seatNum = i + 1;
                          const seatCode = `${selectedZone.data.id} - ${r.rowLabel} - Asiento #${seatNum}`;
                          const isOccupied = checkSeatOccupied(selectedZone.data.id, r.rowLabel, rIdx, i);
                          const isSelected = selectedSeats.includes(seatCode);
                          return renderSeatBtn(seatNum, seatCode, isOccupied, isSelected);
                        })}
                      </div>
                    </div>
                  ));
                }
              }

              // General fallback (Uniform rows: Fila A to F for General, A to J for others)
              const allRows = ["Fila A", "Fila B", "Fila C", "Fila D", "Fila E", "Fila F", "Fila G", "Fila H", "Fila I", "Fila J"];
              const rowsToRender = isGen ? allRows.slice(0, 6) : allRows;

              return rowsToRender.map((rLabel, rIdx) => {
                const cols = selectedZone.data.id === 'central_atras' ? 15 : 10;
                return (
                  <div key={rLabel} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '60px', fontWeight: 700, fontSize: '0.84rem', color: 'var(--apple-text-secondary)' }}>
                      {rLabel}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {Array.from({ length: cols }, (_, i) => {
                        const seatNum = i + 1;
                        const seatCode = `${selectedZone.data.id} - ${rLabel} - Asiento #${seatNum}`;
                        const isOccupied = checkSeatOccupied(selectedZone.data.id, rLabel, rIdx, i);
                        const isSelected = selectedSeats.includes(seatCode);
                        return renderSeatBtn(seatNum, seatCode, isOccupied, isSelected);
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={handleConfirmSelectedSeats}
              disabled={holdingSeats}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor: selectedZone.hoverColor,
                borderRadius: '999px',
                border: 'none',
                cursor: holdingSeats ? 'wait' : 'pointer',
                opacity: holdingSeats ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: `0 10px 30px ${selectedZone.hoverColor}66`,
                transition: 'all 0.2s var(--apple-ease)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Check size={20} strokeWidth={2.5} />
              <span>
                {holdingSeats ? 'Verificando disponibilidad...' : `Continuar (${selectedSeats.length > 0 ? selectedSeats.length : 1} ${selectedSeats.length === 1 ? 'Boleto' : 'Boletos'}) — Total: ${formatCRC((selectedSeats.length > 0 ? selectedSeats.length : 1) * selectedZone.data.price)}`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Zone list cards (Apple Bento Grid) */}
      {!selectedZone && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginTop: '28px'
        }}>
          {zoneList.map((cfg) => {
            const isHovered = hoveredZoneId === cfg.data.id;
            return (
              <div
                key={cfg.data.id}
                onMouseEnter={() => setHoveredZoneId(cfg.data.id)}
                onMouseLeave={() => setHoveredZoneId(null)}
                onClick={() => handleZoneClick(cfg)}
                style={{
                  backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.08)' : '#14141E',
                  color: '#F5F5F7',
                  border: `1px solid ${isHovered ? cfg.hoverColor : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '20px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.25s var(--apple-ease)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: '88px',
                  boxShadow: isHovered ? `0 14px 35px rgba(0,0,0,0.5), 0 0 20px ${cfg.hoverColor}33` : 'none',
                  transform: isHovered ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ 
                    fontSize: '0.92rem', 
                    margin: 0, 
                    color: isHovered ? cfg.hoverColor : '#F5F5F7',
                    fontWeight: 800,
                    lineHeight: 1.2
                  }}>
                    {cfg.label}
                  </h3>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>{formatCRC(cfg.data.price)}</span>
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--apple-text-secondary)' }}>
                  {cfg.sublabel} • {cfg.data.available_capacity} cupos
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
