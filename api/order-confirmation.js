// api/order-confirmation.js
// Endpoint que devuelve la página de confirmación de pago

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>✅ Pago Exitoso - WEYOURFEED</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0A0A0A; color: #FFFFFF; font-family: 'Inter', sans-serif; }
        .logo-text { font-family: 'Oswald', sans-serif; font-size: 2rem; font-weight: 700; font-style: italic; letter-spacing: 2px; }
        .logo-we { color: #FF6600; text-shadow: 0 0 20px #FF6600; }
        .logo-your { color: #FFFFFF; }
        .logo-feed { color: #FF6600; text-shadow: 0 0 20px #FF6600; }
        .glass { background: rgba(19, 19, 19, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 102, 0, 0.2); }
        .success-box { background: rgba(34, 197, 94, 0.1); border: 2px solid #22C55E; border-radius: 12px; padding: 40px; text-align: center; margin: 20px 0; }
        .spinner { width: 50px; height: 50px; border: 3px solid rgba(255, 102, 0, 0.2); border-top-color: #FF6600; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .info-section { background: rgba(26, 26, 26, 0.8); border: 1px solid rgba(255, 102, 0, 0.3); border-radius: 8px; padding: 20px; margin: 15px 0; }
        .info-label { color: #FF6600; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .info-value { color: #FFFFFF; font-size: 16px; word-break: break-all; }
        .button { background: linear-gradient(135deg, #FF6600 0%, #FF8800 100%); color: #000; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 16px; transition: all 0.3s ease; text-decoration: none; display: inline-block; margin: 10px; }
        .button:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(255, 102, 0, 0.4); }
        .notification { padding: 15px 20px; border-radius: 8px; margin: 15px 0; font-weight: 600; }
        .notification.error { background: rgba(239, 68, 68, 0.2); border: 1px solid #EF4444; color: #FCA5A5; }
        .notification.success { background: rgba(34, 197, 94, 0.2); border: 1px solid #22C55E; color: #86EFAC; }
    </style>
</head>
<body>
    <nav class="glass sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" style="text-decoration: none;">
                <span class="logo-text">
                    <span class="logo-we">WE</span><span class="logo-your">YOUR</span><span class="logo-feed">FEED</span>
                </span>
            </a>
            <span style="color: #22C55E; font-weight: bold;">✅ Pago Exitoso</span>
        </div>
    </nav>

    <div class="max-w-4xl mx-auto px-6 py-8">
        <div class="success-box">
            <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
            <h1 style="font-size: 32px; font-weight: bold; color: #22C55E; margin-bottom: 10px;">¡Pago Exitoso!</h1>
            <p style="color: #888; font-size: 16px;">Tu pedido ha sido confirmado. Estamos organizando tu envío.</p>
        </div>

        <div id="loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div class="spinner"></div>
            <p style="color: #888; margin-top: 20px;">Procesando tu orden...</p>
        </div>

        <div id="orderContent" style="display: none;">
            <div id="notifications"></div>

            <div class="info-section">
                <div class="info-label">📌 Número de Referencia</div>
                <div class="info-value" id="orderReference" style="font-size: 18px; color: #FF6600; font-family: monospace;">--</div>
                <p style="color: #888; font-size: 12px; margin-top: 10px;">Guarda este número para seguimiento</p>
            </div>

            <div class="info-section">
                <div class="info-label">🛒 Resumen del Pedido</div>
                <div id="orderItems" style="margin-top: 15px;"></div>
                <div style="border-top: 1px solid rgba(255, 102, 0, 0.3); margin-top: 15px; padding-top: 15px;">
                    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                        <span>Total:</span>
                        <span id="orderTotal" style="color: #FF6600;">$0</span>
                    </div>
                </div>
            </div>

            <div class="info-section">
                <div class="info-label">👤 Datos del Cliente</div>
                <div style="margin-top: 15px;">
                    <div style="margin-bottom: 10px;">
                        <span style="color: #888;">Nombre:</span>
                        <span id="customerName" style="color: #FFF; margin-left: 10px;">--</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="color: #888;">Email:</span>
                        <span id="customerEmail" style="color: #FFF; margin-left: 10px;">--</span>
                    </div>
                </div>
            </div>

            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
                <div style="color: #3B82F6; font-weight: bold; margin-bottom: 10px;">📧 Próximo Paso</div>
                <p style="color: #888;">Estamos organizando tu envío lo antes posible. Recibirás actualizaciones sobre tu pedido en los próximos días.</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="/" class="button">← Volver al Catálogo</a>
            </div>
        </div>
    </div>

    <script>
        const reference = new URLSearchParams(window.location.search).get('reference');

        async function loadOrder() {
            try {
                if (!reference) {
                    showNotification('❌ Número de referencia no encontrado', 'error');
                    document.getElementById('loading').style.display = 'none';
                    return;
                }

                // Obtener orden desde sessionStorage (backup si Firestore falla)
                const sessionOrder = {
                    reference: reference,
                    items: JSON.parse(sessionStorage.getItem('orderCart') || '[]'),
                    customer: JSON.parse(sessionStorage.getItem('orderCustomer') || '{}'),
                    shipping: JSON.parse(sessionStorage.getItem('orderShipping') || '{}'),
                    amount: parseInt(sessionStorage.getItem('orderAmount') || '0')
                };

                displayOrder(sessionOrder);
                showNotification('✅ Pago confirmado exitosamente', 'success');

                document.getElementById('loading').style.display = 'none';
                document.getElementById('orderContent').style.display = 'block';

            } catch (error) {
                console.error('Error:', error);
                showNotification(\`❌ Error: \${error.message}\`, 'error');
                document.getElementById('loading').style.display = 'none';
            }
        }

        function displayOrder(order) {
            if (!order) return;

            document.getElementById('orderReference').textContent = order.reference || '--';

            const itemsDiv = document.getElementById('orderItems');
            if (order.items && Array.isArray(order.items)) {
                itemsDiv.innerHTML = order.items.map(item => \`
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,102,0,0.2);">
                        <div>
                            <div style="color: #FFF; font-weight: bold;">\${item.nombre || ''}</div>
                            <div style="color: #888; font-size: 12px;">Cantidad: \${item.cantidad || 1}</div>
                        </div>
                        <div style="color: #FF6600; font-weight: bold;">$\${(item.precio || 0).toLocaleString('es-ES')}</div>
                    </div>
                \`).join('');
            }

            document.getElementById('orderTotal').textContent = '$' + (order.amount || 0).toLocaleString('es-ES');

            if (order.customer) {
                document.getElementById('customerName').textContent = order.customer.name || '--';
                document.getElementById('customerEmail').textContent = order.customer.email || '--';
            }
        }

        function showNotification(message, type) {
            const notif = document.createElement('div');
            notif.className = \`notification \${type}\`;
            notif.textContent = message;
            document.getElementById('notifications').appendChild(notif);
            setTimeout(() => notif.remove(), 5000);
        }

        loadOrder();
    </script>
</body>
</html>`;

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(HTML_CONTENT);
}
