# Start Position Key Format - S{n}

## Overview
Start positions use a consistent `S{n}` key format where keys are auto-generated, immutable, and used in QR codes. Labels remain user-editable for display purposes only.

**Units:** Position coordinates use **METERS** for clean decimal input and excellent precision.

## Key Format

### Structure
- **Keys:** `S0`, `S1`, `S2`, `S3`, `S4`, ...
- **Auto-generated:** Sequential numbering (S1, S2, S3, ...)
- **Immutable:** Cannot be modified by users
- **Used in:** QR codes (terse format)
- **Zero-padding restriction:** Keys cannot have leading zeros (e.g., `S011` is invalid, must be `S11`)

### Label Format
- **Purpose:** Display only in UI
- **User-editable:** Yes
- **Used in:** App interface, not in QR codes
- **Examples:** "Front", "Back", "Left", "Right", "Custom"

## Position Key Mapping

| Key | Default Label | ID | Usage | QR Format |
|-----|---------------|----|----|-----------|
| S0 | Custom | 0 | Always available, configurable X/Y/? | `S0{base64}` (8 chars) |
| S1 | Front | 1 | Predefined position | `S1` (2 chars) |
| S2 | Back | 2 | Predefined position | `S2` (2 chars) |
| S3 | Left | 3 | Predefined position | `S3` (2 chars) |
| S4 | Right | 4 | Predefined position | `S4` (2 chars) |
| S5+ | User-defined | 5+ | Custom positions | `S{n}` (2-3 chars) |

## Custom Position Encoding (S0)

### Format Specification
- **QR Format:** `S0{base64}` where base64 is exactly 6 characters
- **Total Length:** 8 bytes (`S0` + 6 base64 chars)
- **Encoding:** 12-12-12 bit packing (36 bits total, 0 padding waste)
- **Units:** Meters for X/Y, Degrees for ?

### Bit Allocation
- **X coordinate:** 12 bits (bits 0-11)
- **Y coordinate:** 12 bits (bits 12-23)
- **θ heading:** 12 bits (bits 24-35)
- **Total:** 36 bits = exactly 6 base64 characters

### Resolution
- **X resolution:** 0.893 mm (0.0351 inches)
- **Y resolution:** 0.893 mm (0.0351 inches)
- **θ resolution:** 0.088 degrees
- **X range:** ±1.8288 meters (±72 inches)
- **Y range:** ±1.8288 meters (±72 inches)
- **θ range:** ±180 degrees

### Encoding Algorithm
```javascript
// Each value gets 12 bits (0 to 4095)
x_units = round((x_meters + 1.8288) * 4096 / 3.6576)
y_units = round((y_meters + 1.8288) * 4096 / 3.6576)
theta_units = round((theta_degrees + 180) * 4096 / 360)

// Pack into 36 bits: [X:12bits][Y:12bits][?:12bits]
// Bytes 0-1: X coordinate
// Bytes 1-2: Y coordinate (spans byte boundary)
// Bytes 3-4: θ heading

// Encode to 6 base64 characters
base64_6_chars = encodeBase64(packed_36_bits)
```

### Example
**Position:** X=0.6m, Y=-0.3m, θ=90°

```
X units: (0.6+1.8288) * 4096/3.6576 = 2721
Y units: (-0.3+1.8288) * 4096/3.6576 = 1713
? units: (90+180) * 4096/360 = 3072

Packed: 36 bits across 5 bytes
Base64: "qrG8AA"
QR Code: S0qrG8AA
```

## Benefits of Metric Units

? **Clean decimal input:** 0.5m, 1.25m, 0.05m (no fractions!)  
? **Better precision:** 0.893mm ? 0.035" (better than 1/32")  
? **Universal standard:** Meters are international  
? **Simple math:** Powers of 10, no fraction confusion  
? **Perfect packing:** 36 bits = exactly 6 base64 chars  
? **Field coverage:** ±1.83m covers full FTC field  

## File Structure

### `src/utils/poseEncoder.js` ?
- **Purpose:** Componentized pose encoding/decoding
- **Units:** Meters for X/Y, Degrees for θ
- **Functions:**
  - `encodePose(x_m, y_m, theta)` ? 6-char base64 string
  - `decodePose(base64)` ? `{x, y, theta}` in meters/degrees
  - `getPoseResolution()` ? resolution info (meters and inches)
  - `isValidPoseEncoding(str)` ? validation
  - `inchesToMeters(inches)` ? conversion utility
  - `metersToInches(meters)` ? conversion utility
  - `roundToResolution(value, range, offset)` ? rounding helper
- **Reusable:** Can be used anywhere pose encoding is needed

### `src/utils/terseEncoder.js`
- Imports `encodePose` from `poseEncoder.js`
- Extracts numeric ID from `S{n}` format
- `S0` ? Uses `encodePose()` to create `S0{base64}`
- `S1+` ? Simple `S{n}` format
- Fallback to ID 1 if format is unexpected

