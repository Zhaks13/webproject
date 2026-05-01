import { createContext, useContext, useState } from 'react';

export const translations = {
    ru: {
        // Navbar
        nav: {
            home: 'Главная',
            catalog: 'Каталог',
            customOrder: 'На заказ',
            contacts: 'Контакты',
            profile: 'Профиль',
            logout: 'Выйти',
            login: 'Вход',
            admin: 'Админ',
        },
        // Home
        home: {
            heroTitle: 'Мебель',
            heroSubtitle: 'Со Смыслом.',
            heroDesc: 'Исключительный дизайн, чистота форм и натуральные материалы. Создаем объекты, которые становятся частью вашей жизни.',
            heroCta: 'Смотреть коллекцию',
            featuredTitle: 'Избранное',
            featuredAll: 'Смотреть всё',
            loading: 'Загрузка каталога...',
            noPhoto: 'Нет фото',
            ctaTitle: 'Готовы создать проект?',
            ctaDesc: 'Мы воплотим ваши идеи в реальность с безупречным вниманием к деталям.',
            ctaButton: 'Обсудить проект',
        },
        // Catalog / Products
        catalog: {
            title: 'Каталог',
            desc: 'Естественная фактура массива, чистые линии и ручной труд в каждой детали. Выберите предмет, который станет центром вашего пространства.',
            empty: 'Каталог пуст или обновляется.',
            noPhoto: 'Нет фото',
            details: 'Подробнее',
        },
        // Product Detail
        product: {
            backToCatalog: '← Вернуться в каталог',
            philosophy: 'Философия изделия',
            woodText: 'Мы отбираем каждую доску вручную, чтобы сохранить её природный рисунок. Массив дышит, живёт и со временем обретает ещё более глубокий характер. Каждый спил уникален — в этом истинная роскошь.',
            specs: [
                ['Размеры и конфигурация', 'Индивидуальные размеры под ваши задачи. Доступны разные варианты финишного покрытия.'],
                ['Материалы', 'Массив дуба / ясеня / ореха. Масло-воск европейского производства.'],
                ['Срок изготовления', 'От 14 до 30 рабочих дней в зависимости от сложности.'],
            ],
            orderButton: 'Заказать проект',
        },
        // Custom Order
        customOrder: {
            title: 'Индивидуальный',
            subtitle: 'проект.',
            desc: 'От наброска до финального изделия. Опишите вашу идею, прикрепите референсы, и мы подготовим смету с учётом всех деталей.',
            steps: [
                { step: '01', title: 'Обсуждение', text: 'Выясняем сценарии использования, размеры и стилистику.' },
                { step: '02', title: 'Проектирование', text: 'Готовим детальный чертеж и точную смету изделия.' },
                { step: '03', title: 'Производство', text: 'Отбираем лучший массив и реализуем проект в дереве.' },
            ],
            stats: [
                { value: '5+', label: 'лет опыта' },
                { value: '200+', label: 'изделий' },
                { value: '100%', label: 'ручная работа' },
            ],
            formTitle: 'Запрос на расчет',
            labelName: 'Имя',
            labelPhone: 'Телефон',
            labelDetails: 'Детали проекта',
            labelRefs: 'Референсы (до 5 фото)',
            placeholderName: 'Ваше имя',
            placeholderPhone: '+7 (999) 000-00-00',
            placeholderDetails: 'Опишите, что вы хотите заказать...',
            uploadText: 'Нажмите или перетащите фото',
            uploadHint: 'PNG, JPG до 5 MB',
            submit: 'Отправить заявку',
            submitting: 'Отправка...',
            submitted: 'Отправлено ✓',
            successTitle: 'Заявка принята',
            successDesc: 'Мы свяжемся с вами в течение часа для обсуждения деталей.',
            errorAlert: 'Сбой при отправке заявки. Пожалуйста, попробуйте позже.',
        },
        // Contacts
        contacts: {
            title: 'Связь.',
            desc: 'Мы всегда открыты к диалогу. Задайте вопрос, обсудите проект или приходите в наш шоурум, чтобы прикоснуться к массиву лично.',
            phone: 'Телефон',
            schedule: 'Пн–Вс: 09:00 — 19:00',
            whatsapp: 'WhatsApp',
            whatsappLink: 'Написать в WhatsApp',
            showroom: 'Шоурум',
            address: 'г. Астана, ул. Баршын 26',
            twoGis: 'Мы в 2ГИС',
            socials: 'Соцсети',
            writeUs: 'Написать нам',
            mapCaption: 'г. Астана, ул. Баршын 26',
        },
        // Footer
        footer: {
            tagline: 'Столярная мастерская для серийного производства и индивидуальных заказов.',
            contacts: 'Контакты',
            socials: 'Соцсети',
            navigation: 'Навигация',
            cta: 'Обсудить проект',
            rights: '© 2026 Stolyarniy Dvor • Все права защищены',
        },
    },

    kz: {
        nav: {
            home: 'Басты',
            catalog: 'Каталог',
            customOrder: 'Тапсырыс',
            contacts: 'Байланыс',
            profile: 'Профиль',
            logout: 'Шығу',
            login: 'Кіру',
            admin: 'Әкімші',
        },
        home: {
            heroTitle: 'Жиһаз',
            heroSubtitle: 'Мағынамен.',
            heroDesc: 'Таңдаулы дизайн, таза пішін және табиғи материалдар. Өміріңіздің бір бөлігіне айналатын заттар жасаймыз.',
            heroCta: 'Коллекцияны көру',
            featuredTitle: 'Таңдаулылар',
            featuredAll: 'Барлығын көру',
            loading: 'Каталог жүктелуде...',
            noPhoto: 'Фото жоқ',
            ctaTitle: 'Жоба жасауға дайынсыз ба?',
            ctaDesc: 'Идеяларыңызды шындыққа айналдырамыз — ең кіші бөлшекке дейін.',
            ctaButton: 'Жобаны талқылау',
        },
        catalog: {
            title: 'Каталог',
            desc: 'Массивтің табиғи текстурасы, таза сызықтар және еңбек. Кеңістігіңіздің орталығына айналатын затты таңдаңыз.',
            empty: 'Каталог бос немесе жаңартылуда.',
            noPhoto: 'Фото жоқ',
            details: 'Толығырақ',
        },
        product: {
            backToCatalog: '← Каталогқа оралу',
            philosophy: 'Бұйымның философиясы',
            woodText: 'Табиғи өрнегін сақтау үшін әр тақтаны қолмен іріктейміз. Массив демалады, өмір сүреді және уақыт өте тереңдейді. Әр кесіндісі бірегей — міне, шынайы сән осы.',
            specs: [
                ['Өлшемдер мен конфигурация', 'Міндеттеріңізге сай жеке өлшемдер. Аяқтаудың әр түрлі нұсқалары қол жетімді.'],
                ['Материалдар', 'Емен / күлді / жаңғақ массиві. Еуропалық май-балауыз.'],
                ['Дайындау мерзімі', 'Күрделілігіне байланысты 14-тен 30 жұмыс күніне дейін.'],
            ],
            orderButton: 'Жоба тапсырыс беру',
        },
        customOrder: {
            title: 'Жеке',
            subtitle: 'жоба.',
            desc: 'Эскизден дайын бұйымға дейін. Идеяңызды сипаттаңыз, референстерді тіркеңіз, біз барлық бөлшектерді ескере отырып сметаны дайындаймыз.',
            steps: [
                { step: '01', title: 'Талқылау', text: 'Пайдалану сценарийлерін, өлшемдер мен стилистиканы анықтаймыз.' },
                { step: '02', title: 'Жобалау', text: 'Егжей-тегжейлі сурет және дәл смета дайындаймыз.' },
                { step: '03', title: 'Өндіру', text: 'Ең жақсы массивті іріктеп, жобаны ағашта жүзеге асырамыз.' },
            ],
            stats: [
                { value: '5+', label: 'жыл тәжірибе' },
                { value: '200+', label: 'бұйым' },
                { value: '100%', label: 'қолдан жасалған' },
            ],
            formTitle: 'Есептеу сұрауы',
            labelName: 'Аты',
            labelPhone: 'Телефон',
            labelDetails: 'Жоба мәліметтері',
            labelRefs: 'Референстер (5 фотоға дейін)',
            placeholderName: 'Атыңыз',
            placeholderPhone: '+7 (999) 000-00-00',
            placeholderDetails: 'Не тапсырғыңыз келетінін сипаттаңыз...',
            uploadText: 'Басыңыз немесе фотоны сүйреңіз',
            uploadHint: 'PNG, JPG 5 MB-қа дейін',
            submit: 'Өтінімді жіберу',
            submitting: 'Жіберілуде...',
            submitted: 'Жіберілді ✓',
            successTitle: 'Өтінім қабылданды',
            successDesc: 'Бір сағат ішінде бөлшектерді талқылау үшін хабарласамыз.',
            errorAlert: 'Өтінімді жіберу сәтсіз аяқталды. Кейінірек қайталаңыз.',
        },
        contacts: {
            title: 'Байланыс.',
            desc: 'Біз әрдайым диалогқа ашықпыз. Сұрақ қойыңыз, жобаны талқылаңыз немесе массивті жеке ұстап көру үшін шоурумымызға келіңіз.',
            phone: 'Телефон',
            schedule: 'Дс–Жс: 09:00 — 19:00',
            whatsapp: 'WhatsApp',
            whatsappLink: 'WhatsApp-қа жазу',
            showroom: 'Шоурум',
            address: 'Астана қ., Баршын к-сі 26',
            twoGis: '2ГИС-те ашу',
            socials: 'Әлеуметтік желілер',
            writeUs: 'Бізге жазу',
            mapCaption: 'Астана қ., Баршын к-сі 26',
        },
        footer: {
            tagline: 'Сериялық өндіріс пен жеке тапсырыстарға арналған ағаш шеберханасы.',
            contacts: 'Байланыс',
            socials: 'Әлеуметтік желілер',
            navigation: 'Навигация',
            cta: 'Жобаны талқылау',
            rights: '© 2026 Stolyarniy Dvor • Барлық құқықтар қорғалған',
        },
    },

    en: {
        nav: {
            home: 'Home',
            catalog: 'Catalog',
            customOrder: 'Custom Order',
            contacts: 'Contacts',
            profile: 'Profile',
            logout: 'Logout',
            login: 'Login',
            admin: 'Admin',
        },
        home: {
            heroTitle: 'Furniture',
            heroSubtitle: 'With Purpose.',
            heroDesc: 'Exceptional design, clean forms and natural materials. We craft objects that become a part of your life.',
            heroCta: 'Explore the Collection',
            featuredTitle: 'Featured',
            featuredAll: 'View All',
            loading: 'Loading catalog...',
            noPhoto: 'No photo',
            ctaTitle: 'Ready to start a project?',
            ctaDesc: "We'll bring your ideas to life with meticulous attention to detail.",
            ctaButton: 'Discuss a Project',
        },
        catalog: {
            title: 'Catalog',
            desc: 'Natural solid wood texture, clean lines and handcrafted details. Choose the piece that will become the centerpiece of your space.',
            empty: 'Catalog is empty or being updated.',
            noPhoto: 'No photo',
            details: 'View Details',
        },
        product: {
            backToCatalog: '← Back to Catalog',
            philosophy: 'Product Philosophy',
            woodText: 'We handpick every board to preserve its natural grain. Solid wood breathes, lives and develops a deeper character over time. Every cut is unique — that is true luxury.',
            specs: [
                ['Dimensions & Configuration', 'Custom dimensions tailored to your needs. Various finishing options available.'],
                ['Materials', 'Solid oak / ash / walnut. European oil-wax finish.'],
                ['Lead Time', 'From 14 to 30 working days depending on complexity.'],
            ],
            orderButton: 'Order a Project',
        },
        customOrder: {
            title: 'Custom',
            subtitle: 'Project.',
            desc: 'From sketch to finished piece. Describe your idea, attach references, and we will prepare a detailed quote.',
            steps: [
                { step: '01', title: 'Discussion', text: 'We clarify use cases, dimensions and style preferences.' },
                { step: '02', title: 'Design', text: 'We prepare detailed drawings and an accurate quote.' },
                { step: '03', title: 'Production', text: 'We select the finest solid wood and craft your project.' },
            ],
            stats: [
                { value: '5+', label: 'years experience' },
                { value: '200+', label: 'items crafted' },
                { value: '100%', label: 'handmade' },
            ],
            formTitle: 'Request a Quote',
            labelName: 'Name',
            labelPhone: 'Phone',
            labelDetails: 'Project Details',
            labelRefs: 'References (up to 5 photos)',
            placeholderName: 'Your name',
            placeholderPhone: '+7 (999) 000-00-00',
            placeholderDetails: 'Describe what you would like to order...',
            uploadText: 'Click or drag photos here',
            uploadHint: 'PNG, JPG up to 5 MB',
            submit: 'Submit Request',
            submitting: 'Sending...',
            submitted: 'Sent ✓',
            successTitle: 'Request Received',
            successDesc: 'We will contact you within one hour to discuss the details.',
            errorAlert: 'Failed to submit the request. Please try again later.',
        },
        contacts: {
            title: 'Contact.',
            desc: 'We are always open to dialogue. Ask a question, discuss a project, or visit our showroom to touch the solid wood in person.',
            phone: 'Phone',
            schedule: 'Mon–Sun: 09:00 — 19:00',
            whatsapp: 'WhatsApp',
            whatsappLink: 'Message on WhatsApp',
            showroom: 'Showroom',
            address: 'Astana, Barshyn st. 26',
            twoGis: 'Open in 2GIS',
            socials: 'Social Media',
            writeUs: 'Write to Us',
            mapCaption: 'Astana, Barshyn st. 26',
        },
        footer: {
            tagline: 'A joinery workshop for serial production and custom orders.',
            contacts: 'Contacts',
            socials: 'Social Media',
            navigation: 'Navigation',
            cta: 'Discuss a Project',
            rights: '© 2026 Stolyarniy Dvor • All rights reserved',
        },
    },
};

const LANG_NAMES = { ru: 'Русский', kz: 'Қазақша', en: 'English' };
export { LANG_NAMES };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('lang') || 'ru';
    });

    const switchLang = (newLang) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    const t = translations[lang] || translations.ru;

    return (
        <LanguageContext.Provider value={{ lang, switchLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
    return ctx;
}
