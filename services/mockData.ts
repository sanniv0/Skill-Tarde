import { User, TradeRequest, Chat } from '../types';

export const CURRENT_USER_ID = 'user_1';

export const MOCK_USERS: Record<string, User> = {
  'user_1': {
    id: 'user_1',
    name: 'Alex Rivera',
    avatar: 'https://picsum.photos/200/200?random=1',
    bio: 'Graphic designer and coffee enthusiast. Love helping small businesses with branding.',
    location: 'Mission District, SF',
    credits: 15,
    skillsOffered: ['Graphic Design', 'Logo Design', 'Spanish Tutoring'],
    skillsNeeded: ['Plumbing', 'React.js Coaching', 'Gardening'],
    rating: 4.8,
    reviewCount: 12
  },
  'user_2': {
    id: 'user_2',
    name: 'Sarah Chen',
    avatar: 'https://picsum.photos/200/200?random=2',
    bio: 'Senior Frontend Engineer. I can teach you React!',
    location: 'SoMa, SF',
    credits: 45,
    skillsOffered: ['React.js Coaching', 'JavaScript', 'Career Advice'],
    skillsNeeded: ['Graphic Design', 'Dog Walking'],
    rating: 5.0,
    reviewCount: 28
  },
  'user_3': {
    id: 'user_3',
    name: 'Mike Johnson',
    avatar: 'https://picsum.photos/200/200?random=3',
    bio: 'Handyman with 10 years experience.',
    location: 'Mission District, SF',
    credits: 5,
    skillsOffered: ['Plumbing', 'Carpentry', 'Home Repair'],
    skillsNeeded: ['Accounting', 'Web Design'],
    rating: 4.7,
    reviewCount: 56
  },
  'user_4': {
    id: 'user_4',
    name: 'Emily Davis',
    avatar: 'https://picsum.photos/200/200?random=4',
    bio: 'Gardening expert and botanist.',
    location: 'Noe Valley, SF',
    credits: 20,
    skillsOffered: ['Gardening', 'Landscaping', 'Plant Care'],
    skillsNeeded: ['Photography', 'Spanish Tutoring'],
    rating: 4.9,
    reviewCount: 8
  }
};

export const MOCK_REQUESTS: TradeRequest[] = [
  {
    id: 'req_1',
    authorId: 'user_2',
    title: 'Need a logo for my side project',
    description: 'I am starting a tech blog and need a clean, modern logo. Open to creative ideas.',
    type: 'NEED',
    credits: 10,
    skillTags: ['Graphic Design', 'Logo Design'],
    location: 'Remote',
    distance: 0,
    status: 'OPEN',
    createdAt: '2023-10-25T10:00:00Z'
  },
  {
    id: 'req_2',
    authorId: 'user_3',
    title: 'Leaky faucet repair available',
    description: 'I have a free afternoon this Saturday. Can help with minor plumbing issues in the Mission area.',
    type: 'OFFER',
    credits: 5,
    skillTags: ['Plumbing', 'Home Repair'],
    location: 'Mission District, SF',
    distance: 0.8,
    status: 'OPEN',
    createdAt: '2023-10-26T09:30:00Z'
  },
  {
    id: 'req_3',
    authorId: 'user_4',
    title: 'Looking for Spanish conversation practice',
    description: 'I am intermediate level, looking to practice speaking for 1 hour a week.',
    type: 'NEED',
    credits: 3,
    skillTags: ['Spanish Tutoring', 'Language'],
    location: 'Noe Valley or Remote',
    distance: 2.3,
    status: 'OPEN',
    createdAt: '2023-10-27T14:15:00Z'
  },
  {
    id: 'req_4',
    authorId: 'user_2',
    title: 'Offering React Code Reviews',
    description: 'Will review your PRs or help you debug a tricky component.',
    type: 'OFFER',
    credits: 8,
    skillTags: ['React.js Coaching', 'Coding'],
    location: 'Remote',
    distance: 0,
    status: 'OPEN',
    createdAt: '2023-10-27T16:00:00Z'
  }
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat_1',
    participantIds: ['user_1', 'user_2'],
    lastMessage: 'Great, see you then!',
    lastMessageTime: '10:30 AM',
    messages: [
      { id: 'm1', senderId: 'user_2', text: 'Hi Alex, saw your offer for design.', timestamp: '10:00 AM' },
      { id: 'm2', senderId: 'user_1', text: 'Hey Sarah! Yes, I can help.', timestamp: '10:05 AM' },
      { id: 'm3', senderId: 'user_2', text: 'Great, see you then!', timestamp: '10:30 AM' }
    ]
  }
];