import { l, type L } from './helpers';

export type Activity = { id: string; category: 'help' | 'environment' | 'community'; title: L; body: L };

export const ACTIVITIES: Activity[] = [
  { id: 'k-teach', category: 'help', title: l("Birine bir şey öğret", "Teach someone something"),
    body: l("Bildiğin küçük bir şeyi (bir yöntem, bir kısayol, bir tarif) bugün birine göster.", "Show someone a small thing you know today: a method, a shortcut, a recipe.") },
  { id: 'k-thanks', category: 'help', title: l("İçten bir teşekkür", "A sincere thank-you"),
    body: l("Birine, onda neyi takdir ettiğini içtenlikle söyle.", "Tell someone what you genuinely appreciate about them.") },
  { id: 'k-load', category: 'help', title: l("Bir yükü hafiflet", "Lighten a load"),
    body: l("Yakınındaki birinin bir işini üstlenmeyi ya da yardım etmeyi teklif et.", "Offer to take over or help with one task for someone close to you.") },
  { id: 'k-listen', category: 'help', title: l("Sabırla dinle", "Listen patiently"),
    body: l("Bugün birini sözünü kesmeden ve çözüm önermeden sonuna kadar dinle.", "Listen to someone to the end today without interrupting or offering solutions.") },
  { id: 'k-reuse', category: 'environment', title: l("Tek kullanımlıktan kaçın", "Skip the single-use item"),
    body: l("Bugün tek kullanımlık bir ürün yerine yeniden kullanılabilir olanı seç: bez çanta, matara.", "Choose a reusable item over a single-use one today: a cloth bag, a bottle.") },
  { id: 'k-sort', category: 'environment', title: l("Bir atığı doğru ayır", "Sort one piece of waste"),
    body: l("Bugün en az bir atığı geri dönüşüm kutusuna ayır.", "Put at least one item in the recycling today.") },
  { id: 'k-save', category: 'environment', title: l("Işığı ve suyu kıs", "Save light and water"),
    body: l("Kullanmadığın ışıkları kapat; dişlerini fırçalarken suyu kapat.", "Turn off lights you are not using, and the tap while brushing your teeth.") },
  { id: 'k-local', category: 'community', title: l("Yerel bir girişimi destekle", "Support a local initiative"),
    body: l("Mahallendeki bir kütüphaneye, gönüllü gruba ya da küçük bir işletmeye destek ol.", "Support a library, a volunteer group or a small business in your area.") },
  { id: 'k-share', category: 'community', title: l("Faydalı bir bilgi paylaş", "Share useful knowledge"),
    body: l("Doğruluğundan emin olduğun yararlı bir bilgiyi, kaynağıyla birlikte birine ilet.", "Pass on a useful piece of information you are sure about, with its source.") },
  { id: 'k-tidy', category: 'community', title: l("Ortak alanı toparla", "Tidy a shared space"),
    body: l("Ortak bir alanda gördüğün bir çöpü topla.", "Pick up a piece of litter you see in a shared space.") },
];
