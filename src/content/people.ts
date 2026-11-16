import { l, type L } from './helpers';

export type Scenario = { id: string; text: L; options: { text: L; note: L }[] };

export const SCENARIOS: Scenario[] = [
  { id: 'sc1', text: l("Arkadaşın buluşmaya 20 dakika geç geldi ve bir şey söylemeden oturdu.", "Your friend arrives 20 minutes late and sits down without saying anything."),
    options: [
      { text: l("Hemen kızgınlığımı belirtirim.", "I show my annoyance right away."), note: l("Duygunu paylaşmak değerli; ama önce ne olduğunu sormak suçlayıcı bir tona kaymayı önleyebilir.", "Sharing your feeling is valuable, but asking what happened first can prevent a blaming tone.") },
      { text: l("Nasıl olduğunu sorar, sonra beklediğimi söylerim.", "I ask how they are, then say I was waiting."), note: l("Hem ilişkiyi hem kendi duygunu gözetiyor; “ben dili” ile uyumlu.", "It looks after both the relationship and your own feeling, and fits the “I statement” approach.") },
      { text: l("Hiçbir şey söylemem, içime atarım.", "I say nothing and keep it in."), note: l("Kısa vadede çatışmayı önler; ama biriken duygu sonradan beklenmedik biçimde çıkabilir.", "It avoids conflict for now, but built-up feelings can surface unexpectedly later.") },
    ] },
  { id: 'sc2', text: l("Bir meslektaşın toplantıda senin fikrini kendi fikriymiş gibi sundu.", "A colleague presents your idea as their own in a meeting."),
    options: [
      { text: l("Toplantıda hemen itiraz ederim.", "I object right there in the meeting."), note: l("Haklı olabilirsin; ama herkesin önünde itiraz savunmayı artırabilir.", "You may be right, but objecting publicly can raise defensiveness.") },
      { text: l("Sonra birebir konuşur, gözlemimi paylaşırım.", "I talk privately afterwards and share what I observed."), note: l("Olguya odaklanıp kişiyi suçlamamak çözümü kolaylaştırır.", "Focusing on facts rather than blame makes a solution easier.") },
      { text: l("Bir daha fikir paylaşmam.", "I stop sharing ideas."), note: l("Seni korur gibi görünür; ama seni ve ekibi de kısıtlayabilir.", "It seems protective, but it can limit both you and the team.") },
    ] },
  { id: 'sc3', text: l("Bir arkadaşın derdini anlatıyor ve sen hemen çözüm önermek istiyorsun.", "A friend is telling you their trouble and you want to offer a fix right away."),
    options: [
      { text: l("Aklıma gelen çözümü söylerim.", "I say the solution that comes to mind."), note: l("İyi niyetli; ancak kişi çoğu zaman önce anlaşılmak ister.", "Well meant, but people often want to be understood first.") },
      { text: l("Duygusunu yansıtır, ne istediğini sorarım.", "I reflect their feeling and ask what they need."), note: l("Dinlendiğini hissettirir ve ihtiyacı netleştirir.", "It makes them feel heard and clarifies what they need.") },
      { text: l("Konuyu kendi yaşadığıma getiririm.", "I bring it back to my own experience."), note: l("Bazen bağ kurar, bazen ilgiyi kaydırır; kişinin ihtiyacına bakmak yardımcı olur.", "It can connect or shift the focus; checking their need helps.") },
    ] },
];

export const PEOPLE_PROMPTS: { id: string; text: L }[] = [
  { id: 'pp1', text: l("Son zamanlarda yaşadığın bir anlaşmazlıkta karşı tarafın bakış açısı ne olabilirdi?", "In a recent disagreement, what might the other person's point of view have been?") },
  { id: 'pp2', text: l("Bugün kimi gerçekten dinledin? Bunu nereden anladın?", "Whom did you truly listen to today? How could you tell?") },
  { id: 'pp3', text: l("Şu an ne hissediyorsun? Bir duyguyu mümkün olduğunca tam adlandırmaya çalış.", "What are you feeling right now? Try to name it as precisely as you can.") },
  { id: 'pp4', text: l("Birinin davranışını yorumlarken hangi varsayımları yapmış olabilirsin?", "When interpreting someone's behaviour, what assumptions might you have made?") },
  { id: 'pp5', text: l("Bu hafta bir konuşmayı nasıl daha nazik bitirebilirdin?", "How could you have ended a conversation more kindly this week?") },
];
