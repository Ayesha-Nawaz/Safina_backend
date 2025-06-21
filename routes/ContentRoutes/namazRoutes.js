const express = require('express');
const Namaz = require('../../models/contentModels/namazmodel');

const router = express.Router();

router.post('/addnamaz', async (req, res) => {
    try {
        const namazData = [
            {
                "id": 1,
                "category": "takbeer",
                "arabic": "اَللّٰہُ أَكْبَرۡ",
                "english_translation": "Allah is the Greatest",
                "urdu_translation": "اللہ سب سے بڑا ہے"
              }
             ,
            {
                "id": 2,
                "category": "qayyam",
                "arabic": "سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَوَتَعَالٰى جَدُّكَ وَلَاۤ إِلٰهَ غَيْرُكَ",
                "english_translation": "Glory is to You O Allah, and praise. Blessed is Your Name and Exalted is Your Majesty. There is none worthy of worship but You.",
                "urdu_translation": "اللہ تعالیٰ کی ذات پاک ہے اور تمام تعریفیں اسی کے لیے ہیں۔ اس کا نام بابرکت ہے اور اس کی عظمت بلند ہے۔ اور اس کے سوا کوئی عبادت کے لائق نہیں۔"

            },
            {
                "id": 3,
                "category": "qayyam",
                "arabic": "اَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِیۡمِ",
                "english_translation": "I seek Allah’s protection from Satan who is accursed.",
                "urdu_translation": "میں اللہ کی پناہ مانگتا ہوں شیطان مردود سے۔"
            },
            {
                "id": 4,
                "category": "qayyam",
                "arabic": "بِسۡمِ اللّٰہِ الرَّحۡمٰنِ الرَّحِیۡمِ",
                "english_translation": "In the Name of Allah, the Most Beneficent, the Most Merciful.",
                "urdu_translation": "شروع اللہ کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے۔"
            },
            {
                "id": 5,
                "category": "qayyam",
                "arabic": "اَلۡحَمۡدُ لِلّٰہِ رَبِّ الۡعٰلَمِیۡنَ ا ۙلرَّحۡمٰنِ الرَّحِیۡمِ ۙمٰلِکِ یَوۡمِ الدِّیۡنِ    ؕاِیَّاکَ نَعۡبُدُ وَ اِیَّاکَ نَسۡتَعِیۡنُ ؕاِہۡدِ نَا الصِّرَاطَ الۡمُسۡتَقِیۡمَ ۙصِرَاطَ الَّذِیۡنَ اَنۡعَمۡتَ عَلَیۡہِمۡ ۙ۬ غَیۡرِ الۡمَغۡضُوۡبِ عَلَیۡہِمۡ وَ لَا الضَّآلِّیۡنَ",
                "english_translation": "Praise belongs to Allah, the Lord of all the worlds. The Most Beneficent, the Most Merciful. the Master of the Day of Requital. You alone do we worship, and from You alone do we seek help. Take us on the straight path. the path of those on whom You have bestowed Your Grace, not of those who have incurred Your wrath, nor of those who have gone astray. ",
                "urdu_translation": "تمام تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پروردگار ہے۔ نہایت مہربان، بے حد رحم کرنے والا۔ جزا کے دن کا مالک۔ ہم تیری ہی عبادت کرتے ہیں اور تجھی سے مدد مانگتے ہیں۔ ہمیں سیدھا راستہ دکھا۔ ان لوگوں کا راستہ جن پر تو نے انعام فرمایا۔ جن پر تیرا غضب نازل نہیں ہوا اور نہ ہی جو بھٹکے ہوئے ہیں۔"
            },
            {
                "id": 6,
                "category": "qayyam",
                "arabic": "قُلۡ ہُوَ  اللّٰہُ  اَحَدٌ ۚاَللّٰہُ  الصَّمَدُ ۚلَمۡ  یَلِدۡ ۬ۙ  وَ  لَمۡ  یُوۡلَدۡ ۙوَ  لَمۡ  یَکُنۡ  لَّہٗ   کُفُوًا  اَحَدٌ ",
                "english_translation": "Say: He is Allah, the only one. Allah helps and does not need help.  He does not produce a child, and He was not born of anyone. There is no one equal to Him.",
                "urdu_translation": "کہو: وہ اللہ ایک ہے۔ اللہ سب کی مدد کرتا ہے اور اسے کسی کی مدد کی ضرورت نہیں۔ نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے۔ اور کوئی بھی اس کے برابر نہیں۔"
            },
            {
                "id": 7,
                "category": "rukkuh",
                "arabic": "سُبْحَانَ رَبِّيَ الۡعَظِيمِ",
                "english_translation": "Glory is to my Lord, the Most Great.",
                "urdu_translation": "میرے رب، جو سب سے عظیم ہے، کی پاکیزگی ہے۔"
            },
            {
                "id": 8,
                "category": "qouma",
                "arabic": "سَمِعَ اللّٰهُ لِمَنْ حَمِدَهٗ",
                "english_translation": "Allah listened to the one who praised Him.",
                "urdu_translation": "اللہ نے سن لی جس نے اس کی تعریف کی۔"
            },
            // {
            //     "id": 9,
            //     "category": "qouma",
            //     "arabic": "رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيْرًا طَيِّبًا مُّبَارَكًا فِيْهِ (Optional)",
            //     "english_translation": "O our Lord! All kinds of praise belong only to You—praise that is abundant, pure, and blessed.",
            //     "urdu_translation": "اے ہمارے رب! تیرے ہی لیے ہر قسم کی تعریف ہے۔ تعریف بہت زیادہ، پاکیزہ جس میں برکت کی گئی ہے۔"
            // },
              
            {
                "id": 9,
                "category": "sajdah",
                "arabic": "سُبْحَانَ رَبِّيَ الْأَعْلٰى",
                "english_translation": "Glory is to my Lord, the Most High.",
                "urdu_translation": "میرے رب، جو سب سے بلند ہے، کی پاکیزگی ہے۔"
            }
            ,
            {
                "id": 10,
                "category": "tashhad",
                "arabic": "اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوٰتُ وَالطَّـيِّـبَاتُ اَلسَّلَامُ عَلَيْكَ اَيُّـهَا الـنَّبِىُّ وَرَحْمَةُ اللّٰهِ وَبَـرَكَاتُهٗ اَلسَّلَامُ عَـلَـيْـنَا وَعَلٰى عِبَادِ اللّٰهِ الصّٰلِحِيْنَ اَشْهَدُ اَنْ  لَّآ اِلٰهَ اِلَّا اللّٰهُ  وَاَشْهَدُ اَنَّ مُـحَمَّدًا عَـبْدُهٗ وَرَسُوْلُهٗ",
                "english_translation": "All compliments, all physical prayer and all monetary worship are for Allah. Peace be upon you, Oh Prophet, and Allah’s mercy and blessings. Peace be on us and on all righteous slaves of Allah. I bear witness that no one is worthy of worship except Allah And I bear witness that Muhammad is His slave and Messenger",
                "urdu_translation" : "تمام تعریفیں، تمام جسمانی عبادات اور تمام مالی عبادات اللہ کے لیے ہیں۔ آپ پر سلام ہو، اے نبی، اور اللہ کی رحمت اور برکتیں ہوں۔ ہم پر اور اللہ کے تمام نیک بندوں پر سلام ہو۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی عبادت کے لائق نہیں اور میں گواہی دیتا ہوں کہ محمدؐ اللہ کے رسول اور بندے ہیں۔"
            }
            ,
            
            {
                "id": 11,
                "category": "tashhad",
                "arabic": "اَللّٰهُمَّ صَلِّ عَلىٰ  مُـحَمَّدٍ وَّ عَليٰٓ  اٰلِ مُـحَمَّدٍ كَمَا صَلَّــيْتَ عَليٰٓ  اِبْـرَاهِيْمَ وَ عَليٰٓ  اٰلِ اِبْـرَاهِيْمَ اِنَّكَ حَمِيْدٌ مَّـجِيْدٌ اَللّٰهُمَّ بَارِكْ عَلىٰ مُـحَمَّدٍ وَّ عَليٰٓ  اٰلِ مُـحَمَّدٍ كَمَا بَارَكْتَ عَليٰٓ  اِبْـرَاهِيْمَ وَ عَليٰٓ اٰلِ  اِبْـرَاهِيْمَ اِنَّكَ حَمِيْدٌ مَّـجِيْدٌ",
                "english_translation": "Oh Allah, send grace and honour on Muhammad (PBUH) and On the family and true followers of Muhammad (PBUH). just as you sent Grace and Honour on Ibrahim (a.s) and on the family and true followers of Ibrahim (a.s). Surely, you are praiseworthy, the Great. Oh Allah, send your blessing on Muhammad (PBUH) and the true followers of Muhammad (PBUH), as you sent blessings on Ibrahim (a.s) and on the family and true followers of Ibrahim (a.s). Surely, you are praiseworthy, the Great.",
                "urdu_translation": "آئے اللہ! محمد (صلى الله عليه وسلم) پر اور محمد (صلى الله عليه وسلم) کے خاندان اور سچے پیروکاروں پر اپنی عنایت اور عزت نازل فرما جیسے تو نے ابراہیم (علیہ السلام) اور ان کے خاندان اور سچے پیروکاروں پر عنایت اور عزت نازل فرمائی۔ بے شک تو ہی سب سے زیادہ تعریف کے لائق، عظیم ہے۔ آئے اللہ! محمد (صلى الله عليه وسلم) پر اور محمد (صلى الله عليه وسلم) کے سچے پیروکاروں پر اپنی برکتیں نازل فرما جیسے تو نے ابراہیم (علیہ السلام) اور ان کے خاندان اور سچے پیروکاروں پر برکتیں نازل فرمائی۔ بے شک تو ہی سب سے زیادہ تعریف کے لائق، عظیم ہے۔"
            },
            {
                "id": 12,
                "category": "tashhad",
                "arabic": "رَبِّ اجۡعَلۡنِیۡ مُقِیۡمَ الصَّلٰوۃِ  وَ مِنۡ ذُرِّیَّتِیۡ ٭ۖ رَبَّنَا وَ تَقَبَّلۡ دُعَآءِرَبَّنَا اغۡفِرۡ لِیۡ  وَ لِوَالِدَیَّ وَ لِلۡمُؤۡمِنِیۡنَ  یَوۡمَ  یَقُوۡمُ الۡحِسَابُ",
                "english_translation": "My Lord, make me steadfast in Salāh, and my offspring as well. And, Our Lord, grant my prayer.",
                "urdu_translation": "اے پروردگار مجھ کو ایسی توفیق عنایت کر کہ نماز پڑھتا رہوں اور میری اولاد کو بھی یہ توفیق بخش اے پروردگار میری دعا قبول فرما۔اے پروردگار حساب کتاب کے دن میری اور میرے ماں باپ کی اور مومنوں کی مغفرت کیجیو۔"
            },
              
            {
                "id": 13,
                "category": "salam",
                "arabic": "اَلسَّلَامُ عَلَيْکُمْ وَرَحْمَةُ اللّٰهِ",
                "english_translation": "Peace and mercy of Allah be on you.",
                "urdu_translation" : "اللہ کی سلامتی اور رحمت آپ پر ہو۔"
            },
              
        ];

        // Insert all Namaz data at once
        await Namaz.insertMany(namazData);
        res.status(201).json({ message: 'Namaz data inserted successfully' }); // Respond with success message
    } catch (error) {
        res.status(400).json({ message: error.message }); // Respond with error message
    }
});


// GET request to fetch Namaz data
router.get('/namaz', async (req, res) => {
    try {
        const namaz = await Namaz.find(); // Fetch all Namaz records
        res.status(200).json(namaz); // Respond with fetched Namaz data
    } catch (error) {
        res.status(500).json({ message: error.message }); // Respond with error message
    }
});
router.put('/namaz/:id', async (req, res) => {
    try {
        const updatedNamaz = await Namaz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNamaz) {
            return res.status(404).json({ message: 'Namaz data not found' });
        }
        res.status(200).json(updatedNamaz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.delete('/namaz/:id', async (req, res) => {
    try {
        const deletedNamaz = await Namaz.findByIdAndDelete(req.params.id);
        if (!deletedNamaz) {
            return res.status(404).json({ message: 'Namaz data not found' });
        }
        res.status(200).json({ message: 'Namaz data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;