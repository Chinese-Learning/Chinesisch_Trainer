const VOCAB = [
// Einheit 1
{u:1,h:'你好',p:'nǐ hǎo',d:'Hallo; Guten Tag'}, {u:1,h:'你',p:'nǐ',d:'du; dir; dich'}, {u:1,h:'好',p:'hǎo',d:'gut; OK'},
{u:1,h:'请问',p:'qǐngwèn',d:'Darf ich fragen?'}, {u:1,h:'请',p:'qǐng',d:'bitten; einladen'}, {u:1,h:'问',p:'wèn',d:'fragen'},
{u:1,h:'叫',p:'jiào',d:'heißen; rufen'}, {u:1,h:'什么',p:'shénme',d:'was; was für ein'}, {u:1,h:'名字',p:'míngzi',d:'Name'},
{u:1,h:'我',p:'wǒ',d:'ich; mir; mich'}, {u:1,h:'他',p:'tā',d:'er; ihm; ihn'}, {u:1,h:'她',p:'tā',d:'sie; ihr'}, {u:1,h:'呢',p:'ne',d:'Fragepartikel'},
{u:1,h:'认识',p:'rènshi',d:'kennen; erkennen'}, {u:1,h:'很',p:'hěn',d:'sehr'}, {u:1,h:'高兴',p:'gāoxìng',d:'erfreut sein'},
{u:1,h:'小姐',p:'xiǎojiě',d:'Fräulein; junge Frau'}, {u:1,h:'对不起',p:'duìbuqǐ',d:'Entschuldigung'}, {u:1,h:'姓',p:'xìng',d:'Nachname; mit Nachnamen heißen'},
{u:1,h:'中文',p:'Zhōngwén',d:'Chinesisch'}, {u:1,h:'你们',p:'nǐmen',d:'ihr; euch'}, {u:1,h:'是',p:'shì',d:'sein'}, {u:1,h:'大家',p:'dàjiā',d:'alle'},
// Einheit 2
{u:2,h:'早上好',p:'zǎoshang hǎo',d:'Guten Morgen'}, {u:2,h:'日本',p:'Rìběn',d:'Japan'}, {u:2,h:'人',p:'rén',d:'Mensch; Person'},
{u:2,h:'吗',p:'ma',d:'Fragepartikel'}, {u:2,h:'不',p:'bù',d:'nicht'}, {u:2,h:'哪里',p:'nǎli',d:'wo; wohin'}, {u:2,h:'哪',p:'nǎ',d:'welcher/-e/-s'},
{u:2,h:'中国',p:'Zhōngguó',d:'China'}, {u:2,h:'国',p:'guó',d:'Land; Staat; Nation'}, {u:2,h:'英国',p:'Yīngguó',d:'Großbritannien'},
{u:2,h:'住',p:'zhù',d:'wohnen; leben'}, {u:2,h:'在',p:'zài',d:'in; an; sein'}, {u:2,h:'伦敦',p:'Lúndūn',d:'London'}, {u:2,h:'北京',p:'Běijīng',d:'Beijing'},
{u:2,h:'他们',p:'tāmen',d:'sie; ihnen'}, {u:2,h:'电影',p:'diànyǐng',d:'Film'}, {u:2,h:'明星',p:'míngxīng',d:'Berühmtheit; Star'},
{u:2,h:'但是',p:'dànshì',d:'aber'}, {u:2,h:'美国',p:'Měiguó',d:'Vereinigte Staaten von Amerika'}, {u:2,h:'青岛',p:'Qīngdǎo',d:'Qingdao'},
{u:2,h:'香港',p:'Xiānggǎng',d:'Hongkong'}, {u:2,h:'法国',p:'Fǎguó',d:'Frankreich'}, {u:2,h:'德国',p:'Déguó',d:'Deutschland'},
{u:2,h:'韩国',p:'Hánguó',d:'Korea'}, {u:2,h:'澳大利亚',p:'Àodàlìyà',d:'Australien'}, {u:2,h:'加拿大',p:'Jiānádà',d:'Kanada'}, {u:2,h:'瑞士',p:'Ruìshì',d:'Schweiz'},
// Einheit 3
{u:3,h:'爸爸',p:'bàba',d:'Papa; Vater'}, {u:3,h:'妈妈',p:'māma',d:'Mama; Mutter'}, {u:3,h:'姐姐',p:'jiějie',d:'ältere Schwester'},
{u:3,h:'妹妹',p:'mèimei',d:'jüngere Schwester'}, {u:3,h:'哥哥',p:'gēge',d:'älterer Bruder'}, {u:3,h:'弟弟',p:'dìdi',d:'jüngerer Bruder'},
{u:3,h:'这',p:'zhè',d:'diese/-r/-s'}, {u:3,h:'和',p:'hé',d:'und; mit'}, {u:3,h:'也',p:'yě',d:'auch'}, {u:3,h:'学生',p:'xuésheng',d:'Schüler/-in; Student/-in'},
{u:3,h:'记者',p:'jìzhě',d:'Journalist/-in'}, {u:3,h:'做',p:'zuò',d:'machen'}, {u:3,h:'工作',p:'gōngzuò',d:'Arbeit; arbeiten'},
{u:3,h:'医生',p:'yīshēng',d:'Arzt/Ärztin'}, {u:3,h:'医院',p:'yīyuàn',d:'Spital; Krankenhaus'}, {u:3,h:'都',p:'dōu',d:'alle; beide'},
{u:3,h:'家',p:'jiā',d:'Familie; Zuhause'}, {u:3,h:'的',p:'de',d:'Partikel'}, {u:3,h:'照片',p:'zhàopiàn',d:'Fotografie'},
{u:3,h:'学校',p:'xuéxiào',d:'Schule'}, {u:3,h:'老师',p:'lǎoshī',d:'Lehrer/-in'},
// Einheit 4
{u:4,h:'谁',p:'shéi',d:'wer; wen; wem'}, {u:4,h:'上海',p:'Shànghǎi',d:'Shanghai'}, {u:4,h:'现在',p:'xiànzài',d:'jetzt'},
{u:4,h:'多大',p:'duō dà',d:'wie alt'}, {u:4,h:'岁',p:'suì',d:'Jahre alt'}, {u:4,h:'知道',p:'zhīdào',d:'wissen'}, {u:4,h:'真',p:'zhēn',d:'echt; wirklich'},
{u:4,h:'高',p:'gāo',d:'groß; hoch sein'}, {u:4,h:'帅',p:'shuài',d:'gutaussehend sein'}, {u:4,h:'酷',p:'kù',d:'cool sein'}, {u:4,h:'最',p:'zuì',d:'Superlativbildung; am meisten'},
{u:4,h:'喜欢',p:'xǐhuan',d:'mögen; gerne haben'}, {u:4,h:'篮球',p:'lánqiú',d:'Basketball'}, {u:4,h:'运动员',p:'yùndòngyuán',d:'Sportler/-in'},
{u:4,h:'姓名',p:'xìngmíng',d:'Name und Vorname'}, {u:4,h:'年龄',p:'niánlíng',d:'Alter'}, {u:4,h:'出生地',p:'chūshēngdì',d:'Geburtsort'},
{u:4,h:'国籍',p:'guójí',d:'Nationalität'}, {u:4,h:'电子邮箱',p:'diànzǐ yóuxiāng',d:'E-Mail-Adresse'}, {u:4,h:'动物',p:'dòngwù',d:'Tier'},
{u:4,h:'熊猫',p:'xióngmāo',d:'Großer Panda'}, {u:4,h:'可爱',p:'kě’ài',d:'niedlich sein'}, {u:4,h:'演员',p:'yǎnyuán',d:'Schauspieler/-in'},
{u:4,h:'年轻',p:'niánqīng',d:'jung'}, {u:4,h:'漂亮',p:'piàoliang',d:'hübsch'}, {u:4,h:'矮',p:'ǎi',d:'klein; niedrig'}, {u:4,h:'老',p:'lǎo',d:'alt'},
// Einheit 5
{u:5,h:'电话',p:'diànhuà',d:'Telefon'}, {u:5,h:'号码',p:'hàomǎ',d:'Nummer; Code'}, {u:5,h:'手机',p:'shǒujī',d:'Mobiltelefon'},
{u:5,h:'多少',p:'duōshao',d:'wie viel; wie viele'}, {u:5,h:'公园',p:'gōngyuán',d:'Park'}, {u:5,h:'路',p:'lù',d:'Straße; Weg'}, {u:5,h:'号',p:'hào',d:'Nummer; Datum; mündlich'},
{u:5,h:'新',p:'xīn',d:'neu sein'}, {u:5,h:'地址',p:'dìzhǐ',d:'Adresse'}, {u:5,h:'大学',p:'dàxué',d:'Universität'}, {u:5,h:'公寓',p:'gōngyù',d:'Wohnblock; Wohnhaus'},
{u:5,h:'房间',p:'fángjiān',d:'Zimmer'}, {u:5,h:'可以',p:'kěyǐ',d:'können; dürfen'}, {u:5,h:'给',p:'gěi',d:'geben; für'},
{u:5,h:'打电话',p:'dǎ diànhuà',d:'telefonieren'}, {u:5,h:'发件人',p:'fājiànrén',d:'Absender/-in'}, {u:5,h:'收到',p:'shōudào',d:'empfangen; erhalten'},
{u:5,h:'谢谢',p:'xièxie',d:'danke; danken'}, {u:5,h:'收件箱',p:'shōujiànxiāng',d:'Posteingang'}, {u:5,h:'发送',p:'fāsòng',d:'senden'}, {u:5,h:'新短信',p:'xīn duǎnxìn',d:'neue Kurznachricht'}, {u:5,h:'退出',p:'tuìchū',d:'verlassen; beenden'}
];

