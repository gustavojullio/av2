// academic-hub/public/js/main.js
// eslint-disable-next-line no-undef
const socket = io();

socket.on('newEvent', (data) => {
  // Cria o elemento Toast do Bootstrap dinamicamente
  const toastContainer = document.getElementById('toast-container');
  const toastId = 'toast-' + Date.now();
  
  const toastHTML = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto text-primary"><i class="fas fa-bell"></i> Novo Evento!</strong>
        <small>agora</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        O evento "<strong>${data.title}</strong>" foi criado por <strong>${data.organizer}</strong>.
        <div class="mt-2 pt-2 border-top">
          <a href="/events/${data.id}" class="btn btn-primary btn-sm">Ver Detalhes</a>
        </div>
      </div>
    </div>
  `;
  
  toastContainer.innerHTML += toastHTML;

  // eslint-disable-next-line no-undef
  const toastElement = new bootstrap.Toast(document.getElementById(toastId));
  toastElement.show();
});