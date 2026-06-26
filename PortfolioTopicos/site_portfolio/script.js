document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.topic-cards li');
    const summaryBox = document.getElementById('summaryBox');
    const summaryTitle = document.getElementById('summaryTitle');
    const summaryText = document.getElementById('summaryText');
    const path = document.getElementById('transitionPath');
    const svg = document.getElementById('transitionSvg');

    // Smooth scroll function
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const color = card.getAttribute('data-color');

            // Update Summary Text
            summaryTitle.textContent = title;
            summaryTitle.style.color = color;
            summaryText.textContent = desc;
            
            // Add active class for animation
            summaryBox.classList.add('active');

            // Set SVG stroke color
            path.style.stroke = color;
            path.style.filter = `drop-shadow(0 0 8px ${color})`;

            // Draw line connecting card to summary
            drawLine(card, summaryBox);
        });

        card.addEventListener('mouseleave', () => {
            // Remove the draw class so it animates backwards
            path.classList.remove('draw');
            summaryBox.classList.remove('active');
        });
    });

    function drawLine(card, targetBox) {
        // Find center of hovered card (actually we target the last span to get the elevated position)
        const lastSpan = card.querySelector('span:last-of-type');
        const cardRect = lastSpan.getBoundingClientRect();
        const boxRect = targetBox.getBoundingClientRect();
        
        // Offset scroll just in case, though hero is usually at top
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Start point: Center of the elevated card span
        const startX = cardRect.left + (cardRect.width / 2) + scrollX;
        const startY = cardRect.top + (cardRect.height / 2) + scrollY;

        // End point: Left edge center of the summary box
        const endX = boxRect.left + scrollX;
        const endY = boxRect.top + (boxRect.height / 2) + scrollY;

        // Ensure SVG covers the whole document
        svg.style.width = document.documentElement.scrollWidth + 'px';
        svg.style.height = document.documentElement.scrollHeight + 'px';

        // Create an elegant curved path
        // M = Move to (start)
        // Q = Quadratic Bezier curve (controlPointX, controlPointY, endX, endY)
        const controlX = startX + (endX - startX) / 2;
        const controlY = Math.min(startY, endY) - 50; // Curve dips up slightly

        const d = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
        
        // Reset animation
        path.classList.remove('draw');
        path.setAttribute('d', d);

        // Force reflow
        void path.offsetWidth;

        // Start animation
        path.classList.add('draw');
    }
    
    // Recalculate if window resizes while hovered
    window.addEventListener('resize', () => {
        path.classList.remove('draw');
    });
});
