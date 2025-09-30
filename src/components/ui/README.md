# Custom Alert Component

Modern, özelleştirilebilir alert komponenti. iOS'un varsayılan alert'lerinin yerini alır ve uygulamanın tasarımına uyumlu görünüm sağlar.

## Kurulum

`App.js` dosyanızda CustomAlert komponentini ekleyin:

```jsx
import CustomAlert from './src/components/ui/CustomAlert';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <CustomAlert /> {/* En alta ekleyin */}
    </SafeAreaProvider>
  );
}
```

## Kullanım

### Basit Alert

```jsx
import { showAlert } from '../../components/ui/CustomAlert';

// Tek butonlu basit alert
showAlert('Başlık', 'Mesaj içeriği');
```

### Alert Tipleri

```jsx
// Başarı mesajı (yeşil)
showAlert('Başarılı!', 'İşlem tamamlandı.', 'success');

// Hata mesajı (kırmızı)
showAlert('Hata', 'Bir sorun oluştu.', 'error');

// Uyarı mesajı (turuncu)
showAlert('Uyarı', 'Dikkat edin!', 'warning');

// Bilgi mesajı (mavi)
showAlert('Bilgi', 'Bir bilgi mesajı.', 'info');

// Varsayılan (gri)
showAlert('Bildirim', 'Varsayılan mesaj.', 'default');
```

### Çoklu Butonlar

```jsx
// İki butonlu onay dialog'u
showAlert(
  'Emin misiniz?',
  'Bu işlem geri alınamaz.',
  'warning',
  [
    {
      text: 'İptal',
      style: 'cancel',
    },
    {
      text: 'Onayla',
      style: 'destructive', // veya normal bırakın
      onPress: () => {
        console.log('Onaylandı');
      },
    },
  ]
);
```

### Silme Onayı Örneği

```jsx
const handleDelete = (item) => {
  showAlert(
    'Sil',
    `${item.name} öğesini silmek istediğinizden emin misiniz?`,
    'warning',
    [
      {
        text: 'İptal',
        style: 'cancel',
      },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteItem(item.id);
            showAlert('Başarılı', 'Öğe silindi.', 'success');
          } catch (error) {
            showAlert('Hata', 'Silme işlemi başarısız.', 'error');
          }
        },
      },
    ]
  );
};
```

## Buton Stilleri

- `'cancel'`: Gri arka plan (iptal için)
- `'destructive'`: Kırmızı gradient (silme işlemleri için)
- Belirtilmezse: Alert tipine göre renkli gradient

## Animasyonlar

- Açılış: Scale + fade-in animasyonu
- Kapanış: Smooth fade-out animasyonu
- Spring effect ile modern görünüm

## Özellikler

✅ Modern, gradient tabanlı tasarım
✅ Animasyonlu açılış/kapanış
✅ Tip bazlı renk sistemi (success, error, warning, info)
✅ Tek veya çift buton desteği
✅ Özelleştirilebilir buton stilleri
✅ iOS ve Android uyumlu
✅ Uygulama genelinde tek instance
✅ Kolay kullanım (showAlert fonksiyonu)
