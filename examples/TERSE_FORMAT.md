# Terse Match Format for 100-Byte QR Codes

## Problem
QR code v4 maxes out at ~100 bytes. Even compact JSON is too large for complex sequences.

## Solution: Custom Terse Format

Ultra-compact string format - match number starts immediately with no prefix.

### Format Structure
```
{n}[R|B]S{startPos}[W{sec}|A{actionId}]*
```

### Components
- `{n}` = Match number (required, starts string, no prefix)
- `[R|B]` = Alliance color: R=red, B=blue (required)
- `S{n}` = Start position ID (required)
- `W{sec}` = Wait action in **integer seconds** (optional, repeatable)
- `A{n}` = Action by ID (optional, repeatable)

### Example
```
5RS1W1A1A3A1A4W1A1A5A1A6
```

**Decoded:**
- Match 5
- Red alliance
- Start position 1
- Wait 1 second
- Action 1 (near_launch)
- Action 3 (spike_1)
- Action 1 (near_launch)
- Action 4 (spike_2)
- Wait 1 second
- Action 1 (near_launch)
- Action 5 (spike_3)
- Action 1 (near_launch)
- Action 6 (near_park)

**Size:** 26 bytes! (74 bytes remaining)

## Format Specification

### Match Header
| Component | Format | Example | Bytes |
|-----------|--------|---------|-------|
| Match number | `{n}` | `5` | 1-2 |
| Alliance color | `R` or `B` | `R` | 1 |
| Start position | `S{n}` | `S1` | 2 |

### Start Position IDs
| ID | Position |
|----|----------|
| 1 | front |
| 2 | back |
| 3 | left |
| 4 | right |
| 9 | custom |

### Action IDs
| ID | Action Type | Bytes |
|----|-------------|-------|
| 1 | near_launch | 2 |
| 2 | far_launch | 2 |
| 3 | spike_1 | 2 |
| 4 | spike_2 | 2 |
| 5 | spike_3 | 2 |
| 6 | near_park | 2 |
| 7 | far_park | 2 |
| 8 | dump | 2 |
| 9 | corner | 2 |
| 10 | drive_to | 3 |

### Wait Action
| Format | Example | Meaning | Bytes |
|--------|---------|---------|-------|
| `W{sec}` | `W1` | Wait 1 second | 2 |
| `W{sec}` | `W2` | Wait 2 seconds | 2 |
| `W{sec}` | `W10` | Wait 10 seconds | 3 |

**Note:** Wait times are in **integer seconds only**. Sub-second waits are rounded to nearest second.
- 0-499ms ? W0 (no wait)
- 500-1499ms ? W1
- 1500-2499ms ? W2

## Size Analysis

### Minimal Match
```
1RS1
```
**Base overhead:** 4 bytes (saved 1 byte from removing M!)

### Typical Match (No Waits)
```
5RS1A1A3A1A4A1A5A6
```
**Breakdown:**
- Header: `5RS1` = 4 bytes
- Actions: `A1A3A1A4A1A5A6` = 14 bytes (7 actions)
- **Total:** 18 bytes (82 bytes remaining!)

### With Waits
```
5RS1W1A1A3W1A1A4W1A1A5W2A6
```
**Breakdown:**
- Header: `5RS1` = 4 bytes
- Actions + Waits: 22 bytes
- **Total:** 26 bytes (74 bytes remaining)

### Maximum Actions
With 100-byte limit and 4-byte header = **96 bytes for actions**

**2-byte actions (A{n}):** 48 actions!  
**With waits:** 30-40 actions typical  

## Comparison

| Format | Example Size | Savings |
|--------|--------------|---------|
| Standard JSON | 300+ bytes | N/A |
| Compact JSON | 68 bytes | 77% smaller |
| Previous Terse (with M) | 27 bytes | 91% smaller |
| **New Terse** | **26 bytes** | **91.3% smaller** ? |

## Usage

### Java (Robot Controller)

```java
import org.firstinspires.ftc.teamcode.auto.config.TerseMatchCodec;

// Encode match to terse format
MatchDataConfig.Match match = /* ... */;
String terse = TerseMatchCodec.encode(match);
System.out.println("Terse: " + terse);

// Decode terse format
String scanned = "5RS1A1A3A6";
MatchDataConfig.Match decoded = TerseMatchCodec.decode(scanned);
```

### JavaScript (Web App)

```javascript
function encodeMatchToTerse(match) {
  // Match number (no prefix)
  let terse = `${match.matchNumber}`;
  
  // Alliance color
  terse += match.alliance[0].toUpperCase(); // 'R' or 'B'
  
  // Start position
  terse += `S${positionId(match.startPosition.type)}`;
  
  // Actions
  for (const action of match.actions) {
    if (action.type === 'wait') {
      // Convert ms to seconds, round to nearest integer
      const ms = action.config?.waitTime || 1000;
      const sec = Math.round(ms / 1000);
      terse += `W${sec}`;
    } else {
      terse += `A${actionId(action.type)}`;
    }
  }
  
  return terse;
}

function positionId(type) {
  return { front: 1, back: 2, left: 3, right: 4, custom: 9 }[type] || 1;
}

function actionId(type) {
  const ids = {
    near_launch: 1, far_launch: 2,
    spike_1: 3, spike_2: 4, spike_3: 5,
    near_park: 6, far_park: 7,
    dump: 8, corner: 9, drive_to: 10
  };
  return ids[type] || 99;
}
```

## Examples

### Example 1: Minimal
```
1RS1A1A3A6
```
10 bytes - Launch, Spike, Park

### Example 2: With Waits
```
5RS1W1A1A3W1A1A4W1A1A5W2A6
```
26 bytes - Full sequence

### Example 3: Two-Digit Match
```
12BS1W2A1A3A6
```
14 bytes - Still fits easily!

## Auto-Detection

Scanner detects: `^\d+[RB]S\d+.*$`

Pattern matches match number at start, no M prefix needed!

## Advantages

? **Smallest possible:** No wasted prefix character  
? **Integer seconds:** Simple, no decimal parsing  
? **48 max actions:** One more than before!  
? **Clean:** Match number is obvious at start  

## Disadvantages

? **No sub-second precision:** Rounds to nearest second  
? **No team number:** Not stored  

## Migration Note

**Breaking change from previous version:**
- Old: `M5RS1...` 
- New: `5RS1...`

Regenerate all QR codes!

---

**Format:** `{n}[R|B]S{startPos}[W{sec}|A{actionId}]*`  
**Wait Format:** Integer seconds only (rounded)  
**Typical Size:** 10-35 bytes  
**Max Actions:** 30-48
