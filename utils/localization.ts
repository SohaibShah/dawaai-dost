// Localization system for the app
// Each string has an English version, display text for other languages, and TTS versions

export type Language = 'en' | 'ur';

export interface LocalizedString {
  en: {
    text: string;
    tts: string; // Text to be spoken
    ttsModel: 'en-US';
  };
  ur: {
    text: string;
    tts: string;
    ttsModel: 'hi-IN'; // Using Hindi model for Urdu/Hindi TTS
  };
}

export const STRINGS: Record<string, LocalizedString> = {
  // ============ Common ============
  'ok': {
    en: { text: 'OK', tts: 'OK', ttsModel: 'en-US' },
    ur: { text: 'ٹھیک ہے', tts: 'ठीक है', ttsModel: 'hi-IN' },
  },
  'cancel': {
    en: { text: 'Cancel', tts: 'Cancel', ttsModel: 'en-US' },
    ur: { text: 'منسوخ کریں', tts: 'रद्द करें', ttsModel: 'hi-IN' },
  },
  'delete': {
    en: { text: 'Delete', tts: 'Delete', ttsModel: 'en-US' },
    ur: { text: 'حذف کریں', tts: 'हटाएं', ttsModel: 'hi-IN' },
  },
  'edit': {
    en: { text: 'Edit', tts: 'Edit', ttsModel: 'en-US' },
    ur: { text: 'ترمیم کریں', tts: 'संपादित करें', ttsModel: 'hi-IN' },
  },
  'save': {
    en: { text: 'Save', tts: 'Save', ttsModel: 'en-US' },
    ur: { text: 'محفوظ کریں', tts: 'सहेजें', ttsModel: 'hi-IN' },
  },
  'close': {
    en: { text: 'Close', tts: 'Close', ttsModel: 'en-US' },
    ur: { text: 'بند کریں', tts: 'बंद करें', ttsModel: 'hi-IN' },
  },

  // ============ Home Screen ============
  'home_title': {
    en: { text: 'My Medicines', tts: 'My Medicines', ttsModel: 'en-US' },
    ur: { text: 'میری دوائیں', tts: 'मेरी दवाइयां', ttsModel: 'hi-IN' },
  },
  'no_medicines': {
    en: { text: 'No medicines added yet', tts: 'No medicines added yet. Tap the plus button to add your first medicine.', ttsModel: 'en-US' },
    ur: { text: 'ابھی کوئی دوا شامل نہیں کی گئی', tts: 'ابھی کوئی دوا شامل نہیں کی گئی. اپنی پہلی دوا شامل کرنے کے لیے پلس بٹن دبائیں.', ttsModel: 'hi-IN' },
  },
  'smart_suggestions': {
    en: { text: 'Smart Suggestions', tts: 'Smart Suggestions', ttsModel: 'en-US' },
    ur: { text: 'ہوشیار تجاویز', tts: 'स्मार्ट सुझाव', ttsModel: 'hi-IN' },
  },
  'take_now': {
    en: { text: 'Take Now', tts: 'Take the medicine now', ttsModel: 'en-US' },
    ur: { text: 'اب لیں', tts: 'دوا اب لیں', ttsModel: 'hi-IN' },
  },

  // ============ Add Medicine Screen ============
  'add_medicine_title': {
    en: { text: 'Add Medicine', tts: 'Add a new medicine', ttsModel: 'en-US' },
    ur: { text: 'دوا شامل کریں', tts: 'نئی دوا شامل کریں', ttsModel: 'hi-IN' },
  },
  'prompt_medicine_name': {
    en: { text: 'Medicine Name', tts: 'Enter medicine name', ttsModel: 'en-US' },
    ur: { text: 'دوا کا نام', tts: 'دوا کا نام درج کریں', ttsModel: 'hi-IN' },
  },
  'prompt_dosage': {
    en: { text: 'Dosage', tts: 'Enter dosage', ttsModel: 'en-US' },
    ur: { text: 'خوراک', tts: 'خوراک درج کریں', ttsModel: 'hi-IN' },
  },
  'prompt_frequency': {
    en: { text: 'Frequency', tts: 'Select frequency', ttsModel: 'en-US' },
    ur: { text: 'تعدد', tts: 'تعدد منتخب کریں', ttsModel: 'hi-IN' },
  },
  'prompt_current_stock': {
    en: { text: 'Current Stock', tts: 'Enter current stock', ttsModel: 'en-US' },
    ur: { text: 'موجودہ اسٹاک', tts: 'موجودہ اسٹاک درج کریں', ttsModel: 'hi-IN' },
  },
  'medicine_added_success': {
    en: { text: 'Success!', tts: 'Medicine added successfully', ttsModel: 'en-US' },
    ur: { text: 'کامیاب!', tts: 'دوا کامیابی سے شامل ہو گئی', ttsModel: 'hi-IN' },
  },
  'validation_error': {
    en: { text: 'Validation Error', tts: 'Please fill all required fields', ttsModel: 'en-US' },
    ur: { text: 'توثیق کی خرابی', tts: 'براہ کرم تمام ضروری فیلڈز بھریں', ttsModel: 'hi-IN' },
  },

  // ============ Profile Screen ============
  'profile_title': {
    en: { text: 'Profile', tts: 'Profile', ttsModel: 'en-US' },
    ur: { text: 'پروفائل', tts: 'प्रोफाइल', ttsModel: 'hi-IN' },
  },
  'settings': {
    en: { text: 'Settings', tts: 'Settings', ttsModel: 'en-US' },
    ur: { text: 'سیٹنگز', tts: 'सेटिंग्स', ttsModel: 'hi-IN' },
  },
  'theme': {
    en: { text: 'Theme', tts: 'Theme', ttsModel: 'en-US' },
    ur: { text: 'تھیم', tts: 'थीम', ttsModel: 'hi-IN' },
  },
  'voice': {
    en: { text: 'Voice', tts: 'Voice settings', ttsModel: 'en-US' },
    ur: { text: 'آواز', tts: 'आवाज सेटिंग्स', ttsModel: 'hi-IN' },
  },
  'language': {
    en: { text: 'Language', tts: 'Select app language', ttsModel: 'en-US' },
    ur: { text: 'زبان', tts: 'ایپ کی زبان منتخب کریں', ttsModel: 'hi-IN' },
  },
  'english': {
    en: { text: 'English', tts: 'English', ttsModel: 'en-US' },
    ur: { text: 'انگریزی', tts: 'अंग्रेजी', ttsModel: 'hi-IN' },
  },
  'urdu': {
    en: { text: 'Urdu', tts: 'Urdu', ttsModel: 'en-US' },
    ur: { text: 'اردو', tts: 'उर्दू', ttsModel: 'hi-IN' },
  },
  'reset_data': {
    en: { text: 'Reset All Data', tts: 'Reset all data', ttsModel: 'en-US' },
    ur: { text: 'تمام ڈیٹا دوبارہ ترتیب دیں', tts: 'सभी डेटा रीसेट करें', ttsModel: 'hi-IN' },
  },
  'reset_confirmation': {
    en: { text: 'Are you sure?', tts: 'Are you sure you want to delete all your data? This action cannot be undone.', ttsModel: 'en-US' },
    ur: { text: 'کیا آپ یقینی ہیں؟', tts: 'کیا آپ یقینی ہیں کہ آپ اپنا تمام ڈیٹا حذف کرنا چاہتے ہیں؟', ttsModel: 'hi-IN' },
  },
  'install_voice_pack': {
    en: { text: 'Install Voice Pack', tts: 'Install voice pack', ttsModel: 'en-US' },
    ur: { text: 'آواز پیکج انسٹال کریں', tts: 'आवाज पैक इंस्टॉल करें', ttsModel: 'hi-IN' },
  },
  'voice_language': {
    en: { text: 'Voice Language', tts: 'Select voice language', ttsModel: 'en-US' },
    ur: { text: 'آواز کی زبان', tts: 'आवाज की भाषा चुनें', ttsModel: 'hi-IN' },
  },

  // ============ Alerts ============
  'alert_success': {
    en: { text: 'Success', tts: 'Operation completed successfully', ttsModel: 'en-US' },
    ur: { text: 'کامیاب', tts: 'عمل کامیابی سے مکمل ہوا', ttsModel: 'hi-IN' },
  },
  'alert_error': {
    en: { text: 'Error', tts: 'An error occurred', ttsModel: 'en-US' },
    ur: { text: 'خرابی', tts: 'ایک خرابی واقع ہوئی', ttsModel: 'hi-IN' },
  },

  // ============ Theme & Display ============
  'app_theme': {
    en: { text: 'App Theme', tts: 'App theme settings', ttsModel: 'en-US' },
    ur: { text: 'ایپ کا رنگ', tts: 'अप्प के थीम की सेटिंग', ttsModel: 'hi-IN' },
  },
  'light_mode': {
    en: { text: 'Light Mode', tts: 'Light mode', ttsModel: 'en-US' },
    ur: { text: 'روشن موڈ', tts: 'लाइट मोड', ttsModel: 'hi-IN' },
  },
  'dark_mode': {
    en: { text: 'Dark Mode', tts: 'Dark mode', ttsModel: 'en-US' },
    ur: { text: 'تاریک موڈ', tts: 'डार्क मोड', ttsModel: 'hi-IN' },
  },
  'system_mode': {
    en: { text: 'System', tts: 'System mode', ttsModel: 'en-US' },
    ur: { text: 'سسٹم', tts: 'सिस्टम मोड', ttsModel: 'hi-IN' },
  },
  'choose_language': {
    en: { text: 'Choose your preferred language for the app interface.', tts: 'Choose your preferred language for the app interface', ttsModel: 'en-US' },
    ur: { text: 'اپنی پسند کی زبان کا انتخاب کریں.', tts: 'अपनी पसंद की जुबां मुंतखिब करें', ttsModel: 'hi-IN' },
  },
  'native_name': {
    en: { text: 'Native Name', tts: 'Native name', ttsModel: 'en-US' },
    ur: { text: 'اصل نام', tts: 'اصل نام', ttsModel: 'hi-IN' },
  },
  'tap_to_edit_profile': {
    en: { text: 'Tap to edit profile', tts: 'Tap to edit profile', ttsModel: 'en-US' },
    ur: { text: 'پروفائل میں ترمیم کے لیے تھپتھپائیں', tts: 'प्रोफाइल संपादित करने के लिए टैप करें', ttsModel: 'hi-IN' },
  },
  'configure_language_behavior': {
    en: { text: 'Configure language & behavior', tts: 'Configure language and behavior', ttsModel: 'en-US' },
    ur: { text: 'زبان اور رویہ ترتیب دیں', tts: 'भाषा और व्यवहार कॉन्फ़िगर करें', ttsModel: 'hi-IN' },
  },
  'enable_voice_assistant': {
    en: { text: 'Enable Voice Assistant', tts: 'Enable voice assistant', ttsModel: 'en-US' },
    ur: { text: 'آواز کی مدد فعال کریں', tts: 'वॉयस सहायक सक्षम करें', ttsModel: 'hi-IN' },
  },
  'english_assistant': {
    en: { text: 'English Assistant', tts: 'English assistant', ttsModel: 'en-US' },
    ur: { text: 'انگریزی معاون', tts: 'अंग्रेजी सहायक', ttsModel: 'hi-IN' },
  },
  'speak_english_before_hindi': {
    en: { text: 'Speak English before Hindi?', tts: 'Speak English before Hindi', ttsModel: 'en-US' },
    ur: { text: 'ہندی سے پہلے انگریزی بولیں؟', tts: 'हिंदी से पहले अंग्रेजी बोलें', ttsModel: 'hi-IN' },
  },
  'select_voice_language': {
    en: { text: 'Select Voice Language', tts: 'Select voice language', ttsModel: 'en-US' },
    ur: { text: 'آواز کی زبان منتخب کریں', tts: 'वॉयस भाषा चुनें', ttsModel: 'hi-IN' },
  },
  'available_voices': {
    en: { text: 'Available Voices', tts: 'Available voices', ttsModel: 'en-US' },
    ur: { text: 'دستیاب آوازیں', tts: 'उपलब्ध आवाजें', ttsModel: 'hi-IN' },
  },
  'no_voices_available': {
    en: { text: 'No voices available for this language. Install a voice pack above.', tts: 'No voices available for this language. Install a voice pack', ttsModel: 'en-US' },
    ur: { text: 'اس زبان کے لیے کوئی آوازیں دستیاب نہیں۔ اوپر آواز پیکج انسٹال کریں۔', tts: 'इस भाषा के लिए कोई आवाजें उपलब्ध नहीं हैं। आवाज पैक इंस्टॉल करें', ttsModel: 'hi-IN' },
  },
  'back': {
    en: { text: '← Back', tts: 'Back', ttsModel: 'en-US' },
    ur: { text: '← واپس', tts: 'वापस जाएं', ttsModel: 'hi-IN' },
  },
  'download_for_offline': {
    en: { text: 'Download for offline use', tts: 'Download for offline use', ttsModel: 'en-US' },
    ur: { text: 'آف لائن استعمال کے لیے ڈاؤن لوڈ کریں', tts: 'ऑफ़लाइन उपयोग के लिए डाउनलोड करें', ttsModel: 'hi-IN' },
  },
  'deletes_all_medicines_settings': {
    en: { text: 'Deletes all medicines and settings', tts: 'Deletes all medicines and settings', ttsModel: 'en-US' },
    ur: { text: 'تمام ادویات اور سیٹنگز ڈلیٹ کریں', tts: 'तमाम अद्वियात और सेटिंग्स डिलीट करें', ttsModel: 'hi-IN' },
  },
  'done': {
    en: { text: 'Done', tts: 'Done', ttsModel: 'en-US' },
    ur: { text: 'ہو گیا', tts: 'हो गया', ttsModel: 'hi-IN' },
  },
  'continue': {
    en: { text: 'Continue', tts: 'Continue', ttsModel: 'en-US' },
    ur: { text: 'جاری رکھیں', tts: 'जारी रखें', ttsModel: 'hi-IN' },
  },
  'voice_assistant': {
    en: { text: 'Voice Assistant', tts: 'Voice assistant settings', ttsModel: 'en-US' },
    ur: { text: 'وائس اسسٹنٹ', tts: 'आवाज सहायक सेटिंग्स', ttsModel: 'hi-IN' },
  },
  'select_voice': {
    en: { text: 'Select Voice', tts: 'Select voice', ttsModel: 'en-US' },
    ur: { text: 'آواز منتخب کریں', tts: 'आवाज चुनें', ttsModel: 'hi-IN' },
  },
  'english_us': {
    en: { text: 'English (US)', tts: 'English', ttsModel: 'en-US' },
    ur: { text: 'انگریزی (امریکی)', tts: 'अंग्रेजी', ttsModel: 'hi-IN' },
  },
  'hindi_india': {
    en: { text: 'Hindi (India)', tts: 'Hindi', ttsModel: 'en-US' },
    ur: { text: 'ہندی (بھارت)', tts: 'हिंदी', ttsModel: 'hi-IN' },
  },
  'urdu_hindi': {
    en: { text: 'Urdu/Hindi', tts: 'Urdu Hindi', ttsModel: 'en-US' },
    ur: { text: 'اردو/ہندی', tts: 'उर्दू हिंदी', ttsModel: 'hi-IN' },
  },

  // ============ Add Medicine Wizard ============
  'scan_medicine': {
    en: { text: 'Scan Medicine', tts: 'Scan medicine', ttsModel: 'en-US' },
    ur: { text: 'دوا اسکین کریں', tts: 'दवा स्कैन करें', ttsModel: 'hi-IN' },
  },
  'reading_text': {
    en: { text: 'Finding Medicine...', tts: 'Finding medicine', ttsModel: 'en-US' },
    ur: { text: 'دوائی کا پتہ کیا جا رہا ہے...', tts: 'दवाई का पता किया जा रहा है', ttsModel: 'hi-IN' },
  },
  'what_is_it_called': {
    en: { text: 'What is it called?', tts: 'What is it called', ttsModel: 'en-US' },
    ur: { text: 'دوائی کا نام کیا ہے؟', tts: 'दवाई का नाम क्या है?', ttsModel: 'hi-IN' },
  },
  'medicine_name_placeholder': {
    en: { text: 'e.g., Panadol', tts: 'for example Panadol', ttsModel: 'en-US' },
    ur: { text: 'مثال: پیناڈول', tts: 'मिसाल के तौर पर पनडोल', ttsModel: 'hi-IN' },
  },
  'medicine_name_sublabel': {
    en: { text: 'Dawaai ka naam', tts: 'Medicine name', ttsModel: 'en-US' },
    ur: { text: 'دوائی کا نام', tts: 'दवाई का नाम', ttsModel: 'hi-IN' },
  },
  'frequency' : {
    en: { text: 'Frequency', tts: 'Frequency', ttsModel: 'en-US' },
    ur: { text: 'تعدد', tts: 'तादाद', ttsModel: 'hi-IN' },
  },
  'dosage_label': {
    en: { text: 'Dosage', tts: 'Dosage', ttsModel: 'en-US' },
    ur: { text: 'خوراک', tts: 'खुराक', ttsModel: 'hi-IN' },
  },
  'dosage_sublabel': {
    en: { text: 'In mg, mcg, etc.', tts: 'Strength in milligrams, mcg, etc.', ttsModel: 'en-US' },
    ur: { text: 'ملیگرام، مائیکروگرام، ملی لیٹر، وغیرہ میں دوا کی طاقت', tts: 'मिलीग्राम, माइक्रोग्राम, मिलीलीटर, आदि में दवा की ताकत', ttsModel: 'hi-IN' },
  },
  'dosage_placeholder': {
    en: { text: 'e.g., 500mg', tts: 'for example 500 milligrams', ttsModel: 'en-US' },
    ur: { text: 'مثال: 500mg', tts: 'मिसाल के तौर पर 500 मिलीग्राम', ttsModel: 'hi-IN' },
  },
  'how_often': {
    en: { text: 'How often?', tts: 'How often', ttsModel: 'en-US' },
    ur: { text: 'کتنی بار؟', tts: 'कितनी बार', ttsModel: 'hi-IN' },
  },
  'daily': {
    en: { text: 'Daily', tts: 'Once Daily', ttsModel: 'en-US' },
    ur: { text: 'روزانہ', tts: 'रोज़ाना', ttsModel: 'hi-IN' },
  },
  '2x_daily': {
    en: { text: '2x Daily', tts: 'Twice Daily', ttsModel: 'en-US' },
    ur: { text: 'دن میں 2 بار', tts: 'दिन में दो बार', ttsModel: 'hi-IN' },
  },
  '3x_daily': {
    en: { text: '3x Daily', tts: 'Thrice Daily', ttsModel: 'en-US' },
    ur: { text: 'دن میں 3 بار', tts: 'दिन में तीन बार', ttsModel: 'hi-IN' },
  },
  '4x_daily': {
    en: { text: '4x Daily', tts: 'Four Times Daily', ttsModel: 'en-US' },
    ur: { text: 'دن میں 4 بار', tts: 'दिन में चार बार', ttsModel: 'hi-IN' },
  },
  'weekly': {
    en: { text: 'Weekly', tts: 'Weekly', ttsModel: 'en-US' },
    ur: { text: 'ہفتہ وار', tts: 'हफ्तावार', ttsModel: 'hi-IN' },
  },
  'as_needed': {
    en: { text: 'As Needed', tts: 'As Needed', ttsModel: 'en-US' },
    ur: { text: 'ضرورت کے مطابق', tts: 'ज़रुरत के मुताबिक़', ttsModel: 'hi-IN' },
  },
  'set_timings': {
    en: { text: 'Set Timings', tts: 'Set timings', ttsModel: 'en-US' },
    ur: { text: 'اوقات مقرر کریں', tts: 'दवा खाने के औक़ात मुक़र्रर करें', ttsModel: 'hi-IN' },
  },
  'calculated_for_you': {
    en: { text: 'We calculated these for you. Tap to change.', tts: 'We calculated these for you. Tap to change', ttsModel: 'en-US' },
    ur: { text: 'وقت کا حساب ہم نے لگا لیا ہے۔ آپ چاہیں تو بدل لیں۔', tts: 'वक़्त का हिसाब हम न लगा लिया ह।  आप चाहें तोह बदल लें।', ttsModel: 'hi-IN' },
  },
  'dose': {
    en: { text: 'Dose', tts: 'Dose', ttsModel: 'en-US' },
    ur: { text: 'خوراک', tts: 'खुराक', ttsModel: 'hi-IN' },
  },
  'current_stock_label': {
    en: { text: 'Current Stock', tts: 'Current stock', ttsModel: 'en-US' },
    ur: { text: 'موجودہ ذخیرہ', tts: 'मौजूदा स्टॉक', ttsModel: 'hi-IN' },
  },
  'pills': {
    en: { text: 'Pills', tts: 'Pills', ttsModel: 'en-US' },
    ur: { text: 'گولیاں', tts: 'गोलियाँ', ttsModel: 'hi-IN' },
  },
  'strips': {
    en: { text: 'Strips', tts: 'Strips', ttsModel: 'en-US' },
    ur: { text: 'سٹرپس', tts: 'स्ट्रिप्स', ttsModel: 'hi-IN' },
  },
  'bottles': {
    en: { text: 'Bottles', tts: 'Bottles', ttsModel: 'en-US' },
    ur: { text: 'بوتلیں', tts: 'बोतलें', ttsModel: 'hi-IN' },
  },
  'stock_quantity_placeholder': {
    en: { text: 'Enter quantity', tts: 'Enter quantity', ttsModel: 'en-US' },
    ur: { text: 'مقدار درج کریں', tts: 'मात्रा दर्ज करें', ttsModel: 'hi-IN' },
  },
  'review_details': {
    en: { text: 'Review Details', tts: 'Review details', ttsModel: 'en-US' },
    ur: { text: 'تفصیلات کا جائزہ لیں', tts: 'विवरण की समीक्षा करें', ttsModel: 'hi-IN' },
  },
  'add_to_medicines': {
    en: { text: 'Add to My Medicines', tts: 'Add to my medicines', ttsModel: 'en-US' },
    ur: { text: 'میری ادویات میں شامل کریں', tts: 'मेरी दवाइयों में जोड़ें', ttsModel: 'hi-IN' },
  },

  // ============ Add Medicine Alerts ============
  'no_match_found': {
    en: { text: 'No Match Found', tts: 'No match found', ttsModel: 'en-US' },
    ur: { text: 'کوئی مماثلت نہیں ملی', tts: 'कोई मिलान नहीं मिला', ttsModel: 'hi-IN' },
  },
  'could_not_identify': {
    en: { text: 'Could not identify the medicine. Please enter details manually.', tts: 'Could not identify the medicine. Please enter details manually', ttsModel: 'en-US' },
    ur: { text: 'دوا کی شناخت نہیں ہو سکی۔ براہ کرم تفصیلات خود درج کریں۔', tts: 'दवा की पहचान नहीं हो सकी। कृपया विवरण मैन्युअल रूप से दर्ज करें', ttsModel: 'hi-IN' },
  },
  'network_error': {
    en: { text: 'Network Error', tts: 'Network error', ttsModel: 'en-US' },
    ur: { text: 'نیٹ ورک کی خرابی', tts: 'नेटवर्क त्रुटि', ttsModel: 'hi-IN' },
  },
  'internet_required': {
    en: { text: 'Internet required for scanning. Please try again.', tts: 'Internet required for scanning. Please try again', ttsModel: 'en-US' },
    ur: { text: 'اسکیننگ کے لیے انٹرنیٹ کی ضرورت ہے۔ براہ کرم دوبارہ کوشش کریں۔', tts: 'स्कैनिंग के लिए इंटरनेट की आवश्यकता है। कृपया पुनः प्रयास करें', ttsModel: 'hi-IN' },
  },
  'error_title': {
    en: { text: 'Error', tts: 'Error', ttsModel: 'en-US' },
    ur: { text: 'خرابی', tts: 'त्रुटि', ttsModel: 'hi-IN' },
  },
  'failed_take_picture': {
    en: { text: 'Failed to take picture. Please try again.', tts: 'Failed to take picture. Please try again', ttsModel: 'en-US' },
    ur: { text: 'تصویر لینے میں ناکامی۔ براہ کرم دوبارہ کوشش کریں۔', tts: 'तस्वीर लेने में विफल। कृपया पुनः प्रयास करें', ttsModel: 'hi-IN' },
  },
  'validation_error_title': {
    en: { text: 'Validation Error', tts: 'Validation error', ttsModel: 'en-US' },
    ur: { text: 'توثیق کی خرابی', tts: 'सत्यापन त्रुटि', ttsModel: 'hi-IN' },
  },
  'enter_medicine_name': {
    en: { text: 'Please enter the medicine name.', tts: 'Please enter the medicine name before proceeding', ttsModel: 'en-US' },
    ur: { text: 'براہ کرم دوا کا نام درج کریں۔', tts: 'कृपया दवा का नाम दर्ज करें', ttsModel: 'hi-IN' },
  },
  'enter_dosage': {
    en: { text: 'Please enter the dosage.', tts: 'Please enter the dosage before proceeding', ttsModel: 'en-US' },
    ur: { text: 'براہ کرم خوراک درج کریں۔', tts: 'कृपया खुराक दर्ज करें', ttsModel: 'hi-IN' },
  },
  'enter_valid_stock': {
    en: { text: 'Please enter a valid number of {type}.', tts: 'Please enter a valid number before proceeding', ttsModel: 'en-US' },
    ur: { text: 'براہ کرم {type} کی درست تعداد درج کریں۔', tts: 'कृपया एक वैध संख्या दर्ज करें', ttsModel: 'hi-IN' },
  },
  'medicine_added': {
    en: { text: '{name} has been added to your medicines.', tts: 'Medicine added successfully', ttsModel: 'en-US' },
    ur: { text: '{name} آپ کی ادویات میں شامل کر دی گئی ہے۔', tts: 'दवा सफलतापूर्वक जोड़ दी गई', ttsModel: 'hi-IN' },
  },

  // ============ Voice Prompts for Add Medicine ============
  'prompt_enter_name': {
    en: { text: 'Please enter medicine name.', tts: 'Please enter medicine name', ttsModel: 'en-US' },
    ur: { text: 'براہ کرم دوا کا نام درج کریں۔', tts: 'दवा का नाम दर्ज करें', ttsModel: 'hi-IN' },
  },
  'prompt_how_often': {
    en: { text: 'How often do you take this?', tts: 'How often do you take this', ttsModel: 'en-US' },
    ur: { text: 'آپ یہ کتنی بار لیتے ہیں؟', tts: 'आप यह दवा कितनी बार लेते हैं', ttsModel: 'hi-IN' },
  },
  'prompt_set_time': {
    en: { text: 'Set the time.', tts: 'Set the time', ttsModel: 'en-US' },
    ur: { text: 'وقت مقرر کریں۔', tts: 'वक़्त मुक़र्रर करें', ttsModel: 'hi-IN' },
  },
  'prompt_stock_amount': {
    en: { text: 'How much medicine do you have?', tts: 'How much medicine do you have', ttsModel: 'en-US' },
    ur: { text: 'آپ کے پاس کتنی دوا ہے؟', tts: 'आपके पास कितनी दवा है', ttsModel: 'hi-IN' },
  },
  'prompt_detected_medicine': {
    en: { text: 'Detected medicine: {name}, Dosage: {dosage}', tts: 'Detected medicine', ttsModel: 'en-US' },
    ur: { text: 'دوا کی شناخت: {name}، خوراک: {dosage}', tts: 'दवा की पहचान हुई', ttsModel: 'hi-IN' },
  },
  'prompt_select_frequency': {
    en: { text: 'Select how often you take this medicine.', tts: 'Select how often you take this medicine.', ttsModel: 'en-US' },
    ur: { text: 'منتخب کریں کہ آپ یہ دن میں کتنی بار لیتے ہیں', tts: 'आप ये दवा कितनी बार लेते हैं?', ttsModel: 'hi-IN' },
  },
  'next_step': {
    en: { text: 'Next Step', tts: 'Next step', ttsModel: 'en-US' },
    ur: { text: 'اگلا مرحلہ', tts: 'अगला मरहला', ttsModel: 'hi-IN' },
  },
  'camera_permission_needed': {
    en: { text: 'We need access to your camera to scan medicine labels.', tts: 'We need camera access to scan medicine labels', ttsModel: 'en-US' },
    ur: { text: 'ہمیں دوا کے لیبل اسکین کرنے کے لیے آپ کے کیمرے تک رسائی کی ضرورت ہے۔', tts: 'हमें दवा के लेबल स्कैन करने के लिए कैमरा एक्सेस की आवश्यकता है', ttsModel: 'hi-IN' },
  },
  'enable_camera': {
    en: { text: 'Enable Camera', tts: 'Enable camera', ttsModel: 'en-US' },
    ur: { text: 'کیمرہ آن کریں', tts: 'कैमरा ऑन करें', ttsModel: 'hi-IN' },
  },

  // ============ Home Screen ============
  'good_morning': {
    en: { text: 'Good Morning', tts: 'Good morning', ttsModel: 'en-US' },
    ur: { text: 'صبح بخیر', tts: 'सुप्रभात', ttsModel: 'hi-IN' },
  },
  'good_afternoon': {
    en: { text: 'Good Afternoon', tts: 'Good afternoon', ttsModel: 'en-US' },
    ur: { text: 'سہ پہر بخیر', tts: 'शुभ दोपहर', ttsModel: 'hi-IN' },
  },
  'good_evening': {
    en: { text: 'Good Evening', tts: 'Good evening', ttsModel: 'en-US' },
    ur: { text: 'شام بخیر', tts: 'शुभ संध्या', ttsModel: 'hi-IN' },
  },
  'no_medicines_scheduled': {
    en: { text: 'No medicines scheduled.', tts: 'No medicines scheduled', ttsModel: 'en-US' },
    ur: { text: 'کوئی دوائیں طے شدہ نہیں۔', tts: 'कोई दवाइयां निर्धारित नहीं हैं', ttsModel: 'hi-IN' },
  },
  'doses_left': {
    en: { text: 'You have {count} doses left.', tts: 'You have doses left', ttsModel: 'en-US' },
    ur: { text: 'آپ کے پاس {count} خوراکیں باقی ہیں۔', tts: 'आपके पास खुराकें शेष हैं', ttsModel: 'hi-IN' },
  },
  'smart_suggestions_title': {
    en: { text: 'Smart Suggestions', tts: 'Smart suggestions', ttsModel: 'en-US' },
    ur: { text: 'ہوشیار تجاویز', tts: 'स्मार्ट सुझाव', ttsModel: 'hi-IN' },
  },
  'check_medicines_tips': {
    en: { text: 'Check your medicines for tips', tts: 'Check your medicines for tips', ttsModel: 'en-US' },
    ur: { text: 'تجاویز کے لیے اپنی دوائیں چیک کریں', tts: 'सुझावों के लिए अपनी दवाइयां देखें', ttsModel: 'hi-IN' },
  },
  'no_medicines_title': {
    en: { text: 'No Medicines', tts: 'No medicines', ttsModel: 'en-US' },
    ur: { text: 'کوئی دوائیں نہیں', tts: 'कोई दवाइयां नहीं', ttsModel: 'hi-IN' },
  },
  'add_first_prescription': {
    en: { text: 'Tap the + button to add your first prescription.', tts: 'Tap the plus button to add your first prescription', ttsModel: 'en-US' },
    ur: { text: 'اپنی پہلی نسخہ شامل کرنے کے لیے + بٹن دبائیں۔', tts: 'अपनी पहली दवा जोड़ने के लिए प्लस बटन दबाएं', ttsModel: 'hi-IN' },
  },
  'to_take': {
    en: { text: 'To Take', tts: 'To take', ttsModel: 'en-US' },
    ur: { text: 'لینے کے لیے', tts: 'लेने के लिए', ttsModel: 'hi-IN' },
  },
  'remaining': {
    en: { text: 'Remaining', tts: 'Remaining', ttsModel: 'en-US' },
    ur: { text: 'باقی', tts: 'शेष', ttsModel: 'hi-IN' },
  },
  'manage_medicine': {
    en: { text: 'Manage Medicine', tts: 'Manage medicine', ttsModel: 'en-US' },
    ur: { text: 'دوائی میں تبدیلی', tts: 'दवाई में तब्दीली', ttsModel: 'hi-IN' },
  },
  'edit_details': {
    en: { text: 'Edit Details', tts: 'Edit details', ttsModel: 'en-US' },
    ur: { text: 'تفصیلات بدلیں', tts: 'तफ्सीलात बदलें', ttsModel: 'hi-IN' },
  },
  'delete_medicine_confirm': {
    en: { text: 'Delete Medicine?', tts: 'Delete medicine', ttsModel: 'en-US' },
    ur: { text: 'دوا ڈلیٹ کریں؟', tts: 'दवा डिलीट करें?', ttsModel: 'hi-IN' },
  },
  'action_cannot_undone': {
    en: { text: 'This action cannot be undone.', tts: 'This action cannot be undone', ttsModel: 'en-US' },
    ur: { text: 'یہ عمل واپس نہیں ہو سکتا', tts: 'यह अमल वापस नहीं हो सकता', ttsModel: 'hi-IN' },
  },
  'close_menu': {
    en: { text: 'Close Menu', tts: 'Close menu', ttsModel: 'en-US' },
    ur: { text: 'مینو بند کریں', tts: 'मेनू बंद करें', ttsModel: 'hi-IN' },
  },
  'completed_today': {
    en: { text: 'Completed Today', tts: 'Completed today', ttsModel: 'en-US' },
    ur: { text: 'آج کیلئے مکمّل', tts: 'आज केलिए मुकम्मल', ttsModel: 'hi-IN' },
  },

  // ============ Confirmation Modal ============
  'confirm_dose': {
    en: { text: 'Confirm Dose', tts: 'Confirm dose', ttsModel: 'en-US' },
    ur: { text: 'خوراک کی تصدیق کریں', tts: 'खुराक की पुष्टि करें', ttsModel: 'hi-IN' },
  },
  'confirm_dose_removal': {
    en: { text: 'Confirm Dose Removal', tts: 'Confirm dose removal', ttsModel: 'en-US' },
    ur: { text: 'خوراک ہٹانے کی تصدیق کریں', tts: 'खुराक हटाने की पुष्टि करें', ttsModel: 'hi-IN' },
  },
  'mark_as_taken': {
    en: { text: 'Mark {name} as taken?', tts: 'Mark as taken', ttsModel: 'en-US' },
    ur: { text: '{name} کو لیا ہوا نشان زد کریں؟', tts: 'लिया हुआ चिह्नित करें', ttsModel: 'hi-IN' },
  },
  'unmark_as_taken': {
    en: { text: 'Unmark {name} as taken?', tts: 'Unmark as taken', ttsModel: 'en-US' },
    ur: { text: '{name} کو لیا ہوا نشان سے ہٹائیں؟', tts: 'लिया हुआ से हटाएं', ttsModel: 'hi-IN' },
  },
  'press_again': {
    en: { text: 'Press Again!', tts: 'Press again to confirm', ttsModel: 'en-US' },
    ur: { text: 'دوبارہ دبائیں!', tts: 'तसदीक केलिए दुबारा दबाएं।', ttsModel: 'hi-IN' },
  },
  'yes_taken': {
    en: { text: 'Yes, Taken', tts: 'Yes taken', ttsModel: 'en-US' },
    ur: { text: 'ہاں، لیا', tts: 'हां लेली', ttsModel: 'hi-IN' },
  },
  'yes_remove': {
    en: { text: 'Yes, Remove', tts: 'Yes remove', ttsModel: 'en-US' },
    ur: { text: 'ہاں، ہٹائیں', tts: 'हां हटाएं', ttsModel: 'hi-IN' },
  },
  'no_cancel': {
    en: { text: 'No, Cancel', tts: 'No cancel', ttsModel: 'en-US' },
    ur: { text: 'نہیں، منسوخ کریں', tts: 'नहीं रद्द करें', ttsModel: 'hi-IN' },
  },
  'have_you_taken': {
    en: { text: 'Have you taken {name}?', tts: 'Have you taken this medicine', ttsModel: 'en-US' },
    ur: { text: 'کیا آپ نے {name} لی ہے؟', tts: 'क्या आपने यह दवा खा ली है?', ttsModel: 'hi-IN' },
  },
  'unmark_question': {
    en: { text: 'Do you want to unmark {name} as taken today?', tts: 'Do you want to unmark as taken today', ttsModel: 'en-US' },
    ur: { text: 'کیا آپ آج {name} کو لیا ہوا سے ہٹانا چاہتے ہیں؟', tts: 'क्या आप आज लिया हुआ से हटाना चाहते हैं', ttsModel: 'hi-IN' },
  },

  // ============ Edit Medicine Modal ============
  'edit_medicine': {
    en: { text: 'Edit Medicine', tts: 'Edit medicine', ttsModel: 'en-US' },
    ur: { text: 'دوائی میں ترمیم کریں', tts: 'दवा संपादित करें', ttsModel: 'hi-IN' },
  },
  'medicine_name': {
    en: { text: 'Medicine Name', tts: 'Medicine name', ttsModel: 'en-US' },
    ur: { text: 'دوائی کا نام', tts: 'दवा का नाम', ttsModel: 'hi-IN' },
  },
  'stock_level': {
    en: { text: 'Stock Level', tts: 'Stock level', ttsModel: 'en-US' },
    ur: { text: 'اسٹاک کی سطح', tts: 'स्टॉक स्तर', ttsModel: 'hi-IN' },
  },
  'schedule': {
    en: { text: 'Schedule', tts: 'Schedule', ttsModel: 'en-US' },
    ur: { text: 'شیڈول', tts: 'शेड्यूल', ttsModel: 'hi-IN' },
  },
  'save_changes': {
    en: { text: 'Save Changes', tts: 'Save changes', ttsModel: 'en-US' },
    ur: { text: 'تبدیلیاں محفوظ کریں', tts: 'परिवर्तन सहेजें', ttsModel: 'hi-IN' },
  },
  'delete_medicine': {
    en: { text: 'Delete Medicine', tts: 'Delete medicine', ttsModel: 'en-US' },
    ur: { text: 'دوائی حذف کریں', tts: 'दवा हटाएं', ttsModel: 'hi-IN' },
  },
  'delete_medicine_question': {
    en: { text: 'Are you sure you want to delete this medicine?', tts: 'Are you sure you want to delete this medicine', ttsModel: 'en-US' },
    ur: { text: 'کیا آپ واقعی یہ دوائی حذف کرنا چاہتے ہیں؟', tts: 'क्या आप वाकई यह दवा हटाना चाहते हैं', ttsModel: 'hi-IN' },
  },
  'dose_at': {
    en: { text: 'Dose at {time}.', tts: 'Dose at', ttsModel: 'en-US' },
    ur: { text: '{time} پر خوراک۔', tts: 'खुराक का समय', ttsModel: 'hi-IN' },
  },

  // ============ Common labels used in cards/modals ============
  'smart_tip': {
    en: { text: 'Smart Tip', tts: 'Smart tip', ttsModel: 'en-US' },
    ur: { text: 'سمارٹ مشورہ', tts: 'स्मार्ट सुझाव', ttsModel: 'hi-IN' },
  },
  'medicine': {
    en: { text: 'Medicine', tts: 'Medicine', ttsModel: 'en-US' },
    ur: { text: 'دوائی', tts: 'दवा', ttsModel: 'hi-IN' },
  },
  'dosage': {
    en: { text: 'Dosage', tts: 'Dosage', ttsModel: 'en-US' },
    ur: { text: 'خوراک', tts: 'खुराक', ttsModel: 'hi-IN' },
  },

  // ============ Edit Profile Modal ============
  'edit_profile': {
    en: { text: 'Edit Profile', tts: 'Edit profile', ttsModel: 'en-US' },
    ur: { text: 'پروفائل میں ترمیم کریں', tts: 'प्रोफ़ाइल संपादित करें', ttsModel: 'hi-IN' },
  },
  'display_name': {
    en: { text: 'Display Name', tts: 'Display name', ttsModel: 'en-US' },
    ur: { text: 'ظاہری نام', tts: 'प्रदर्शित नाम', ttsModel: 'hi-IN' },
  },
  'save_profile': {
    en: { text: 'Save Profile', tts: 'Save profile', ttsModel: 'en-US' },
    ur: { text: 'پروفائل محفوظ کریں', tts: 'प्रोफ़ाइल सहेजें', ttsModel: 'hi-IN' },
  },

  // ============ Tab Bar Labels ============
  'home': {
    en: { text: 'Home', tts: 'Home', ttsModel: 'en-US' },
    ur: { text: 'ہوم', tts: 'होम', ttsModel: 'hi-IN' },
  },
  'profile': {
    en: { text: 'Profile', tts: 'Profile', ttsModel: 'en-US' },
    ur: { text: 'پروفائل', tts: 'प्रोफ़ाइल', ttsModel: 'hi-IN' },
  },
  'add': {
    en: { text: 'Add', tts: 'Add', ttsModel: 'en-US' },
    ur: { text: 'شامل کریں', tts: 'जोड़ें', ttsModel: 'hi-IN' },
  },

  // ============ Additional Alert Strings ============
  'what_would_you_like': {
    en: { text: 'What would you like to do with', tts: 'What would you like to do with', ttsModel: 'en-US' },
    ur: { text: 'آپ کیا کرنا چاہیں گے', tts: 'आप क्या करना चाहेंगे', ttsModel: 'hi-IN' },
  },
  'delete_action': {
    en: { text: 'Delete', tts: 'Delete', ttsModel: 'en-US' },
    ur: { text: 'ڈلیٹ کریں', tts: 'हटाएं', ttsModel: 'hi-IN' },
  },
  'alert': {
    en: { text: 'Alert!', tts: 'Alert', ttsModel: 'en-US' },
    ur: { text: 'الرٹ!', tts: 'अलर्ट', ttsModel: 'hi-IN' },
  },
  'first_option': {
    en: { text: 'First Option', tts: 'First option', ttsModel: 'en-US' },
    ur: { text: 'پہلا آپشن', tts: 'पहला ऑप्शन', ttsModel: 'hi-IN' },
  },
  'second_option': {
    en: { text: 'Second Option', tts: 'Second option', ttsModel: 'en-US' },
    ur: { text: 'دوسرا آپشن', tts: 'दूसरा ऑप्शन', ttsModel: 'hi-IN' },
  },
  'third_option': {
    en: { text: 'Third Option', tts: 'Third option', ttsModel: 'en-US' },
    ur: { text: 'تیسرا آپشن', tts: 'तीसरा ऑप्शन', ttsModel: 'hi-IN' },
  },

  // ============ Accessibility Features ============
  'text_size': {
    en: { text: 'Text Size', tts: 'Text size settings', ttsModel: 'en-US' },
    ur: { text: 'متن کی سائز', tts: 'टेक्स्ट आकार सेटिंग', ttsModel: 'hi-IN' },
  },
  'adjust_text_for_readability': {
    en: { text: 'Adjust text for better readability', tts: 'Adjust text size for better readability', ttsModel: 'en-US' },
    ur: { text: 'بہتر پڑھنے کے لیے متن کو ایڈجسٹ کریں', tts: 'बेहतर पठनीयता के लिए पाठ का आकार समायोजित करें', ttsModel: 'hi-IN' },
  },
  'text_size_preview': {
    en: { text: 'This is how your medicine names and instructions will appear.', tts: 'This is how your medicine names and instructions will appear', ttsModel: 'en-US' },
    ur: { text: 'یہ ہے کہ آپ کے دوائیں کے نام اور ہدایات کیسے ظاہر ہوں گے۔', tts: 'यह है कि आपकी दवा के नाम और निर्देश कैसे प्रदर्शित होंगे', ttsModel: 'hi-IN' },
  },
  'high_contrast': {
    en: { text: 'High Contrast Mode', tts: 'High contrast mode', ttsModel: 'en-US' },
    ur: { text: 'اعلیٰ کنٹراسٹ موڈ', tts: 'उच्च कंट्रास्ट मोड', ttsModel: 'hi-IN' },
  },
  'bold_colors_for_visibility': {
    en: { text: 'Use bold colors for better visibility', tts: 'Use bold colors for better visibility', ttsModel: 'en-US' },
    ur: { text: 'بہتر نظر آنے کے لیے بولڈ رنگ استعمال کریں', tts: 'बेहतर दृश्यमानता के लिए बोल्ड रंग का उपयोग करें', ttsModel: 'hi-IN' },
  },
  'simplified_mode': {
    en: { text: 'Simplified Mode', tts: 'Simplified mode', ttsModel: 'en-US' },
    ur: { text: 'آسان موڈ', tts: 'सरलीकृत मोड', ttsModel: 'hi-IN' },
  },
  'show_essential_buttons_only': {
    en: { text: 'Show only essential buttons and options', tts: 'Show only essential buttons and options', ttsModel: 'en-US' },
    ur: { text: 'صرف ضروری بٹنوں اور آپشنز دکھائیں', tts: 'केवल आवश्यक बटन और विकल्प दिखाएं', ttsModel: 'hi-IN' },
  },
  'tap_anywhere_to_close': {
    en: { text: 'Tap anywhere to close', tts: 'Tap anywhere to close', ttsModel: 'en-US' },
    ur: { text: 'بند کرنے کے لیے کہیں بھی ٹیپ کریں', tts: 'बंद करने के लिए कहीं भी टैप करें', ttsModel: 'hi-IN' },
  },
  // Note: 'deletes_all_medicines_settings' is defined earlier; avoid duplicate key here.

  // ============ Audio Confirmations ============
  'dose_marked_taken': {
    en: { text: 'Dose marked as taken', tts: 'Dose marked as taken', ttsModel: 'en-US' },
    ur: { text: 'خوراک لی گئی کے طور پر نشان زد', tts: 'खुराक लिए गए के रूप में चिह्नित', ttsModel: 'hi-IN' },
  },
  'dose_unmarked': {
    en: { text: 'Dose unmarked', tts: 'Dose unmarked', ttsModel: 'en-US' },
    ur: { text: 'خوراک غیر نشان زد', tts: 'खुराक अचिह्नित', ttsModel: 'hi-IN' },
  },
  'medicine_added_successfully': {
    en: { text: 'Medicine added successfully', tts: 'Medicine added successfully', ttsModel: 'en-US' },
    ur: { text: 'دوا کامیابی سے شامل ہو گئی', tts: 'दवा सफलतापूर्वक जोड़ी गई', ttsModel: 'hi-IN' },
  },
  'medicine_deleted': {
    en: { text: 'Medicine deleted', tts: 'Medicine deleted', ttsModel: 'en-US' },
    ur: { text: 'دوا حذف کر دی گئی', tts: 'दवा हटा दी गई', ttsModel: 'hi-IN' },
  },
  'settings_saved': {
    en: { text: 'Settings saved', tts: 'Settings saved successfully', ttsModel: 'en-US' },
    ur: { text: 'سیٹنگز محفوظ ہو گئیں', tts: 'सेटिंग्स सफलतापूर्वक सहेजी गईं', ttsModel: 'hi-IN' },
  },

  // ============ Onboarding ============
  'onboarding_welcome': {
    en: { text: 'Welcome to Dawaai Dost', tts: 'Welcome to Dawaai Dost, your medicine companion', ttsModel: 'en-US' },
    ur: { text: 'دوائی دوست میں خوش آمدید', tts: 'दवाई दोस्त में आपका स्वागत है', ttsModel: 'hi-IN' },
  },
  'onboarding_subtitle': {
    en: { text: 'Your trusted medicine companion', tts: 'Your trusted medicine companion', ttsModel: 'en-US' },
    ur: { text: 'آپ کا قابل اعتماد دوا ساتھی', tts: 'आपका भरोसेमंद दवा साथी', ttsModel: 'hi-IN' },
  },
  'onboarding_lets_begin': {
    en: { text: "Let's Begin", tts: "Let's begin setting up your app", ttsModel: 'en-US' },
    ur: { text: 'آئیے شروع کریں', tts: 'चलिए शुरू करते हैं', ttsModel: 'hi-IN' },
  },
  'onboarding_skip': {
    en: { text: 'Skip', tts: 'Skip onboarding', ttsModel: 'en-US' },
    ur: { text: 'چھوڑیں', tts: 'छोड़ें', ttsModel: 'hi-IN' },
  },
  'onboarding_next': {
    en: { text: 'Next', tts: 'Next', ttsModel: 'en-US' },
    ur: { text: 'اگلا', tts: 'अगला', ttsModel: 'hi-IN' },
  },
  'onboarding_back': {
    en: { text: 'Back', tts: 'Go back', ttsModel: 'en-US' },
    ur: { text: 'واپس', tts: 'वापस जाएँ', ttsModel: 'hi-IN' },
  },
  'onboarding_finish': {
    en: { text: 'Get Started', tts: 'Get started with the app', ttsModel: 'en-US' },
    ur: { text: 'شروع کریں', tts: 'शुरू करें', ttsModel: 'hi-IN' },
  },
  'onboarding_language_title': {
    en: { text: 'Choose Your Language', tts: 'Choose your preferred language for the app', ttsModel: 'en-US' },
    ur: { text: 'اپنی زبان منتخب کریں', tts: 'अपनी भाषा चुनें', ttsModel: 'hi-IN' },
  },
  'onboarding_language_description': {
    en: { text: 'Select the language you are most comfortable with', tts: 'Select the language you are most comfortable with', ttsModel: 'en-US' },
    ur: { text: 'وہ زبان منتخب کریں جو آپ کے لیے سب سے آسان ہو', tts: 'वह भाषा चुनें जो आपके लिए सबसे आसान हो', ttsModel: 'hi-IN' },
  },
  'onboarding_voice_title': {
    en: { text: 'Voice Assistant', tts: 'Voice assistant settings', ttsModel: 'en-US' },
    ur: { text: 'آواز کا معاون', tts: 'आवाज़ सहायक', ttsModel: 'hi-IN' },
  },
  'onboarding_voice_description': {
    en: { text: 'Enable voice guidance to help you navigate the app', tts: 'Enable voice guidance to help you navigate the app', ttsModel: 'en-US' },
    ur: { text: 'ایپ میں راستہ دکھانے کے لیے آواز کی رہنمائی فعال کریں', tts: 'ऐप में रास्ता दिखाने के लिए आवाज़ की मार्गदर्शिका सक्षम करें', ttsModel: 'hi-IN' },
  },
  'onboarding_voice_enable': {
    en: { text: 'Enable Voice Assistant', tts: 'Enable voice assistant', ttsModel: 'en-US' },
    ur: { text: 'آواز کا معاون فعال کریں', tts: 'आवाज़ सहायक सक्षम करें', ttsModel: 'hi-IN' },
  },
  'onboarding_voice_mode_title': {
    en: { text: 'Voice Mode', tts: 'Select voice mode', ttsModel: 'en-US' },
    ur: { text: 'آواز کا طریقہ', tts: 'आवाज़ मोड', ttsModel: 'hi-IN' },
  },
  'onboarding_voice_dual': {
    en: { text: 'Dual Language', tts: 'Dual language. Speaks in both English and Urdu', ttsModel: 'en-US' },
    ur: { text: 'دو زبانیں', tts: 'दोहरी भाषा। अंग्रेजी और उर्दू दोनों में बोलता है', ttsModel: 'hi-IN' },
  },
  'onboarding_voice_urdu_only': {
    en: { text: 'Urdu Only', tts: 'Urdu only. Speaks only in Urdu', ttsModel: 'en-US' },
    ur: { text: 'صرف اردو', tts: 'केवल उर्दू। केवल उर्दू में बोलता है', ttsModel: 'hi-IN' },
  },
  'onboarding_features_title': {
    en: { text: 'Key Features', tts: 'Let me show you the key features of the app', ttsModel: 'en-US' },
    ur: { text: 'اہم خصوصیات', tts: 'मैं आपको ऐप की मुख्य सुविधाएं दिखाता हूं', ttsModel: 'hi-IN' },
  },
  'onboarding_features_caption': {
    en: { text: 'Let’s explore how to use the app effectively', tts: 'Let’s explore how to use the app effectively', ttsModel: 'en-US' },
    ur: { text: 'آئیے دیکھتے ہیں ایپ کو مؤثر طریقے سے کیسے استعمال کریں', tts: 'चलो देखते हैं ऐप को असरदार तरीके से कैसे इस्तेमाल करें', ttsModel: 'hi-IN' },
  },
  'onboarding_add_medicine_title': {
    en: { text: 'Add Your Medicines', tts: 'Add your medicines by tapping the plus button', ttsModel: 'en-US' },
    ur: { text: 'اپنی دوائیں شامل کریں', tts: 'प्लस बटन को टैप करके अपनी दवाएं जोड़ें', ttsModel: 'hi-IN' },
  },
  'onboarding_add_medicine_description': {
    en: { text: 'Tap the + button at the bottom to add a new medicine. You can enter the name, dosage, and schedule.', tts: 'Tap the plus button at the bottom to add a new medicine. You can enter the name, dosage, and schedule', ttsModel: 'en-US' },
    ur: { text: 'نئی دوا شامل کرنے کے لیے نیچے + بٹن دبائیں۔ آپ نام، خوراک اور شیڈول درج کر سکتے ہیں۔', tts: 'नई दवा जोड़ने के लिए नीचे प्लस बटन दबाएं। आप नाम, खुराक और शेड्यूल दर्ज कर सकते हैं', ttsModel: 'hi-IN' },
  },
  'onboarding_mark_dose_title': {
    en: { text: 'Mark Doses Taken', tts: 'Mark doses as taken by tapping the time slot', ttsModel: 'en-US' },
    ur: { text: 'لی گئی خوراکوں کو نشان زد کریں', tts: 'समय स्लॉट को टैप करके खुराक को लिया गया चिह्नित करें', ttsModel: 'hi-IN' },
  },
  'onboarding_mark_dose_description': {
    en: { text: 'Tap on a time slot pill to mark that dose as taken. The color will change to show completion.', tts: 'Tap on a time slot pill to mark that dose as taken. The color will change to show completion', ttsModel: 'en-US' },
    ur: { text: 'اس خوراک کو لی گئی کے طور پر نشان زد کرنے کے لیے ٹائم سلاٹ گولی پر تھپتھپائیں۔ تکمیل ظاہر کرنے کے لیے رنگ بدل جائے گا۔', tts: 'उस खुराक को लिया गया चिह्नित करने के लिए टाइम स्लॉट पिल पर टैप करें। पूर्णता दिखाने के लिए रंग बदल जाएगा', ttsModel: 'hi-IN' },
  },
  'onboarding_edit_medicine_title': {
    en: { text: 'Edit or Delete', tts: 'Edit or delete medicines by holding on the card', ttsModel: 'en-US' },
    ur: { text: 'ترمیم یا حذف', tts: 'कार्ड को होल्ड करके दवाएं संपादित या हटाएं', ttsModel: 'hi-IN' },
  },
  'onboarding_edit_medicine_description': {
    en: { text: 'Press and hold anywhere on a medicine card to see options. You can edit details or delete the medicine.', tts: 'Press and hold anywhere on a medicine card to see options. You can edit details or delete the medicine', ttsModel: 'en-US' },
    ur: { text: 'اختیارات دیکھنے کے لیے دوا کارڈ پر کہیں بھی دبائیں اور دبائے رکھیں۔ آپ تفصیلات میں ترمیم یا دوا حذف کر سکتے ہیں۔', tts: 'विकल्प देखने के लिए दवा कार्ड पर कहीं भी दबाएं और होल्ड करें। आप विवरण संपादित कर सकते हैं या दवा हटा सकते हैं', ttsModel: 'hi-IN' },
  },
  'onboarding_smart_suggestions_title': {
    en: { text: 'Smart Suggestions', tts: 'Smart suggestions help you stay on track', ttsModel: 'en-US' },
    ur: { text: 'ہوشیار تجاویز', tts: 'स्मार्ट सुझाव आपको ट्रैक पर रखने में मदद करते हैं', ttsModel: 'hi-IN' },
  },
  'onboarding_smart_suggestions_description': {
    en: { text: 'The app will show you medicines that are due soon at the top of your list with a "Take Now" button.', tts: 'The app will show you medicines that are due soon at the top of your list with a Take Now button', ttsModel: 'en-US' },
    ur: { text: 'ایپ آپ کی فہرست کے اوپر جلد آنے والی دوائیں "اب لیں" بٹن کے ساتھ دکھائے گی۔', tts: 'ऐप आपकी सूची के शीर्ष पर जल्द आने वाली दवाएं "अब लें" बटन के साथ दिखाएगा', ttsModel: 'hi-IN' },
  },
  'onboarding_profile_title': {
    en: { text: 'Your Profile', tts: 'Customize your profile and settings', ttsModel: 'en-US' },
    ur: { text: 'آپ کی پروفائل', tts: 'अपनी प्रोफ़ाइल और सेटिंग्स को अनुकूलित करें', ttsModel: 'hi-IN' },
  },
  'onboarding_profile_description': {
    en: { text: 'Visit the Profile tab to change your settings, adjust text size, theme, and more. You can also replay this tutorial anytime.', tts: 'Visit the Profile tab to change your settings, adjust text size, theme, and more. You can also replay this tutorial anytime', ttsModel: 'en-US' },
    ur: { text: 'اپنی ترتیبات تبدیل کرنے، متن کا سائز، تھیم اور مزید ایڈجسٹ کرنے کے لیے پروفائل ٹیب ملاحظہ کریں۔ آپ یہ ٹیوٹوریل کبھی بھی دوبارہ چلا سکتے ہیں۔', tts: 'अपनी सेटिंग्स बदलने, पाठ आकार, थीम और अधिक समायोजित करने के लिए प्रोफ़ाइल टैब पर जाएं। आप यह ट्यूटोरियल कभी भी दोबारा चला सकते हैं', ttsModel: 'hi-IN' },
  },
  'onboarding_ready_title': {
    en: { text: "You're All Set!", tts: "You're all set! Let's start managing your medicines", ttsModel: 'en-US' },
    ur: { text: 'آپ تیار ہیں!', tts: 'आप तैयार हैं! चलिए अपनी दवाओं का प्रबंधन शुरू करते हैं', ttsModel: 'hi-IN' },
  },
  'onboarding_ready_description': {
    en: { text: 'You can now start adding your medicines and never miss a dose. Tap below to get started!', tts: 'You can now start adding your medicines and never miss a dose. Tap below to get started', ttsModel: 'en-US' },
    ur: { text: 'اب آپ اپنی دوائیں شامل کرنا شروع کر سکتے ہیں اور کبھی خوراک نہیں چھوڑیں۔ شروع کرنے کے لیے نیچے تھپتھپائیں!', tts: 'अब आप अपनी दवाएं जोड़ना शुरू कर सکتے हैं और कभी खुराक नहीं चूकेंगे। शुरू करने के लिए नीचे टैप करें', ttsModel: 'hi-IN' },
  },
  'onboarding_tap_here': {
    en: { text: 'Tap here', tts: 'Tap here', ttsModel: 'en-US' },
    ur: { text: 'یہاں تھپتھپائیں', tts: 'यहाँ टैप करें', ttsModel: 'hi-IN' },
  },
  'replay_tutorial': {
    en: { text: 'Replay Tutorial', tts: 'Replay the onboarding tutorial', ttsModel: 'en-US' },
    ur: { text: 'ٹیوٹوریل دوبارہ چلائیں', tts: 'ट्यूटोरियल फिर से चलाएं', ttsModel: 'hi-IN' },
  },
};

export function getLocalizedTTS(key: string, language: Language): string {
  return STRINGS[key]?.[language]?.tts ?? STRINGS[key]?.[language]?.text ?? key;
}

export function getString(key: string, language: Language): string {
  return STRINGS[key]?.[language]?.text ?? key;
}

export function getTTSString(key: string, language: Language): { text: string; model: string } {
  const str = STRINGS[key]?.[language];
  return {
    text: str?.tts ?? STRINGS[key]?.[language]?.text ?? key,
    model: str?.ttsModel ?? 'en-US',
  };
}

export function getTTSModel(key: string, language: Language): string {
  return STRINGS[key]?.[language]?.ttsModel ?? 'en-US';
}
