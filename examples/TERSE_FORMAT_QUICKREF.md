# Terse Format Quick Reference

## Format
```
{n}[R|B]S{startPos}[W{sec}|A{actionId}]*
```

## Example
```
5RS1W1A1A3A1A4W1A1A5A1A6
```
= Match 5, Red, Start 1, 10 actions (26 bytes)

## Components

| Token | Meaning | Example |
|-------|---------|---------|
| `{n}` | Match number (no prefix) | `5` |
| `R`/`B` | Alliance color | `R` |
| `S{n}` | Start position ID | `S1` |
| `W{sec}` | Wait (integer seconds) | `W1` |
| `A{n}` | Action by ID | `A1` |

## Wait Format (Integer Seconds Only)

| Input (ms) | Rounded | Output |
|------------|---------|--------|
| 0-499ms | 0s | `W0` |
| 500-1499ms | 1s | `W1` |
| 1500-2499ms | 2s | `W2` |

## Start Position IDs

| ID | Position |
|----|----------|
| 1 | front |
| 2 | back |
| 3 | left |
| 4 | right |
| 9 | custom |

## Action IDs

| ID | Action |
|----|--------|
| 1 | near_launch |
| 2 | far_launch |
| 3 | spike_1 |
| 4 | spike_2 |
| 5 | spike_3 |
| 6 | near_park |
| 7 | far_park |
| 8 | dump |
| 9 | corner |
| 10 | drive_to |

## Size Budget (100 bytes)
- Header: 4 bytes
- Each action: 2-3 bytes
- Each wait: 2-3 bytes  
- **Max:** 48 actions!

## JavaScript Encoder
```javascript
function encode(match) {
  let s = `${match.matchNumber}`; // No M prefix!
  s += match.alliance[0].toUpperCase();
  s += `S${posId(match.startPosition.type)}`;
  
  for (const a of match.actions) {
    if (a.type === 'wait') {
      s += `W${Math.round((a.config?.waitTime || 1000) / 1000)}`;
    } else {
      s += `A${actionId(a.type)}`;
    }
  }
  return s;
}
```

## Examples

### Minimal (10 bytes)
```
1RS1A1A3A6
```

### With Waits (26 bytes)
```
5RS1W1A1A3W1A1A4W1A1A5W2A6
```

### Two-Digit Match (14 bytes)
```
12BS1W2A1A3A6
```

---
**Format:** `{n}[R|B]S{startPos}[W{sec}|A{actionId}]*`  
**No M prefix!** Match number starts immediately  
**Integer seconds only** (no decimals)
