# Start Position Key Format - S{n}

## Overview
Start positions use a consistent `S{n}` key format where keys are auto-generated, immutable, and used in QR codes. Labels remain user-editable for display purposes only.

## Key Format

### Structure
- **Keys:** `S0`, `S1`, `S2`, `S3`, `S4`, ...
- **Auto-generated:** Sequential numbering
- **Immutable:** Cannot be modified by users
- **Used in:** QR codes (terse format)

### Label Format
- **Purpose:** Display only in UI
- **User-editable:** Yes
- **Used in:** App interface, not in QR codes
- **Examples:** "Front", "Back", "Left", "Right", "Custom"

## Position Key Mapping

| Key | Default Label | ID | Usage |
|-----|---------------|----|----|
| S0 | Custom | 0 | Always available, configurable X/Y/? |
| S1 | Front | 1 | Predefined position |
| S2 | Back | 2 | Predefined position |
| S3 | Left | 3 | Predefined position |
| S4 | Right | 4 | Predefined position |
| S5+ | User-defined | 5+ | Custom positions |

## File Structure

### `src/utils/terseEncoder.js`
- Extracts numeric ID from `S{n}` format
- `S0` ? ID 0, `S1` ? ID 1, `S2` ? ID 2, etc.
- Fallback to ID 1 if format is unexpected

### `src/hooks/useStartPositions.js`
- Storage format: `{ key, label }`
- Auto-generates next available `S{n}` key
- Default positions: S1 (Front), S2 (Back), S3 (Left), S4 (Right)
- Only label can be updated, key is immutable

### `src/components/config/StartPositionsConfigContent.jsx`
- Shows read-only key in gray monospace box
- Editable label field
- Help text explains key vs label distinction

### `src/components/ManageStartPositionsModal.jsx`
- Displays key as read-only
- Separate editable label field
- Help text: "Keys vs Labels" explanation

### `src/components/steps/Step4StartPosition.jsx`
- Uses `pos.key` for identification
- Custom position always uses `S0`
- Labels for display only

## User Experience

### Adding a Position
1. Click "Add Position" button
2. Enter label (e.g., "Center")
3. System auto-assigns key (e.g., `S5`)
4. Position appears with key `S5` and label "Center"

### Editing a Position
- **Key:** Read-only, shown in gray box
- **Label:** Editable text field
- Can delete position (removes both key and label)

### Using in Match Configuration
- Buttons show user-friendly **labels**
- System stores **keys** (`S1`, `S2`, etc.)
- QR codes contain **numeric IDs** (1, 2, etc.)

## QR Code Format

### Example: Preset Position
**Match 5, Red alliance, Start position S3 (Left):**
```
5RS3A1W1A2
```

**Breakdown:**
- `5` - Match number
- `R` - Red alliance
- `S3` - Start position 3
- `A1` - Action 1 (near_launch)
- `W1` - Wait 1 second
- `A2` - Action 2 (far_launch)

### Example: Custom Position
**Match 3, Blue alliance, Start position S0 (Custom):**
```
3BS0A3W2A6
```

**Breakdown:**
- `3` - Match number
- `B` - Blue alliance
- `S0` - Custom position
- `A3` - Action 3 (spike_1)
- `W2` - Wait 2 seconds
- `A6` - Action 6 (near_park)

## Benefits

? **Consistent format** - All keys follow S{n} pattern  
? **Auto-numbered** - No manual key management  
? **Immutable keys** - Prevents accidental changes  
? **Clear separation** - Keys for QR, labels for UI  
? **Scalable** - Easy to add unlimited positions  
? **Compact QR** - Numeric IDs keep QR codes small  
? **Reserved S0** - Custom position always available at ID 0

## API

### Position Object Structure
```javascript
{
  key: 'S1',    // Auto-generated, immutable
  label: 'Front' // User-editable
}

// Special case: Custom position
{
  key: 'S0',    // Reserved for custom
  label: 'Custom'
}
```

### `useStartPositions` Hook
```javascript
// Add position with auto-generated key
addStartPosition('Custom Front')  // Assigns next S{n} key

// Update label only
updateStartPosition(index, { label: 'New Label' })

// Key updates are ignored
updateStartPosition(index, { key: 'S99' })  // ? No effect
```

## Testing

### Test Cases
- ? Add new position ? Key auto-assigns as S{n}
- ? Edit label ? Only label changes, key unchanged
- ? Delete position ? Both key and label removed
- ? QR encoding ? Extracts numeric ID from S{n} key
- ? Match selection ? Uses key to identify position
- ? UI display ? Shows user-friendly labels
- ? Custom position ? Always uses S0, supports X/Y/?

### Expected Behavior
1. **Config screen:** Keys shown in gray read-only boxes
2. **Match step:** Buttons display labels
3. **QR code:** Contains numeric position ID (0 for custom)
4. **Storage:** Saves both key and label
5. **Custom:** S0 reserved, cannot be assigned to other positions

---

**Status:** ? Complete  
**Format:** `S{n}` where n is auto-generated integer  
**Custom Position:** Always S0 (reserved)  
**Label Purpose:** UI display only, not in QR  
**Key Purpose:** QR encoding, immutable
