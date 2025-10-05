
import React from 'react';
import type { Resource, TeamMember } from './types';

export const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'The Future of Renewable Energy',
    category: 'Science',
    shortDescription: 'An in-depth look at solar, wind, and geothermal energy sources.',
    content: 'Renewable energy is derived from natural sources that are replenished on a human timescale. The main forms of renewable energy are solar, wind, geothermal, hydropower, and biomass. In 2020, renewable energy sources accounted for about 12.6% of total U.S. energy consumption and about 19.8% of electricity generation. The push towards a sustainable future has accelerated research and development in this field, with significant improvements in efficiency and cost-effectiveness. Solar panels, for instance, have seen a drastic price reduction over the past decade, making them more accessible for both residential and commercial use. Wind turbines are becoming larger and more powerful, capable of powering thousands of homes. Geothermal energy taps into the Earth\'s internal heat, offering a consistent and reliable power source. The transition to renewable energy is crucial for combating climate change and reducing our reliance on fossil fuels.',
    imageUrl: 'https://picsum.photos/seed/science/400/300',
    status: 'published',
    tags: ['Solar', 'Wind', 'Geothermal', 'Sustainability', 'Climate Change'],
    authorName: 'Sofia Rossi',
  },
  {
    id: '2',
    title: 'A Brief History of Classical Music',
    category: 'Arts',
    shortDescription: 'From the Baroque period to the Romantic era, explore the masters.',
    content: 'Classical music is a broad term that usually refers to the standard music of countries in the Western world. It is music that has been composed by musicians who are trained in the art of writing music and written down in music notation so that other musicians can play it. The history of classical music is often divided into stylistic periods. The Baroque period (1600-1750) was characterized by its ornate detail, with composers like Bach and Handel leading the way. The Classical period (1750-1820) followed, emphasizing elegance and balance, with Mozart and Haydn as its most famous composers. The Romantic era (1820-1900) brought intense emotion and individualism, with giants like Beethoven, Chopin, and Wagner. Each period contributed unique forms, structures, and emotional palettes to the rich tapestry of classical music.',
    imageUrl: 'https://picsum.photos/seed/arts/400/300',
    status: 'published',
    tags: ['Music', 'Baroque', 'Classical', 'Romantic', 'Composers'],
    authorName: 'Eleanor Vance',
  },
  {
    id: '3',
    title: 'The Rise of Artificial Intelligence',
    category: 'Technology',
    shortDescription: 'Understanding machine learning, neural networks, and their impact.',
    content: 'Artificial intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction. Particular applications of AI include expert systems, natural language processing (NLP), speech recognition, and machine vision. The field has seen exponential growth in recent years, largely due to the availability of large datasets and advancements in computational power. Machine learning, a subset of AI, allows systems to automatically learn and improve from experience without being explicitly programmed. Deep learning, a further subset, utilizes neural networks with many layers to analyze complex patterns in data, powering everything from self-driving cars to medical diagnostics. The societal impact of AI is profound, raising important ethical questions while offering unprecedented opportunities for innovation.',
    imageUrl: 'https://picsum.photos/seed/tech/400/300',
    status: 'published',
    tags: ['AI', 'Machine Learning', 'Neural Networks', 'Tech Ethics', 'Innovation'],
    authorName: 'Kenji Tanaka',
  },
  {
    id: '4',
    title: 'Global Economic Trends in the 21st Century',
    category: 'Economics',
    shortDescription: 'Analyzing globalization, emerging markets, and digital currencies.',
    content: 'The 21st-century global economy is characterized by increasing interconnectedness, rapid technological change, and the rise of emerging markets. Globalization has facilitated the flow of goods, services, capital, and information across borders, but has also created challenges related to inequality and economic volatility. Emerging economies, particularly in Asia, have become major engines of global growth. The digital revolution has transformed industries, with e-commerce, digital payments, and cryptocurrencies like Bitcoin challenging traditional financial systems. Central banks are exploring the issuance of their own digital currencies (CBDCs). Key challenges facing the global economy include climate change, geopolitical tensions, and the need to ensure that economic growth is inclusive and sustainable.',
    imageUrl: 'https://picsum.photos/seed/economics/400/300',
    status: 'published',
    tags: ['Globalization', 'Economics', 'Crypto', 'Emerging Markets', 'Finance'],
    authorName: 'Marcus Bell',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Dr. Evelyn Reed',
    role: 'Project Lead & AI Specialist',
    imageUrl: 'https://picsum.photos/seed/person1/200/200',
    bio: 'Evelyn holds a Ph.D. in Computer Science and has over 15 years of experience in machine learning and natural language processing. She is the visionary behind Living Library 2.0.'
  },
  {
    name: 'David Chen',
    role: 'Lead Frontend Engineer',
    imageUrl: 'https://picsum.photos/seed/person2/200/200',
    bio: 'David is a passionate developer with a keen eye for UI/UX design. He brought the Living Library 2.0 interface to life with his expertise in React and modern web technologies.'
  },
  {
    name: 'Maria Garcia',
    role: 'Content Strategist & Librarian',
    imageUrl: 'https://picsum.photos/seed/person3/200/200',
    bio: 'With a background in library sciences, Maria curates the resources and ensures the quality and relevance of the content available in the Living Library.'
  },
];

export const MENTORS: TeamMember[] = [
  {
    name: 'Professor Alistair Finch',
    role: 'Academic Advisor',
    imageUrl: 'https://picsum.photos/seed/mentor1/200/200',
    bio: 'A renowned professor in digital humanities, Alistair provides guidance on the ethical implications and academic applications of our AI-powered platform.'
  },
  {
    name: 'Brenda Miles',
    role: 'Industry Mentor',
    imageUrl: 'https://picsum.photos/seed/mentor2/200/200',
    bio: 'As a VP of Engineering at a top tech company, Brenda offers invaluable insights into scaling technology and building sustainable, high-impact products.'
  },
];

export const MOST_VIEWED_AUTHORS: TeamMember[] = [
  {
    name: 'Eleanor Vance',
    role: 'Author',
    imageUrl: 'https://picsum.photos/seed/author1/200/200',
    bio: 'Eleanor is a historian specializing in the Renaissance period, known for her vivid storytelling.'
  },
  {
    name: 'Kenji Tanaka',
    role: 'Author',
    imageUrl: 'https://picsum.photos/seed/author2/200/200',
    bio: 'Kenji writes about the intersection of technology and philosophy, exploring future digital landscapes.'
  },
  {
    name: 'Sofia Rossi',
    role: 'Author',
    imageUrl: 'https://picsum.photos/seed/author3/200/200',
    bio: 'A biologist and author, Sofia makes complex scientific concepts accessible to a wide audience.'
  },
  {
    name: 'Marcus Bell',
    role: 'Author',
    imageUrl: 'https://picsum.photos/seed/author4/200/200',
    bio: 'Marcus is a celebrated poet and short story writer, focusing on themes of nature and identity.'
  }
];
