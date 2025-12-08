document.addEventListener('DOMContentLoaded', function() {

    // 1. SCORRIMENTO FOTO (Carousel Infinito)
    // ---------------------------------------
    function startCarousel(selector, speed) {
        const container = document.querySelector(selector);
        if (!container) return;

        const slides = container.querySelectorAll('.slide-box');
        
        // Duplichiamo le slide per riempire lo spazio ed evitare "buchi"
        slides.forEach(slide => {
            let clone = slide.cloneNode(true);
            container.appendChild(clone);
        });

        let scrollPos = 0;
        // Punto di reset: metà della larghezza totale
        let resetWidth = container.scrollWidth / 2;

        function animate() {
            scrollPos += speed;
            // Se siamo arrivati a metà (alla fine delle slide originali), resettiamo a 0
            if (scrollPos >= resetWidth) {
                scrollPos = 0;
            }
            container.scrollLeft = scrollPos;
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Avvia lo scorrimento delle FOTO
    startCarousel('.carousel-foto', 1); // Velocità 1 (puoi aumentarla)


    // 2. VIDEO WALL (Autoplay Intelligente)
    // -------------------------------------
    const videos = document.querySelectorAll('video');
    
    // Questo "osservatore" controlla se il video è visibile sullo schermo
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play(); // Se visibile, PLAY
            } else {
                entry.target.pause(); // Se esce dallo schermo, PAUSA
            }
        });
    }, { threshold: 0.25 }); // Basta che il 25% del video sia visibile

    videos.forEach(video => {
        observer.observe(video);
        
        // Cliccando sul video, attivi/disattivi l'audio
        video.parentElement.addEventListener('click', () => {
            video.muted = !video.muted;
        });
    });


    // 3. MENU MOBILE COMPLETO
    // ------------------------
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

        // Chiudi il menu quando clicchi fuori
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

    // 5. CAROUSEL EVENTI CON SCROLL AUTOMATICO
    // -----------------------------------------
    const eventGrid = document.querySelector('.event-grid');
    if (eventGrid) {
        let autoScrollInterval;
        let userInteracting = false;
        let lastScrollTime = Date.now();
        const autoScrollDelay = 7000; // 7 secondi
        const scrollSpeed = 1; // Velocità di scroll

        function startAutoScroll() {
            if (userInteracting) return;
            
            autoScrollInterval = setInterval(() => {
                if (!userInteracting && Date.now() - lastScrollTime >= autoScrollDelay) {
                    const maxScroll = eventGrid.scrollWidth - eventGrid.clientWidth;
                    const currentScroll = eventGrid.scrollLeft;
                    
                    if (currentScroll >= maxScroll - 10) {
                        // Se siamo alla fine, torna all'inizio
                        eventGrid.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        // Scrolla avanti
                        eventGrid.scrollBy({ left: scrollSpeed, behavior: 'auto' });
                    }
                }
            }, 16); // ~60fps
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        function resetAutoScroll() {
            userInteracting = true;
            lastScrollTime = Date.now();
            stopAutoScroll();
            
            // Dopo 7 secondi di inattività, riprendi lo scroll automatico
            setTimeout(() => {
                userInteracting = false;
                startAutoScroll();
            }, autoScrollDelay);
        }

        // Rileva interazione utente
        eventGrid.addEventListener('scroll', resetAutoScroll);
        eventGrid.addEventListener('touchstart', resetAutoScroll);
        eventGrid.addEventListener('mousedown', resetAutoScroll);
        eventGrid.addEventListener('wheel', resetAutoScroll);

        // Avvia lo scroll automatico dopo 7 secondi
        setTimeout(() => {
            startAutoScroll();
        }, autoScrollDelay);
    }

});
// 6. EFFETTO OPACITÀ IMMAGINE HERO ALLO SCROLL
// ---------------------------------------------
window.addEventListener('scroll', function () {
  const heroSection = document.querySelector('#hero');
  const heroBg = document.querySelector('.hero-bg');
  const heroHeight = heroSection.offsetHeight;

  if (window.scrollY > heroHeight) {
    heroBg.style.opacity = '0';
  } else {
    heroBg.style.opacity = '1';
  }
});
