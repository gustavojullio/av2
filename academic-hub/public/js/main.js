// Em public/js/main.js

const socket = io(); // 1. Inicia a conexão com o servidor Socket.IO

// 2. Fica "ouvindo" por qualquer mensagem que chegue com o nome 'newEvent'
socket.on('newEvent', (data) => {

  // 3. Quando a mensagem chega, pegamos o container de notificações no HTML
  const toastContainer = document.getElementById('toast-container');
  
  // 4. Criamos dinamicamente o HTML da notificação (um "Toast" do Bootstrap)
  //    usando os dados que recebemos do servidor (data.title, data.organizer, etc.)
  const toastHTML = `
    <div class="toast" ...>
      <div class="toast-header"> ... </div>
      <div class="toast-body">
        O evento "<strong>${data.title}</strong>" foi criado por <strong>${data.organizer}</strong>.
        <div class="mt-2 pt-2 border-top">
          <a href="/events/${data.id}" class="btn btn-primary btn-sm">Ver Detalhes</a>
        </div>
      </div>
    </div>
  `;
  
  // 5. Adicionamos a notificação na página e mandamos ela aparecer
  toastContainer.innerHTML += toastHTML;
  const toastElement = new bootstrap.Toast(document.getElementById(toastId));
  toastElement.show();
});