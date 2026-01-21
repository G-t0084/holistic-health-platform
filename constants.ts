
import { Dosha } from './types';

export interface Question {
  id: string;
  category: 'Structural' | 'Metabolic' | 'Mental';
  question: string;
  options: { text: string; dosha: Dosha }[];
}

export const PRAKRITI_QUESTIONS: Question[] = [
  // --- STRUCTURAL (Deha) ---
  {
    id: 'frame',
    category: 'Structural',
    question: 'How would you describe your body frame?',
    options: [
      { text: 'Thin, bony, or very tall/short', dosha: Dosha.VATA },
      { text: 'Medium build, athletic', dosha: Dosha.PITTA },
      { text: 'Large, broad, or solid build', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'hair',
    category: 'Structural',
    question: 'Describe the natural quality of your hair.',
    options: [
      { text: 'Dry, curly, frizzy, or brittle', dosha: Dosha.VATA },
      { text: 'Fine, soft, straight, prone to early graying', dosha: Dosha.PITTA },
      { text: 'Thick, oily, wavy, and lustrous', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'skin',
    category: 'Structural',
    question: 'Describe your skin texture and quality.',
    options: [
      { text: 'Dry, rough, thin, or cold to touch', dosha: Dosha.VATA },
      { text: 'Soft, warm, oily, prone to rashes/moles', dosha: Dosha.PITTA },
      { text: 'Thick, moist, oily, smooth, and cool', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'eyes',
    category: 'Structural',
    question: 'Observe your eyes (size and quality).',
    options: [
      { text: 'Small, dry, sunken, or often blinking', dosha: Dosha.VATA },
      { text: 'Medium, sharp, sensitive to light', dosha: Dosha.PITTA },
      { text: 'Large, wide, thick lashes, steady gaze', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'joints',
    category: 'Structural',
    question: 'How are your physical joints?',
    options: [
      { text: 'Prominent, dry, or prone to cracking sounds', dosha: Dosha.VATA },
      { text: 'Flexible, medium-sized, and loose', dosha: Dosha.PITTA },
      { text: 'Strong, large, well-lubricated/padded', dosha: Dosha.KAPHA }
    ]
  },

  // --- METABOLIC (Agni/Koshtha) ---
  {
    id: 'digestion',
    category: 'Metabolic',
    question: 'How is your digestion and hunger (Agni)?',
    options: [
      { text: 'Irregular (sometimes high, sometimes low)', dosha: Dosha.VATA },
      { text: 'Strong and intense (cannot skip meals)', dosha: Dosha.PITTA },
      { text: 'Slow but steady (can easily skip meals)', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'thirst',
    category: 'Metabolic',
    question: 'How is your thirst frequency?',
    options: [
      { text: 'Variable; often forgets to drink water', dosha: Dosha.VATA },
      { text: 'Frequent; drinks a lot of cold water', dosha: Dosha.PITTA },
      { text: 'Low; rarely feels thirsty', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'bowels',
    category: 'Metabolic',
    question: 'Describe your typical bowel habits.',
    options: [
      { text: 'Hard, dry, or prone to constipation', dosha: Dosha.VATA },
      { text: 'Soft, loose, or frequent', dosha: Dosha.PITTA },
      { text: 'Heavy, solid, and regular', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'sweat',
    category: 'Metabolic',
    question: 'How much do you typically sweat?',
    options: [
      { text: 'Scanty and odorless', dosha: Dosha.VATA },
      { text: 'Profuse, with a strong/sour odor', dosha: Dosha.PITTA },
      { text: 'Steady and moderate', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'temperature',
    category: 'Metabolic',
    question: 'Which climate/temperature do you prefer?',
    options: [
      { text: 'Likes warmth; hates cold/wind', dosha: Dosha.VATA },
      { text: 'Likes cool; hates heat/sun', dosha: Dosha.PITTA },
      { text: 'Likes dry/warm; hates damp/cold', dosha: Dosha.KAPHA }
    ]
  },

  // --- MENTAL (Manas) ---
  {
    id: 'sleep',
    category: 'Mental',
    question: 'What is your typical sleep pattern?',
    options: [
      { text: 'Light, interrupted, difficulty falling asleep', dosha: Dosha.VATA },
      { text: 'Moderate, sound, can wake up easily', dosha: Dosha.PITTA },
      { text: 'Deep, heavy, difficulty waking up', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'memory',
    category: 'Mental',
    question: 'How do you learn and remember things?',
    options: [
      { text: 'Learns quickly, forgets quickly', dosha: Dosha.VATA },
      { text: 'Learns quickly, retains well, sharp memory', dosha: Dosha.PITTA },
      { text: 'Learns slowly, but never forgets', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'speech',
    category: 'Mental',
    question: 'How would others describe your speech style?',
    options: [
      { text: 'Talkative, fast, sometimes erratic', dosha: Dosha.VATA },
      { text: 'Sharp, precise, argumentative, or convincing', dosha: Dosha.PITTA },
      { text: 'Slow, melodious, calm, and thoughtful', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'decisions',
    category: 'Mental',
    question: 'How do you typically make decisions?',
    options: [
      { text: 'Hesitant, changes mind frequently', dosha: Dosha.VATA },
      { text: 'Decisive, impulsive, or confident', dosha: Dosha.PITTA },
      { text: 'Slow, methodical, or stubborn', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'concentration',
    category: 'Mental',
    question: 'Describe your typical concentration span.',
    options: [
      { text: 'Short; mind wanders easily', dosha: Dosha.VATA },
      { text: 'Strong; intense focus on goals', dosha: Dosha.PITTA },
      { text: 'Steady; takes time to settle in but stays focused', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'temperament',
    category: 'Mental',
    question: 'How do you react to intense stress?',
    options: [
      { text: 'Anxiety, worry, or fear', dosha: Dosha.VATA },
      { text: 'Irritability, anger, or impatience', dosha: Dosha.PITTA },
      { text: 'Calmness, withdrawing, or laziness', dosha: Dosha.KAPHA }
    ]
  },
  {
    id: 'finance',
    category: 'Mental',
    question: 'How do you handle money and finances?',
    options: [
      { text: 'Spends quickly on small, varied things', dosha: Dosha.VATA },
      { text: 'Spends on quality or luxury items', dosha: Dosha.PITTA },
      { text: 'Saves money; spends reluctantly', dosha: Dosha.KAPHA }
    ]
  }
];

export const APP_THEME = {
  primary: '#0F766E',
  secondary: '#F59E0B',
  accent: '#BEF264',
  vata: '#60A5FA',
  pitta: '#F87171',
  kapha: '#4ADE80'
};
