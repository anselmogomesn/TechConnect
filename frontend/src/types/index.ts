// ============================================
// ANSELMO - Shared Type Definitions
// ============================================

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'SILENCED' | 'DELETED';

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  username: string;
  bio: string | null;
  avatar: string | null;
  banner: string | null;
  website: string | null;
  location: string | null;
  role: UserRole;
  status: UserStatus;
  level: number;
  xp: number;
  totalXpEarned: number;
  reputation: number;
  title: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  likesReceived: number;
  commentsCount: number;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  lastActivity: string;
  rank: number | null;
  streakCount: number;
  badges: Badge[];
  achievements: Achievement[];
}

// ============================================
// POST TYPES
// ============================================

export type PostType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'CODE' | 'POLL' | 'LINK';

export interface Post {
  id: string;
  userId: string;
  content: string;
  type: PostType;
  media: string | null;
  isEdited: boolean;
  isPinned: boolean;
  isPublic: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'level'>;
  reactions?: Reaction[];
  hasLiked?: boolean;
}

// ============================================
// COMMENT TYPES
// ============================================

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  content: string;
  isEdited: boolean;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  user: Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'level'>;
  replies?: Comment[];
}

// ============================================
// REACTION TYPES
// ============================================

export type ReactionType = 'LIKE' | 'LOVE' | 'INTERESTING' | 'FUNNY' | 'ANGRY' | 'APPLAUSE';

export interface Reaction {
  id: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType =
  | 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MESSAGE' | 'MENTION'
  | 'BADGE' | 'ACHIEVEMENT' | 'LEVEL_UP' | 'MISSION_COMPLETE'
  | 'ADMIN' | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string | null;
  referenceId: string | null;
  referenceType: string | null;
  actorId: string | null;
  image: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  actor?: Pick<User, 'id' | 'name' | 'username' | 'avatar'>;
}

// ============================================
// BADGE & ACHIEVEMENT TYPES
// ============================================

export type BadgeRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
export type BadgeCategory = 'GENERAL' | 'SOCIAL' | 'CONTENT' | 'COMMUNITY' | 'MILESTONE' | 'SPECIAL' | 'ADMINISTRATIVE';

export interface Badge {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  icon: string | null;
  category: BadgeCategory;
  rarity: BadgeRarity;
  xpReward: number;
  earnedAt?: string;
}

export interface Achievement {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  category: string | null;
  rarity: BadgeRarity;
  xpReward: number;
  maxProgress: number;
  progress: number;
  completed: boolean;
  completedAt: string | null;
}

// ============================================
// MISSION TYPES
// ============================================

export type MissionType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'EVENT' | 'SPECIAL';

export interface Mission {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: MissionType;
  xpReward: number;
  maxProgress: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  endsAt: string | null;
}

// ============================================
// MESSAGE TYPES
// ============================================

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'GIF';
  media: string | null;
  isRead: boolean;
  isDelivered: boolean;
  createdAt: string;
  sender: Pick<User, 'id' | 'name' | 'username' | 'avatar'>;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name: string | null;
  avatar: string | null;
  lastMessageAt: string | null;
  participants: UserConversation[];
  lastMessage?: Message;
}

export interface UserConversation {
  userId: string;
  lastReadAt: string | null;
  isMuted: boolean;
  user: Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'status'>;
}

// ============================================
// COMMUNITY TYPES
// ============================================

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  banner: string | null;
  avatar: string | null;
  rules: string | null;
  category: string | null;
  isPrivate: boolean;
  isVerified: boolean;
  ownerId: string;
  membersCount: number;
  postsCount: number;
  createdAt: string;
  owner: Pick<User, 'id' | 'name' | 'username' | 'avatar'>;
  role?: CommunityRole;
}

export type CommunityRole = 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';

// ============================================
// API TYPES
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    errors?: Record<string, string[]>;
  };
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  [key: string]: any;
}

// ============================================
// LEVEL & XP TYPES
// ============================================

export interface LevelInfo {
  level: number;
  xpRequired: number;
  title: string;
  rewards: string | null;
}

export interface XpHistory {
  id: string;
  amount: number;
  reason: string;
  referenceType: string | null;
  referenceId: string | null;
  multiplier: number | null;
  total: number;
  createdAt: string;
}
