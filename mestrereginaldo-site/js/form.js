// Form submission handler
document.getElementById('consultationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitButton = this.querySelector('.submit-button');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual backend integration)
    setTimeout(() => {
        // Format data for WhatsApp message
        const whatsappMessage = formatWhatsAppMessage(data);
        
        // Send to WhatsApp
        const phoneNumber = '55[SEUNUMERO]'; // Replace with your WhatsApp number
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        this.reset();
        
        // Show success message
        showNotification('Solicitação enviada com sucesso! Redirecionando para WhatsApp...', 'success');
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
    }, 2000);
});

// Form validation function
function validateForm(data) {
    // Name validation
    if (data.nome.trim().length < 3) {
        showNotification('Por favor, insira seu nome completo.', 'error');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!phoneRegex.test(data.telefone)) {
        showNotification('Por favor, insira um telefone válido.', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        return false;
    }
    
    // Service selection
    if (!data.servico) {
        showNotification('Por favor, selecione um tipo de serviço.', 'error');
        return false;
    }
    
    // Date validation
    const selectedDate = new Date(data.data);
    const today = new Date();
    const minDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (selectedDate < minDate) {
        showNotification('A data deve ser pelo menos amanhã.', 'error');
        return false;
    }
    
    return true;
}

// Format WhatsApp message
function formatWhatsAppMessage(data) {
    return `🌟 *NOVA SOLICITAÇÃO DE CONSULTA* 🌟
    
👤 *Nome:* ${data.nome}
📱 *Telefone:* ${data.telefone}
📧 *Email:* ${data.email}
🔮 *Serviço:* ${getServiceName(data.servico)}
📅 *Data:* ${formatDate(data.data)}
⏰ *Horário:* ${getTimeLabel(data.horario)}
💬 *Mensagem:* ${data.mensagem || 'Nenhuma mensagem adicional'}

Obrigado pelo contato! Responderei em breve. 🙏`;
}

// Get service name
function getServiceName(servico) {
    const services = {
        'consulta': 'Consulta Espiritual',
        'limpeza': 'Limpeza Energética',
        'trabalho': 'Trabalho de Candomblé',
        'orientacao': 'Orientação de Caminhos',
        'abertura': 'Abertura de Caminhos',
        'harmonizacao': 'Harmonização de Relacionamentos'
    };
    return services[servico] || servico;
}

// Get time label
function getTimeLabel(horario) {
    const times = {
        'manha': 'Manhã (9h - 12h)',
        'tarde': 'Tarde (14h - 17h)',
        'noite': 'Noite (18h - 20h)'
    };
    return times[horario] || horario;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Auto-save form data to localStorage
const form = document.getElementById('consultationForm');
if (form) {
    // Load saved data
    const savedData = localStorage.getItem('consultationForm');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
    
    // Save data on input change
    form.addEventListener('input', function() {
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        localStorage.setItem('consultationForm', JSON.stringify(data));
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem('consultationForm');
    });
}

// Add input mask for phone
const phoneInput = document.getElementById('telefone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            if (value.length <= 10) {
                formattedValue = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else {
                formattedValue = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = formattedValue;
    });
}

// Add loading states
function setLoadingState(button, loading = true) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Validate email in real-time
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value)) {
            this.style.borderColor = '#dc3545';
            showNotification('Por favor, insira um email válido.', 'warning');
        } else {
            this.style.borderColor = '#28a745';
        }
    });
}