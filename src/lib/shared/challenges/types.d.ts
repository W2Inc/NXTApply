// Message types that can be sent between parent and iframe
type MessageType =
  | 'GAME_START'
  | 'GAME_STOP'
  | 'GAME_COMPLETE'
  | 'GAME_FAILED'
  | 'CHEAT_DETECTED'
  | 'STATE_UPDATE';

// The main message structure
interface GameMessage {
  type: MessageType;
  payload?: any;
  timestamp: string;
  // Verification token to prevent message spoofing
  token: string;
}

// Game completion data
interface CompletionData {
  success: boolean;
  score?: number;
  timeSpent: number;
  moves?: number[];
}

// Game state update data
interface StateUpdate {
  currentState: any;
  validMove: boolean;
  message?: string;
}