const SENTENCES = [
{u:1,h:'你好！',p:'Nǐ hǎo!',d:'Hallo!'}, {u:1,h:'请问，你叫什么名字？',p:'Qǐngwèn, nǐ jiào shénme míngzi?',d:'Darf ich fragen, wie du heißt?'},
{u:1,h:'我叫王玉。',p:'Wǒ jiào Wáng Yù.',d:'Ich heiße Wang Yu.'}, {u:1,h:'你呢？',p:'Nǐ ne?',d:'Und du?'},
{u:1,h:'认识你很高兴。',p:'Rènshi nǐ hěn gāoxìng.',d:'Freut mich, dich kennenzulernen.'}, {u:1,h:'对不起，我姓王。',p:'Duìbuqǐ, wǒ xìng Wáng.',d:'Entschuldigung, mein Nachname ist Wang.'},
{u:1,h:'大家好，我叫马克。',p:'Dàjiā hǎo, wǒ jiào Mǎkè.',d:'Hallo zusammen, ich heiße Mark.'}, {u:1,h:'中文名字是马克。',p:'Zhōngwén míngzi shì Mǎkè.',d:'Der chinesische Name ist Mark.'},
{u:2,h:'你是日本人吗？',p:'Nǐ shì Rìběnrén ma?',d:'Bist du Japaner/-in?'}, {u:2,h:'不是，我不是日本人。',p:'Bú shì, wǒ bú shì Rìběnrén.',d:'Nein, ich bin kein/-e Japaner/-in.'},
{u:2,h:'你是哪里人？',p:'Nǐ shì nǎli rén?',d:'Woher kommst du?'}, {u:2,h:'我是中国人。',p:'Wǒ shì Zhōngguórén.',d:'Ich bin Chinese/Chinesin.'},
{u:2,h:'你是哪国人？',p:'Nǐ shì nǎ guó rén?',d:'Welche Nationalität hast du?'}, {u:2,h:'我是英国人。',p:'Wǒ shì Yīngguórén.',d:'Ich bin Brite/Britin.'},
{u:2,h:'你住在伦敦吗？',p:'Nǐ zhù zài Lúndūn ma?',d:'Wohnst du in London?'}, {u:2,h:'不，我住在北京。',p:'Bù, wǒ zhù zài Běijīng.',d:'Nein, ich wohne in Beijing.'},
{u:2,h:'他们是电影明星。',p:'Tāmen shì diànyǐng míngxīng.',d:'Sie sind Filmstars.'}, {u:2,h:'但是他们不是美国人。',p:'Dànshì tāmen bú shì Měiguórén.',d:'Aber sie sind keine Amerikaner.'},
{u:3,h:'她是你妹妹吗？',p:'Tā shì nǐ mèimei ma?',d:'Ist sie deine jüngere Schwester?'}, {u:3,h:'是，她是我妹妹。',p:'Shì, tā shì wǒ mèimei.',d:'Ja, sie ist meine jüngere Schwester.'},
{u:3,h:'这是我弟弟。',p:'Zhè shì wǒ dìdi.',d:'Das ist mein jüngerer Bruder.'}, {u:3,h:'你妹妹和弟弟也是学生吗？',p:'Nǐ mèimei hé dìdi yě shì xuésheng ma?',d:'Sind deine Schwester und dein Bruder auch Schüler/Studenten?'},
{u:3,h:'我弟弟是学生，但是我妹妹是记者。',p:'Wǒ dìdi shì xuésheng, dànshì wǒ mèimei shì jìzhě.',d:'Mein Bruder ist Schüler/Student, aber meine Schwester ist Journalistin.'},
{u:3,h:'你爸爸做什么工作？',p:'Nǐ bàba zuò shénme gōngzuò?',d:'Was arbeitet dein Vater?'}, {u:3,h:'他是医生。',p:'Tā shì yīshēng.',d:'Er ist Arzt.'},
{u:3,h:'你妈妈在哪里工作？',p:'Nǐ māma zài nǎli gōngzuò?',d:'Wo arbeitet deine Mutter?'}, {u:3,h:'她在医院工作。',p:'Tā zài yīyuàn gōngzuò.',d:'Sie arbeitet im Krankenhaus.'},
{u:3,h:'爸爸妈妈都是医生。',p:'Bàba māma dōu shì yīshēng.',d:'Vater und Mutter sind beide Ärzte.'}, {u:3,h:'这是我家的照片。',p:'Zhè shì wǒ jiā de zhàopiàn.',d:'Das ist ein Foto meiner Familie.'},
{u:4,h:'他是谁？',p:'Tā shì shéi?',d:'Wer ist er?'}, {u:4,h:'他是姚明，是吗？',p:'Tā shì Yáo Míng, shì ma?',d:'Er ist Yao Ming, oder?'},
{u:4,h:'他是哪里人？',p:'Tā shì nǎli rén?',d:'Woher kommt er?'}, {u:4,h:'上海人，但是现在住在美国。',p:'Shànghǎirén, dànshì xiànzài zhù zài Měiguó.',d:'Er ist aus Shanghai, aber wohnt jetzt in den USA.'},
{u:4,h:'他多大？',p:'Tā duō dà?',d:'Wie alt ist er?'}, {u:4,h:'我不知道。',p:'Wǒ bù zhīdào.',d:'Ich weiß es nicht.'},
{u:4,h:'他真高！',p:'Tā zhēn gāo!',d:'Er ist wirklich groß!'}, {u:4,h:'也很帅，很酷！',p:'Yě hěn shuài, hěn kù!',d:'Auch sehr gutaussehend, sehr cool!'},
{u:4,h:'他是我最喜欢的篮球运动员。',p:'Tā shì wǒ zuì xǐhuan de lánqiú yùndòngyuán.',d:'Er ist mein Lieblingsbasketballspieler.'}, {u:4,h:'最喜欢的动物是熊猫。',p:'Zuì xǐhuan de dòngwù shì xióngmāo.',d:'Das Lieblingstier ist der Panda.'},
{u:5,h:'你的电话号码是55546998吗？',p:'Nǐ de diànhuà hàomǎ shì 55546998 ma?',d:'Ist deine Telefonnummer 55546998?'},
{u:5,h:'这是我家的电话号码。',p:'Zhè shì wǒ jiā de diànhuà hàomǎ.',d:'Das ist meine Haustelefonnummer.'}, {u:5,h:'你的手机号码是多少？',p:'Nǐ de shǒujī hàomǎ shì duōshao?',d:'Wie lautet deine Handynummer?'},
{u:5,h:'我的手机号码是12081345761。',p:'Wǒ de shǒujī hàomǎ shì 12081345761.',d:'Meine Handynummer ist 12081345761.'}, {u:5,h:'你住在哪里？',p:'Nǐ zhù zài nǎli?',d:'Wo wohnst du?'},
{u:5,h:'我住在公园路19号。',p:'Wǒ zhù zài Gōngyuán Lù shíjiǔ hào.',d:'Ich wohne in der Parkstraße Nummer 19.'}, {u:5,h:'你的电子邮箱是什么？',p:'Nǐ de diànzǐ yóuxiāng shì shénme?',d:'Wie lautet deine E-Mail-Adresse?'},
{u:5,h:'我的地址是大学路23号。',p:'Wǒ de dìzhǐ shì Dàxué Lù èrshísān hào.',d:'Meine Adresse ist Universitätsstraße 23.'}, {u:5,h:'你可以给我打电话。',p:'Nǐ kěyǐ gěi wǒ dǎ diànhuà.',d:'Du kannst mich anrufen.'},
{u:5,h:'收到，谢谢！',p:'Shōudào, xièxie!',d:'Erhalten, danke!'}
];

const DIALOGUE_Q = [
{u:1,q:'Wie fragt man auf Chinesisch nach dem Namen?',a:'你叫什么名字？'}, {u:1,q:'Wie sagt man: Ich heiße Wang Yu?',a:'我叫王玉。'},
{u:2,q:'Wie fragt man: Woher kommst du?',a:'你是哪里人？'}, {u:2,q:'Wie sagt man: Ich wohne in Beijing?',a:'我住在北京。'},
{u:3,q:'Wie fragt man nach dem Beruf des Vaters?',a:'你爸爸做什么工作？'}, {u:3,q:'Wie sagt man: Sie arbeitet im Krankenhaus?',a:'她在医院工作。'},
{u:4,q:'Wie fragt man: Wer ist er?',a:'他是谁？'}, {u:4,q:'Wie sagt man: Ich weiß es nicht?',a:'我不知道。'},
{u:5,q:'Wie fragt man nach der Handynummer?',a:'你的手机号码是多少？'}, {u:5,q:'Wie fragt man nach der E-Mail-Adresse?',a:'你的电子邮箱是什么？'}
];
