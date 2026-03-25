// Traductions multilingues pour les formulaires
export const translations = {
  fr: {
    form_title: "Formulaire de contact",
    form_subtitle: "Remplissez ce formulaire pour être contacté par votre conseiller financier",
    nom_complet: "Nom complet",
    nom_complet_placeholder: "Entrez votre nom complet",
    email: "Adresse courriel",
    email_placeholder: "votre@email.com",
    telephone: "Numéro de téléphone",
    telephone_placeholder: "(514) 555-1234",
    besoins: "Quels sont vos besoins?",
    besoins_subtitle: "Sélectionnez tout ce qui s'applique",
    details: "Détails supplémentaires (optionnel)",
    details_placeholder: "Décrivez vos besoins en détail...",
    submit: "Envoyer ma demande",
    success_title: "Merci!",
    success_message: "Votre demande a été envoyée avec succès. Votre conseiller vous contactera bientôt.",
    error_message: "Une erreur est survenue. Veuillez réessayer.",
    required: "Ce champ est requis",
    devenir_conseiller: "Je souhaite devenir conseiller(ère) en finance personnelle",
    devenir_conseiller_description: "Cochez cette case si vous êtes intéressé par une carrière de conseiller financier",
    besoins_options: {
      analyse_financiere: "Besoin d'une analyse financière",
      epargne: "Besoin de savoir comment épargner",
      assurance_vie: "Besoin d'assurance vie",
      liberte_financiere: "Besoin d'une méthode pour trouver la liberté financière",
      ree_enfants: "Besoin d'un compte REE pour mes enfants",
      retour_impot: "Veux maximiser mon retour d'impôt",
      autre: "Autre"
    }
  },
  en: {
    form_title: "Contact Form",
    form_subtitle: "Fill out this form to be contacted by your financial advisor",
    nom_complet: "Full Name",
    nom_complet_placeholder: "Enter your full name",
    email: "Email Address",
    email_placeholder: "your@email.com",
    telephone: "Phone Number",
    telephone_placeholder: "(514) 555-1234",
    besoins: "What are your needs?",
    besoins_subtitle: "Select all that apply",
    details: "Additional details (optional)",
    details_placeholder: "Describe your needs in detail...",
    submit: "Submit my request",
    success_title: "Thank you!",
    success_message: "Your request has been sent successfully. Your advisor will contact you soon.",
    error_message: "An error occurred. Please try again.",
    required: "This field is required",
    devenir_conseiller: "I want to become a personal finance advisor",
    devenir_conseiller_description: "Check this box if you are interested in a career as a financial advisor",
    besoins_options: {
      analyse_financiere: "Need a financial analysis",
      epargne: "Need to know how to save",
      assurance_vie: "Need life insurance",
      liberte_financiere: "Need a method to achieve financial freedom",
      ree_enfants: "Need an RESP account for my children",
      retour_impot: "Want to maximize my tax return",
      autre: "Other"
    }
  },
  es: {
    form_title: "Formulario de contacto",
    form_subtitle: "Complete este formulario para ser contactado por su asesor financiero",
    nom_complet: "Nombre completo",
    nom_complet_placeholder: "Ingrese su nombre completo",
    email: "Correo electrónico",
    email_placeholder: "su@email.com",
    telephone: "Número de teléfono",
    telephone_placeholder: "(514) 555-1234",
    besoins: "¿Cuáles son sus necesidades?",
    besoins_subtitle: "Seleccione todo lo que aplique",
    details: "Detalles adicionales (opcional)",
    details_placeholder: "Describa sus necesidades en detalle...",
    submit: "Enviar mi solicitud",
    success_title: "¡Gracias!",
    success_message: "Su solicitud ha sido enviada con éxito. Su asesor se pondrá en contacto pronto.",
    error_message: "Ocurrió un error. Por favor intente de nuevo.",
    required: "Este campo es requerido",
    devenir_conseiller: "Quiero convertirme en asesor de finanzas personales",
    devenir_conseiller_description: "Marque esta casilla si está interesado en una carrera como asesor financiero",
    besoins_options: {
      analyse_financiere: "Necesito un análisis financiero",
      epargne: "Necesito saber cómo ahorrar",
      assurance_vie: "Necesito seguro de vida",
      liberte_financiere: "Necesito un método para lograr la libertad financiera",
      ree_enfants: "Necesito una cuenta RESP para mis hijos",
      retour_impot: "Quiero maximizar mi devolución de impuestos",
      autre: "Otro"
    }
  },
  ht: {
    form_title: "Fòm kontak",
    form_subtitle: "Ranpli fòm sa a pou konseye finansye w la kontakte w",
    nom_complet: "Non konplè",
    nom_complet_placeholder: "Antre non konplè w",
    email: "Adrès imèl",
    email_placeholder: "ou@email.com",
    telephone: "Nimewo telefòn",
    telephone_placeholder: "(514) 555-1234",
    besoins: "Ki sa w bezwen?",
    besoins_subtitle: "Chwazi tout sa ki aplike",
    details: "Detay siplemantè (opsyonèl)",
    details_placeholder: "Dekri bezwen w yo an detay...",
    submit: "Voye demann mwen",
    success_title: "Mèsi!",
    success_message: "Demann ou an voye avèk siksè. Konseye w la ap kontakte w byento.",
    error_message: "Yon erè rive. Tanpri eseye ankò.",
    required: "Chan sa a obligatwa",
    devenir_conseiller: "Mwen vle vin yon konseye finans pèsonèl",
    devenir_conseiller_description: "Tcheke bwat sa a si w enterese nan yon karyè kòm konseye finansye",
    besoins_options: {
      analyse_financiere: "Bezwen yon analiz finansye",
      epargne: "Bezwen konnen kijan pou m ekonomize",
      assurance_vie: "Bezwen asirans vi",
      liberte_financiere: "Bezwen yon metòd pou jwenn libète finansye",
      ree_enfants: "Bezwen yon kont REE pou timoun mwen yo",
      retour_impot: "Vle maksimize ranbousman taks mwen",
      autre: "Lòt"
    }
  }
};

export const getTranslation = (lang) => {
  return translations[lang] || translations.fr;
};

export const languageNames = {
  fr: "Français",
  en: "English",
  es: "Español",
  ht: "Kreyòl Ayisyen"
};
