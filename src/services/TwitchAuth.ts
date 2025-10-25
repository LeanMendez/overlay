/**
 * Twitch Authentication Service
 * Maneja la autenticación, refresh de tokens y almacenamiento seguro
 */

export interface TwitchTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp en milisegundos
  clientId: string;
  clientSecret?: string; // Opcional - solo si el usuario lo proporciona
}

export interface TwitchCredentials {
  clientId: string;
  clientSecret?: string;
  accessToken: string;
  refreshToken?: string;
  broadcasterId: string;
  moderatorId?: string;
}

export class TwitchAuthService {
  private static STORAGE_KEY = 'twitchConfig';
  private static TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutos de buffer

  /**
   * Guardar credenciales de forma segura en localStorage
   */
  static saveCredentials(credentials: TwitchCredentials): void {
    // Calcular tiempo de expiración (por defecto 60 días si no se especifica)
    const expiresAt = Date.now() + (60 * 24 * 60 * 60 * 1000);

    const dataToSave = {
      ...credentials,
      expiresAt,
      savedAt: Date.now(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
  }

  /**
   * Cargar credenciales desde localStorage
   */
  static loadCredentials(): TwitchCredentials | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing credentials:', error);
      return null;
    }
  }

  /**
   * Verificar si el token necesita ser refrescado
   */
  static needsRefresh(credentials: TwitchCredentials): boolean {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return false;

    try {
      const parsed = JSON.parse(data);
      const expiresAt = parsed.expiresAt || 0;

      // Si falta menos de 5 minutos para expirar, refrescar
      return Date.now() > (expiresAt - this.TOKEN_EXPIRY_BUFFER);
    } catch (error) {
      return false;
    }
  }

  /**
   * Refrescar el Access Token usando el Refresh Token
   */
  static async refreshAccessToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number } | null> {
    try {
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to refresh token:', error);
        return null;
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  /**
   * Intentar refrescar el token si es necesario
   * Retorna las credenciales actualizadas o null si falló
   */
  static async ensureValidToken(
    credentials: TwitchCredentials
  ): Promise<TwitchCredentials | null> {
    // Si no necesita refresh, retornar credenciales actuales
    if (!this.needsRefresh(credentials)) {
      return credentials;
    }

    // Si no hay refresh token o client secret, no se puede refrescar
    if (!credentials.refreshToken || !credentials.clientSecret) {
      console.warn('Cannot refresh token: missing refresh token or client secret');
      return credentials; // Retornar credenciales actuales y dejar que expire
    }

    console.log('Token needs refresh, refreshing...');

    // Intentar refrescar
    const newTokens = await this.refreshAccessToken(
      credentials.clientId,
      credentials.clientSecret,
      credentials.refreshToken
    );

    if (!newTokens) {
      console.error('Failed to refresh token');
      return null;
    }

    // Actualizar credenciales con nuevos tokens
    const updatedCredentials: TwitchCredentials = {
      ...credentials,
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };

    // Guardar nuevas credenciales
    const expiresAt = Date.now() + (newTokens.expiresIn * 1000);
    const dataToSave = {
      ...updatedCredentials,
      expiresAt,
      savedAt: Date.now(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));

    console.log('✓ Token refreshed successfully');

    return updatedCredentials;
  }

  /**
   * Validar que el Access Token sea válido haciendo una llamada a la API
   */
  static async validateToken(
    clientId: string,
    accessToken: string
  ): Promise<{ valid: boolean; username?: string; userId?: string }> {
    try {
      const response = await fetch('https://id.twitch.tv/oauth2/validate', {
        headers: {
          'Authorization': `OAuth ${accessToken}`,
        },
      });

      if (!response.ok) {
        return { valid: false };
      }

      const data = await response.json();

      return {
        valid: true,
        username: data.login,
        userId: data.user_id,
      };
    } catch (error) {
      console.error('Error validating token:', error);
      return { valid: false };
    }
  }

  /**
   * Limpiar credenciales guardadas
   */
  static clearCredentials(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Revocar el token en Twitch (logout completo)
   */
  static async revokeToken(clientId: string, accessToken: string): Promise<boolean> {
    try {
      const response = await fetch('https://id.twitch.tv/oauth2/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          token: accessToken,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error revoking token:', error);
      return false;
    }
  }
}
