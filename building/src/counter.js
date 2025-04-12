<script src="main.js"></script>
<script>
  // Navigation functionality
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links and sections
      document.querySelectorAll('.nav-menu a').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Show corresponding section
      const sectionId = this.getAttribute('href').substring(1);
      document.getElementById(sectionId).classList.add('active');
      
      // Animate section transition
      gsap.from(`#${sectionId} .content-container`, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  });
  
  // Loading screen animation
  window.addEventListener('load', function() {
    setTimeout(() => {
      gsap.to("#loading-screen", {
        opacity: 0,
        duration: 1.5,
        onComplete: function() {
          document.getElementById('loading-screen').style.display = 'none';
          
          // Intro animations
          gsap.from(".intro-card", {
            opacity: 0,
            y: 50,
            duration: 1.5,
            ease: "power2.out"
          });
          
          // Animate tech stack items
          document.querySelectorAll('.tech-item').forEach(item => {
            gsap.from(item, {
              opacity: 0,
              y: 20,
              scale: 0.8,
              duration: 0.5,
              delay: parseInt(item.dataset.delay) / 1000,
              ease: "back.out(1.7)"
            });
          });
        }
      });
    }, 1500); // Show loader for at least 1.5 seconds
  });
</script>
</body>
</html>