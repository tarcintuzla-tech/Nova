import { l, type L } from './helpers';

export type Exercise = { id: string; type: 'observe' | 'breath' | 'empathy' | 'body'; minutes: number; title: L; body: L };

export const EXERCISES: Exercise[] = [
  { id: 'a-54321', type: 'observe', minutes: 3, title: l("5-4-3-2-1", "5-4-3-2-1"),
    body: l("Etrafında 5 şey gör, 4 şeye dokun, 3 ses duy, 2 koku al, 1 tat al (ya da hayal et). Her birine kısaca dikkat et.",
            "Notice 5 things you see, touch 4, hear 3, smell 2 and taste 1 (or imagine it). Give each a moment of attention.") },
  { id: 'a-breath', type: 'breath', minutes: 2, title: l("Üç nefes", "Three breaths"),
    body: l("Burnundan yavaşça nefes al, ağzından yavaşça ver. Üç nefes boyunca yalnızca nefesinin hissine odaklan.",
            "Breathe in slowly through your nose and out through your mouth. For three breaths, focus only on the feeling of breathing.") },
  { id: 'a-object', type: 'observe', minutes: 2, title: l("Tek bir nesneye bak", "Look at one object"),
    body: l("Önündeki bir nesneyi bir dakika boyunca ilk kez görüyormuş gibi incele: renk, doku, gölge.",
            "Look at an object in front of you for a minute as if seeing it for the first time: colour, texture, shadow.") },
  { id: 'a-body', type: 'body', minutes: 5, title: l("Vücut taraması", "Body scan"),
    body: l("Ayak parmaklarından başlayıp başına doğru ilerle. Her bölgede gerginlik var mı fark et; değiştirmeye çalışma.",
            "Move your attention from your toes up to your head. Notice any tension in each area without trying to change it.") },
  { id: 'a-walk', type: 'body', minutes: 5, title: l("Dikkatli yürüyüş", "Mindful walk"),
    body: l("Beş dakika yürürken adımlarının zeminle temasına dikkat et. Zihnin dağılırsa nazikçe geri dön.",
            "For five minutes, notice your steps touching the ground. If your mind wanders, gently return.") },
  { id: 'a-otherview', type: 'empathy', minutes: 3, title: l("Başka bir gözle", "Through another's eyes"),
    body: l("Bugün karşılaştığın birini düşün. O gün neyle uğraşıyor olabilir? Bir tahmin yap ve bunun yalnızca bir tahmin olduğunu hatırla.",
            "Think of someone you met today. What might they be dealing with? Make a guess and remember it is only a guess.") },
  { id: 'a-sounds', type: 'observe', minutes: 2, title: l("Sesleri say", "Count the sounds"),
    body: l("Gözlerini kapat ve bir dakika boyunca duyduğun tüm sesleri say; yakından uzağa doğru.",
            "Close your eyes and count every sound you hear for a minute, from near to far.") },
  { id: 'a-pause', type: 'empathy', minutes: 1, title: l("Tepkiden önce duraklama", "Pause before reacting"),
    body: l("Bugün bir tepki vermeden önce bir nefes bekle ve ne hissettiğini kendine adlandır.",
            "Today, before reacting, wait one breath and name to yourself what you feel.") },
];

export const THOUGHTS: L[] = [
  l("Küçük adımlar, sessiz ama gerçek bir yön çizer.", "Small steps draw a direction that is quiet but real."),
  l("Her şeyi anlamak zorunda değilsin; merak etmek iyi bir başlangıç.", "You do not have to understand everything; being curious is a good start."),
  l("Dinlenmek de ilerlemenin bir parçasıdır.", "Rest is also part of progress."),
  l("Kendine söylediğin cümleler, gününün sessiz rehberidir.", "The sentences you say to yourself quietly guide your day."),
  l("Bir iyilik, ona tanık olan herkes için küçük bir davettir.", "One kind act is a small invitation to everyone who witnesses it."),
  l("Bugün yapamadığın, yarını tanımlamaz.", "What you could not do today does not define tomorrow."),
  l("Dikkat, verebileceğin en cömert hediyelerden biridir.", "Attention is one of the most generous gifts you can give."),
];
