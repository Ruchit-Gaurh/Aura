// Comprehensive translations for Indian languages and others
export interface AppTranslations {
  // Common UI elements
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    done: string;
    yes: string;
    no: string;
    ok: string;
  };
  
  // Navigation
  navigation: {
    home: string;
    appointments: string;
    profile: string;
    ai: string;
    medicineReminders: string;
    medicineSchedule: string;
  };
  
  // Home screen
  home: {
    greeting: (name: string) => string;
    subtitle: string;
    quickActions: string;
    bookAppointment: string;
    scheduleConsultation: string;
    myAppointments: string;
    viewAllAppointments: string;
    aiAssistant: string;
    getHealthInsights: string;
    medicineReminders: string;
    manageMedications: string;
    medicineSchedule: string;
    todaysMedications: string;
    upcomingAppointments: string;
    noUpcomingAppointments: string;
    bookFirstAppointment: string;
    bookNow: string;
    nextMedicine: string;
    nextDose: string;
    viewSchedule: string;
  };
  
  // Medicine reminders
  medicine: {
    medicineReminders: string;
    addMedicine: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    instructions: string;
    takeWithFood: string;
    onceDailyFreq: string;
    twiceDailyFreq: string;
    threeTimesDailyFreq: string;
    weeklyFreq: string;
    medicineSchedule: string;
    todaysSchedule: string;
    taken: string;
    skipped: string;
    missed: string;
    pending: string;
    markAsTaken: string;
    skipMedicine: string;
    noMedicinesScheduled: string;
    testVoice: string;
  };
  
  // Profile
  profile: {
    profile: string;
    personalInformation: string;
    name: string;
    email: string;
    preferredLanguage: string;
    selectLanguage: string;
    updateProfile: string;
    logout: string;
    accountSettings: string;
  };
  
  // Voice commands
  voice: {
    voiceCommands: string;
    availableCommands: string;
    tapForVoice: string;
    listening: string;
    alwaysListening: string;
    voiceActivated: string;
    stopListening: string;
  };
}

