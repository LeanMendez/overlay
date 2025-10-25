/**
 * Twitch EventSub WebSocket Service
 * Maneja la conexión con Twitch EventSub para recibir eventos en tiempo real
 */

export interface TwitchConfig {
  clientId: string;
  accessToken: string;
  broadcasterId: string;
  moderatorId?: string; // Necesario para channel.follow
}

export interface ChatMessageEvent {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  chatter_user_id: string;
  chatter_user_login: string;
  chatter_user_name: string;
  message_id: string;
  message: {
    text: string;
    fragments: Array<{
      type: string;
      text: string;
      cheermote?: any;
      emote?: any;
    }>;
  };
  color: string;
  badges: Array<{
    set_id: string;
    id: string;
    info: string;
  }>;
  message_type: 'text' | 'channel_points_highlighted' | 'channel_points_sub_only' | 'user_intro';
  cheer?: {
    bits: number;
  };
}

export interface FollowEvent {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  followed_at: string;
}

export interface SubscribeEvent {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  tier: string;
  is_gift: boolean;
}

export interface CheerEvent {
  is_anonymous: boolean;
  user_id?: string;
  user_login?: string;
  user_name?: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  message: string;
  bits: number;
}

export interface RaidEvent {
  from_broadcaster_user_id: string;
  from_broadcaster_user_login: string;
  from_broadcaster_user_name: string;
  to_broadcaster_user_id: string;
  to_broadcaster_user_login: string;
  to_broadcaster_user_name: string;
  viewers: number;
}

type EventCallback = (event: any) => void;

export class TwitchEventSubClient {
  private ws: WebSocket | null = null;
  private config: TwitchConfig;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventHandlers: Map<string, EventCallback[]> = new Map();
  private isConnecting = false;

  constructor(config: TwitchConfig) {
    this.config = config;
  }

  /**
   * Conectar al WebSocket de Twitch EventSub
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
        console.log('Already connected or connecting');
        resolve();
        return;
      }

      this.isConnecting = true;
      console.log('Connecting to Twitch EventSub WebSocket...');

      this.ws = new WebSocket('wss://eventsub.wss.twitch.tv/ws');

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      this.ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        const messageType = data.metadata.message_type;

        console.log('Received message type:', messageType);

        switch (messageType) {
          case 'session_welcome':
            this.sessionId = data.payload.session.id;
            console.log('Session ID received:', this.sessionId);
            this.reconnectAttempts = 0;
            this.isConnecting = false;

            // Subscribir a eventos
            try {
              await this.subscribeToEvents();
              resolve();
            } catch (error) {
              reject(error);
            }
            break;

          case 'notification':
            this.handleNotification(data);
            break;

          case 'session_keepalive':
            console.log('Keepalive received');
            break;

          case 'session_reconnect':
            console.log('Reconnect requested by server');
            const reconnectUrl = data.payload.session.reconnect_url;
            this.reconnect(reconnectUrl);
            break;

          default:
            console.log('Unknown message type:', messageType, data);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        reject(error);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.isConnecting = false;
        this.sessionId = null;

        // Auto-reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
          console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`);
          setTimeout(() => this.connect(), delay);
        }
      };
    });
  }

  /**
   * Reconnectar usando URL proporcionada por Twitch
   */
  private reconnect(url?: string) {
    if (this.ws) {
      this.ws.close();
    }

    if (url) {
      console.log('Reconnecting to:', url);
      this.ws = new WebSocket(url);
      // Re-attach event handlers...
    } else {
      this.connect();
    }
  }

  /**
   * Subscribir a eventos de Twitch
   */
  private async subscribeToEvents() {
    if (!this.sessionId) {
      throw new Error('No session ID available');
    }

    console.log('Subscribing to Twitch events...');

    const subscriptions = [
      // Chat messages
      {
        type: 'channel.chat.message',
        version: '1',
        condition: {
          broadcaster_user_id: this.config.broadcasterId,
          user_id: this.config.broadcasterId,
        },
      },
      // Follows (requiere moderator_id)
      ...(this.config.moderatorId ? [{
        type: 'channel.follow',
        version: '2',
        condition: {
          broadcaster_user_id: this.config.broadcasterId,
          moderator_user_id: this.config.moderatorId,
        },
      }] : []),
      // Subscriptions
      {
        type: 'channel.subscribe',
        version: '1',
        condition: {
          broadcaster_user_id: this.config.broadcasterId,
        },
      },
      // Cheers
      {
        type: 'channel.cheer',
        version: '1',
        condition: {
          broadcaster_user_id: this.config.broadcasterId,
        },
      },
      // Raids
      {
        type: 'channel.raid',
        version: '1',
        condition: {
          to_broadcaster_user_id: this.config.broadcasterId,
        },
      },
    ];

    for (const sub of subscriptions) {
      try {
        await this.createSubscription(sub);
        console.log(`Subscribed to ${sub.type}`);
      } catch (error) {
        console.error(`Failed to subscribe to ${sub.type}:`, error);
      }
    }
  }

  /**
   * Crear una subscripción en Twitch EventSub
   */
  private async createSubscription(subscription: any) {
    const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',
      headers: {
        'Client-ID': this.config.clientId,
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...subscription,
        transport: {
          method: 'websocket',
          session_id: this.sessionId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create subscription: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Manejar notificaciones de eventos
   */
  private handleNotification(data: any) {
    const eventType = data.metadata.subscription_type;
    const event = data.payload.event;

    console.log('Event received:', eventType, event);

    // Emitir evento a los handlers registrados
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.forEach(handler => handler(event));
  }

  /**
   * Registrar un handler para un tipo de evento
   */
  on(eventType: string, callback: EventCallback) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(callback);
  }

  /**
   * Desregistrar un handler
   */
  off(eventType: string, callback: EventCallback) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Desconectar del WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.sessionId = null;
    this.eventHandlers.clear();
  }
}
