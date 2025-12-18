/**
 * Terse Match Format Encoder for QR Codes
 * Format: {n}[R|B]S{startPos}[W{sec}|A{actionId}]*
 * 
 * Example: 5RS1W1A1A3A1A4W1A1A5A1A6
 * - Match 5, Red, Start position 1
 * - Wait 1s, Action 1, Action 3, etc.
 * 
 * Custom Position: S0{base64} where base64 is 6 characters encoding X, Y, ?
 * Example: 5RS0qqa8AAW1A1A3
 * - Match 5, Red, Custom position with encoded pose
 */

import { encodePose } from './poseEncoder';

// Action type to ID mapping
const ACTION_TO_ID = {
  'near_launch': 1,
  'far_launch': 2,
  'spike_1': 3,
  'spike_2': 4,
  'spike_3': 5,
  'near_park': 6,
  'far_park': 7,
  'dump': 8,
  'corner': 9,
  'drive_to': 10
};

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
  
  // Actions: [W{sec}|A{id}]*
  if (match.actions && match.actions.length > 0) {
    for (const action of match.actions) {
      if (action.type === 'wait') {
        // Wait: W{seconds} - convert ms to seconds, round to nearest int
        const waitTimeMs = action.config?.waitTime || 1000;
        const waitTimeSec = Math.round(waitTimeMs / 1000);
        terse += `W${waitTimeSec}`;
      } else {
        // Action: A{id}
        const actionId = ACTION_TO_ID[action.type] || 99;
        terse += `A${actionId}`;
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
