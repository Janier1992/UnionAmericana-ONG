'use server';

export async function submitContact(prevState: any, formData: FormData) {
  try {
    const nombre = formData.get('nombre') as string;
    const email = formData.get('email') as string;
    const tipo = formData.get('tipo') as string;
    const pais = formData.get('pais') as string;
    const mensaje = formData.get('mensaje') as string;
    const origen = formData.get('origen') as string || 'contactos'; // Nuevo campo para diferenciar formulario

    if (!nombre || !email || !tipo) {
      return { error: 'Faltan campos obligatorios.', success: false };
    }

    const insforgeUrl = process.env.VITE_INSFORGE_URL || process.env.INSFORGE_URL;
    const insforgeKey = process.env.VITE_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY;

    if (!insforgeUrl || !insforgeKey) {
      console.error('Error de configuración: Faltan las claves de Insforge en el archivo .env.local');
      return { error: 'Error del servidor: Configuración incompleta.', success: false };
    }

    // Rutear dinámicamente según el origen (voluntarios, donaciones, contactos)
    const table = origen === 'voluntarios' ? 'voluntarios' : origen === 'donaciones' ? 'donaciones' : 'contactos';
    const base = insforgeUrl.replace(/\/$/, '');
    
    // RUTA OFICIAL DE INSFORGE: /api/database/records/{tabla}
    const endpoint = `${base}/api/database/records/${table}`;

    console.log(`🚀 Enviando datos a Insforge: ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': insforgeKey, // Necesario para la API
          'Authorization': `Bearer ${insforgeKey}`, // Necesario para la API
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nombre,
          email,
          tipo,
          pais: pais || null,
          mensaje: mensaje || null
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error en Insforge (${response.status}):`, errorText);
        
        let finalMsg = errorText;
        try {
          const parsed = JSON.parse(errorText);
          finalMsg = parsed.message || parsed.hint || errorText;
        } catch (e) {}
        
        return { error: `Error de Insforge: ${finalMsg}`, success: false };
      }

      console.log(`✅ ¡ÉXITO! Datos guardados en la tabla: ${table}`);
      return { success: true, message: '¡Gracias por unerte a La Unión Americana! Hemos guardado tus datos exitosamente.' };

    } catch (error: any) {
      console.error('Network o Server error:', error);
      return { error: `Error de red: ${error.message}`, success: false };
    }

    return { success: true, message: '¡Gracias por unerte a La Unión Americana! Hemos guardado tus datos exitosamente.' };

  } catch (error) {
    console.error('Network o Server error:', error);
    return { error: 'Ocurrió un error inesperado de red.', success: false };
  }
}
