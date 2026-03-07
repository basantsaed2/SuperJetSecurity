import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // --- Auth ---
      "login_title": "Sign In",
      "login_subtitle": "Gate Officer Authentication",
      "login_brand_tagline": "Monitoring buses movements",
      "identifier_label": "Username / Email / Phone",
      "identifier_placeholder": "Enter your username, email or phone",
      "password_label": "Password",
      "password_placeholder": "Enter Password",
      "login_button": "Login",
      "hello": "Hello",
      "welcome_back": "welcome back!",
      "already_logged_in": "You are already logged in",

      // --- Dashboard ---
      "main_menu": "Main Menu",
      "check_in": "Bus Check-In",
      "check_out": "Bus Check-Out",
      "check_in_subtitle": "Register incoming buses for maintenance",
      "check_out_subtitle": "Release active units for operation",

      // --- CheckIn Form ---
      "gate_entry_title": "Check In",
      "garage_label": "Garage Name",
      "select_bus_label": "Select Bus",
      "select_bus_placeholder": "Search and select bus...",
      "driver_label": "Driver",
      "driver_placeholder": "Select driver...",
      "maintenance_label": "Maintenance Requirements",
      "maintenance_placeholder": "Select multiple maintenance types...",
      "description_label": "Description / Observations",
      "description_placeholder": "Noticeable engine noise, body scratches, etc...",
      "entry_time_label": "Entry Time",
      "register_entry_button": "Register Check-In",
      "check_in_success": "Check-in registered successfully",
      "selected_bus": "Selected Bus",
      "qr_scan_success": "QR code scanned successfully",

      // --- CheckOut Form ---
      "inside_garage": "Inside Garage",
      "units_label": "UNITS",
      "scanning_garage": "SCANNING GARAGE...",
      "note_attached": "Note attached",
      "confirm_exit_button": "Confirm Exit",
      "garage_clear": "Garage Clear",
      "confirm_departure_title": "Confirm Check-Out",
      "confirm_departure_desc": "Are you sure you want to authorize the exit for unit",
      "cancel": "Cancel",
      "authorize_exit": "Authorize Exit",
      "driver_name": "Driver Name",
      "driver_phone": "Driver Phone",
      "driver_status": "Driver Status",
      "bus_number": "Bus Number",
      "plate_number": "Plate Number",
      "bus_status": "Bus Status",
      "garage_location": "Garage Location",
      "view_details": "View Details",
      "close": "Close",
      "unknown_bus": "Unknown Bus",
      "check_out_success": "Check-out registered successfully",
      "check_out_error": "Check-out failed",


      // --- Shared ---
      "logout": "Logout",

      // --- Searchable Select ---
      "search_by": "Search by...",
      "no_records_found": "No records found",
      "select_all": "Select All",
      "deselect_all": "Deselect All",
      "selected": "selected",
      "scan_qr_placeholder": "Point the camera at the bus QR code"
    }
  },
  ar: {
    translation: {
      // --- Auth ---
      "login_title": "تسجيل الدخول",
      "login_subtitle": "تسجيل دخول فرد أمن البوابة",
      "login_brand_tagline": "مراقبة حركة الاوتوبيسات",
      "identifier_label": "اسم المستخدم / البريد / الهاتف",
      "identifier_placeholder": "أدخل اسم المستخدم أو البريد أو الهاتف",
      "password_label": "كلمة المرور",
      "password_placeholder": "أدخل كلمة المرور",
      "login_button": "دخول",
      "hello": "أهلاً",
      "welcome_back": "مرحباً بك مجدداً!",
      "already_logged_in": "أنت مسجل الدخول بالفعل",

      // --- Dashboard ---
      "main_menu": "القائمة الرئيسية",
      "check_in": "دخول اتوبيس",
      "check_out": "خروج اتوبيس",
      "check_in_subtitle": "تسجيل دخول اتوبيس للصيانة",
      "check_out_subtitle": "تسجيل خروج اتوبيس للتشغيل",

      // --- CheckIn Form ---
      "gate_entry_title": "تسجيل دخول الاتوبيس",
      "garage_label": "اسم الجراج",
      "select_bus_label": "اختر الاتوبيس",
      "select_bus_placeholder": "ابحث عن الاتوبيس...",
      "driver_label": "السائق",
      "driver_placeholder": "اختر السائق...",
      "maintenance_label": "متطلبات الصيانة",
      "maintenance_placeholder": "اختر أنواع الصيانة...",
      "description_label": "الوصف / الملاحظات",
      "description_placeholder": "ضوضاء المحرك، خدوش الهيكل، إلخ...",
      "entry_time_label": "وقت الدخول",
      "register_entry_button": "تسجيل الدخول",
      "check_in_success": "تم تسجيل الدخول بنجاح",
      "selected_bus": "الاتوبيس المحدد",
      "qr_scan_success": "تم مسح كود الـ QR بنجاح",

      // --- CheckOut Form ---
      "inside_garage": "داخل الجراج",
      "units_label": "وحدة",
      "scanning_garage": "جاري فحص الجراج...",
      "note_attached": "يوجد ملاحظة",
      "confirm_exit_button": "تأكيد الخروج",
      "garage_clear": "الجراج فارغ",
      "confirm_departure_title": "تأكيد تسجيل الخروج",
      "confirm_departure_desc": "هل أنت متأكد من تصريح خروج الوحدة",
      "cancel": "إلغاء",
      "authorize_exit": "تصريح الخروج",
      "driver_name": "اسم السائق",
      "driver_phone": "هاتف السائق",
      "driver_status": "حالة السائق",
      "bus_number": "رقم الاتوبيس",
      "plate_number": "رقم اللوحة",
      "bus_status": "حالة الاتوبيس",
      "garage_location": "موقع الجراج",
      "view_details": "عرض التفاصيل",
      "close": "إغلاق",
      "unknown_bus": "اتوبيس غير معروف",
      "check_out_success": "تم تسجيل الخروج بنجاح",
      "check_out_error": "فشل تسجيل الخروج",

      // --- Shared ---
      "logout": "تسجيل الخروج",

      // --- Searchable Select ---
      "search_by": "بحث بـ...",
      "no_records_found": "لا توجد سجلات",
      "select_all": "اختر الكل",
      "deselect_all": "إلغاء تحديد الكل",
      "selected": "تم الاختيار",
      "scan_qr_placeholder": "وجه الكاميرا نحو كود الـ QR الخاص بالحافلة"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',           // Default language: Arabic
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
