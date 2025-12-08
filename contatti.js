document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.getElementById('main-header');

    // Funzione per aggiornare lo stato del menu (accessibile globalmente)
    const updateMenuState = (isActive) => {
        if (!menuBtn || !nav) return;
        const icon = menuBtn.querySelector('i');
        if (isActive) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            if (header) header.classList.add('menu-open');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            if (header) header.classList.remove('menu-open');
        }
    };

    // Funzione per chiudere il menu
    const closeMenu = () => {
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            updateMenuState(false);
        }
    };

    if(menuBtn && nav) {
        // Toggle del menu al click sull'hamburger
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Previene che il click si propaghi al document
            nav.classList.toggle('active');
            updateMenuState(nav.classList.contains('active'));
        });

        // Chiudi il menu quando clicchi su un link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    updateMenuState(false);
                }
            });
        });

        // NUOVO: Chiudi il menu quando clicchi fuori
        document.addEventListener('click', (e) => {
            // Controlla se il menu è aperto e se il click NON è sul menu o sull'hamburger
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !menuBtn.contains(e.target)) {
                
                closeMenu();
            }
        });

        // Previeni che i click sul menu stesso lo chiudano
        nav.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 4. GESTIONE HEADER CON SCROLL
    // -----------------------------
    const headerScroll = document.getElementById('main-header');
    let lastScrollTop = 0;
    const scrollThreshold = 100; // Soglia per considerare lo scroll (aumentata per mantenere trasparenza più a lungo)

    if (headerScroll) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Se stai scrollando in basso e il menu è aperto, chiudilo automaticamente
            if (scrollTop > lastScrollTop && scrollTop > 50 && nav && nav.classList.contains('active')) {
                closeMenu();
            }

            // Se siamo in alto (appena entrati o poco scrollati), header completamente trasparente
            if (scrollTop < scrollThreshold) {
                headerScroll.classList.remove('scrolled', 'hidden', 'visible');
            } else {
                // Quando scrolli abbastanza in basso, aggiungi sfondo opaco
                headerScroll.classList.add('scrolled');

                // Gestione nascondi/mostra in base alla direzione
                if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                    // Scrolling down - nascondi header
                    headerScroll.classList.add('hidden');
                    headerScroll.classList.remove('visible');
                } else {
                    // Scrolling up - mostra header
                    headerScroll.classList.remove('hidden');
                    headerScroll.classList.add('visible');
                }
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Per evitare valori negativi
        });
    }
});


const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx6ea0zKuBymZ4iuTcNwjSTbI6i0orsylUzi5xhTOlYYrdErvrSa_-H7hVFdZ1xiKFn/exec';


function showToast(message, type = 'ok') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = 'toast';
  }, 3000); // 3 secondi
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      showToast('Richiesta inviata correttamente!', 'ok');
      form.reset();
    } catch (err) {
      console.error(err);
      showToast('Errore durante l\'invio. Riprova più tardi.', 'error');
    }
  });
});

