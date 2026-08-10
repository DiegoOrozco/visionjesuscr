import React, { useState } from 'react';
import { RotateCcw, Check, MousePointerClick, Star, Ticket } from 'lucide-react';

export default function VenueMap({ zones, occupiedSeats = [], onSelectZone }) {
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

  const vipCentral = getZone('vip_central', 'VIP Central', 12000, '#DB2777');
  const vipIzquierda = getZone('vip_izquierda', 'VIP Izquierda', 12000, '#9333EA');
  const vipDerecha = getZone('vip_derecha', 'VIP Derecha', 12000, '#9333EA');
  
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
    vip_central: {
      reservedRows: ["Fila 1 (RESERVADO)", "Fila 2 (RESERVADO)"],
      activeRows: [
        { rowLabel: "Fila 3", seatsCount: 9 },
        { rowLabel: "Fila 4", seatsCount: 9 },
        { rowLabel: "Fila 5", seatsCount: 9 },
        { rowLabel: "Fila 6", seatsCount: 9 },
        { rowLabel: "Fila 7", seatsCount: 9 },
        { rowLabel: "Fila 8", seatsCount: 9 },
        { rowLabel: "Fila 9", seatsCount: 9 },
        { rowLabel: "Fila 10", seatsCount: 9 }
      ]
    },
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
      label: "VIP CENTRAL",
      sublabel: "Frente al Altar",
      hoverColor: "#DB2777"
    },
    {
      data: vipIzquierda,
      x: 70, y: 140, width: 180, height: 180, rx: 12,
      label: "VIP IZQUIERDA",
      sublabel: "10 Filas x 8 Asientos",
      hoverColor: "#9333EA"
    },
    {
      data: vipDerecha,
      x: 650, y: 140, width: 180, height: 180, rx: 12,
      label: "VIP DERECHA",
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

    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      setSelectedSeats([...selectedSeats, seatCode]);
    }
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

    let queueIndex = 1;
    if (zoneId === 'vip_central') {
      // row index in React represents Fila 3 to 10 (which is index 0 to 7)
      // We must add the 18 reserved seats of Row 1 & Row 2 (9 per row)
      queueIndex = ((rowIndex + 2) * 9) + seatNum;
    } else if (zoneId === 'vip_izquierda' || zoneId === 'vip_derecha') {
      queueIndex = (rowIndex * 8) + seatNum;
    } else if (zoneId === 'central_atras') {
      queueIndex = (rowIndex * 15) + seatNum;
    } else {
      queueIndex = (rowIndex * 10) + seatNum;
    }

    const queueCode = `${prefix}-${String(queueIndex).padStart(3, '0')}`;

    return occupiedSeats.some(occ => {
      if (!occ) return false;
      const s = String(occ).trim();
      return s === seatCode || s === queueCode;
    });
  };

  // Validate single gaps of exactly 1 empty space
  const validateRowGaps = () => {
    const seatsByRow = {};
    for (const seat of selectedSeats) {
      const parts = seat.split(' - ');
      if (parts.length < 3) continue;
      const zId = parts[0];
      const rLabel = parts[1];
      const key = `${zId}::${rLabel}`;
      if (!seatsByRow[key]) seatsByRow[key] = [];
      seatsByRow[key].push(seat);
    }

    for (const [key, selectedInRow] of Object.entries(seatsByRow)) {
      const [zId, rLabel] = key.split('::');
      let maxSeats = 10;
      let rowIndex = 0;

      if (zId === 'vip_central') {
        const activeRows = seatLayouts.vip_central.activeRows;
        const activeRow = activeRows.find((r, idx) => {
          if (r.rowLabel === rLabel) {
            rowIndex = idx;
            return true;
          }
          return false;
        });
        maxSeats = activeRow ? activeRow.seatsCount : 9;
      } else if (zId === 'vip_izquierda' || zId === 'vip_derecha') {
        const rows = seatLayouts[zId];
        const row = rows.find((r, idx) => {
          if (r.rowLabel === rLabel) {
            rowIndex = idx;
            return true;
          }
          return false;
        });
        maxSeats = row ? row.seatsCount : 8;
      } else {
        const rows = ["Fila A", "Fila B", "Fila C", "Fila D", "Fila E", "Fila F", "Fila G", "Fila H", "Fila I", "Fila J"];
        rowIndex = rows.indexOf(rLabel);
        if (zId === 'central_atras') maxSeats = 15;
        else maxSeats = 10;
      }

      const rowState = [];
      for (let i = 0; i < maxSeats; i++) {
        const seatCode = `${zId} - ${rLabel} - Asiento #${i + 1}`;
        const isOccupied = checkSeatOccupied(zId, rLabel, rowIndex, i);
        const isSelected = selectedSeats.includes(seatCode);
        rowState.push(isOccupied || isSelected);
      }

      for (let i = 0; i < maxSeats; i++) {
        if (rowState[i] === false) {
          const leftIsBoundOrTaken = (i === 0 || rowState[i - 1] === true);
          const rightIsBoundOrTaken = (i === maxSeats - 1 || rowState[i + 1] === true);
          if (leftIsBoundOrTaken && rightIsBoundOrTaken) {
            alert(`No se permite dejar asientos vacíos individuales (fila: ${rLabel}, asiento: ${i + 1}). Por favor selecciona este asiento o reorganiza tus selecciones para no dejar huecos aislados.`);
            return false;
          }
        }
      }
    }
    return true;
  };

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
    if (!validateRowGaps()) return;

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
        if (onResetZoom) onResetZoom();
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
    const textColor = isHovered || isSelected ? '#FFFFFF' : '#1F2937';
    const priceColor = isHovered || isSelected ? '#FAF8F5' : '#4B5563';

    const words = cfg.label.split(' ');
    const isMultiWord = words.length > 1;

    // Center coordinates for active VIP Central area (y: 215 to 320 -> center is 267.5)
    const centerY = cfg.data.id === 'vip_central' 
      ? 267.5 
      : cfg.y + cfg.height / 2;

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

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--accent-beige-border)'
    }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <span className="badge badge-approved" style={{ backgroundColor: 'var(--accent-coffee)', color: '#FFF' }}>
            CONGRESO AUTÉNTICAS 2026
          </span>
          <h2 style={{ fontSize: '1.75rem', marginTop: '6px', color: 'var(--accent-coffee)' }}>
            Auditorio Visión Jesús
          </h2>
        </div>

        {selectedZone ? (
          <button 
            onClick={handleResetZoom}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-secondary)', fontWeight: 700 }}
          >
            <RotateCcw size={18} />
            <span>REGRESAR AL MAPA PRINCIPAL</span>
          </button>
        ) : (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Toca una zona para seleccionar asientos por fila
          </div>
        )}
      </div>

      {/* Active Hover Banner */}
      {!selectedZone && (
        <div style={{
          minHeight: '46px',
          backgroundColor: activeHoverConfig ? activeHoverConfig.hoverColor : '#F5EBE1',
          color: activeHoverConfig ? '#FFFFFF' : 'var(--accent-coffee)',
          borderRadius: '16px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '1rem',
          marginBottom: '20px',
          transition: 'all 0.25s ease',
          boxShadow: activeHoverConfig ? '0 10px 25px rgba(0,0,0,0.2)' : 'none'
        }}>
          {activeHoverConfig ? (
            <>
              <MousePointerClick size={20} />
              <span>
                {activeHoverConfig.data.name} — {formatCRC(activeHoverConfig.data.price)} por boleto ({activeHoverConfig.data.available_capacity} cupos) — ¡HAZ CLIC PARA VER ASIENTOS!
              </span>
            </>
          ) : (
            <span>Pasa el cursor sobre las zonas del auditorio</span>
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
          backgroundColor: '#FAF8F5',
          border: '2px solid var(--accent-beige-border)',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.03)'
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
                rx="10" 
                fill="#000000" 
                stroke="#333333" 
                strokeWidth="2"
              />
              <text 
                x="450" 
                y="73" 
                fill="#FFFFFF" 
                fontSize="28" 
                fontWeight="900" 
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
              const isDimmed = selectedZone && !isSelected;

              return (
                <g
                  key={cfg.data.id}
                  onMouseEnter={() => !selectedZone && setHoveredZoneId(cfg.data.id)}
                  onMouseLeave={() => !selectedZone && setHoveredZoneId(null)}
                  onClick={() => handleZoneClick(cfg)}
                  style={{ 
                    cursor: selectedZone && !isSelected ? 'default' : 'pointer',
                    opacity: isDimmed ? 0.35 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <rect
                    x={cfg.x}
                    y={cfg.y}
                    width={cfg.width}
                    height={cfg.height}
                    rx={cfg.rx}
                    fill={isSelected || isHovered ? cfg.hoverColor : '#D1D5DB'}
                    stroke={isSelected || isHovered ? '#2C1A0E' : '#FFFFFF'}
                    strokeWidth={isSelected || isHovered ? "4" : "3"}
                    style={{ transition: 'all 0.25s ease' }}
                  />

                  {/* BLACK RESERVED AREA IN VIP CENTRAL */}
                  {cfg.data.id === 'vip_central' && (
                    <g>
                      <rect 
                        x="270" y="140" width="360" height="75" rx="10" 
                        fill="#000000" stroke="#333333" strokeWidth="2"
                      />
                      <text x="450" y="172" fill="#4ADE80" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="2">
                        RESERVADO
                      </text>
                      <text x="450" y="195" fill="#FFFFFF" fontSize="12" fontWeight="700" textAnchor="middle">
                        INVITADOS ESPECIALES / PASTORES
                      </text>
                    </g>
                  )}

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
          backgroundColor: '#FAF8F5',
          border: '2px solid ' + selectedZone.hoverColor,
          borderRadius: '20px',
          padding: '24px',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            borderBottom: '1px solid var(--accent-beige-border)',
            paddingBottom: '12px'
          }}>
            <div>
              <span className="badge" style={{ backgroundColor: selectedZone.hoverColor, color: '#FFF' }}>
                ZONA SELECCIONADA
              </span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-coffee)', marginTop: '4px' }}>
                {selectedZone.label} ({formatCRC(selectedZone.data.price)} / boleto)
              </h3>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monto a Pagar:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-green)' }}>
                {formatCRC((selectedSeats.length > 0 ? selectedSeats.length : 1) * selectedZone.data.price)}
              </div>
            </div>
          </div>

          {/* Seat Legend */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB' }} />
              <span>Disponible</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: selectedZone.hoverColor }} />
              <span>Seleccionado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#4B5563', border: '1px solid #374151' }} />
              <span>Ocupado / Reservado</span>
            </div>
          </div>

          {/* Reserved Rows Banner for VIP Central */}
          {selectedZone.data.id === 'vip_central' && (
            <div style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '14px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Star size={22} color="#4ADE80" />
                <div>
                  <div style={{ fontWeight: 800, color: '#4ADE80', fontSize: '0.95rem' }}>
                    FILAS 1 Y 2 RESERVADAS (INVITADOS ESPECIALES / PASTORES)
                  </div>
                  <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>
                    Las 2 primeras filas están bloqueadas. Puedes seleccionar asientos en las Filas 3 a la 10 (9 asientos por fila).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected seats pills preview */}
          {selectedSeats.length > 0 && (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--accent-beige-border)',
              borderRadius: '12px',
              padding: '10px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-coffee)' }}>
                Asientos Marcados ({selectedSeats.length}):
              </span>
              {selectedSeats.map(s => {
                const displayCode = s.includes(' - ') ? s.split(' - ').slice(1).join(' - ') : s;
                return (
                  <span key={s} className="badge" style={{ backgroundColor: selectedZone.hoverColor, color: '#FFF' }}>
                    {displayCode}
                  </span>
                );
              })}
            </div>
          )}

          {/* Seat Layout Render */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', overflowX: 'auto' }}>
            {seatLayouts[selectedZone.data.id] ? (
              selectedZone.data.id === 'vip_central' ? (
                seatLayouts.vip_central.activeRows.map((r, rIdx) => (
                  <div key={r.rowLabel} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '60px', fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-coffee)' }}>
                      {r.rowLabel}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {Array.from({ length: r.seatsCount }, (_, i) => {
                        const seatNum = i + 1;
                        const seatCode = `${selectedZone.data.id} - ${r.rowLabel} - Asiento #${seatNum}`;
                        const isOccupied = checkSeatOccupied(selectedZone.data.id, r.rowLabel, rIdx, i);
                        const isSelected = selectedSeats.includes(seatCode);

                        return (
                          <button
                            key={seatNum}
                            disabled={isOccupied}
                            onClick={() => toggleSeatSelection(seatCode, isOccupied)}
                            title={isOccupied ? 'Asiento Ocupado / Reservado' : `Seleccionar Fila ${r.rowLabel} Asiento #${seatNum}`}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '10px',
                              border: isOccupied 
                                ? '1px solid #374151' 
                                : isSelected ? '3px solid #2C1A0E' : '1px solid #D1D5DB',
                              backgroundColor: isOccupied 
                                ? '#4B5563' 
                                : isSelected ? selectedZone.hoverColor : '#FFFFFF',
                              color: isOccupied 
                                ? '#9CA3AF' 
                                : isSelected ? '#FFFFFF' : '#1F2937',
                              fontWeight: 900,
                              fontSize: '0.85rem',
                              boxShadow: isSelected ? '0 6px 16px rgba(0,0,0,0.3)' : 'none',
                              transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                              cursor: isOccupied ? 'not-allowed' : 'pointer',
                              opacity: isOccupied ? 0.7 : 1
                            }}
                          >
                            {isOccupied ? 'X' : seatNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                seatLayouts[selectedZone.data.id].map((r, rIdx) => (
                  <div key={r.rowLabel} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '60px', fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-coffee)' }}>
                      {r.rowLabel}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {Array.from({ length: r.seatsCount }, (_, i) => {
                        const seatNum = i + 1;
                        const seatCode = `${selectedZone.data.id} - ${r.rowLabel} - Asiento #${seatNum}`;
                        const isOccupied = checkSeatOccupied(selectedZone.data.id, r.rowLabel, rIdx, i);
                        const isSelected = selectedSeats.includes(seatCode);

                        return (
                          <button
                            key={seatNum}
                            disabled={isOccupied}
                            onClick={() => toggleSeatSelection(seatCode, isOccupied)}
                            title={isOccupied ? 'Asiento Ocupado / Reservado' : `Seleccionar Fila ${r.rowLabel} Asiento #${seatNum}`}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '10px',
                              border: isOccupied 
                                ? '1px solid #374151' 
                                : isSelected ? '3px solid #2C1A0E' : '1px solid #D1D5DB',
                              backgroundColor: isOccupied 
                                ? '#4B5563' 
                                : isSelected ? selectedZone.hoverColor : '#FFFFFF',
                              color: isOccupied 
                                ? '#9CA3AF' 
                                : isSelected ? '#FFFFFF' : '#1F2937',
                              fontWeight: 900,
                              fontSize: '0.85rem',
                              boxShadow: isSelected ? '0 6px 16px rgba(0,0,0,0.3)' : 'none',
                              transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                              cursor: isOccupied ? 'not-allowed' : 'pointer',
                              opacity: isOccupied ? 0.7 : 1
                            }}
                          >
                            {isOccupied ? 'X' : seatNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )
            ) : (
              // General Zones (Uniform 10 rows: Fila A to J)
              ["Fila A", "Fila B", "Fila C", "Fila D", "Fila E", "Fila F", "Fila G", "Fila H", "Fila I", "Fila J"].map((rLabel, rIdx) => {
                const cols = selectedZone.data.id === 'central_atras' ? 15 : 10;
                return (
                  <div key={rLabel} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '60px', fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-coffee)' }}>
                      {rLabel}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {Array.from({ length: cols }, (_, i) => {
                        const seatNum = i + 1;
                        const seatCode = `${selectedZone.data.id} - ${rLabel} - Asiento #${seatNum}`;
                        const isOccupied = checkSeatOccupied(selectedZone.data.id, rLabel, rIdx, i);
                        const isSelected = selectedSeats.includes(seatCode);

                        return (
                          <button
                            key={seatNum}
                            disabled={isOccupied}
                            onClick={() => toggleSeatSelection(seatCode, isOccupied)}
                            title={isOccupied ? 'Asiento Ocupado / Reservado' : `Seleccionar Fila ${rLabel} Asiento #${seatNum}`}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '10px',
                              border: isOccupied 
                                ? '1px solid #374151' 
                                : isSelected ? '3px solid #2C1A0E' : '1px solid #D1D5DB',
                              backgroundColor: isOccupied 
                                ? '#4B5563' 
                                : isSelected ? selectedZone.hoverColor : '#FFFFFF',
                              color: isOccupied 
                                ? '#9CA3AF' 
                                : isSelected ? '#FFFFFF' : '#1F2937',
                              fontWeight: 900,
                              fontSize: '0.85rem',
                              boxShadow: isSelected ? '0 6px 16px rgba(0,0,0,0.3)' : 'none',
                              transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                              cursor: isOccupied ? 'not-allowed' : 'pointer',
                              opacity: isOccupied ? 0.7 : 1
                            }}
                          >
                            {isOccupied ? 'X' : seatNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleConfirmSelectedSeats}
              disabled={holdingSeats}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '16px',
                fontSize: '1.1rem',
                backgroundColor: selectedZone.hoverColor,
                borderRadius: '12px',
                opacity: holdingSeats ? 0.7 : 1
              }}
            >
              <Check size={20} />
              <span>
                {holdingSeats ? 'Verificando disponibilidad...' : `Reservar (${selectedSeats.length > 0 ? selectedSeats.length : 1} ${selectedSeats.length === 1 ? 'Boleto' : 'Boletos'}) — Total: ${formatCRC((selectedSeats.length > 0 ? selectedSeats.length : 1) * selectedZone.data.price)}`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Zone list cards */}
      {!selectedZone && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginTop: '24px'
        }}>
          {zoneList.map((cfg) => (
            <div
              key={cfg.data.id}
              onMouseEnter={() => setHoveredZoneId(cfg.data.id)}
              onMouseLeave={() => setHoveredZoneId(null)}
              onClick={() => handleZoneClick(cfg)}
              style={{
                backgroundColor: hoveredZoneId === cfg.data.id ? cfg.hoverColor : '#FFFFFF',
                color: hoveredZoneId === cfg.data.id ? '#FFFFFF' : 'var(--accent-coffee)',
                border: `2px solid ${hoveredZoneId === cfg.data.id ? '#2C1A0E' : 'var(--accent-beige-border)'}`,
                borderRadius: '14px',
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '80px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h3 style={{ 
                  fontSize: '0.88rem', 
                  margin: 0, 
                  color: hoveredZoneId === cfg.data.id ? '#FFFFFF' : 'var(--accent-coffee)',
                  fontWeight: 900,
                  lineHeight: 1.2
                }}>
                  {cfg.label}
                </h3>
                <span style={{ fontSize: '0.95rem', fontWeight: 900 }}>{formatCRC(cfg.data.price)}</span>
              </div>
              <div style={{ fontSize: '0.78rem', marginTop: '4px', opacity: 0.9 }}>
                {cfg.sublabel} • {cfg.data.available_capacity} cupos
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
