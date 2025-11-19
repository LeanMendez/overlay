export type AlertType = 'follow' | 'subscribe' | 'donation' | 'raid' | 'bits';

export interface AlertData {
  id: number;
  type: AlertType;
  username: string;
  message?: string;
  amount?: number;
}

export interface AlertBoxProps {
  type: AlertType;
  username: string;
  message?: string;
  amount?: number;
  duration?: number;
  onComplete?: () => void;
}

export const ALERT_CONFIG = {
  follow: {
    title: 'NEW FOLLOWER',
    icon: '★',
    accentColor: '#60A5FA', // Sapphire Blue
  },
  subscribe: {
    title: 'NEW SUBSCRIBER',
    icon: '◆',
    accentColor: '#F87171', // Ruby Red
  },
  donation: {
    title: 'DONATION',
    icon: '◈',
    accentColor: '#34D399', // Emerald Green
  },
  raid: {
    title: 'RAID',
    icon: '⚡',
    accentColor: '#FBBF24', // Topaz Gold
  },
  bits: {
    title: 'BITS',
    icon: '◇',
    accentColor: '#E0F2FE', // Diamond White/Cyan
  },
} as const;

// Chat Overlay types
export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  color?: string;
  badges?: string[];
  highlighted?: boolean; // For donations, subs, etc.
}

export interface ChatOverlayProps {
  maxMessages?: number;
  messageLifetime?: number;
  position?: 'left' | 'right' | 'bottom';
  width?: number;
  showTimestamp?: boolean;
}

// Goal Tracker types
export type GoalType = 'followers' | 'subscribers' | 'donations' | 'custom';

export interface GoalTrackerProps {
  goalType?: GoalType;
  title?: string;
  current: number;
  target: number;
  icon?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showPercentage?: boolean;
}

export interface GoalTrackerCompactProps {
  goalType?: GoalType;
  title?: string;
  current: number;
  target: number;
  icon?: string;
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  showPercentage?: boolean;
}
