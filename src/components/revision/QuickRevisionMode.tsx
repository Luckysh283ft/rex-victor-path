import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  Zap, 
  Lightbulb, 
  ArrowLeft,
  Calculator,
  Atom,
  FlaskConical,
  ChevronRight,
  Star,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickRevisionModeProps {
  onBack: () => void;
}

// Comprehensive formula and concept database
const revisionData = {
  Physics: {
    icon: Atom,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    chapters: [
      {
        name: 'किनेमेटिक्स (Kinematics)',
        formulas: [
          { title: 'समीकरण 1', formula: 'v = u + at', description: 'अंतिम वेग = प्रारंभिक वेग + त्वरण × समय' },
          { title: 'समीकरण 2', formula: 's = ut + ½at²', description: 'विस्थापन = प्रारंभिक वेग × समय + ½ × त्वरण × समय²' },
          { title: 'समीकरण 3', formula: 'v² = u² + 2as', description: 'अंतिम वेग² = प्रारंभिक वेग² + 2 × त्वरण × विस्थापन' },
          { title: 'औसत वेग', formula: 'v_avg = (u + v)/2', description: 'एकसमान त्वरण के लिए' },
        ],
        shortcuts: [
          'गुरुत्व के अधीन गिरती वस्तु: a = g = 9.8 m/s²',
          'अधिकतम ऊंचाई: H = u²/(2g)',
          'उड़ान समय: T = 2u sin(θ)/g',
          'परास: R = u² sin(2θ)/g',
        ],
        concepts: [
          'विस्थापन दूरी से कम या बराबर होता है',
          'वेग एक सदिश राशि है, गति अदिश है',
          'समान गति में त्वरण शून्य होता है',
        ]
      },
      {
        name: 'न्यूटन के नियम (Newton\'s Laws)',
        formulas: [
          { title: 'बल', formula: 'F = ma', description: 'बल = द्रव्यमान × त्वरण' },
          { title: 'संवेग', formula: 'p = mv', description: 'संवेग = द्रव्यमान × वेग' },
          { title: 'आवेग', formula: 'J = FΔt = Δp', description: 'आवेग = बल × समय अंतराल' },
          { title: 'घर्षण बल', formula: 'f = μN', description: 'घर्षण बल = घर्षण गुणांक × अभिलंब बल' },
        ],
        shortcuts: [
          'जड़त्व: वस्तु अपनी अवस्था बनाए रखती है',
          'क्रिया = प्रतिक्रिया (विपरीत दिशा)',
          'स्थैतिक घर्षण > गतिक घर्षण',
          'लिफ्ट में भारी महसूस: ऊपर जाते समय',
        ],
        concepts: [
          'मुक्त-पिंड आरेख बनाना महत्वपूर्ण है',
          'छद्म बल केवल अजड़त्वीय निर्देश तंत्र में',
          'संवेग संरक्षण: बाह्य बल = 0',
        ]
      },
      {
        name: 'कार्य, ऊर्जा, शक्ति (Work, Energy, Power)',
        formulas: [
          { title: 'कार्य', formula: 'W = F·d·cos(θ)', description: 'कार्य = बल × विस्थापन × cos(कोण)' },
          { title: 'गतिज ऊर्जा', formula: 'KE = ½mv²', description: 'गतिज ऊर्जा = ½ × द्रव्यमान × वेग²' },
          { title: 'स्थितिज ऊर्जा', formula: 'PE = mgh', description: 'स्थितिज ऊर्जा = द्रव्यमान × g × ऊंचाई' },
          { title: 'शक्ति', formula: 'P = W/t = F·v', description: 'शक्ति = कार्य/समय = बल × वेग' },
        ],
        shortcuts: [
          'संरक्षी बल: कुल यांत्रिक ऊर्जा स्थिर',
          'स्प्रिंग ऊर्जा: ½kx²',
          '1 HP = 746 W',
          'कार्य-ऊर्जा प्रमेय: W = ΔKE',
        ],
        concepts: [
          'कार्य धनात्मक, ऋणात्मक या शून्य हो सकता है',
          'ऊर्जा कभी नष्ट नहीं होती, रूपांतरित होती है',
          'घर्षण द्वारा किया गया कार्य सदैव ऋणात्मक',
        ]
      },
      {
        name: 'घूर्णी गति (Rotational Motion)',
        formulas: [
          { title: 'कोणीय वेग', formula: 'ω = dθ/dt', description: 'कोणीय वेग = कोण का परिवर्तन/समय' },
          { title: 'बल आघूर्ण', formula: 'τ = r × F = Iα', description: 'बल आघूर्ण = स्थिति × बल' },
          { title: 'जड़त्व आघूर्ण', formula: 'I = Σmr²', description: 'जड़त्व आघूर्ण = Σ(द्रव्यमान × त्रिज्या²)' },
          { title: 'कोणीय संवेग', formula: 'L = Iω', description: 'कोणीय संवेग = जड़त्व आघूर्ण × कोणीय वेग' },
        ],
        shortcuts: [
          'वृत्तीय डिस्क: I = ½MR²',
          'छड़ (केंद्र): I = ML²/12',
          'गोला: I = (2/5)MR²',
          'लुढ़कना: v = ωR',
        ],
        concepts: [
          'समांतर अक्ष प्रमेय: I = I_cm + Md²',
          'लंबवत अक्ष प्रमेय: I_z = I_x + I_y',
          'कोणीय संवेग संरक्षण: τ_ext = 0',
        ]
      },
      {
        name: 'विद्युत और चुंबकत्व (Electricity & Magnetism)',
        formulas: [
          { title: 'ओम का नियम', formula: 'V = IR', description: 'वोल्टेज = धारा × प्रतिरोध' },
          { title: 'कूलॉम का नियम', formula: 'F = kq₁q₂/r²', description: 'बल = k × आवेश1 × आवेश2 / दूरी²' },
          { title: 'धारिता', formula: 'C = Q/V', description: 'धारिता = आवेश/वोल्टेज' },
          { title: 'लॉरेंत्ज़ बल', formula: 'F = qvB sin(θ)', description: 'चुंबकीय बल = आवेश × वेग × चुंबकीय क्षेत्र' },
        ],
        shortcuts: [
          'श्रेणी में प्रतिरोध जुड़ते हैं',
          'समांतर में प्रतिरोध का व्युत्क्रम जुड़ता है',
          'RC समय स्थिरांक: τ = RC',
          'चुंबकीय क्षेत्र में आवेश वृत्ताकार पथ पर चलता है',
        ],
        concepts: [
          'विद्युत क्षेत्र: E = F/q = kQ/r²',
          'विभव: V = kQ/r',
          'फैराडे का नियम: ε = -dΦ/dt',
        ]
      },
    ]
  },
  Chemistry: {
    icon: FlaskConical,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    chapters: [
      {
        name: 'परमाणु संरचना (Atomic Structure)',
        formulas: [
          { title: 'बोर त्रिज्या', formula: 'rₙ = 0.529 × n²/Z Å', description: 'n = कक्षा संख्या, Z = परमाणु क्रमांक' },
          { title: 'ऊर्जा', formula: 'Eₙ = -13.6 × Z²/n² eV', description: 'कक्षा की ऊर्जा' },
          { title: 'डी-ब्रॉग्ली तरंगदैर्ध्य', formula: 'λ = h/mv', description: 'तरंगदैर्ध्य = प्लांक स्थिरांक/संवेग' },
          { title: 'हाइजेनबर्ग अनिश्चितता', formula: 'Δx × Δp ≥ h/4π', description: 'स्थिति × संवेग अनिश्चितता' },
        ],
        shortcuts: [
          'कोश भरने का क्रम: 1s 2s 2p 3s 3p 4s 3d 4p...',
          'अधिकतम इलेक्ट्रॉन: 2n²',
          'स्पिन क्वांटम संख्या: +½ या -½',
          'हुंड का नियम: अधिकतम स्पिन',
        ],
        concepts: [
          'आफबाउ सिद्धांत: कम ऊर्जा कक्षक पहले भरता है',
          'पाउली का अपवर्जन सिद्धांत: 4 क्वांटम संख्याएं अलग',
          'हुंड का नियम: समान ऊर्जा कक्षकों में पहले एक-एक इलेक्ट्रॉन',
        ]
      },
      {
        name: 'रासायनिक बंधन (Chemical Bonding)',
        formulas: [
          { title: 'बंध क्रम', formula: 'BO = (Nb - Na)/2', description: 'Nb = बंधी इलेक्ट्रॉन, Na = प्रतिबंधी इलेक्ट्रॉन' },
          { title: 'द्विध्रुव आघूर्ण', formula: 'μ = q × d', description: 'द्विध्रुव आघूर्ण = आवेश × दूरी' },
          { title: 'जालक ऊर्जा', formula: 'U ∝ q₁q₂/r', description: 'बॉर्न-लैंडे समीकरण' },
        ],
        shortcuts: [
          'sp³ = चतुष्फलकीय (109.5°)',
          'sp² = त्रिकोणीय समतल (120°)',
          'sp = रैखिक (180°)',
          'ध्रुवता: EN अंतर > 1.7 = आयनिक',
        ],
        concepts: [
          'VSEPR सिद्धांत से ज्यामिति निर्धारित होती है',
          'हाइड्रोजन बंध सबसे मजबूत अंतराआण्विक बल',
          'संकरण = s, p, d कक्षकों का मिश्रण',
        ]
      },
      {
        name: 'रासायनिक साम्य (Chemical Equilibrium)',
        formulas: [
          { title: 'साम्य स्थिरांक', formula: 'Kc = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ', description: 'उत्पादों की सांद्रता/अभिकारकों की सांद्रता' },
          { title: 'Kp और Kc संबंध', formula: 'Kp = Kc(RT)^Δn', description: 'Δn = गैसीय मोलों का अंतर' },
          { title: 'पृथक्करण की मात्रा', formula: 'α = √(Kc/C)', description: 'दुर्बल अम्ल/क्षार के लिए' },
        ],
        shortcuts: [
          'Q < K: आगे की ओर अभिक्रिया',
          'Q > K: पीछे की ओर अभिक्रिया',
          'दाब बढ़ाने पर कम मोल वाली दिशा',
          'ताप बढ़ाने पर एंडोथर्मिक दिशा',
        ],
        concepts: [
          'ले-शातेलिए सिद्धांत: साम्य विरोध करता है',
          'उत्प्रेरक साम्य स्थिति नहीं बदलता',
          'साम्य एक गतिक अवस्था है',
        ]
      },
      {
        name: 'कार्बनिक रसायन (Organic Chemistry)',
        formulas: [
          { title: 'DBE', formula: 'DBE = (2C + 2 + N - H - X)/2', description: 'असंतृप्तता की मात्रा' },
          { title: 'ऑप्टिकल घूर्णन', formula: '[α] = α/(l × c)', description: 'विशिष्ट घूर्णन' },
        ],
        shortcuts: [
          'मार्कोवनिकॉफ: H कम H वाले C पर',
          'एंटी-मार्कोवनिकॉफ: HBr + peroxide',
          'SN1: तृतीयक > द्वितीयक > प्राथमिक',
          'SN2: प्राथमिक > द्वितीयक > तृतीयक',
          'E1, E2: विलोपन - β-H निकलता है',
        ],
        concepts: [
          'इलेक्ट्रॉन दाता समूह: -NH2, -OH, -OR, -alkyl',
          'इलेक्ट्रॉन ग्राही समूह: -NO2, -CN, -CHO, -COOH',
          'अनुनाद प्रभाव: p-π संयुग्मन',
          'आगमनिक प्रभाव: σ बंध द्वारा',
        ]
      },
      {
        name: 'ऊष्मागतिकी (Thermodynamics)',
        formulas: [
          { title: 'प्रथम नियम', formula: 'ΔU = q + w', description: 'आंतरिक ऊर्जा = ऊष्मा + कार्य' },
          { title: 'एन्थैल्पी', formula: 'ΔH = ΔU + PΔV', description: 'नियत दाब पर ऊष्मा' },
          { title: 'गिब्स ऊर्जा', formula: 'ΔG = ΔH - TΔS', description: 'स्वतःप्रवर्तित के लिए ΔG < 0' },
          { title: 'साम्य', formula: 'ΔG° = -RT ln K', description: 'मानक गिब्स ऊर्जा और K का संबंध' },
        ],
        shortcuts: [
          'ΔH < 0: ऊष्माक्षेपी',
          'ΔH > 0: ऊष्माशोषी',
          'ΔS > 0: अव्यवस्था बढ़ी',
          'ऊष्माक्षेपी + ΔS > 0: हमेशा स्वतःप्रवर्तित',
        ],
        concepts: [
          'हेस का नियम: पथ स्वतंत्रता',
          'एन्ट्रॉपी ब्रह्मांड में हमेशा बढ़ती है',
          'कार्नो इंजन: अधिकतम दक्षता',
        ]
      },
    ]
  },
  Mathematics: {
    icon: Calculator,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    chapters: [
      {
        name: 'द्विघात समीकरण (Quadratic Equations)',
        formulas: [
          { title: 'मूल सूत्र', formula: 'x = (-b ± √(b²-4ac))/2a', description: 'ax² + bx + c = 0 के मूल' },
          { title: 'मूलों का योग', formula: 'α + β = -b/a', description: 'दोनों मूलों का योग' },
          { title: 'मूलों का गुणनफल', formula: 'αβ = c/a', description: 'दोनों मूलों का गुणनफल' },
          { title: 'विविक्तकर', formula: 'D = b² - 4ac', description: 'मूलों की प्रकृति निर्धारित करता है' },
        ],
        shortcuts: [
          'D > 0: दो भिन्न वास्तविक मूल',
          'D = 0: दो समान वास्तविक मूल',
          'D < 0: काल्पनिक मूल',
          'समीकरण निर्माण: x² - (योग)x + (गुणनफल) = 0',
        ],
        concepts: [
          'परवलय का शीर्ष: x = -b/2a',
          'a > 0: ऊपर की ओर खुलता है',
          'a < 0: नीचे की ओर खुलता है',
        ]
      },
      {
        name: 'त्रिकोणमिति (Trigonometry)',
        formulas: [
          { title: 'पायथागोरस सर्वसमिका', formula: 'sin²θ + cos²θ = 1', description: 'मूल त्रिकोणमितीय सर्वसमिका' },
          { title: 'योग सूत्र', formula: 'sin(A+B) = sinA cosB + cosA sinB', description: 'कोणों के योग का sin' },
          { title: 'द्विगुण कोण', formula: 'sin2θ = 2sinθ cosθ', description: 'दोगुने कोण का sin' },
          { title: 'cos द्विगुण', formula: 'cos2θ = cos²θ - sin²θ', description: 'दोगुने कोण का cos' },
        ],
        shortcuts: [
          'sin(90°-θ) = cosθ, cos(90°-θ) = sinθ',
          'sin(-θ) = -sinθ, cos(-θ) = cosθ',
          'tan45° = 1, sin30° = 1/2, cos60° = 1/2',
          'sin0° = 0, cos0° = 1, sin90° = 1, cos90° = 0',
        ],
        concepts: [
          'चतुर्थांश नियम: All Students Take Coffee',
          '1st: सभी +, 2nd: sin +, 3rd: tan +, 4th: cos +',
          'सामान्य हल: nπ, 2nπ, nπ + (-1)ⁿα',
        ]
      },
      {
        name: 'कलन (Calculus)',
        formulas: [
          { title: 'शक्ति नियम', formula: 'd/dx(xⁿ) = nxⁿ⁻¹', description: 'घात का अवकलन' },
          { title: 'श्रृंखला नियम', formula: 'dy/dx = (dy/du)(du/dx)', description: 'संयुक्त फलन का अवकलन' },
          { title: 'समाकलन', formula: '∫xⁿdx = xⁿ⁺¹/(n+1) + C', description: 'घात का समाकलन (n ≠ -1)' },
          { title: 'खंडश: समाकलन', formula: '∫u dv = uv - ∫v du', description: 'दो फलनों के गुणनफल का समाकलन' },
        ],
        shortcuts: [
          'd/dx(eˣ) = eˣ',
          'd/dx(ln x) = 1/x',
          'd/dx(sinx) = cosx',
          'd/dx(cosx) = -sinx',
          '∫1/x dx = ln|x| + C',
        ],
        concepts: [
          'अधिकतम/न्यूनतम: dy/dx = 0, जांचें d²y/dx²',
          'निश्चित समाकलन = क्षेत्रफल',
          'लाइबनिट्ज़ नियम: समाकलन की सीमा फलन हो',
        ]
      },
      {
        name: 'सदिश और 3D ज्यामिति (Vectors & 3D)',
        formulas: [
          { title: 'अदिश गुणनफल', formula: 'a⃗·b⃗ = |a||b|cosθ', description: 'डॉट प्रोडक्ट' },
          { title: 'सदिश गुणनफल', formula: '|a⃗×b⃗| = |a||b|sinθ', description: 'क्रॉस प्रोडक्ट का परिमाण' },
          { title: 'दूरी सूत्र', formula: 'd = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]', description: '3D में दो बिंदुओं के बीच दूरी' },
          { title: 'दिक्-कोसाइन', formula: 'l² + m² + n² = 1', description: 'दिशा कोसाइनों का संबंध' },
        ],
        shortcuts: [
          'a⃗⊥b⃗ ⟺ a⃗·b⃗ = 0',
          'a⃗∥b⃗ ⟺ a⃗×b⃗ = 0',
          'त्रिभुज का क्षेत्रफल = ½|a⃗×b⃗|',
          'समांतर चतुर्भुज का क्षेत्रफल = |a⃗×b⃗|',
        ],
        concepts: [
          'रेखा का समीकरण: (x-x₁)/l = (y-y₁)/m = (z-z₁)/n',
          'समतल का समीकरण: ax + by + cz + d = 0',
          'बिंदु से समतल की दूरी: |ax₁+by₁+cz₁+d|/√(a²+b²+c²)',
        ]
      },
      {
        name: 'प्रायिकता और सांख्यिकी (Probability & Statistics)',
        formulas: [
          { title: 'प्रायिकता', formula: 'P(A) = n(A)/n(S)', description: 'अनुकूल/कुल परिणाम' },
          { title: 'सशर्त प्रायिकता', formula: 'P(A|B) = P(A∩B)/P(B)', description: 'B दिए होने पर A की प्रायिकता' },
          { title: 'बेयज़ प्रमेय', formula: 'P(Aᵢ|B) = P(Aᵢ)P(B|Aᵢ)/ΣP(Aⱼ)P(B|Aⱼ)', description: 'पश्चगामी प्रायिकता' },
          { title: 'द्विपद बंटन', formula: 'P(X=r) = ⁿCᵣ pʳ qⁿ⁻ʳ', description: 'n प्रयोगों में r सफलताएं' },
        ],
        shortcuts: [
          'P(A∪B) = P(A) + P(B) - P(A∩B)',
          'स्वतंत्र घटनाएं: P(A∩B) = P(A)×P(B)',
          'माध्य = Σxᵢfᵢ/Σfᵢ',
          'प्रसरण = E(X²) - [E(X)]²',
        ],
        concepts: [
          'परस्पर अपवर्जी: P(A∩B) = 0',
          'पूरक: P(A\') = 1 - P(A)',
          'कुल प्रायिकता: ΣP(Aᵢ) = 1 (विभाजन)',
        ]
      },
    ]
  }
};

