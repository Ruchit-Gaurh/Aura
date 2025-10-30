// Multilingual messages for medicine reminders
export interface MedicineMessages {
  reminderTitle: string;
  reminderMessage: (medicineName: string, dosage: string) => string;
  withFoodMessage: string;
  takenConfirmation: (medicineName: string) => string;
  skippedWarning: (medicineName: string) => string;
  missedWarning: (medicineName: string) => string;
  timeAnnouncement: (time: string) => string;
  goodJob: string;
  consultDoctor: string;
}

export const medicineMessages: Record<string, MedicineMessages> = {
  // English
  'en': {
    reminderTitle: 'Medicine Reminder',
    reminderMessage: (medicineName: string, dosage: string) => 
      `Time to take your ${medicineName}, ${dosage}`,
    withFoodMessage: 'Please take this medicine with food',
    takenConfirmation: (medicineName: string) => 
      `Great job! You have taken your ${medicineName}`,
    skippedWarning: (medicineName: string) => 
      `You have skipped ${medicineName}. Please consult your doctor if you skip medicines frequently`,
    missedWarning: (medicineName: string) => 
      `You missed your ${medicineName}. Please take it as soon as possible`,
    timeAnnouncement: (time: string) => 
      `It is ${time}. Time for your medicine`,
    goodJob: 'Good job taking your medicine!',
    consultDoctor: 'Please consult your doctor'
  },

  // Spanish
  'es': {
    reminderTitle: 'Recordatorio de Medicina',
    reminderMessage: (medicineName: string, dosage: string) => 
      `Es hora de tomar su ${medicineName}, ${dosage}`,
    withFoodMessage: 'Por favor tome esta medicina con comida',
    takenConfirmation: (medicineName: string) => 
      `¡Muy bien! Ha tomado su ${medicineName}`,
    skippedWarning: (medicineName: string) => 
      `Ha omitido ${medicineName}. Consulte a su médico si omite medicinas frecuentemente`,
    missedWarning: (medicineName: string) => 
      `Se perdió su ${medicineName}. Tómelo tan pronto como sea posible`,
    timeAnnouncement: (time: string) => 
      `Son las ${time}. Hora de su medicina`,
    goodJob: '¡Buen trabajo tomando su medicina!',
    consultDoctor: 'Por favor consulte a su médico'
  },

  // French
  'fr': {
    reminderTitle: 'Rappel de Médicament',
    reminderMessage: (medicineName: string, dosage: string) => 
      `Il est temps de prendre votre ${medicineName}, ${dosage}`,
    withFoodMessage: 'Veuillez prendre ce médicament avec de la nourriture',
    takenConfirmation: (medicineName: string) => 
      `Excellent! Vous avez pris votre ${medicineName}`,
    skippedWarning: (medicineName: string) => 
      `Vous avez sauté ${medicineName}. Consultez votre médecin si vous sautez des médicaments fréquemment`,
    missedWarning: (medicineName: string) => 
      `Vous avez manqué votre ${medicineName}. Prenez-le dès que possible`,
    timeAnnouncement: (time: string) => 
      `Il est ${time}. C'est l'heure de votre médicament`,
    goodJob: 'Bon travail en prenant votre médicament!',
    consultDoctor: 'Veuillez consulter votre médecin'
  },

  // German
  'de': {
    reminderTitle: 'Medikamenten-Erinnerung',
    reminderMessage: (medicineName: string, dosage: string) => 
      `Zeit, Ihr ${medicineName} zu nehmen, ${dosage}`,
    withFoodMessage: 'Bitte nehmen Sie dieses Medikament mit dem Essen',
    takenConfirmation: (medicineName: string) => 
      `Großartig! Sie haben Ihr ${medicineName} genommen`,
    skippedWarning: (medicineName: string) => 
      `Sie haben ${medicineName} übersprungen. Konsultieren Sie Ihren Arzt, wenn Sie häufig Medikamente auslassen`,
    missedWarning: (medicineName: string) => 
      `Sie haben Ihr ${medicineName} verpasst. Nehmen Sie es so bald wie möglich`,
    timeAnnouncement: (time: string) => 
      `Es ist ${time}. Zeit für Ihr Medikament`,
    goodJob: 'Gut gemacht beim Einnehmen Ihres Medikaments!',
    consultDoctor: 'Bitte konsultieren Sie Ihren Arzt'
  },

  // Italian
  'it': {
    reminderTitle: 'Promemoria Medicina',
    reminderMessage: (medicineName: string, dosage: string) => 
      `È ora di prendere il tuo ${medicineName}, ${dosage}`,
    withFoodMessage: 'Per favore prendi questa medicina con il cibo',
    takenConfirmation: (medicineName: string) => 
      `Ottimo lavoro! Hai preso il tuo ${medicineName}`,
    skippedWarning: (medicineName: string) => 
      `Hai saltato ${medicineName}. Consulta il tuo medico se salti spesso le medicine`,
    missedWarning: (medicineName: string) => 
      `Hai perso il tuo ${medicineName}. Prendilo appena possibile`,
    timeAnnouncement: (time: string) => 
      `Sono le ${time}. È ora della tua medicina`,
    goodJob: 'Bravo a prendere la tua medicina!',
    consultDoctor: 'Per favore consulta il tuo medico'
  },

  // Portuguese
  'pt': {
    reminderTitle: 'Lembrete de Remédio',
    reminderMessage: (medicineName: string, dosage: string) => 
      `Hora de tomar seu ${medicineName}, ${dosage}`,
    withFoodMessage: 'Por favor tome este remédio com comida',
    takenConfirmation: (medicineName: string) => 
      `Muito bem! Você tomou seu ${medicineName}`,
    skippedWarning: (medicineName: string) => 
      `Você pulou ${medicineName}. Consulte seu médico se pular remédios frequentemente`,
    missedWarning: (medicineName: string) => 
      `Você perdeu seu ${medicineName}. Tome assim que possível`,
    timeAnnouncement: (time: string) => 
      `São ${time}. Hora do seu remédio`,
    goodJob: 'Bom trabalho tomando seu remédio!',
    consultDoctor: 'Por favor consulte seu médico'
  },

  // Hindi
  'hi-IN': {
    reminderTitle: 'दवा की याददाश्त',
    reminderMessage: (medicineName: string, dosage: string) => 
      `आपकी ${medicineName} लेने का समय है, ${dosage}`,
    withFoodMessage: 'कृपया यह दवा खाने के साथ लें',
    takenConfirmation: (medicineName: string) => 
      `बहुत अच्छा! आपने अपनी ${medicineName} ली है`,
    skippedWarning: (medicineName: string) => 
      `आपने ${medicineName} छोड़ दी है। यदि आप अक्सर दवाएं छोड़ते हैं तो कृपया अपने डॉक्टर से सलाह लें`,
    missedWarning: (medicineName: string) => 
      `आप अपनी ${medicineName} भूल गए। कृपया जल्दी से जल्दी लें`,
    timeAnnouncement: (time: string) => 
      `अभी ${time} बजे हैं। आपकी दवा का समय है`,
    goodJob: 'दवा लेने के लिए बहुत अच्छा!',
    consultDoctor: 'कृपया अपने डॉक्टर से सलाह लें'
  },

  // Hindi (fallback)
  'hi': {
    reminderTitle: 'दवा की याददाश्त',
    reminderMessage: (medicineName: string, dosage: string) => 
      `आपकी ${medicineName} लेने का समय है, ${dosage}`,
    withFoodMessage: 'कृपया यह दवा खाने के साथ लें',
    takenConfirmation: (medicineName: string) => 
      `बहुत अच्छा! आपने अपनी ${medicineName} ली है`,
    skippedWarning: (medicineName: string) => 
      `आपने ${medicineName} छोड़ दी है। यदि आप अक्सर दवाएं छोड़ते हैं तो कृपया अपने डॉक्टर से सलाह लें`,
    missedWarning: (medicineName: string) => 
      `आप अपनी ${medicineName} भूल गए। कृपया जल्दी से जल्दी लें`,
    timeAnnouncement: (time: string) => 
      `अभी ${time} बजे हैं। आपकी दवा का समय है`,
    goodJob: 'दवा लेने के लिए बहुत अच्छा!',
    consultDoctor: 'कृपया अपने डॉक्टर से सलाह लें'
  },

  // Chinese (Simplified)
  'zh': {
    reminderTitle: '药物提醒',
    reminderMessage: (medicineName: string, dosage: string) => 
      `该服用您的${medicineName}了，${dosage}`,
    withFoodMessage: '请与食物一起服用此药',
    takenConfirmation: (medicineName: string) => 
      `很好！您已经服用了${medicineName}`,
    skippedWarning: (medicineName: string) => 
      `您跳过了${medicineName}。如果您经常跳过药物，请咨询您的医生`,
    missedWarning: (medicineName: string) => 
      `您错过了${medicineName}。请尽快服用`,
    timeAnnouncement: (time: string) => 
      `现在是${time}。该服药了`,
    goodJob: '服药做得很好！',
    consultDoctor: '请咨询您的医生'
  },

  // Japanese
  'ja': {
    reminderTitle: '薬のリマインダー',
    reminderMessage: (medicineName: string, dosage: string) => 
      `${medicineName}を服用する時間です、${dosage}`,
    withFoodMessage: 'この薬は食事と一緒に服用してください',
    takenConfirmation: (medicineName: string) => 
      `素晴らしい！${medicineName}を服用しました`,
    skippedWarning: (medicineName: string) => 
      `${medicineName}をスキップしました。頻繁に薬をスキップする場合は医師に相談してください`,
    missedWarning: (medicineName: string) => 
      `${medicineName}を飲み忘れました。できるだけ早く服用してください`,
    timeAnnouncement: (time: string) => 
      `${time}です。薬の時間です`,
    goodJob: '薬を服用してよくできました！',
    consultDoctor: '医師に相談してください'
  },

  // Bengali
  'bn-IN': {
    reminderTitle: 'ওষুধের রিমাইন্ডার',
    reminderMessage: (medicineName: string, dosage: string) => 
      `আপনার ${medicineName} খাওয়ার সময় হয়েছে, ${dosage}`,
    withFoodMessage: 'দয়া করে এই ওষুধটি খাবারের সাথে নিন',
    takenConfirmation: (medicineName: string) => 
      `খুব ভাল! আপনি আপনার ${medicineName} খেয়েছেন`,
    skippedWarning: (medicineName: string) => 
      `আপনি ${medicineName} এড়িয়ে গেছেন। আপনি যদি ঘন ঘন ওষুধ এড়িয়ে যান তাহলে দয়া করে আপনার ডাক্তারের সাথে পরামর্শ করুন`,
    missedWarning: (medicineName: string) => 
      `আপনি আপনার ${medicineName} মিস করেছেন। দয়া করে যত তাড়াতাড়ি সম্ভব নিন`,
    timeAnnouncement: (time: string) => 
      `এখন ${time} বাজে। আপনার ওষুধের সময়`,
    goodJob: 'ওষুধ খাওয়ার জন্য ভাল কাজ!',
    consultDoctor: 'দয়া করে আপনার ডাক্তারের সাথে পরামর্শ করুন'
  },

  // Telugu
  'te-IN': {
    reminderTitle: 'మందుల రిమైండర్',
    reminderMessage: (medicineName: string, dosage: string) => 
      `మీ ${medicineName} తీసుకునే సమయం వచ్చింది, ${dosage}`,
    withFoodMessage: 'దయచేసి ఈ మందును ఆహారంతో తీసుకోండి',
    takenConfirmation: (medicineName: string) => 
      `చాలా బాగుంది! మీరు మీ ${medicineName} తీసుకున్నారు`,
    skippedWarning: (medicineName: string) => 
      `మీరు ${medicineName} దాటవేశారు. మీరు తరచుగా మందులు దాటవేస్తే దయచేసి మీ వైద్యుడిని సంప్రదించండి`,
    missedWarning: (medicineName: string) => 
      `మీరు మీ ${medicineName} మిస్ అయ్యారు. దయచేసి వీలైనంత త్వరగా తీసుకోండి`,
    timeAnnouncement: (time: string) => 
      `ఇప్పుడు ${time} అయింది। మీ మందుల సమయం`,
    goodJob: 'మందు తీసుకున్నందుకు చాలా బాగుంది!',
    consultDoctor: 'దయచేసి మీ వైద్యుడిని సంప్రదించండి'
  },

  // Tamil
  'ta-IN': {
    reminderTitle: 'மருந்து நினைவூட்டல்',
    reminderMessage: (medicineName: string, dosage: string) => 
      `உங்கள் ${medicineName} எடுக்கும் நேரம் வந்துவிட்டது, ${dosage}`,
    withFoodMessage: 'தயவுசெய்து இந்த மருந்தை உணவுடன் எடுத்துக்கொள்ளுங்கள்',
    takenConfirmation: (medicineName: string) => 
      `மிகவும் நல்லது! நீங்கள் உங்கள் ${medicineName} எடுத்துக்கொண்டீர்கள்`,
    skippedWarning: (medicineName: string) => 
      `நீங்கள் ${medicineName} தவிர்த்துவிட்டீர்கள். நீங்கள் அடிக்கடி மருந்துகளைத் தவிர்த்தால் தயவுசெய்து உங்கள் மருத்துவரை அணுகவும்`,
    missedWarning: (medicineName: string) => 
      `நீங்கள் உங்கள் ${medicineName} தவறவிட்டீர்கள். தயவுசெய்து முடிந்தவரை விரைவில் எடுத்துக்கொள்ளுங்கள்`,
    timeAnnouncement: (time: string) => 
      `இப்போது ${time} ஆகிவிட்டது। உங்கள் மருந்து நேரம்`,
    goodJob: 'மருந்து எடுத்துக்கொண்டதற்கு நல்ல வேலை!',
    consultDoctor: 'தயவுசெய்து உங்கள் மருத்துவரை அணுகவும்'
  },

  // Marathi
  'mr-IN': {
    reminderTitle: 'औषध स्मरणपत्र',
    reminderMessage: (medicineName: string, dosage: string) => 
      `तुमची ${medicineName} घेण्याची वेळ आली आहे, ${dosage}`,
    withFoodMessage: 'कृपया हे औषध जेवणासोबत घ्या',
    takenConfirmation: (medicineName: string) => 
      `खूप छान! तुम्ही तुमची ${medicineName} घेतली आहे`,
    skippedWarning: (medicineName: string) => 
      `तुम्ही ${medicineName} वगळली आहे। जर तुम्ही वारंवार औषधे वगळत असाल तर कृपया तुमच्या डॉक्टरांशी सल्लामसलत करा`,
    missedWarning: (medicineName: string) => 
      `तुम्ही तुमची ${medicineName} चुकवली आहे। कृपया लवकरात लवकर घ्या`,
    timeAnnouncement: (time: string) => 
      `आता ${time} वाजले आहेत। तुमच्या औषधाची वेळ आहे`,
    goodJob: 'औषध घेतल्याबद्दल छान काम!',
    consultDoctor: 'कृपया तुमच्या डॉक्टरांशी सल्लामसलत करा'
  },

  // Gujarati
  'gu-IN': {
    reminderTitle: 'દવાનું રિમાઇન્ડર',
    reminderMessage: (medicineName: string, dosage: string) => 
      `તમારી ${medicineName} લેવાનો સમય આવી ગયો છે, ${dosage}`,
    withFoodMessage: 'કૃપા કરીને આ દવા ખોરાક સાથે લો',
    takenConfirmation: (medicineName: string) => 
      `ખૂબ સારું! તમે તમારી ${medicineName} લીધી છે`,
    skippedWarning: (medicineName: string) => 
      `તમે ${medicineName} છોડી દીધી છે। જો તમે વારંવાર દવાઓ છોડો છો તો કૃપા કરીને તમારા ડૉક્ટરની સલાહ લો`,
    missedWarning: (medicineName: string) => 
      `તમે તમારી ${medicineName} ચૂકી ગયા છો। કૃપા કરીને શક્ય તેટલી જલ્દી લો`,
    timeAnnouncement: (time: string) => 
      `હવે ${time} વાગ્યા છે। તમારી દવાનો સમય છે`,
    goodJob: 'દવા લેવા બદલ સારું કામ!',
    consultDoctor: 'કૃપા કરીને તમારા ડૉક્ટરની સલાહ લો'
  },

  // Kannada
  'kn-IN': {
    reminderTitle: 'ಔಷಧದ ಜ್ಞಾಪನೆ',
    reminderMessage: (medicineName: string, dosage: string) => 
      `ನಿಮ್ಮ ${medicineName} ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯ ಬಂದಿದೆ, ${dosage}`,
    withFoodMessage: 'ದಯವಿಟ್ಟು ಈ ಔಷಧವನ್ನು ಆಹಾರದೊಂದಿಗೆ ತೆಗೆದುಕೊಳ್ಳಿ',
    takenConfirmation: (medicineName: string) => 
      `ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ! ನೀವು ನಿಮ್ಮ ${medicineName} ತೆಗೆದುಕೊಂಡಿದ್ದೀರಿ`,
    skippedWarning: (medicineName: string) => 
      `ನೀವು ${medicineName} ಬಿಟ್ಟುಬಿಟ್ಟಿದ್ದೀರಿ। ನೀವು ಆಗಾಗ್ಗೆ ಔಷಧಗಳನ್ನು ಬಿಟ್ಟರೆ ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ`,
    missedWarning: (medicineName: string) => 
      `ನೀವು ನಿಮ್ಮ ${medicineName} ತಪ್ಪಿಸಿಕೊಂಡಿದ್ದೀರಿ। ದಯವಿಟ್ಟು ಸಾಧ್ಯವಾದಷ್ಟು ಬೇಗ ತೆಗೆದುಕೊಳ್ಳಿ`,
    timeAnnouncement: (time: string) => 
      `ಈಗ ${time} ಆಗಿದೆ। ನಿಮ್ಮ ಔಷಧದ ಸಮಯ`,
    goodJob: 'ಔಷಧ ತೆಗೆದುಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಚೆನ್ನಾಗಿದೆ!',
    consultDoctor: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ'
  },

  // Malayalam
  'ml-IN': {
    reminderTitle: 'മരുന്ന് ഓർമ്മപ്പെടുത്തൽ',
    reminderMessage: (medicineName: string, dosage: string) => 
      `നിങ്ങളുടെ ${medicineName} കഴിക്കാനുള്ള സമയം വന്നിരിക്കുന്നു, ${dosage}`,
    withFoodMessage: 'ദയവായി ഈ മരുന്ന് ഭക്ഷണത്തോടൊപ്പം കഴിക്കുക',
    takenConfirmation: (medicineName: string) => 
      `വളരെ നല്ലത്! നിങ്ങൾ നിങ്ങളുടെ ${medicineName} കഴിച്ചു`,
    skippedWarning: (medicineName: string) => 
      `നിങ്ങൾ ${medicineName} ഒഴിവാക്കി. നിങ്ങൾ പതിവായി മരുന്നുകൾ ഒഴിവാക്കുകയാണെങ്കിൽ ദയവായി നിങ്ങളുടെ ഡോക്ടറെ സമീപിക്കുക`,
    missedWarning: (medicineName: string) => 
      `നിങ്ങൾ നിങ്ങളുടെ ${medicineName} നഷ്ടപ്പെടുത്തി. ദയവായി എത്രയും വേഗം കഴിക്കുക`,
    timeAnnouncement: (time: string) => 
      `ഇപ്പോൾ ${time} ആയി. നിങ്ങളുടെ മരുന്നിന്റെ സമയം`,
    goodJob: 'മരുന്ന് കഴിച്ചതിന് നല്ല ജോലി!',
    consultDoctor: 'ദയവായി നിങ്ങളുടെ ഡോക്ടറെ സമീപിക്കുക'
  },

  // Punjabi
  'pa-IN': {
    reminderTitle: 'ਦਵਾਈ ਦੀ ਯਾਦ ਦਿਲਾਉਣਾ',
    reminderMessage: (medicineName: string, dosage: string) => 
      `ਤੁਹਾਡੀ ${medicineName} ਲੈਣ ਦਾ ਸਮਾਂ ਆ ਗਿਆ ਹੈ, ${dosage}`,
    withFoodMessage: 'ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦਵਾਈ ਖਾਣੇ ਨਾਲ ਲਓ',
    takenConfirmation: (medicineName: string) => 
      `ਬਹੁਤ ਵਧੀਆ! ਤੁਸੀਂ ਆਪਣੀ ${medicineName} ਲੈ ਲਈ ਹੈ`,
    skippedWarning: (medicineName: string) => 
      `ਤੁਸੀਂ ${medicineName} ਛੱਡ ਦਿੱਤੀ ਹੈ। ਜੇ ਤੁਸੀਂ ਅਕਸਰ ਦਵਾਈਆਂ ਛੱਡਦੇ ਹੋ ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ`,
    missedWarning: (medicineName: string) => 
      `ਤੁਸੀਂ ਆਪਣੀ ${medicineName} ਮਿਸ ਕਰ ਦਿੱਤੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਜਿੰਨੀ ਜਲਦੀ ਹੋ ਸਕੇ ਲਓ`,
    timeAnnouncement: (time: string) => 
      `ਹੁਣ ${time} ਵਜੇ ਹਨ। ਤੁਹਾਡੀ ਦਵਾਈ ਦਾ ਸਮਾਂ ਹੈ`,
    goodJob: 'ਦਵਾਈ ਲੈਣ ਲਈ ਬਹੁਤ ਵਧੀਆ!',
    consultDoctor: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ'
  },

  // Urdu
  'ur-IN': {
    reminderTitle: 'دوا کی یاد دہانی',
    reminderMessage: (medicineName: string, dosage: string) => 
      `آپ کی ${medicineName} لینے کا وقت آ گیا ہے، ${dosage}`,
    withFoodMessage: 'براہ کرم یہ دوا کھانے کے ساتھ لیں',
    takenConfirmation: (medicineName: string) => 
      `بہت اچھا! آپ نے اپنی ${medicineName} لے لی ہے`,
    skippedWarning: (medicineName: string) => 
      `آپ نے ${medicineName} چھوڑ دی ہے۔ اگر آپ اکثر دوائیں چھوڑتے ہیں تو براہ کرم اپنے ڈاکٹر سے مشورہ کریں`,
    missedWarning: (medicineName: string) => 
      `آپ اپنی ${medicineName} بھول گئے۔ براہ کرم جلد سے جلد لیں`,
    timeAnnouncement: (time: string) => 
      `اب ${time} بجے ہیں۔ آپ کی دوا کا وقت ہے`,
    goodJob: 'دوا لینے کے لیے بہت اچھا!',
    consultDoctor: 'براہ کرم اپنے ڈاکٹر سے مشورہ کریں'
  },

  // Arabic
  'ar': {
    reminderTitle: 'تذكير الدواء',
    reminderMessage: (medicineName: string, dosage: string) => 
      `حان وقت تناول ${medicineName}، ${dosage}`,
    withFoodMessage: 'يرجى تناول هذا الدواء مع الطعام',
    takenConfirmation: (medicineName: string) => 
      `عمل رائع! لقد تناولت ${medicineName}`,
    skippedWarning: (medicineName: string) => 
      `لقد تخطيت ${medicineName}. يرجى استشارة طبيبك إذا كنت تتخطى الأدوية بشكل متكرر`,
    missedWarning: (medicineName: string) => 
      `لقد فوت ${medicineName}. يرجى تناوله في أقرب وقت ممكن`,
    timeAnnouncement: (time: string) => 
      `الوقت الآن ${time}. حان وقت دوائك`,
    goodJob: 'عمل جيد في تناول دوائك!',
    consultDoctor: 'يرجى استشارة طبيبك'
  }
};

export const getMedicineMessages = (language: string): MedicineMessages => {
  // Try exact match first
  if (medicineMessages[language]) {
    return medicineMessages[language];
  }
  
  // Try language family (e.g., 'en' for 'en-US')
  const languageFamily = language.split('-')[0];
  if (medicineMessages[languageFamily]) {
    return medicineMessages[languageFamily];
  }
  
  // Fallback to English
  return medicineMessages['en'];
};