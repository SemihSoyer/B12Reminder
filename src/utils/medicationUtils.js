const DAYS_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

// Tarihi "15 Eki 2025" formatına çevirir
const formatSpecificDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('tr-TR', { month: 'short' });
  return `${day} ${month}`;
};

export const getFrequencyText = (frequency) => {
  if (!frequency) return 'Seçilmedi';

  const { type, value } = frequency;

  if (type === 'daily') {
    return 'Her Gün';
  }

  if (type === 'interval') {
    return `Her ${value} günde bir`;
  }

  if (type === 'weekly') {
    if (!value || value.length === 0) return 'Seçilmedi';
    if (value.length === 7) return 'Her Gün';
    
    // Haftanın tüm günleri ve hafta sonu/içi kısayolları
    const weekdays = [0, 1, 2, 3, 4];
    const weekend = [5, 6];
    const isWeekdays = value.length === 5 && weekdays.every(day => value.includes(day));
    const isWeekend = value.length === 2 && weekend.every(day => value.includes(day));

    if (isWeekdays) return 'Hafta İçi Her Gün';
    if (isWeekend) return 'Hafta Sonu';

    return value.map(dayIndex => DAYS_SHORT[dayIndex]).join(', ');
  }

  if (type === 'specific_dates') {
    if (!value || value.length === 0) return 'Seçilmedi';
    if (value.length === 1) return formatSpecificDate(value[0]);
    if (value.length > 2) return `${value.length} gün seçildi`;
    return value.map(formatSpecificDate).join(' & ');
  }

  return 'Seçilmedi';
};