export const QuickRevisionMode: React.FC<QuickRevisionModeProps> = ({ onBack }) => {
  const [activeSubject, setActiveSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const subjectData = revisionData[activeSubject];
  const SubjectIcon = subjectData.icon;

  const toggleTopicComplete = (topicName: string) => {
    setCompletedTopics(prev => 
      prev.includes(topicName) 
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    );
  };

  const getProgress = () => {
    const totalTopics = Object.values(revisionData).reduce(
      (sum, subject) => sum + subject.chapters.length, 0
    );
    return Math.round((completedTopics.length / totalTopics) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="h-6 w-6 text-warning" />
                  त्वरित संशोधन मोड
                </h1>
                <p className="text-sm text-muted-foreground">
                  सूत्र, संकल्पनाएं और शॉर्टकट्स
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">पूर्ण</div>
                <div className="text-lg font-bold text-primary">{getProgress()}%</div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {completedTopics.length} / {Object.values(revisionData).reduce((s, sub) => s + sub.chapters.length, 0)} अध्याय
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeSubject} onValueChange={(v) => setActiveSubject(v as typeof activeSubject)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="Physics" className="flex items-center gap-2">
              <Atom className="h-4 w-4" />
              भौतिकी
            </TabsTrigger>
            <TabsTrigger value="Chemistry" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              रसायन
            </TabsTrigger>
            <TabsTrigger value="Mathematics" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              गणित
            </TabsTrigger>
          </TabsList>

          {['Physics', 'Chemistry', 'Mathematics'].map((subject) => (
            <TabsContent key={subject} value={subject}>
              <ScrollArea className="h-[calc(100vh-220px)]">
                <Accordion type="multiple" className="space-y-4">
                  {revisionData[subject as keyof typeof revisionData].chapters.map((chapter, idx) => (
                    <AccordionItem 
                      key={idx} 
                      value={`chapter-${idx}`}
                      className="border rounded-lg bg-card overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            revisionData[subject as keyof typeof revisionData].bgColor
                          )}>
                            <SubjectIcon className={cn("h-5 w-5", revisionData[subject as keyof typeof revisionData].color)} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{chapter.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {chapter.formulas.length} सूत्र • {chapter.shortcuts.length} शॉर्टकट्स
                            </div>
                          </div>
                          {completedTopics.includes(chapter.name) && (
                            <CheckCircle2 className="h-5 w-5 text-success mr-2" />
                          )}
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="px-4 pb-4 space-y-6">
                        {/* Formulas */}
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3 text-primary">
                            <BookOpen className="h-4 w-4" />
                            मुख्य सूत्र
                          </h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            {chapter.formulas.map((formula, fIdx) => (
                              <Card key={fIdx} className="bg-muted/30">
                                <CardContent className="p-4">
                                  <div className="text-sm font-medium text-muted-foreground mb-1">
                                    {formula.title}
                                  </div>
                                  <div className="text-lg font-mono font-bold text-primary mb-2">
                                    {formula.formula}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {formula.description}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Shortcuts */}
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3 text-warning">
                            <Zap className="h-4 w-4" />
                            याद रखें (शॉर्टकट्स)
                          </h4>
                          <div className="bg-warning/10 rounded-lg p-4 space-y-2">
                            {chapter.shortcuts.map((shortcut, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2 text-sm">
                                <ChevronRight className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                                <span>{shortcut}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Concepts */}
                        <div>
                          <h4 className="font-semibold flex items-center gap-2 mb-3 text-success">
                            <Lightbulb className="h-4 w-4" />
                            मुख्य संकल्पनाएं
                          </h4>
                          <div className="bg-success/10 rounded-lg p-4 space-y-2">
                            {chapter.concepts.map((concept, cIdx) => (
                              <div key={cIdx} className="flex items-start gap-2 text-sm">
                                <Star className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                <span>{concept}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mark Complete */}
                        <Button
                          variant={completedTopics.includes(chapter.name) ? "secondary" : "default"}
                          className="w-full"
                          onClick={() => toggleTopicComplete(chapter.name)}
                        >
                          {completedTopics.includes(chapter.name) ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              पूर्ण (फिर से पढ़ें?)
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              पूर्ण के रूप में चिह्नित करें
                            </>
                          )}
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
