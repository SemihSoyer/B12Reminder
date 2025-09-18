// Doğum günü hatırlatıcı veri yapısı

export const BirthdayDataStructure = {
  id: '', // Unique identifier
  name: '', // İsim soyisim
  birthDate: '', // YYYY-MM-DD formatında
  photo: null, // Fotoğraf URI veya null
  reminderDays: [1, 3, 7], // Kaç gün önceden hatırlat (default: 1, 3, 7 gün)
  customNote: '', // Kullanıcının özel notu
  notificationMessage: '', // Özel bildirim mesajı
  useTemplateMessage: true, // Şablon mesaj kullan mı?
  isActive: true, // Hatırlatıcı aktif mi?
  createdAt: '', // Oluşturulma tarihi
  updatedAt: '', // Son güncelleme tarihi
  
  // Hesaplanan alanlar (runtime'da eklenir)
  age: 0, // Yaş
  daysUntil: 0, // Kaç gün kaldı
  nextBirthday: '' // Bir sonraki doğum günü tarihi
};

// Varsayılan bildirim mesaj şablonları
export const NotificationTemplates = [
  {
    id: 'template1',
    title: 'Klasik Hatırlatma',
    message: '{name} adlı kişinin doğum günü {days} gün sonra! 🎂'
  },
  {
    id: 'template2', 
    title: 'Samimi Hatırlatma',
    message: '{name}\'in doğum günü yaklaşıyor! Hediye almayı unutma 🎁'
  },
  {
    id: 'template3',
    title: 'Kısa Hatırlatma', 
    message: '{name} - {days} gün kaldı 🎉'
  },
  {
    id: 'template4',
    title: 'Detaylı Hatırlatma',
    message: 'Sevgili {name}\'in {age}. yaş doğum günü {days} gün sonra! Kutlamaya hazır ol! 🥳'
  }
];

// Varsayılan hatırlatma gün seçenekleri
export const ReminderDayOptions = [
  { value: 1, label: '1 gün önce', icon: '📅' },
  { value: 3, label: '3 gün önce', icon: '📆' },
  { value: 7, label: '1 hafta önce', icon: '🗓️' },
  { value: 14, label: '2 hafta önce', icon: '📋' },
  { value: 30, label: '1 ay önce', icon: '📊' }
];

// Form adımları
export const FormSteps = {
  CALENDAR: 'calendar',
  REMINDER_DAYS: 'reminder_days', 
  NOTIFICATION: 'notification',
  PERSONAL_INFO: 'personal_info',
  REVIEW: 'review'
};

// Form validasyon kuralları
export const ValidationRules = {
  name: {
    required: true,
    minLength: 0,
    maxLength: 50,
    message: 'İsim boş olamaz, en fazla 50 karakter olabilir'
  },
  birthDate: {
    required: true,
    message: 'Doğum tarihi seçilmelidir'
  },
  reminderDays: {
    required: true,
    minItems: 1,
    message: 'En az bir hatırlatma günü seçilmelidir'
  },
  customNote: {
    maxLength: 200,
    message: 'Not en fazla 200 karakter olabilir'
  },
  notificationMessage: {
    maxLength: 100,
    message: 'Bildirim mesajı en fazla 100 karakter olabilir'
  }
};
