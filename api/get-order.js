// api/get-order.js
// Endpoint para obtener una orden desde Firestore

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ error: 'Referencia requerida' });
    }

    const projectId = 'weyourfeed';
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/ordenes/${reference}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 404) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error obteniendo orden' });
    }

    const result = await response.json();

    // Convertir formato REST API de Firestore a JSON normal
    const order = convertFirestoreDoc(result);

    return res.status(200).json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Función para convertir documento de Firestore REST API a objeto normal
function convertFirestoreDoc(doc) {
  if (!doc.fields) return doc;

  const convert = (value) => {
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue);
    if (value.doubleValue !== undefined) return value.doubleValue;
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.timestampValue !== undefined) return new Date(value.timestampValue);
    if (value.mapValue) {
      const map = {};
      for (const key in value.mapValue.fields) {
        map[key] = convert(value.mapValue.fields[key]);
      }
      return map;
    }
    if (value.arrayValue) {
      return value.arrayValue.values.map(convert);
    }
    return value;
  };

  const obj = {};
  for (const key in doc.fields) {
    obj[key] = convert(doc.fields[key]);
  }

  return {
    id: doc.name.split('/').pop(),
    ...obj
  };
}
