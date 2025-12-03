

import { Book, Category, SubscriptionPlan } from './types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    period: 'forever',
    features: [
      '3 Résumés par mois',
      'Accès limité à l\'IA',
      'Audio qualité standard',
      'Publicités'
    ],
    color: 'bg-gray-100'
  },
  {
    id: 'monthly',
    name: 'Gold Mensuel',
    price: 900,
    period: 'month',
    features: [
      'Résumés illimités',
      'IA illimitée (PDF & Texte)',
      'Audio HD sans pub',
      'Téléchargement PDF',
      'Support prioritaire'
    ],
    color: 'bg-blue-50',
    recommended: false
  },
  {
    id: 'yearly',
    name: 'Gold Annuel',
    price: 9000,
    period: 'year',
    features: [
      'Tout inclus (Gold Mensuel)',
      '2 mois offerts',
      'Badge Membre Fondateur',
      'Accès anticipé aux nouveautés'
    ],
    color: 'bg-gradient-to-br from-amber-100 to-orange-100',
    recommended: true
  }
];

// URLs for demonstration (Using reliable MP3 sources from Free Music Archive)
const DEMO_AUDIO_1 = 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3'; 
const DEMO_AUDIO_2 = 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3';
const DEMO_AUDIO_3 = 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3';

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg',
    category: Category.SELF_HELP,
    rating: 4.9,
    duration: 10,
    summary: 'An easy and proven way to build good habits and break bad ones.',
    longSummary: `James Clear's "Atomic Habits" is a definitive guide to breaking bad behaviors and adopting good ones in four steps, showing you how small, incremental, everyday routines compound into massive, positive change over time.

The core philosophy of the book is that real change comes from the compound effect of hundreds of small decisions—doing two push-ups a day, waking up five minutes early, or reading a single page. Clear calls these "atomic habits."

**The Four Laws of Behavior Change**
Clear introduces a framework called the Four Laws of Behavior Change, which are a set of simple rules we can use to build better habits. They are:
1. **Make it Obvious:** Redesign your environment to make the cues for your good habits visible. If you want to play guitar, leave it in the middle of the living room.
2. **Make it Attractive:** Bundle habits you need to do with habits you want to do. This is known as "temptation bundling."
3. **Make it Easy:** Reduce friction. The central idea is to optimize your environment to make actions easier.
4. **Make it Satisfying:** Give yourself an immediate reward when you complete your habit.

The book also delves into the concept of identity. Clear argues that the most effective way to change your habits is to focus not on what you want to achieve, but on who you want to become. Instead of saying "I want to read a book," say "I am a reader."

Ultimately, "Atomic Habits" provides a practical manual for rewiring your brain and your life, proving that you don't need to revolutionize your entire life overnight to see results—you just need to be 1% better today than you were yesterday.`,
    fullSummary: {
      mainIdea: "Small changes, remarkable results. Habits are the compound interest of self-improvement.",
      keyPoints: [
        "The 1% rule: get 1% better every day.",
        "Focus on systems, not goals.",
        "Identity change is the north star of habit change."
      ],
      lessons: [
        "Make it obvious.",
        "Make it attractive.",
        "Make it easy.",
        "Make it satisfying."
      ]
    },
    audioUrl: DEMO_AUDIO_1
  },
  {
    id: '2',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    coverUrl: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg',
    category: Category.SCIENCE,
    rating: 4.8,
    duration: 9,
    summary: 'A brief history of humankind from the Stone Age to the 21st century.',
    longSummary: `In "Sapiens: A Brief History of Humankind," Yuval Noah Harari spans the entire history of the human species, from the very first humans to walk the earth to the radical—and sometimes devastating—breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions.

Harari argues that Homo sapiens rules the world because we are the only animal that can believe in things that exist purely in our own imagination, such as gods, states, money, and human rights.

**Key Revolutions:**
1. **The Cognitive Revolution (70,000 years ago):** Sapiens developed the unique ability to use complex language to communicate about things that don't physically exist (myths, legends, religions). This allowed for large-scale cooperation.
2. **The Agricultural Revolution (12,000 years ago):** Humans transitioned from foraging to farming. Harari provocatively calls this "history's biggest fraud," arguing that while it allowed for population growth, it led to a worse diet, longer work hours, and more disease for the average individual.
3. **The Scientific Revolution (500 years ago):** Humankind admitted its ignorance and began to acquire unprecedented power by investing resources in scientific research.

The book concludes with a look at the future, suggesting that we are on the verge of becoming "gods" through biotechnology and AI, potentially leading to the end of Homo sapiens as we know them. It is a thought-provoking exploration of where we came from and where we might be going.`,
    audioUrl: DEMO_AUDIO_2
  },
  {
    id: '3',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    coverUrl: 'https://m.media-amazon.com/images/I/51bVNTqHFlL._AC_UF1000,1000_QL80_.jpg',
    category: Category.FICTION,
    rating: 4.7,
    duration: 8,
    summary: 'A fable about following your dream and listening to your heart.',
    longSummary: `The Alchemist follows the journey of an Andalusian shepherd boy named Santiago. Believing a recurring dream to be prophetic, he decides to travel to the pyramids of Egypt to find a treasure.

Along the way, he meets a series of spiritual guides—a gypsy woman, a king, and an alchemist—who point him in the direction of his "Personal Legend," or his true purpose in life.

**Themes of the Journey:**
The book is a metaphor for life. It teaches that when you want something, all the universe conspires in helping you to achieve it. However, fear of failure often stops people from pursuing their dreams. Santiago learns to listen to his heart and read the "omens" scattered throughout the world.

One of the key lessons is that the journey itself matters as much as the destination. Santiago finds love, learns the universal language of the world, and turns himself into the wind, discovering that the treasure he sought was not just gold, but the wisdom and experience gained along the way.

In the end, "The Alchemist" is a simple yet powerful reminder to pursue our dreams, listen to our intuition, and not let fear dictate our paths.`,
    audioUrl: DEMO_AUDIO_3
  },
  {
    id: '4',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverUrl: 'https://m.media-amazon.com/images/I/61fdrEuPJwL._AC_UF1000,1000_QL80_.jpg',
    category: Category.PSYCHOLOGY,
    rating: 4.6,
    duration: 10,
    summary: 'The two systems that drive the way we think: System 1 (fast) and System 2 (slow).',
    longSummary: `Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind in "Thinking, Fast and Slow." He explains the two systems that drive the way we think:

**System 1** is fast, intuitive, and emotional. It operates automatically and quickly, with little or no effort and no sense of voluntary control. It is responsible for forming first impressions and making snap judgments.

**System 2** is slower, more deliberative, and more logical. It allocates attention to the effortful mental activities that demand it, including complex computations.

Kahneman exposes the extraordinary capabilities—and also the faults and biases—of fast thinking, and reveals the pervasive influence of intuitive impressions on our thoughts and behavior. He explains why we are prone to cognitive biases like:
*   **Anchoring:** Relying too heavily on the first piece of information offered.
*   **Loss Aversion:** The tendency to prefer avoiding losses to acquiring equivalent gains.
*   **The Halo Effect:** How our overall impression of a person influences how we feel and think about their character.

The book offers practical insights into how we make choices in both our business and our personal lives, and how we can use different techniques to guard against the mental glitches that often get us into trouble.`,
    audioUrl: DEMO_AUDIO_1
  },
  {
    id: '5',
    title: 'Zero to One',
    author: 'Peter Thiel',
    coverUrl: 'https://m.media-amazon.com/images/I/71uAI28kJuL._AC_UF1000,1000_QL80_.jpg',
    category: Category.BUSINESS,
    rating: 4.5,
    duration: 10,
    summary: 'Notes on startups, or how to build the future.',
    longSummary: `"Zero to One" presents Peter Thiel's philosophy on entrepreneurship and innovation. The central thesis is that doing what someone else already knows how to do takes the world from 1 to n, adding more of something familiar. But when you do something new, you go from 0 to 1. The next Bill Gates will not build an operating system. The next Larry Page or Sergey Brin won’t make a search engine.

**Key Concepts:**
*   **Monopoly is Good:** Thiel argues that competition is for losers. Creative monopolies—companies that create something so new and valuable that they have no close substitutes—are the engines of progress.
*   **The Power of Secrets:** Great companies are built on secrets—specific truths that very few people agree with you on.
*   **The Last Mover Advantage:** It’s not about being the first to market; it’s about being the last. You want to build a product so good that no one else can compete.

Thiel also emphasizes the importance of sales (you need to sell your product, it won't sell itself) and the role of founders (eccentric individuals who drive the vision). It is a contrarian manifesto for building the future.`,
    fullSummary: {
      mainIdea: "To build a better future, you must believe in secrets and build a monopoly.",
      keyPoints: [
        "Vertical progress (0 to 1) vs Horizontal progress (1 to n).",
        "Competition is for losers; aim for monopoly.",
        "Sales matter as much as product."
      ],
      lessons: [
        "Start small and monopolize.",
        "Don't disrupt; avoid competition.",
        "Last mover advantage."
      ]
    },
    audioUrl: DEMO_AUDIO_2
  },
  {
    id: '6',
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    coverUrl: 'https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg',
    category: Category.BUSINESS,
    rating: 4.8,
    duration: 8,
    summary: 'What the rich teach their kids about money that the poor and middle class do not.',
    longSummary: `This classic personal finance book tells the story of Robert Kiyosaki growing up with two dads—his real father (Poor Dad) and the father of his best friend (Rich Dad)—and the ways in which both men shaped his thoughts about money and investing.

**Core Lessons:**
1.  **The Rich Don't Work for Money:** They make money work for them. Poor and middle-class people work for money. The rich acquire assets.
2.  **Assets vs. Liabilities:** An asset puts money in your pocket. A liability takes money out of your pocket. Kiyosaki argues that a house is often a liability, not an asset, because of the costs associated with it.
3.  **Financial Literacy:** Understanding financial statements is crucial. You must know the difference between income, expense, assets, and liabilities.

The book challenges the myth that you need to earn a high income to become rich and explains the difference between working for money and having your money work for you. It emphasizes the importance of financial education, financial independence, and building wealth through investing in assets, real estate investing, starting and owning businesses, as well as increasing one's financial intelligence.`,
    audioUrl: DEMO_AUDIO_3
  },
  {
    id: '7',
    title: 'Deep Work',
    author: 'Cal Newport',
    coverUrl: 'https://m.media-amazon.com/images/I/71QL1H8Vp1L._AC_UF1000,1000_QL80_.jpg',
    category: Category.PRODUCTIVITY,
    rating: 4.7,
    duration: 9,
    summary: 'Rules for focused success in a distracted world.',
    longSummary: `Cal Newport defines "Deep Work" as professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.

**The Problem:**
We are living in an economy that increasingly rewards deep work (complex problem solving, high-level coding, writing), yet our environment (social media, open offices, constant emails) is making deep work increasingly rare.

**Strategies for Deep Work:**
*   **Work Deeply:** Choose a philosophy (Monastic, Bimodal, Rhythmic, or Journalistic) that fits your life to carve out time for deep work.
*   **Embrace Boredom:** Train your brain to be comfortable with lack of stimulation. If you succumb to distraction every time you are bored, you will never be able to focus deeply.
*   **Quit Social Media:** Apply the law of the vital few to your internet habits.
*   **Drain the Shallows:** Minimize "shallow work"—non-cognitively demanding, logistical-style tasks.

"Deep Work" is an indispensable guide to anyone seeking focused success in a distracted world.`,
    audioUrl: DEMO_AUDIO_1
  },
  {
    id: '8',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    coverUrl: 'https://m.media-amazon.com/images/I/81Dky+tD+pL._AC_UF1000,1000_QL80_.jpg',
    category: Category.BUSINESS,
    rating: 4.9,
    duration: 9,
    summary: 'Timeless lessons on wealth, greed, and happiness.',
    longSummary: `Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life’s most important topics.

**Key Insights:**
*   **Luck & Risk:** They are siblings. Outcomes are rarely 100% due to effort. Acknowledge the role of luck in success and risk in failure.
*   **Getting Wealthy vs. Staying Wealthy:** Getting money requires taking risks, being optimistic, and putting yourself out there. Keeping money requires the opposite: fear, humility, and frugality.
*   **The Power of Compounding:** The most powerful force in finance is time. Warren Buffett is a great investor, but his secret is that he has been a great investor for 80 years.
*   **Freedom:** The highest form of wealth is the ability to wake up every morning and say, "I can do whatever I want today."

Housel argues that doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people.`,
    audioUrl: DEMO_AUDIO_2
  },
  {
    id: '9',
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg',
    category: Category.FICTION,
    rating: 4.8,
    duration: 10,
    summary: 'A mythic and emotionally charged hero\'s journey on a desert planet.',
    longSummary: `Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness. Coveted across the known universe, melange is a prize worth killing for.

When House Atreides is betrayed, the destruction of Paul’s family sets the boy on a journey toward a destiny greater than he could ever have imagined. And as he evolves into the mysterious man known as Muad'Dib, he will bring to fruition humankind’s most ancient and unattainable dream.

Dune is a complex tapestry of politics, religion, ecology, technology, and human emotion. It explores the danger of charismatic leaders, the relationship between ecology and culture, and the potential of the human mind. It is widely considered one of the greatest science fiction novels of all time.`,
    audioUrl: DEMO_AUDIO_3
  }
];

export const CATEGORIES = Object.values(Category);