export const translations: Record<string, AppTranslations> = {
  // English
  'en-US': {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
    },
    navigation: {
      home: 'Home',
      appointments: 'Appointments',
      profile: 'Profile',
      ai: 'AI Assistant',
      medicineReminders: 'Medicine Reminders',
      medicineSchedule: 'Medicine Schedule',
    },
    home: {
      greeting: (name: string) => `Hello, ${name}!`,
      subtitle: 'How can we help you today?',
      quickActions: 'Quick Actions',
      bookAppointment: 'Book Appointment',
      scheduleConsultation: 'Schedule a new consultation',
      myAppointments: 'My Appointments',
      viewAllAppointments: 'View all appointments',
      aiAssistant: 'AI Assistant',
      getHealthInsights: 'Get health insights',
      medicineReminders: 'Medicine Reminders',
      manageMedications: 'Manage your medications',
      medicineSchedule: 'Medicine Schedule',
      todaysMedications: "Today's medications",
      upcomingAppointments: 'Upcoming Appointments',
      noUpcomingAppointments: 'No Upcoming Appointments',
      bookFirstAppointment: 'Book your first appointment to get started',
      bookNow: 'Book Now',
      nextMedicine: 'Next Medicine',
      nextDose: 'Next dose:',
      viewSchedule: 'View Schedule',
    },
    medicine: {
      medicineReminders: 'Medicine Reminders',
      addMedicine: 'Add Medicine',
      medicineName: 'Medicine Name',
      dosage: 'Dosage',
      frequency: 'Frequency',
      instructions: 'Instructions',
      takeWithFood: 'Take with food',
      onceDailyFreq: 'Once daily',
      twiceDailyFreq: 'Twice daily',
      threeTimesDailyFreq: '3 times daily',
      weeklyFreq: 'Weekly',
      medicineSchedule: 'Medicine Schedule',
      todaysSchedule: "Today's Schedule",
      taken: 'Taken',
      skipped: 'Skipped',
      missed: 'Missed',
      pending: 'Pending',
      markAsTaken: 'Mark as Taken',
      skipMedicine: 'Skip Medicine',
      noMedicinesScheduled: 'No medicines scheduled',
      testVoice: 'Test Voice',
    },
    profile: {
      profile: 'Profile',
      personalInformation: 'Personal Information',
      name: 'Name',
      email: 'Email',
      preferredLanguage: 'Preferred Language',
      selectLanguage: 'Select Language',
      updateProfile: 'Update Profile',
      logout: 'Logout',
      accountSettings: 'Account Settings',
    },
    voice: {
      voiceCommands: 'Voice Commands',
      availableCommands: 'Available Commands',
      tapForVoice: 'Tap for voice',
      listening: 'Listening...',
      alwaysListening: 'Always listening',
      voiceActivated: 'Voice activated',
      stopListening: 'Stop listening',
    },
  },

  // Hindi
  'hi-IN': {
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      save: 'सेव करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      back: 'वापस',
      next: 'अगला',
      done: 'पूर्ण',
      yes: 'हाँ',
      no: 'नहीं',
      ok: 'ठीक है',
    },
    navigation: {
      home: 'होम',
      appointments: 'अपॉइंटमेंट',
      profile: 'प्रोफाइल',
      ai: 'AI सहायक',
      medicineReminders: 'दवा रिमाइंडर',
      medicineSchedule: 'दवा का शेड्यूल',
    },
    home: {
      greeting: (name: string) => `नमस्ते, ${name}!`,
      subtitle: 'आज हम आपकी कैसे मदद कर सकते हैं?',
      quickActions: 'त्वरित कार्य',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      scheduleConsultation: 'नया परामर्श शेड्यूल करें',
      myAppointments: 'मेरे अपॉइंटमेंट',
      viewAllAppointments: 'सभी अपॉइंटमेंट देखें',
      aiAssistant: 'AI सहायक',
      getHealthInsights: 'स्वास्थ्य जानकारी प्राप्त करें',
      medicineReminders: 'दवा रिमाइंडर',
      manageMedications: 'अपनी दवाओं का प्रबंधन करें',
      medicineSchedule: 'दवा का शेड्यूल',
      todaysMedications: 'आज की दवाएं',
      upcomingAppointments: 'आगामी अपॉइंटमेंट',
      noUpcomingAppointments: 'कोई आगामी अपॉइंटमेंट नहीं',
      bookFirstAppointment: 'शुरुआत करने के लिए अपना पहला अपॉइंटमेंट बुक करें',
      bookNow: 'अभी बुक करें',
      nextMedicine: 'अगली दवा',
      nextDose: 'अगली खुराक:',
      viewSchedule: 'शेड्यूल देखें',
    },
    medicine: {
      medicineReminders: 'दवा रिमाइंडर',
      addMedicine: 'दवा जोड़ें',
      medicineName: 'दवा का नाम',
      dosage: 'खुराक',
      frequency: 'आवृत्ति',
      instructions: 'निर्देश',
      takeWithFood: 'खाने के साथ लें',
      onceDailyFreq: 'दिन में एक बार',
      twiceDailyFreq: 'दिन में दो बार',
      threeTimesDailyFreq: 'दिन में 3 बार',
      weeklyFreq: 'साप्ताहिक',
      medicineSchedule: 'दवा का शेड्यूल',
      todaysSchedule: 'आज का शेड्यूल',
      taken: 'ली गई',
      skipped: 'छोड़ी गई',
      missed: 'छूट गई',
      pending: 'बाकी',
      markAsTaken: 'ली गई के रूप में चिह्नित करें',
      skipMedicine: 'दवा छोड़ें',
      noMedicinesScheduled: 'कोई दवा शेड्यूल नहीं',
      testVoice: 'आवाज़ टेस्ट करें',
    },
    profile: {
      profile: 'प्रोफाइल',
      personalInformation: 'व्यक्तिगत जानकारी',
      name: 'नाम',
      email: 'ईमेल',
      preferredLanguage: 'पसंदीदा भाषा',
      selectLanguage: 'भाषा चुनें',
      updateProfile: 'प्रोफाइल अपडेट करें',
      logout: 'लॉगआउट',
      accountSettings: 'खाता सेटिंग्स',
    },
    voice: {
      voiceCommands: 'आवाज़ कमांड',
      availableCommands: 'उपलब्ध कमांड',
      tapForVoice: 'आवाज़ के लिए टैप करें',
      listening: 'सुन रहा है...',
      alwaysListening: 'हमेशा सुन रहा है',
      voiceActivated: 'आवाज़ सक्रिय',
      stopListening: 'सुनना बंद करें',
    },
  },

  // Bengali
  'bn-IN': {
    common: {
      loading: 'লোড হচ্ছে...',
      error: 'ত্রুটি',
      success: 'সফল',
      cancel: 'বাতিল',
      save: 'সেভ',
      delete: 'মুছুন',
      edit: 'সম্পাদনা',
      back: 'পিছনে',
      next: 'পরবর্তী',
      done: 'সম্পন্ন',
      yes: 'হ্যাঁ',
      no: 'না',
      ok: 'ঠিক আছে',
    },
    navigation: {
      home: 'হোম',
      appointments: 'অ্যাপয়েন্টমেন্ট',
      profile: 'প্রোফাইল',
      ai: 'AI সহায়ক',
      medicineReminders: 'ওষুধের রিমাইন্ডার',
      medicineSchedule: 'ওষুধের সময়সূচী',
    },
    home: {
      greeting: (name: string) => `নমস্কার, ${name}!`,
      subtitle: 'আজ আমরা আপনাকে কীভাবে সাহায্য করতে পারি?',
      quickActions: 'দ্রুত কাজ',
      bookAppointment: 'অ্যাপয়েন্টমেন্ট বুক করুন',
      scheduleConsultation: 'নতুন পরামর্শের সময় নির্ধারণ করুন',
      myAppointments: 'আমার অ্যাপয়েন্টমেন্ট',
      viewAllAppointments: 'সব অ্যাপয়েন্টমেন্ট দেখুন',
      aiAssistant: 'AI সহায়ক',
      getHealthInsights: 'স্বাস্থ্য তথ্য পান',
      medicineReminders: 'ওষুধের রিমাইন্ডার',
      manageMedications: 'আপনার ওষুধ পরিচালনা করুন',
      medicineSchedule: 'ওষুধের সময়সূচী',
      todaysMedications: 'আজকের ওষুধ',
      upcomingAppointments: 'আসন্ন অ্যাপয়েন্টমেন্ট',
      noUpcomingAppointments: 'কোন আসন্ন অ্যাপয়েন্টমেন্ট নেই',
      bookFirstAppointment: 'শুরু করতে আপনার প্রথম অ্যাপয়েন্টমেন্ট বুক করুন',
      bookNow: 'এখনই বুক করুন',
      nextMedicine: 'পরবর্তী ওষুধ',
      nextDose: 'পরবর্তী ডোজ:',
      viewSchedule: 'সময়সূচী দেখুন',
    },
    medicine: {
      medicineReminders: 'ওষুধের রিমাইন্ডার',
      addMedicine: 'ওষুধ যোগ করুন',
      medicineName: 'ওষুধের নাম',
      dosage: 'ডোজ',
      frequency: 'ফ্রিকোয়েন্সি',
      instructions: 'নির্দেশনা',
      takeWithFood: 'খাবারের সাথে নিন',
      onceDailyFreq: 'দিনে একবার',
      twiceDailyFreq: 'দিনে দুইবার',
      threeTimesDailyFreq: 'দিনে ৩ বার',
      weeklyFreq: 'সাপ্তাহিক',
      medicineSchedule: 'ওষুধের সময়সূচী',
      todaysSchedule: 'আজকের সময়সূচী',
      taken: 'নেওয়া হয়েছে',
      skipped: 'এড়িয়ে যাওয়া',
      missed: 'মিস করা',
      pending: 'বাকি',
      markAsTaken: 'নেওয়া হিসেবে চিহ্নিত করুন',
      skipMedicine: 'ওষুধ এড়িয়ে যান',
      noMedicinesScheduled: 'কোন ওষুধ নির্ধারিত নেই',
      testVoice: 'ভয়েস টেস্ট করুন',
    },
    profile: {
      profile: 'প্রোফাইল',
      personalInformation: 'ব্যক্তিগত তথ্য',
      name: 'নাম',
      email: 'ইমেইল',
      preferredLanguage: 'পছন্দের ভাষা',
      selectLanguage: 'ভাষা নির্বাচন করুন',
      updateProfile: 'প্রোফাইল আপডেট করুন',
      logout: 'লগআউট',
      accountSettings: 'অ্যাকাউন্ট সেটিংস',
    },
    voice: {
      voiceCommands: 'ভয়েস কমান্ড',
      availableCommands: 'উপলব্ধ কমান্ড',
      tapForVoice: 'ভয়েসের জন্য ট্যাপ করুন',
      listening: 'শুনছে...',
      alwaysListening: 'সবসময় শুনছে',
      voiceActivated: 'ভয়েস সক্রিয়',
      stopListening: 'শোনা বন্ধ করুন',
    },
  },

  // Telugu
  'te-IN': {
    common: {
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం',
      success: 'విజయం',
      cancel: 'రద్దు చేయండి',
      save: 'సేవ్ చేయండి',
      delete: 'తొలగించండి',
      edit: 'సవరించండి',
      back: 'వెనుకకు',
      next: 'తదుపరి',
      done: 'పూర్తయింది',
      yes: 'అవును',
      no: 'లేదు',
      ok: 'సరే',
    },
    navigation: {
      home: 'హోమ్',
      appointments: 'అపాయింట్మెంట్లు',
      profile: 'ప్రొఫైల్',
      ai: 'AI సహాయకుడు',
      medicineReminders: 'మందుల రిమైండర్లు',
      medicineSchedule: 'మందుల షెడ్యూల్',
    },
    home: {
      greeting: (name: string) => `నమస్కారం, ${name}!`,
      subtitle: 'ఈరోజు మేము మీకు ఎలా సహాయం చేయగలం?',
      quickActions: 'త్వరిత చర్యలు',
      bookAppointment: 'అపాయింట్మెంట్ బుక్ చేయండి',
      scheduleConsultation: 'కొత్త సంప్రదింపును షెడ్యూల్ చేయండి',
      myAppointments: 'నా అపాయింట్మెంట్లు',
      viewAllAppointments: 'అన్ని అపాయింట్మెంట్లను చూడండి',
      aiAssistant: 'AI సహాయకుడు',
      getHealthInsights: 'ఆరోగ్య సమాచారం పొందండి',
      medicineReminders: 'మందుల రిమైండర్లు',
      manageMedications: 'మీ మందులను నిర్వహించండి',
      medicineSchedule: 'మందుల షెడ్యూల్',
      todaysMedications: 'నేటి మందులు',
      upcomingAppointments: 'రాబోయే అపాయింట్మెంట్లు',
      noUpcomingAppointments: 'రాబోయే అపాయింట్మెంట్లు లేవు',
      bookFirstAppointment: 'ప్రారంభించడానికి మీ మొదటి అపాయింట్మెంట్ను బుక్ చేయండి',
      bookNow: 'ఇప్పుడే బుక్ చేయండి',
      nextMedicine: 'తదుపరి మందు',
      nextDose: 'తదుపరి డోస్:',
      viewSchedule: 'షెడ్యూల్ చూడండి',
    },
    medicine: {
      medicineReminders: 'మందుల రిమైండర్లు',
      addMedicine: 'మందు జోడించండి',
      medicineName: 'మందు పేరు',
      dosage: 'డోసేజ్',
      frequency: 'ఫ్రీక్వెన్సీ',
      instructions: 'సూచనలు',
      takeWithFood: 'ఆహారంతో తీసుకోండి',
      onceDailyFreq: 'రోజుకు ఒకసారి',
      twiceDailyFreq: 'రోజుకు రెండుసార్లు',
      threeTimesDailyFreq: 'రోజుకు 3 సార్లు',
      weeklyFreq: 'వారానికి',
      medicineSchedule: 'మందుల షెడ్యూల్',
      todaysSchedule: 'నేటి షెడ్యూల్',
      taken: 'తీసుకున్నారు',
      skipped: 'దాటవేశారు',
      missed: 'మిస్ అయ్యారు',
      pending: 'పెండింగ్',
      markAsTaken: 'తీసుకున్నట్లు గుర్తించండి',
      skipMedicine: 'మందు దాటవేయండి',
      noMedicinesScheduled: 'మందులు షెడ్యూల్ చేయలేదు',
      testVoice: 'వాయిస్ టెస్ట్ చేయండి',
    },
    profile: {
      profile: 'ప్రొఫైల్',
      personalInformation: 'వ్యక్తిగత సమాచారం',
      name: 'పేరు',
      email: 'ఇమెయిల్',
      preferredLanguage: 'ప్రాధాన్య భాష',
      selectLanguage: 'భాష ఎంచుకోండి',
      updateProfile: 'ప్రొఫైల్ అప్డేట్ చేయండి',
      logout: 'లాగ్అవుట్',
      accountSettings: 'ఖాతా సెట్టింగ్లు',
    },
    voice: {
      voiceCommands: 'వాయిస్ కమాండ్లు',
      availableCommands: 'అందుబాటులో ఉన్న కమాండ్లు',
      tapForVoice: 'వాయిస్ కోసం ట్యాప్ చేయండి',
      listening: 'వింటోంది...',
      alwaysListening: 'ఎల్లప్పుడూ వింటోంది',
      voiceActivated: 'వాయిస్ యాక్టివేట్ చేయబడింది',
      stopListening: 'వినడం ఆపండి',
    },
  },

  // Tamil
  'ta-IN': {
    common: {
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      cancel: 'ரத்து செய்',
      save: 'சேமி',
      delete: 'நீக்கு',
      edit: 'திருத்து',
      back: 'பின்',
      next: 'அடுத்து',
      done: 'முடிந்தது',
      yes: 'ஆம்',
      no: 'இல்லை',
      ok: 'சரி',
    },
    navigation: {
      home: 'முகப்பு',
      appointments: 'சந்திப்புகள்',
      profile: 'சுயவிவரம்',
      ai: 'AI உதவியாளர்',
      medicineReminders: 'மருந்து நினைவூட்டல்கள்',
      medicineSchedule: 'மருந்து அட்டவணை',
    },
    home: {
      greeting: (name: string) => `வணக்கம், ${name}!`,
      subtitle: 'இன்று நாங்கள் உங்களுக்கு எப்படி உதவ முடியும்?',
      quickActions: 'விரைவு செயல்கள்',
      bookAppointment: 'சந்திப்பு முன்பதிவு',
      scheduleConsultation: 'புதிய ஆலோசனையை திட்டமிடுங்கள்',
      myAppointments: 'என் சந்திப்புகள்',
      viewAllAppointments: 'அனைத்து சந்திப்புகளையும் பார்க்கவும்',
      aiAssistant: 'AI உதவியாளர்',
      getHealthInsights: 'சுகாதார தகவல்களைப் பெறுங்கள்',
      medicineReminders: 'மருந்து நினைவூட்டல்கள்',
      manageMedications: 'உங்கள் மருந்துகளை நிர்வகிக்கவும்',
      medicineSchedule: 'மருந்து அட்டவணை',
      todaysMedications: 'இன்றைய மருந்துகள்',
      upcomingAppointments: 'வரவிருக்கும் சந்திப்புகள்',
      noUpcomingAppointments: 'வரவிருக்கும் சந்திப்புகள் இல்லை',
      bookFirstAppointment: 'தொடங்க உங்கள் முதல் சந்திப்பை முன்பதிவு செய்யுங்கள்',
      bookNow: 'இப்போது முன்பதிவு செய்யுங்கள்',
      nextMedicine: 'அடுத்த மருந்து',
      nextDose: 'அடுத்த டோஸ்:',
      viewSchedule: 'அட்டவணையைப் பார்க்கவும்',
    },
    medicine: {
      medicineReminders: 'மருந்து நினைவூட்டல்கள்',
      addMedicine: 'மருந்து சேர்க்கவும்',
      medicineName: 'மருந்தின் பெயர்',
      dosage: 'டோஸ்',
      frequency: 'அதிர்வெண்',
      instructions: 'வழிமுறைகள்',
      takeWithFood: 'உணவுடன் எடுத்துக்கொள்ளுங்கள்',
      onceDailyFreq: 'நாளுக்கு ஒருமுறை',
      twiceDailyFreq: 'நாளுக்கு இருமுறை',
      threeTimesDailyFreq: 'நாளுக்கு 3 முறை',
      weeklyFreq: 'வாராந்திர',
      medicineSchedule: 'மருந்து அட்டவணை',
      todaysSchedule: 'இன்றைய அட்டவணை',
      taken: 'எடுத்துக்கொண்டது',
      skipped: 'தவிர்த்தது',
      missed: 'தவறவிட்டது',
      pending: 'நிலுவையில்',
      markAsTaken: 'எடுத்துக்கொண்டதாக குறிக்கவும்',
      skipMedicine: 'மருந்தைத் தவிர்க்கவும்',
      noMedicinesScheduled: 'மருந்துகள் திட்டமிடப்படவில்லை',
      testVoice: 'குரல் சோதனை',
    },
    profile: {
      profile: 'சுயவிவரம்',
      personalInformation: 'தனிப்பட்ட தகவல்',
      name: 'பெயர்',
      email: 'மின்னஞ்சல்',
      preferredLanguage: 'விருப்பமான மொழி',
      selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
      updateProfile: 'சுயவிவரத்தைப் புதுப்பிக்கவும்',
      logout: 'வெளியேறு',
      accountSettings: 'கணக்கு அமைப்புகள்',
    },
    voice: {
      voiceCommands: 'குரல் கட்டளைகள்',
      availableCommands: 'கிடைக்கும் கட்டளைகள்',
      tapForVoice: 'குரலுக்கு தட்டவும்',
      listening: 'கேட்கிறது...',
      alwaysListening: 'எப்போதும் கேட்கிறது',
      voiceActivated: 'குரல் செயல்படுத்தப்பட்டது',
      stopListening: 'கேட்பதை நிறுத்து',
    },
  },

  // Marathi
  'mr-IN': {
    common: {
      loading: 'लोड होत आहे...',
      error: 'त्रुटी',
      success: 'यश',
      cancel: 'रद्द करा',
      save: 'सेव्ह करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      back: 'मागे',
      next: 'पुढे',
      done: 'पूर्ण',
      yes: 'होय',
      no: 'नाही',
      ok: 'ठीक आहे',
    },
    navigation: {
      home: 'होम',
      appointments: 'भेटी',
      profile: 'प्रोफाइल',
      ai: 'AI सहाय्यक',
      medicineReminders: 'औषध स्मरणपत्र',
      medicineSchedule: 'औषध वेळापत्रक',
    },
    home: {
      greeting: (name: string) => `नमस्कार, ${name}!`,
      subtitle: 'आज आम्ही तुमची कशी मदत करू शकतो?',
      quickActions: 'त्वरित कृती',
      bookAppointment: 'भेट बुक करा',
      scheduleConsultation: 'नवीन सल्लामसलत शेड्यूल करा',
      myAppointments: 'माझ्या भेटी',
      viewAllAppointments: 'सर्व भेटी पहा',
      aiAssistant: 'AI सहाय्यक',
      getHealthInsights: 'आरोग्य माहिती मिळवा',
      medicineReminders: 'औषध स्मरणपत्र',
      manageMedications: 'तुमची औषधे व्यवस्थापित करा',
      medicineSchedule: 'औषध वेळापत्रक',
      todaysMedications: 'आजची औषधे',
      upcomingAppointments: 'येणाऱ्या भेटी',
      noUpcomingAppointments: 'येणाऱ्या भेटी नाहीत',
      bookFirstAppointment: 'सुरुवात करण्यासाठी तुमची पहिली भेट बुक करा',
      bookNow: 'आता बुक करा',
      nextMedicine: 'पुढील औषध',
      nextDose: 'पुढील डोस:',
      viewSchedule: 'वेळापत्रक पहा',
    },
    medicine: {
      medicineReminders: 'औषध स्मरणपत्र',
      addMedicine: 'औषध जोडा',
      medicineName: 'औषधाचे नाव',
      dosage: 'डोस',
      frequency: 'वारंवारता',
      instructions: 'सूचना',
      takeWithFood: 'जेवणासोबत घ्या',
      onceDailyFreq: 'दिवसातून एकदा',
      twiceDailyFreq: 'दिवसातून दोनदा',
      threeTimesDailyFreq: 'दिवसातून ३ वेळा',
      weeklyFreq: 'साप्ताहिक',
      medicineSchedule: 'औषध वेळापत्रक',
      todaysSchedule: 'आजचे वेळापत्रक',
      taken: 'घेतले',
      skipped: 'वगळले',
      missed: 'चुकले',
      pending: 'प्रलंबित',
      markAsTaken: 'घेतले म्हणून चिन्हांकित करा',
      skipMedicine: 'औषध वगळा',
      noMedicinesScheduled: 'कोणतीही औषधे शेड्यूल केलेली नाहीत',
      testVoice: 'आवाज चाचणी',
    },
    profile: {
      profile: 'प्रोफाइल',
      personalInformation: 'वैयक्तिक माहिती',
      name: 'नाव',
      email: 'ईमेल',
      preferredLanguage: 'पसंतीची भाषा',
      selectLanguage: 'भाषा निवडा',
      updateProfile: 'प्रोफाइल अपडेट करा',
      logout: 'लॉगआउट',
      accountSettings: 'खाते सेटिंग्ज',
    },
    voice: {
      voiceCommands: 'आवाज आदेश',
      availableCommands: 'उपलब्ध आदेश',
      tapForVoice: 'आवाजासाठी टॅप करा',
      listening: 'ऐकत आहे...',
      alwaysListening: 'नेहमी ऐकत आहे',
      voiceActivated: 'आवाज सक्रिय',
      stopListening: 'ऐकणे थांबवा',
    },
  },

  // Gujarati
  'gu-IN': {
    common: {
      loading: 'લોડ થઈ રહ્યું છે...',
      error: 'ભૂલ',
      success: 'સફળતા',
      cancel: 'રદ કરો',
      save: 'સેવ કરો',
      delete: 'ડિલીટ કરો',
      edit: 'એડિટ કરો',
      back: 'પાછળ',
      next: 'આગળ',
      done: 'પૂર્ણ',
      yes: 'હા',
      no: 'ના',
      ok: 'ઠીક છે',
    },
    navigation: {
      home: 'હોમ',
      appointments: 'એપોઇન્ટમેન્ટ',
      profile: 'પ્રોફાઇલ',
      ai: 'AI સહાયક',
      medicineReminders: 'દવાના રિમાઇન્ડર',
      medicineSchedule: 'દવાનું શેડ્યૂલ',
    },
    home: {
      greeting: (name: string) => `નમસ્તે, ${name}!`,
      subtitle: 'આજે અમે તમારી કેવી રીતે મદદ કરી શકીએ?',
      quickActions: 'ઝડપી ક્રિયાઓ',
      bookAppointment: 'એપોઇન્ટમેન્ટ બુક કરો',
      scheduleConsultation: 'નવી સલાહ શેડ્યૂલ કરો',
      myAppointments: 'મારી એપોઇન્ટમેન્ટ',
      viewAllAppointments: 'બધી એપોઇન્ટમેન્ટ જુઓ',
      aiAssistant: 'AI સહાયક',
      getHealthInsights: 'આરોગ્ય માહિતી મેળવો',
      medicineReminders: 'દવાના રિમાઇન્ડર',
      manageMedications: 'તમારી દવાઓનું સંચાલન કરો',
      medicineSchedule: 'દવાનું શેડ્યૂલ',
      todaysMedications: 'આજની દવાઓ',
      upcomingAppointments: 'આવનારી એપોઇન્ટમેન્ટ',
      noUpcomingAppointments: 'કોઈ આવનારી એપોઇન્ટમેન્ટ નથી',
      bookFirstAppointment: 'શરૂ કરવા માટે તમારી પ્રથમ એપોઇન્ટમેન્ટ બુક કરો',
      bookNow: 'હવે બુક કરો',
      nextMedicine: 'આગળની દવા',
      nextDose: 'આગળનો ડોઝ:',
      viewSchedule: 'શેડ્યૂલ જુઓ',
    },
    medicine: {
      medicineReminders: 'દવાના રિમાઇન્ડર',
      addMedicine: 'દવા ઉમેરો',
      medicineName: 'દવાનું નામ',
      dosage: 'ડોઝ',
      frequency: 'આવૃત્તિ',
      instructions: 'સૂચનાઓ',
      takeWithFood: 'ખોરાક સાથે લો',
      onceDailyFreq: 'દિવસમાં એકવાર',
      twiceDailyFreq: 'દિવસમાં બે વાર',
      threeTimesDailyFreq: 'દિવસમાં ૩ વાર',
      weeklyFreq: 'સાપ્તાહિક',
      medicineSchedule: 'દવાનું શેડ્યૂલ',
      todaysSchedule: 'આજનું શેડ્યૂલ',
      taken: 'લીધી',
      skipped: 'છોડી દીધી',
      missed: 'ચૂકી ગઈ',
      pending: 'બાકી',
      markAsTaken: 'લીધી તરીકે ચિહ્નિત કરો',
      skipMedicine: 'દવા છોડો',
      noMedicinesScheduled: 'કોઈ દવા શેડ્યૂલ નથી',
      testVoice: 'અવાજ ટેસ્ટ કરો',
    },
    profile: {
      profile: 'પ્રોફાઇલ',
      personalInformation: 'વ્યક્તિગત માહિતી',
      name: 'નામ',
      email: 'ઈમેઇલ',
      preferredLanguage: 'પસંદગીની ભાષા',
      selectLanguage: 'ભાષા પસંદ કરો',
      updateProfile: 'પ્રોફાઇલ અપડેટ કરો',
      logout: 'લોગઆઉટ',
      accountSettings: 'એકાઉન્ટ સેટિંગ્સ',
    },
    voice: {
      voiceCommands: 'અવાજ આદેશો',
      availableCommands: 'ઉપલબ્ધ આદેશો',
      tapForVoice: 'અવાજ માટે ટેપ કરો',
      listening: 'સાંભળી રહ્યું છે...',
      alwaysListening: 'હંમેશા સાંભળી રહ્યું છે',
      voiceActivated: 'અવાજ સક્રિય',
      stopListening: 'સાંભળવાનું બંધ કરો',
    },
  },
};

export const getTranslations = (language: string): AppTranslations => {
  // Try exact match first
  if (translations[language]) {
    return translations[language];
  }
  
  // Try language family (e.g., 'hi' for 'hi-IN')
  const languageFamily = language.split('-')[0];
  const familyMatch = Object.keys(translations).find(key => key.startsWith(languageFamily));
  if (familyMatch && translations[familyMatch]) {
    return translations[familyMatch];
  }
  
  // Fallback to English
  return translations['en-US'];
};