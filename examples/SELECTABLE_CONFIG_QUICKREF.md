# Selectable Config Auto - Quick Reference

## ?? Controls

| Button | Action |
|--------|--------|
| **DPAD ?** | Previous match (wraps) |
| **DPAD ?** | Next match (wraps) |
| **A** | Confirm selection |
| **Y** | Reload match data |
| **BACK** | View match details |

## ?? Quick Start

### Create Your OpMode

```java
@Autonomous(name = "My Auto", group = "Competition")
public class MyAuto extends SelectableConfigAutoOpMode {
    
    private MecanumDrive drive;
    
    @Override
    protected void initializeHardware(Match match) {
        // Initialize after match selected
        drive = new MecanumDrive(hardwareMap);
    }
    
    @Override
    protected void executeAutonomous(Match match) {
        // Execute based on selected match
        for (Action action : getActions()) {
            executeAction(action);
        }
    }
}
```

### Use in Competition

```
1. Select OpMode
2. Press INIT
3. DPAD to navigate matches
4. Press A to confirm
5. Press PLAY to start
```

## ?? Selection Screen

```
??? SELECT MATCH ???

  Match 1 - RED Alliance
? Match 2 - BLUE Alliance
    Partner: 24180
    Start: front
    Actions: 5
  Match 3 - RED Alliance

? More below

??? CONTROLS ???
DPAD ?/?: Navigate
A Button: Confirm selection
Y Button: Reload data
BACK: View details

Available: 3 match(es)
Selected: 2 of 3
```

## ?? Required Methods

### initializeHardware(Match match)
**When:** After selection, before start  
**Purpose:** Initialize hardware for selected match

```java
@Override
protected void initializeHardware(Match match) {
    drive = new MecanumDrive(hardwareMap);
    // Set start position from match
}
```

### executeAutonomous(Match match)
**When:** After start (during autonomous)  
**Purpose:** Execute autonomous sequence

```java
@Override
protected void executeAutonomous(Match match) {
    for (Action action : getActions()) {
        executeAction(action);
    }
}
```

## ?? Optional Methods

### onMatchSelected(Match match)
**When:** Immediately after selection  
**Purpose:** Early initialization

```java
@Override
protected void onMatchSelected(Match match) {
    if (isRedAlliance()) {
        loadRedTrajectories();
    } else {
        loadBlueTrajectories();
    }
}
```

### getDataFilePath()
**When:** During load  
**Purpose:** Custom file location

```java
@Override
protected String getDataFilePath() {
    return "/sdcard/FIRST/competition.json";
}
```

## ??? Utility Methods

| Method | Returns | Use |
|--------|---------|-----|
| `getSelectedMatch()` | Match | Current match config |
| `isRedAlliance()` | boolean | Check if red |
| `isBlueAlliance()` | boolean | Check if blue |
| `getStartPosition()` | StartPosition | Start position config |
| `getActions()` | List\<Action\> | Action sequence |

## ?? Execution Flow

```
Press INIT
    ?
Load match data
    ?
Display match list
    ?
Navigate with DPAD ?/?
    ?
Press A to confirm
    ?
onMatchSelected() called
    ?
initializeHardware() called
    ?
"READY TO START" displayed
    ?
Press PLAY
    ?
executeAutonomous() called
    ?
Complete
```

## ? Quick Examples

### Basic Extension
```java
@Autonomous(name = "Quick Auto")
public class QuickAuto extends SelectableConfigAutoOpMode {
    @Override
    protected void initializeHardware(Match match) {
        // Init hardware
    }
    
    @Override
    protected void executeAutonomous(Match match) {
        // Execute
    }
}
```

### Alliance-Aware
```java
@Override
protected void onMatchSelected(Match match) {
    if (isRedAlliance()) {
        setupRed();
    } else {
        setupBlue();
    }
}
```

### Custom Path
```java
@Override
protected String getDataFilePath() {
    return "/sdcard/FIRST/practice.json";
}
```

## ?? Use Cases

| Scenario | Use This |
|----------|----------|
| **10+ matches** | ? Perfect |
| **Need flexibility** | ? Perfect |
| **One OpMode** | ? Perfect |
| **Quick updates** | ? Perfect |
| **Learning** | ? Use Basic |
| **1-2 matches** | ? Use Fixed |

## ?? Troubleshooting

| Problem | Solution |
|---------|----------|
| No matches listed | Run scanner OpMode first |
| DPAD not working | Check gamepad connected |
| Wrong match runs | Verify selection on screen |
| Hardware errors | Check initializeHardware() |

## ?? Full Documentation

- **Complete Guide**: [SELECTABLE_CONFIG_GUIDE.md](SELECTABLE_CONFIG_GUIDE.md)
- **Comparison**: [OPMODE_COMPARISON.md](OPMODE_COMPARISON.md)
- **Example**: [SelectableAutoExample.java](java/SelectableAutoExample.java)

## ? Checklist

### Setup
- [ ] Base class copied to TeamCode
- [ ] Match data scanned
- [ ] Created extension class
- [ ] Implemented required methods

### Testing
- [ ] OpMode appears
- [ ] Match list displays
- [ ] Navigation works
- [ ] Selection works
- [ ] Hardware initializes
- [ ] Autonomous executes

### Competition
- [ ] All matches scanned
- [ ] Team knows controls
- [ ] Tested full workflow
- [ ] Quick ref available

---

**Version**: 2.6.0  
**Base Class**: SelectableConfigAutoOpMode.java  
**Example**: SelectableAutoExample.java  
**See**: [SELECTABLE_CONFIG_GUIDE.md](SELECTABLE_CONFIG_GUIDE.md)
