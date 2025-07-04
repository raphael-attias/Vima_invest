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
  
  console.log('Script chargé');
  console.log('Formulaire trouvé:', form ? 'OUI' : 'NON');
  console.log('Message status trouvé:', messageStatus ? 'OUI' : 'NON');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Empêcher la soumission normale
      
      console.log('Formulaire soumis');
      
      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');
      
      // Debug - afficher les données envoyées
      console.log('Données du formulaire:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      // Désactiver le bouton et changer le texte
      submitButton.disabled = true;
      submitButton.textContent = 'Envoi en cours...';
      
      console.log('Envoi vers contact.php...');
      
      // Envoyer les données via AJAX
      fetch('contact.php', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log('Réponse reçue:', response.status, response.statusText);
        console.log('Content-Type:', response.headers.get('Content-Type'));
        return response.text(); // Utiliser text() d'abord pour debug
      })
      .then(data => {
        console.log('Données brutes reçues:', data);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('Données JSON parsées:', jsonData);
          
          if (jsonData.success) {
            showMessage(jsonData.success, 'success');
            form.reset(); // Vider le formulaire
          } else {
            showMessage(jsonData.error || 'Une erreur est survenue', 'error');
          }
        } catch (e) {
          console.error('Erreur parsing JSON:', e);
          console.log('Réponse reçue (non-JSON):', data);
          
          // Afficher la réponse brute pour debug
          showMessage('Erreur de format de réponse. Vérifiez la console.', 'error');
        }
      })
      .catch(error => {
        console.error('Erreur fetch:', error);
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
    if (messageStatus) {
      messageStatus.textContent = message;
      messageStatus.className = `message-status ${type}`;
      messageStatus.style.display = 'block';
      
      // Faire disparaître le message après 5 secondes
      setTimeout(() => {
        messageStatus.style.display = 'none';
      }, 5000);
    } else {
      console.error('messageStatus element not found');
    }
  }
});