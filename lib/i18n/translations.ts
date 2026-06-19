
export type Language = 'en' | 'ar';

export type TranslationKeys =
    | 'hero.greeting'
    | 'hero.title_prefix'
    | 'hero.title_highlight'
    | 'hero.subtitle'
    | 'hero.description'
    | 'hero.cta_primary'
    | 'hero.cta_secondary'
    | 'nav.home'
    | 'nav.about'
    | 'nav.blog'
    | 'nav.gallery'
    | 'nav.contact'
    | 'modal.title'
    | 'modal.select_language'
    | 'modal.confirm';

export const translations: Record<Language, Record<string, string>> = {
    en: {
        // Hero
        'hero.greeting': 'Welcome to',
        'hero.title_prefix': 'Rand',
        'hero.title_highlight': 'Portfolio',
        'hero.subtitle': 'Cyber-Kawaii Portfolio',
        'hero.description': 'I code fast. I break things. I hop back up. A digital playground of neon dreams and code.',
        'hero.cta_primary': 'Explore My World',
        'hero.cta_secondary': 'View Projects',

        // Navigation
        'nav.home': 'Home',
        'nav.about': 'Me',
        'nav.blog': 'Blog',
        'nav.gallery': 'Gallery',
        'nav.contact': 'Summon',

        // Modal
        'modal.title': 'Choose Your Experience',
        'modal.select_language': 'Select Language',
        'modal.confirm': 'Enter',

        // Contact
        'contact.headline': 'Let\'s Make Magic Together',
        'contact.subheadline': 'Have a project in mind? Or just want to say hi? I\'m always open to discussing new ideas and opportunities.',
        'contact.social_title': 'Connect with Me',
        'contact.form_title': 'Send a Message',
        'contact.form_btn_text': 'Send Message',
        'contact.input_name': 'Your Name',
        'contact.input_email': 'Your Email',
        'contact.input_message': 'Tell me about your project...',

        // About
        'about.resume_btn': 'Resume',
        'about.footer_text': 'Designed with',
        'about.no_img': 'NO IMG',
        'about.skills_title': 'Magic Abilities',
        'about.timeline_title': 'The Adventure Log',
        'about.timeline_subtitle': 'System Log Active',
    },
    ar: {
        // Hero
        'hero.greeting': 'مرحباً بك في',
        'hero.title_prefix': 'محفظة',
        'hero.title_highlight': 'رند',
        'hero.subtitle': 'محفظة سايبر-كاواي',
        'hero.description': 'أبرمج بسرعة. أكسر الأشياء. وأعود للقفز من جديد. ملعب رقمي من أحلام النيون والكود.',
        'hero.cta_primary': 'الملف الشخصي 🐰',
        'hero.cta_secondary': 'المعرض ✨',

        // Navigation
        'nav.home': 'الرئيسية',
        'nav.about': 'من أنا',
        'nav.blog': 'المدونة',
        'nav.gallery': 'المعرض',
        'nav.contact': 'تواصل',

        // Modal
        'modal.title': 'اختر تجربتك',
        'modal.select_language': 'اختر اللغة',
        'modal.confirm': 'دخول',

        // Contact
        'contact.headline': 'لنصنع السحر معاً',
        'contact.subheadline': 'هل لديك مشروع في ذهنك؟ أو تود قول مرحباً فقط؟ أنا دائماً منفتح لمناقشة الأفكار والفرص الجديدة.',
        'contact.social_title': 'تواصل معي',
        'contact.form_title': 'أرسل رسالة',
        'contact.form_btn_text': 'إرسال الرسالة',
        'contact.input_name': 'اسمك',
        'contact.input_email': 'بريدك الإلكتروني',
        'contact.input_message': 'أخبرني عن مشروعك...',

        // About
        'about.resume_btn': 'السيرة الذاتية',
        'about.footer_text': 'تم التصميم بـ',
        'about.no_img': 'لا توجد صورة',
        'about.skills_title': 'القدرات الإبداعية والمهارات',
        'about.timeline_title': 'مسيرة العمل والخبرات',
        'about.timeline_subtitle': 'سجل النظام نشط',
    }
};

export const dir = (lang: Language) => lang === 'ar' ? 'rtl' : 'ltr';

// --- CV Translation Mappings (Static fallback translations for resume data) ---
const resumeTranslations: Record<Language, Record<string, string>> = {
    en: {},
    ar: {
        // Roles
        'Graphic Designer': 'مصمم جرافيك',
        'Head of Label & Packaging Department': 'رئيس قسم الملصقات والتعبئة والتغليف',
        'Graphic Designer & Social Media Manager': 'مصمم جرافيك ومدير وسائل التواصل الاجتماعي',
        'Graphic Designer & IT Support': 'مصمم جرافيك ودعم فني',
        'Graphic Designer (Trainee)': 'مصمم جرافيك متدرب',
        'Freelance Graphic Designer': 'مصمم جرافيك حر',
        'Diploma Degree / Graphic Design': 'شهادة الدبلوم / تصميم جرافيك',
        'Bachelor / Software Eng.': 'بكالوريوس / هندسة البرمجيات',

        // Companies
        'Zalatimo Brothers': 'إخوان زلاطيمو',
        'Shabib Marketing': 'شبيب للتسويق',
        'ORYX': 'أوريكس',
        'IT / A.I.C.S.K. Schools': 'تكنولوجيا المعلومات / مدارس A.I.C.S.K',
        'IT / A.I.C.S.K Schools': 'تكنولوجيا المعلومات / مدارس A.I.C.S.K',
        'Advertising Offices': 'مكاتب إعلانية',
        'KSA Academe': 'أكاديمية KSA',
        'Global': 'عالمي',
        'HorizonApex': 'هورايزون أبكس',
        'The Hashemite University': 'الجامعة الهاشمية',
        'Fast Solutions Marketing Company': 'شركة الحلول السريعة للتسويق',
        'Al Sahab Manufacturing & Packaging Company': 'شركة السحاب للتصنيع والتغليف',

        // Locations
        'Shmeisani, JORDAN': 'الشميساني، الأردن',
        'Al Zarqa, JORDAN': 'الزرقاء، الأردن',
        'Zarqa, Jordan': 'الزرقاء، الأردن',
        'Freelancer - Macca': 'عمل حر - مكة',
        'Shafa Badran, JORDAN': 'شفا بدران، الأردن',
        'Trainee - Amman': 'متدرب - عمان',
        'Amman, Jordan': 'عمان، الأردن',
        'Jordan': 'الأردن',
        'Remote | 3 Months': 'عن بعد | ٣ أشهر',
        'Present': 'الآن',

        // Skills
        'Logo Design': 'تصميم الشعارات',
        'Branding': 'الهوية التجارية',
        'Typography': 'تايبوغرافي والخطوط',
        'Digital Marketing': 'التسويق الرقمي',
        'Campaign Development': 'تطوير الحملات الإعلانية',
        'Video Editing': 'تحرير الفيديو',
        'Photography': 'التصوير الفوتوغرافي',
        'Adobe Photoshop': 'أدوبي فوتوشوب',
        'Adobe Illustrator': 'أدوبي إليستريتور',
        'Social Media Management': 'إدارة منصات التواصل',

        // Categories
        'Design': 'التصميم',
        'Marketing': 'التسويق',
        'Media': 'الوسائط',
        'Tech': 'التقنية',
    }
};

export const translateResume = (field: string, lang: Language): string => {
    if (lang === 'en') return field;
    return resumeTranslations.ar[field] || field;
};
