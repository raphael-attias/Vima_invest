// Fonction pour le menu burger
function toggleMenu() {
  const nav = document.getElementById('mainNav');
  const burger = document.querySelector('.burger');
  const isOpen = nav.classList.toggle('open');
  burger.classList.toggle('open');
  
  // Bloquer le scroll de fond
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Fermer le menu après clic sur un lien
document.querySelectorAll('#mainNav a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) toggleMenu();
  });
});

// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const messageStatus = document.getElementById('messageStatus');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Empêcher la soumission normale
      
      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');
      
      // Désactiver le bouton et changer le texte
      submitButton.disabled = true;
      submitButton.textContent = 'Envoi en cours...';
      
      // Envoyer les données via AJAX
      fetch('contact.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showMessage(data.success, 'success');
          form.reset(); // Vider le formulaire
        } else {
          showMessage(data.error || 'Une erreur est survenue', 'error');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion. Veuillez réessayer.', 'error');
      })
      .finally(() => {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.textContent = 'Envoyer';
      });
    });
  }
  
  function showMessage(message, type) {
    messageStatus.textContent = message;
    messageStatus.className = `message-status ${type}`;
    messageStatus.style.display = 'block';
    
    // Faire disparaître le message après 5 secondes
    setTimeout(() => {
      messageStatus.style.display = 'none';
    }, 5000);
  }
});
