.contact-extra {
display: inline-flex;
align-items: center;
justify-content: center;
gap: 0.55rem;
}

.contact-extra svg {
width: 18px;
height: 18px;
flex: 0 0 auto;
}

.contact-whatsapp {
background: #25d366 !important;
border-color: #25d366 !important;
color: #ffffff !important;
}

.contact-whatsapp:hover {
background: #1ebe5d !important;
border-color: #1ebe5d !important;
transform: translateY(-1px);
}

.contact-phone {
background: #ffffff !important;
color: #0f172a !important;
border-color: rgba(15, 23, 42, 0.16) !important;
}

.contact-phone:hover {
background: #f8fafc !important;
transform: translateY(-1px);
}

[data-theme="dark"] .contact-phone {
background: rgba(255, 255, 255, 0.08) !important;
color: #ffffff !important;
border-color: rgba(255, 255, 255, 0.16) !important;
}

@media (max-width: 700px) {
.contact-extra {
width: 100%;
}
}
