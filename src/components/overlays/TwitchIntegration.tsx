import { useEffect, useRef, useState } from 'react';
import { TwitchEventSubClient, type ChatMessageEvent, type TwitchConfig } from '../../services/TwitchEventSub';

interface TwitchIntegrationProps {
  config: TwitchConfig;
  onChatMessage?: (message: any) => void;
  onAlert?: (alert: any) => void;
  autoConnect?: boolean;
}

export default function TwitchIntegration({
  config,
  onChatMessage,
  onAlert,
  autoConnect = true,
}: TwitchIntegrationProps) {
  const clientRef = useRef<TwitchEventSubClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.clientId || !config.accessToken || !config.broadcasterId) {
      setError('Missing Twitch credentials');
      return;
    }

    // Crear cliente
    clientRef.current = new TwitchEventSubClient(config);

    // Registrar handlers para eventos de chat
    clientRef.current.on('channel.chat.message', (event: ChatMessageEvent) => {
      console.log('Chat message received:', event);

      // Convertir badges de Twitch a emojis simples
      const badges: string[] = [];
      if (event.badges) {
        event.badges.forEach(badge => {
          if (badge.set_id === 'moderator') badges.push('🛡️');
          else if (badge.set_id === 'subscriber') badges.push('⭐');
          else if (badge.set_id === 'vip') badges.push('💎');
          else if (badge.set_id === 'broadcaster') badges.push('📺');
        });
      }

      // Determinar si es mensaje destacado
      const isHighlighted =
        event.message_type === 'channel_points_highlighted' ||
        (event.cheer && event.cheer.bits > 0);

      // Disparar evento para ChatOverlay
      const chatMessage = {
        id: event.message_id,
        username: event.chatter_user_name,
        message: event.message.text,
        timestamp: Date.now(),
        color: event.color || '#FFFFFF',
        badges,
        highlighted: isHighlighted,
      };

      // Llamar callback si existe
      if (onChatMessage) {
        onChatMessage(chatMessage);
      }

      // Disparar evento global
      window.dispatchEvent(new CustomEvent('chatMessage', {
        detail: chatMessage,
      }));
    });

    // Registrar handlers para alertas
    clientRef.current.on('channel.follow', (event) => {
      console.log('New follower:', event);
      const alert = {
        type: 'follow',
        username: event.user_name,
      };

      if (onAlert) onAlert(alert);

      window.dispatchEvent(new CustomEvent('twitchAlert', {
        detail: alert,
      }));
    });

    clientRef.current.on('channel.subscribe', (event) => {
      console.log('New subscriber:', event);
      const alert = {
        type: 'subscribe',
        username: event.user_name,
        tier: event.tier,
      };

      if (onAlert) onAlert(alert);

      window.dispatchEvent(new CustomEvent('twitchAlert', {
        detail: alert,
      }));
    });

    clientRef.current.on('channel.cheer', (event) => {
      console.log('Bits cheered:', event);
      const alert = {
        type: 'bits',
        username: event.user_name || 'Anonymous',
        amount: event.bits,
        message: event.message,
      };

      if (onAlert) onAlert(alert);

      window.dispatchEvent(new CustomEvent('twitchAlert', {
        detail: alert,
      }));
    });

    clientRef.current.on('channel.raid', (event) => {
      console.log('Raid received:', event);
      const alert = {
        type: 'raid',
        username: event.from_broadcaster_user_name,
        amount: event.viewers,
      };

      if (onAlert) onAlert(alert);

      window.dispatchEvent(new CustomEvent('twitchAlert', {
        detail: alert,
      }));
    });

    // Conectar automáticamente si está habilitado
    if (autoConnect) {
      clientRef.current.connect()
        .then(() => {
          console.log('Connected to Twitch EventSub');
          setIsConnected(true);
          setError(null);
        })
        .catch((err) => {
          console.error('Failed to connect to Twitch:', err);
          setError(err.message);
          setIsConnected(false);
        });
    }

    // Cleanup
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [config, autoConnect, onChatMessage, onAlert]);

  // Componente invisible - solo maneja la lógica
  return (
    <div style={{ display: 'none' }}>
      {error && <span>Error: {error}</span>}
      {isConnected && <span>Connected to Twitch</span>}
    </div>
  );
}
