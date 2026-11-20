
// El formulario
const form = document.getElementById('solicitudForm');

if (form) {
  const disp = document.getElementById('dispositivo');
  const serv = document.getElementById('servicio');
  const otroBox = document.getElementById('otro-field');
  const otroInput = document.getElementById('otro-text');

  function checkOtro() {
    const need = disp.value === 'otro' || serv.value === 'otro';

    otroBox.classList.toggle('active', need);

    if (need) {
      otroInput.required = true;
    } else {
      otroInput.required = false;
    }
  }

  disp.addEventListener('change', checkOtro);
  serv.addEventListener('change', checkOtro);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let ok = true;

    form.querySelectorAll('[required]').forEach(inp => {
      if (!inp.value.trim()) {
        inp.classList.add('input-error');
        ok = false;
      } else {
        inp.classList.remove('input-error');
      }
    });

    const status = document.getElementById('status');

    if (!ok) {
      status.style.color = 'red';
      status.textContent = '✕ Completa todos los campos';
      return;
    }

    // 👇 PON AQUÍ EL CORREO DONDE QUIERES RECIBIR LAS SOLICITUDES
    const correoDestino = 'hanny353536@gmailcom';

    status.style.color = '#555';
    status.textContent = 'Enviando solicitud...';

    const datos = {
      nombre: document.getElementById('nombre').value,
      plan: document.getElementById('plan').value,
      servicio: document.getElementById('servicio').value,
      dispositivo: document.getElementById('dispositivo').value,
      fecha: document.getElementById('fecha').value,
      celular: document.getElementById('celular').value,
      otro: document.getElementById('otro-text').value
    };

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(correoDestino)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ...datos,
            _subject: 'Nueva solicitud - TECNORESCATE',
            _template: 'table'
          })
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        status.style.color = 'green';
        status.textContent =
          '✓ Solicitud enviada correctamente. Revisa tu correo.';

        form.reset();
        otroBox.classList.remove('active');

      } else {
        throw new Error('No se pudo enviar la solicitud');
      }

    } catch (error) {
      console.error(error);

      status.style.color = 'red';
      status.textContent =
        '✕ No se pudo enviar la solicitud. Intenta nuevamente.';
    }
  });
}
