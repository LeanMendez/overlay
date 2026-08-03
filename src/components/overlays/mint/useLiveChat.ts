import { useEffect, useState } from 'react';
import type { ChatMessage } from './ChatPanel';

interface TwitchChatEventDetail {
  id: string;
  username: string;
  message: string;
  badges?: string[];
}

/** Listens for the `chatMessage` window events dispatched by `TwitchIntegration`
 * (see src/components/overlays/TwitchIntegration.tsx) and turns them into the
 * `{u, t, badge}` shape ChatPanel renders. Requires Twitch credentials saved at
 * `/twitch-setup` and a `TwitchBridge` mounted somewhere on the page to open the
 * connection — this hook only reads the messages it broadcasts. */
export function useLiveChat(maxMessages = 6): ChatMessage[] {
  const [mensajes, setMensajes] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const onChatMessage = (event: Event) => {
      const detail = (event as CustomEvent<TwitchChatEventDetail>).detail;
      if (!detail) return;
      const nuevo: ChatMessage = {
        u: detail.username,
        t: detail.message,
        badge: detail.badges?.[0],
      };
      setMensajes((prev) => [...prev, nuevo].slice(-maxMessages));
    };

    window.addEventListener('chatMessage', onChatMessage);
    return () => window.removeEventListener('chatMessage', onChatMessage);
  }, [maxMessages]);

  return mensajes;
}
