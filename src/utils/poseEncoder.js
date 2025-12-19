/**
 * Pose Encoder/Decoder for Custom Start Positions
 * 
 * Encodes X, Y, ? coordinates into compact base64 format
 * Format: 6 base64 characters representing 36 bits (12 bits each)
 * 
 * Units: METERS and DEGREES
 * Ranges:
 * - X: ±1.8288 meters (±72 inches) with 0.893 mm resolution (4096 values)
 * - Y: ±1.8288 meters (±72 inches) with 0.893 mm resolution (4096 values)
 * - ?: ±180° with 0.088° resolution (4096 values)
 */

// Constants for encoding/decoding
const POSITION_RANGE_METERS = 3.6576; // ±1.8288 meters (±72 inches)
const ANGLE_RANGE_DEGREES = 360; // ±180 degrees
const BITS_PER_VALUE = 12;
const MAX_VALUE = 4096; // 2^12

/**
 * Encode pose (x, y, theta) to base64 string
 * @param {number} x_meters - X coordinate in meters (±1.8288m)
 * @param {number} y_meters - Y coordinate in meters (±1.8288m)
 * @param {number} theta_degrees - Heading in degrees (±180°)
 * @returns {string} 6-character base64 encoded string
 */
export function encodePose(x_meters, y_meters, theta_degrees) {
  // Validate inputs
  if (Math.abs(x_meters) > 1.8288 || Math.abs(y_meters) > 1.8288 || Math.abs(theta_degrees) > 180) {
    throw new Error('Pose values out of range');
  }

  // Convert to 12-bit unsigned values (0 to 4095)
  // Add offset to make all values positive, then scale to fit in 4096 steps
  const x_units = Math.round((x_meters + 1.8288) * (MAX_VALUE / POSITION_RANGE_METERS));
  const y_units = Math.round((y_meters + 1.8288) * (MAX_VALUE / POSITION_RANGE_METERS));
  const theta_units = Math.round((theta_degrees + 180) * (MAX_VALUE / ANGLE_RANGE_DEGREES));

  // Clamp to valid range (0 to 4095)
  const x_clamped = Math.max(0, Math.min(MAX_VALUE - 1, x_units));
  const y_clamped = Math.max(0, Math.min(MAX_VALUE - 1, y_units));
  const theta_clamped = Math.max(0, Math.min(MAX_VALUE - 1, theta_units));

  // Pack 36 bits: [X:12bits][Y:12bits][?:12bits]
  // Create a byte array for the 36 bits (4.5 bytes, we'll use 5 bytes)
  const bytes = new Uint8Array(6);
  
  // Pack X (bits 0-11) into bytes 0-1
  bytes[0] = (x_clamped >> 4) & 0xFF;        // Upper 8 bits of X
  bytes[1] = ((x_clamped & 0x0F) << 4) |     // Lower 4 bits of X
             ((y_clamped >> 8) & 0x0F);       // Upper 4 bits of Y
  
  // Pack Y (bits 12-23) into bytes 1-2
  bytes[2] = y_clamped & 0xFF;                // Lower 8 bits of Y
  
  // Pack ? (bits 24-35) into bytes 3-4
  bytes[3] = (theta_clamped >> 4) & 0xFF;     // Upper 8 bits of ?
  bytes[4] = (theta_clamped & 0x0F) << 4;     // Lower 4 bits of ? (padded with 0s)

  // Convert to base64 (will produce 8 chars, we take first 6)
  const base64 = btoa(String.fromCharCode(...bytes));
  
  // Return exactly 6 characters
  return base64.substring(0, 6);
}

/**
 * Decode base64 string to pose (x, y, theta)
 * @param {string} encoded - 6-character base64 string
 * @returns {Object} { x, y, theta } - Pose in meters and degrees
 */
export function decodePose(encoded) {
  // Validate input
  if (encoded.length !== 6) {
    throw new Error('Invalid pose encoding: must be 6 characters');
  }

  // Decode base64 (add padding for standard decoder)
  const padded = encoded + '==';
  const decoded = atob(padded);
  const bytes = new Uint8Array([...decoded].map(c => c.charCodeAt(0)));

  // Unpack X (bits 0-11)
  const x_units = ((bytes[0] & 0xFF) << 4) | ((bytes[1] >> 4) & 0x0F);
  
  // Unpack Y (bits 12-23)
  const y_units = ((bytes[1] & 0x0F) << 8) | (bytes[2] & 0xFF);
  
  // Unpack ? (bits 24-35)
  const theta_units = ((bytes[3] & 0xFF) << 4) | ((bytes[4] >> 4) & 0x0F);

  // Convert back to real units
  const x_meters = (x_units * POSITION_RANGE_METERS / MAX_VALUE) - 1.8288;
  const y_meters = (y_units * POSITION_RANGE_METERS / MAX_VALUE) - 1.8288;
  const theta_degrees = (theta_units * ANGLE_RANGE_DEGREES / MAX_VALUE) - 180;

  return { 
    x: x_meters, 
    y: y_meters, 
    theta: theta_degrees 
  };
}

/**
 * Get resolution information for pose encoding
 * @returns {Object} Resolution details
 */
export function getPoseResolution() {
  return {
    x_meters: POSITION_RANGE_METERS / MAX_VALUE, // ~0.000893 meters
    y_meters: POSITION_RANGE_METERS / MAX_VALUE, // ~0.000893 meters
    x_inches: (POSITION_RANGE_METERS / MAX_VALUE) * 39.3701, // ~0.0351 inches
    y_inches: (POSITION_RANGE_METERS / MAX_VALUE) * 39.3701, // ~0.0351 inches
    theta_degrees: ANGLE_RANGE_DEGREES / MAX_VALUE, // ~0.087890625 degrees
    bits_per_value: BITS_PER_VALUE,
    total_bits: BITS_PER_VALUE * 3,
    encoded_length: 6 // base64 characters
  };
}

/**
 * Validate if a string is a valid pose encoding
 * @param {string} str - String to validate
 * @returns {boolean} True if valid pose encoding
 */
export function isValidPoseEncoding(str) {
  if (!str || str.length !== 6) return false;
  
  // Check if valid base64 characters
  const base64Regex = /^[A-Za-z0-9+/]+$/;
  return base64Regex.test(str);
}

/**
 * Round value to encoding resolution
 * @param {number} value - Input value in meters
 * @param {number} range - Total range in meters (e.g., 3.6576 for ±1.8288m)
 * @param {number} offset - Offset to add (e.g., 1.8288 for ±1.8288m range)
 * @returns {number} Rounded value in meters
 */
export function roundToResolution(value, range, offset) {
  // Convert to units, round, convert back
  const units = Math.round((value + offset) * (MAX_VALUE / range));
  const clamped = Math.max(0, Math.min(MAX_VALUE - 1, units));
  const result = (clamped * range / MAX_VALUE) - offset;
  
  // Round to 6 decimal places to avoid floating point artifacts
  return Math.round(result * 1000000) / 1000000;
}

/**
 * Convert inches to meters
 * @param {number} inches - Value in inches
 * @returns {number} Value in meters
 */
export function inchesToMeters(inches) {
  return inches * 0.0254;
}

/**
 * Convert meters to inches
 * @param {number} meters - Value in meters
 * @returns {number} Value in inches
 */
export function metersToInches(meters) {
  return meters * 39.3701;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Value in degrees
 * @returns {number} Value in radians
 */
export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Value in radians
 * @returns {number} Value in degrees
 */
export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}
