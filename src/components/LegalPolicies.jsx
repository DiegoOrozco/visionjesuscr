import React from 'react';

const LegalPolicies = () => {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h1 style={{ color: 'var(--accent-coffee)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '40px', textAlign: 'center' }}>
          Políticas y Términos Legales
        </h1>

        <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #EAEAEA' }} id="envio">
          <h2 style={{ color: 'var(--accent-gold)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px' }}>Políticas de Envío</h2>
          <div style={{ color: '#4A4A4A', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p><strong>Condiciones:</strong> Visión Jesús ofrece exclusivamente la venta de productos digitales (como boletos o entradas virtuales para eventos y congresos) y la recepción de ofrendas. No realizamos envíos de productos físicos.</p>
            <p><strong>Tiempo:</strong> El envío del boleto digital o comprobante es inmediato tras la confirmación exitosa del pago.</p>
            <p><strong>Procedimiento:</strong> Una vez aprobada la transacción por su entidad bancaria, el sistema generará un comprobante digital o código QR que será enviado automáticamente al correo electrónico registrado por el usuario durante el proceso de compra.</p>
          </div>
        </div>

        <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #EAEAEA' }} id="cancelacion">
          <h2 style={{ color: 'var(--accent-gold)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px' }}>Políticas de Cancelación y Devolución</h2>
          <div style={{ color: '#4A4A4A', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p><strong>Políticas de Cambios y Cancelación:</strong> Todas las ventas y donaciones realizadas a través de nuestro sitio web son finales. No se permiten cambios de fechas, zonas o localidades para los eventos una vez emitido el boleto, ni se permite la cancelación de la compra o aporte.</p>
            <p><strong>Condiciones de Devolución:</strong> No se realizan devoluciones de dinero bajo ninguna circunstancia (incluyendo, pero no limitado a, no poder asistir al evento, errores en la selección de boletos por parte del usuario, o cambios de opinión).</p>
            <p><strong>Tiempo y Procedimiento:</strong> Dado que no se aceptan devoluciones ni cancelaciones, el servicio se considera completamente ejecutado en el momento en que el boleto digital es emitido y enviado al usuario.</p>
          </div>
        </div>

        <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #EAEAEA' }} id="privacidad">
          <h2 style={{ color: 'var(--accent-gold)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px' }}>Políticas de Privacidad</h2>
          <div style={{ color: '#4A4A4A', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p><strong>Destino de la información:</strong> Los datos personales recolectados (Nombre, correo electrónico, teléfono) son utilizados exclusivamente para la emisión de los boletos digitales, control de acceso a los eventos y para contactarle en caso de cambios en los servicios. <strong>Importante:</strong> Nuestro sitio NO guarda, almacena ni retiene información sensible de tarjetas de crédito o débito (Número de tarjeta, fecha de vencimiento, CVV). Toda la información de pago es procesada de forma encriptada y directa por la pasarela de pagos del banco.</p>
            <p><strong>Verificación de conexión segura:</strong> Le recomendamos verificar siempre que su conexión sea segura antes de ingresar cualquier dato. Puede confirmar esto revisando que la URL en su navegador inicie con <strong>https://</strong> y que aparezca el icono de un candado cerrado junto a la barra de direcciones.</p>
            <p><strong>Confidencialidad:</strong> Las transacciones son procesadas a través de canales seguros y cifrados. Sus datos de pago no pueden ser visualizados por nosotros ni por terceros ajenos a la transacción bancaria.</p>
            <p><strong>Forma de proteger la privacidad:</strong> Nos comprometemos a no vender, ceder ni compartir sus datos personales con terceros sin su consentimiento previo, utilizando la información únicamente para los fines eclesiásticos e informativos de la organización.</p>
          </div>
        </div>

        <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #EAEAEA' }} id="seguridad">
          <h2 style={{ color: 'var(--accent-gold)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px' }}>Políticas de Seguridad</h2>
          <div style={{ color: '#4A4A4A', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p><strong>Ingreso de información segura:</strong> Su información transaccional viaja de manera encriptada, garantizando que el ingreso de su nombre, número de tarjeta y fecha de vencimiento se realice bajo los más altos estándares de seguridad bancaria.</p>
            <p><strong>Servidor Seguro y Certificado SSL:</strong> Nuestro sitio web y pasarela de pago utilizan tecnología de servidor seguro. Contamos con un <strong>Certificado de Seguridad TLS 1.2 (SSL de 256 bits) mínimo</strong> emitido por proveedores modernos.</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', marginBottom: '20px' }}>
              <li><strong>Dominio para el que se expidió:</strong> https://www.visionjesuscr.com/</li>
              <li><strong>Dueño del Certificado:</strong> Asociación Visión Jesús</li>
              <li><strong>Domicilio del Dueño:</strong> Del Cementerio de San Antonio, 200mts NE. Auditorio principal Visión Jesús, Costa Rica.</li>
              <li><strong>Fecha de validez:</strong> Renovación automática y vigente (Validez continua mediante protocolo de renovación encriptado).</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '40px' }} id="contacto">
          <h2 style={{ color: 'var(--accent-coffee)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px' }}>Información de Contacto</h2>
          <div style={{ color: '#4A4A4A', lineHeight: '1.8', fontSize: '1.05rem', backgroundColor: '#F9F9F9', padding: '20px', borderRadius: '8px' }}>
            <p><strong>Razón Social:</strong> Asociación Visión Jesús</p>
            <p><strong>Cédula Jurídica:</strong> 3-002-771146 (Sujeta a actualización oficial)</p>
            <p><strong>Dirección Física:</strong> Del Cementerio de San Antonio, 200mts NE. Auditorio principal Visión Jesús.</p>
            <p><strong>Correo Electrónico:</strong> <a href="mailto:info@visionjesuscr.com" style={{ color: 'var(--accent-gold)' }}>info@visionjesuscr.com</a></p>
            <p><strong>Teléfono:</strong> <a href="tel:+50663777743" style={{ color: 'var(--accent-gold)' }}>63777743</a></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LegalPolicies;