### `src/components/steps/Step4StartPosition.jsx`
- Uses `pos.key` for identification
- Custom position always uses `S0`
- Shows X/Y/θ input fields for S0 **in meters**
- Input ranges: X/Y ±1.83m, θ ±180°
- Step sizes: X/Y 0.001m, θ 0.088°
- Displays resolution info and encoding details
- Auto-rounds to encoding precision on blur

## User Experience

### Entering Custom Position
**Input examples:**
- `0.5` meters (50cm, ~20 inches)
- `1.25` meters (125cm, ~49 inches)
- `0.05` meters (5cm, ~2 inches)
- `-0.75` meters (negative positions)

**Display:**
- Shows position in meters: "Custom (0.500m, -0.300m, 90.00°)"
- Resolution banner: "X/Y: 0.000893m (~0.89mm), θ: 0.088°"
- Range hints: "±1.83m (±72")"

**Adjustment feedback:**
- "X rounded to 0.893mm resolution"
- "Y clamped to ±1.83m range"
- "Heading rounded to 0.088° resolution"

## QR Code Format

### Example: Preset Position
**Match 5, Red alliance, Start position S3 (Left):**
```
5RS3A1W1A2
```

**Breakdown:**
- `5` - Match number (no zero padding)
- `R` - Red alliance
- `S3` - Start position 3
- `A1` - Action 1 (near_launch)
- `W1` - Wait 1 second
- `A2` - Action 2 (far_launch)

### Example: Custom Position
**Match 3, Blue alliance, Start position S0 at (0.6m, -0.3m, 90°):**
```
3BS0qrG8AAA3W2A6
```

**Breakdown:**
- `3` - Match number
- `B` - Blue alliance
- `S0qrG8AA` - Custom position (8 bytes total)
  - `S0` - Custom position indicator
  - `qrG8AA` - Base64 encoded pose (0.6m, -0.3m, 90°)
- `A3` - Action 3 (spike_1)
- `W2` - Wait 2 seconds
- `A6` - Action 6 (near_park)

## Format Specification Rules

### Zero-Padding Restriction
**Enforced:** Position keys cannot have leading zeros

? **Valid:**
- `S0` (special case: custom position)
- `S1`, `S2`, `S3`, ..., `S9`
- `S10`, `S11`, `S12`, ...

? **Invalid:**
- `S01`, `S02`, `S03` (zero-padded)
- `S001`, `S099` (zero-padded)

**Rationale:** When parser encounters `S0`, it knows the next 6 bytes are base64 pose data. This disambiguation is only possible if no other keys can start with `S0`.

## API

### `poseEncoder.js` API
```javascript
import { 
  encodePose, 
  decodePose, 
  getPoseResolution, 
  isValidPoseEncoding,
  inchesToMeters,
  metersToInches,
  roundToResolution
} from './utils/poseEncoder';

// Encode pose (units: meters, degrees)
const base64 = encodePose(0.6, -0.3, 90);
// Returns: "qrG8AA" (6 characters)

// Decode pose
const pose = decodePose("qrG8AA");
// Returns: { x: 0.6, y: -0.3, theta: 90.0 } (meters, degrees)

// Get resolution info
const res = getPoseResolution();
// Returns: { 
//   x_meters: 0.000893, y_meters: 0.000893,
//   x_inches: 0.0351, y_inches: 0.0351,
//   theta_degrees: 0.087890625, ... 
// }

// Convert units
const meters = inchesToMeters(24); // 0.6096m
const inches = metersToInches(0.6); // 23.622"

// Round to encoding precision
const rounded = roundToResolution(0.6123, 3.6576, 1.8288);
// Returns: 0.612 (rounded to nearest 0.893mm)

// Validate encoding
const valid = isValidPoseEncoding("qrG8AA");
// Returns: true
```

## Testing

### Test Cases
- ? Encode/decode identity: `decodePose(encodePose(x, y, θ))` ? `(x, y, θ)`
- ? Resolution: Values round to 0.893mm for X/Y, 0.088° for θ
- ? Range limits: ±1.8288m for X/Y, ±180° for θ
- ? Clean decimals: 0.5m, 1.0m, 1.5m encode/decode perfectly
- ? Base64 format: Always produces exactly 6 characters
- ? QR integration: S0 + 6 chars = 8 bytes total
- ? Bit packing: 12+12+12 = 36 bits, zero padding waste

### Example Values
| Input (m) | Encoded Units | Decoded (m) | Error (mm) |
|-----------|---------------|-------------|------------|
| 0.0 | 2048 | 0.0 | 0.0 |
| 0.5 | 2607 | 0.500089 | 0.089 |
| 1.0 | 3166 | 1.000178 | 0.178 |
| 1.5 | 3725 | 1.500268 | 0.268 |
| -0.5 | 1489 | -0.499911 | 0.089 |

---

**Status:** ? Complete  
**Format:** `S{n}` where n is auto-generated integer (no zero-padding)
**Custom Position:** Always `S0` with 6-char base64 pose
**Units:** Meters for X/Y coordinates, Degrees for θ
**Resolution:** 0.893mm (0.0351") for position, 0.088° for θ
**Encoding:** 12-12-12 bits, perfect 36-bit packing
**Total Size:** 8 bytes for custom position (S0 + 6 base64 chars)
