import { useEffect, useState } from 'react';
import TwitchIntegration from '../TwitchIntegration';
import type { TwitchConfig } from '../../../services/TwitchEventSub';

/** Invisible component that opens the Twitch connection for any mint page that needs
 * live chat. Reads the credentials saved at `/twitch-setup` (localStorage `twitchConfig`)
 * and, once connected, `TwitchIntegration` broadcasts `chatMessage` window events that
 * `ChatPanel` (via `useLiveChat`) picks up. Renders nothing visible; shows nothing at all
 * if no config was ever saved, so pages fall back to their static demo messages. */
export default function TwitchBridge() {
  const [config, setConfig] = useState<TwitchConfig | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('twitchConfig');
    if (!raw) return;
    try {
      setConfig(JSON.parse(raw));
    } catch {
      // ignore malformed/legacy config
    }
  }, []);

  if (!config) return null;
  return <TwitchIntegration config={config} autoConnect />;
}
