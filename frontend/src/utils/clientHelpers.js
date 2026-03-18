// Status badge classes
export const getStatusBadgeClass = (status) => {
  const classes = {
    prospect: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    actif: 'bg-green-100 text-green-800 border-green-200',
    suivi: 'bg-sky-100 text-sky-800 border-sky-200',
    ferme: 'bg-gray-100 text-gray-600 border-gray-200'
  };
  return classes[status] || classes.prospect;
};

// Status labels in French
export const getStatusLabel = (status) => {
  const labels = {
    prospect: 'Prospect',
    actif: 'Client actif',
    suivi: 'En suivi',
    ferme: 'Dossier fermé'
  };
  return labels[status] || status;
};

// Get initials from name
export const getInitials = (prenom, nom) => {
  const p = prenom ? prenom.charAt(0).toUpperCase() : '';
  const n = nom ? nom.charAt(0).toUpperCase() : '';
  return p + n;
};

// Generate avatar color based on name
export const getAvatarColor = (name) => {
  const colors = [
    'bg-slate-600',
    'bg-sky-600',
    'bg-emerald-600',
    'bg-amber-600',
    'bg-rose-600',
    'bg-violet-600',
    'bg-cyan-600',
    'bg-orange-600'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Format date and time
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Check if date is today
export const isToday = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Check if date is in the past
export const isPast = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};
