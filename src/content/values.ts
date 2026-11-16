import { l } from './helpers';

export const VALUES = [
  { id: 'honesty', label: l("Dürüstlük", "Honesty") },
  { id: 'compassion', label: l("Merhamet", "Compassion") },
  { id: 'freedom', label: l("Özgürlük", "Freedom") },
  { id: 'family', label: l("Aile", "Family") },
  { id: 'curiosity', label: l("Merak", "Curiosity") },
  { id: 'justice', label: l("Adalet", "Justice") },
  { id: 'creativity', label: l("Yaratıcılık", "Creativity") },
  { id: 'balance', label: l("Denge", "Balance") },
  { id: 'courage', label: l("Cesaret", "Courage") },
  { id: 'respect', label: l("Saygı", "Respect") },
  { id: 'health', label: l("Sağlık", "Health") },
  { id: 'loyalty', label: l("Bağlılık", "Loyalty") },
];
export const MAX_VALUES = 5;

export const STRENGTH_PROMPTS = [
  { id: 's1', text: l("Zorlu bir işi başardığın bir anı yaz. O sırada hangi becerilerini kullandın?", "Describe a time you got through something hard. Which skills did you use?") },
  { id: 's2', text: l("İnsanlar sana en çok hangi konuda danışıyor?", "What do people most often ask you for help with?") },
  { id: 's3', text: l("Zamanın nasıl geçtiğini anlamadığın bir etkinlik hangisi?", "Which activity makes time disappear for you?") },
  { id: 's4', text: l("Başkalarının sende fark ettiği güzel bir özellik hangisi?", "What good quality do others notice in you?") },
  { id: 's5', text: l("Hangi konuda öğrenmeyi bırakmak istemezsin?", "What do you never want to stop learning about?") },
  { id: 's6', text: l("Bir arkadaşın seni anlatsaydı ne derdi?", "If a friend described you, what would they say?") },
];
