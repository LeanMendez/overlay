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
    accentColor: 'rgba(255, 255, 255, 0.9)',
  },
  subscribe: {
    title: 'NEW SUBSCRIBER',
    icon: '◆',
    accentColor: 'rgba(255, 255, 255, 0.95)',
  },
  donation: {
    title: 'DONATION',
    icon: '◈',
    accentColor: 'rgba(255, 255, 255, 1)',
  },
  raid: {
    title: 'RAID',
    icon: '⚡',
    accentColor: 'rgba(255, 255, 255, 0.9)',
  },
  bits: {
    title: 'BITS',
    icon: '◇',
    accentColor: 'rgba(255, 255, 255, 0.85)',
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
