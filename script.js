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


    // 3. MENU MOBILE
    // --------------
    const menuBtn = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav-menu');

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
});