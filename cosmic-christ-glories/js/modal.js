document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const bookButtons = document.querySelectorAll('.book-ticket');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalSubmitText = submitBtn.textContent;
    
    // Store event data from the clicked card
    let currentEvent = null;
    
    // Open modal when book button is clicked
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Get event data from the card (assuming data attributes)
            const card = e.target.closest('.event-card');
            currentEvent = {
                id: card.dataset.eventId,
                title: card.querySelector('.event-title').textContent,
                date: card.querySelector('.event-date').textContent.replace('Date: ', ''),
                time: card.querySelector('.event-time').textContent.replace('Time: ', '')
            };
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${getScrollbarWidth()}px`;
        });
    });
    
    // Close modal when X is clicked
    closeModal.addEventListener('click', () => {
        closeModalHandler();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalHandler();
        }
    });
    
    // Form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);
        
        // Calculate total tickets (1 for self + invited guests)
        const totalTickets = 1 + parseInt(data.guests);
        
        // Prepare payload for API
        const payload = {
            eventId: currentEvent.id,
            eventTitle: currentEvent.title,
            eventDate: currentEvent.date,
            eventTime: currentEvent.time,
            attendee: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                location: data.location
            },
            totalTickets: totalTickets,
            bookingDate: new Date().toISOString()
        };
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        try {
            // Send data to backend API
            const response = await fetch('https://api.cosmicchrist.org/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY' // If needed
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Show success message
            showModalMessage(
                'Booking Confirmed!',
                `Your booking for ${totalTickets} ticket(s) to "${currentEvent.title}" has been confirmed. 
                A confirmation has been sent to ${data.email}.`,
                'success'
            );
            
            // Reset form
            bookingForm.reset();
            document.getElementById('booking-guests').value = 1;
            
            // Close modal after delay
            setTimeout(closeModalHandler, 3000);
            
        } catch (error) {
            console.error('Booking error:', error);
            showModalMessage(
                'Booking Failed',
                'There was an error processing your booking. Please try again or contact support.',
                'error'
            );
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalSubmitText;
        }
    });
    
    // Helper function to show status messages
    function showModalMessage(title, message, type) {
        const modalContent = document.querySelector('.modal-container');
        const originalContent = modalContent.innerHTML;
        
        // Create message HTML
        modalContent.innerHTML = `
            <div class="modal-message ${type}">
                <h2>${title}</h2>
                <p>${message}</p>
                <button class="btn btn-primary" id="message-ok-btn">OK</button>
            </div>
        `;
        
        // Add event listener to OK button
        document.getElementById('message-ok-btn').addEventListener('click', () => {
            modalContent.innerHTML = originalContent;
            setupModalEvents(); // Reattach event listeners
        });
    }
    
    // Helper function to reattach event listeners after message display
    function setupModalEvents() {
        // Reattach all modal event listeners here
        // (Same as original setup code)
    }
    
    // Helper function to close modal
    function closeModalHandler() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        currentEvent = null;
    }
    
    // Helper function to get scrollbar width
    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }
});