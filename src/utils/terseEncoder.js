/**
 * Terse Match Format Encoder for QR Codes
 * Format: {n}[R|B]S{startPos}[W{sec}|A{n}]*
 * 
 * Example: 5RS1W1A1A3A1A4W1A1A5A1A6
 * - Match 5, Red, Start position 1
 * - Wait 1s, Action A1, Action A3, etc.
 * 
 * Custom Position: S0{base64} where base64 is 6 characters encoding X, Y, ?
 * Example: 5RS0qqa8AAW1A1A3
 * - Match 5, Red, Custom position with encoded pose
 * 
 * Actions use A{n} format (A1, A2, A3...) and W for wait
 */

import { encodePose } from './poseEncoder';

/**
 * Extract position ID from position type
 * @param {string} positionType - Position type in S{n} format (e.g., 'S0', 'S1', 'S2')
 * @returns {number} Position ID
 */
function getPositionId(positionType) {
  if (!positionType) return 1;
  
  // Extract numeric ID from S{n} format
  if (positionType.startsWith('S')) {
    const id = parseInt(positionType.substring(1));
    return isNaN(id) ? 1 : id;
  }
  
  // Fallback if format is unexpected
  return 1;
}

/**
 * Encode start position for terse format
 * @param {Object} startPosition - Start position object with type and optional x, y, theta
 * @returns {string} Encoded start position (e.g., "S1" or "S0qqa8AA")
 */
function encodeStartPosition(startPosition) {
  const posId = getPositionId(startPosition?.type);
  
  // Custom position (S0) - encode pose
  if (posId === 0) {
    const x = startPosition.x ?? 0;
    const y = startPosition.y ?? 0;
    const theta = startPosition.theta ?? 0;
    
    try {
      const poseEncoded = encodePose(x, y, theta);
      return `S0${poseEncoded}`;
    } catch (error) {
      console.error('Failed to encode custom position:', error);
      return 'S0AAAAAA'; // Fallback to origin (0, 0, 0)
    }
  }
  
  // Preset position (S1, S2, etc.)
  return `S${posId}`;
}

/**
 * Encode a match to terse format
 * @param {Object} match - Match object with matchNumber, alliance, startPosition, actions
 * @returns {string} Terse format string
 */
export function encodeMatchToTerse(match) {
  let terse = '';
  
  // Match number (no prefix, no zero padding)
  terse += match.matchNumber;
  
  // Alliance color: R or B
  terse += match.alliance[0].toUpperCase();
  
  // Start position: S{id} or S0{base64}
  terse += encodeStartPosition(match.startPosition);
  
  // Actions: [W{sec}|A{n}]*
  if (match.actions && match.actions.length > 0) {
    for (const action of match.actions) {
      // Action type is stored in action.type and should be 'W' or 'A{n}'
      const actionType = action.type;
      
      if (actionType === 'W') {
        // Wait: W{seconds} - convert ms to seconds, round to nearest int
        const waitTimeMs = action.config?.waitTime || 1000;
        const waitTimeSec = Math.round(waitTimeMs / 1000);
        terse += `W${waitTimeSec}`;
      } else if (actionType && actionType.match(/^A\d+$/)) {
        // Action: A{n} - use the action type directly
        terse += actionType;
      } else {
        // Unknown action type - log warning and skip
        console.warn(`Unknown action type: ${actionType}`);
      }
    }
  }
  
  return terse;
}

/**
 * Get the byte size of a terse-encoded match
 * @param {Object} match - Match object
 * @returns {number} Size in bytes
 */
export function getTerseSize(match) {
  return encodeMatchToTerse(match).length;
}

/**
 * Get display info for terse format
 * @param {Object} match - Match object
 * @returns {Object} { terse, size, fitsInQRv4 }
 */
export function getTerseInfo(match) {
  const terse = encodeMatchToTerse(match);
  const size = terse.length;
  const fitsInQRv4 = size <= 100;
  
  return { terse, size, fitsInQRv4 };
}
