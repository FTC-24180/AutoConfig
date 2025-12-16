# OpMode Comparison Guide

## Choosing the Right OpMode

AutoConfig provides three autonomous OpMode patterns. Choose based on your needs:

| Feature | BasicOpMode | FixedMatchOpMode | SelectableOpMode |
|---------|-------------|------------------|------------------|
| **File** | `AutoConfigOpModeExample` | `LimelightScannedAutoOpMode` | `SelectableConfigAutoOpMode` |
| **Match Selection** | Hardcoded | Hardcoded | Interactive (gamepad) |
| **Complexity** | Simple | Medium | Advanced |
| **Flexibility** | Low | Medium | High |
| **Best For** | Learning | Single match | Multiple matches |

## Quick Comparison

### 1. Basic OpMode (`AutoConfigOpModeExample`)

```java
@Autonomous(name = "Auto Match 1")
public class Auto1 extends LinearOpMode {
    private static final int MATCH_NUMBER = 1;  // Fixed
    
    public void runOpMode() {
        // Load match 1
        Match match = parser.getMatchByNumber(config, MATCH_NUMBER);
        
        // Execute
        waitForStart();
        executeAutonomous(match);
    }
}
```

**Pros:**
- ? Simple and straightforward
- ? Easy to understand
- ? Good for learning
- ? Minimal code

**Cons:**
- ? One OpMode per match
- ? Must redeploy to change match
- ? No runtime flexibility

**Use When:**
- Learning the system
- Testing single configuration
- Simplicity is priority

---

### 2. Fixed Match OpMode (`LimelightScannedAutoOpMode`)

```java
@Autonomous(name = "Auto Match 1")
public class Auto1 extends LimelightScannedAutoOpMode {
    private static final int MATCH_NUMBER = 1;  // Fixed
    
    // Match is loaded automatically
    // Just implement action handlers
}
```

**Pros:**
- ? Built-in error handling
- ? Comprehensive telemetry
- ? Complete example code
- ? Easy to customize actions

**Cons:**
- ? One OpMode per match
- ? Fixed match number
- ? No runtime selection

**Use When:**
- Want separate OpModes per match
- Need good error handling
- Prefer explicit match numbers
- Following provided examples

---

### 3. Selectable Config OpMode (`SelectableConfigAutoOpMode`)

```java
@Autonomous(name = "Selectable Auto")
public class Auto extends SelectableConfigAutoOpMode {
    
    @Override
    protected void initializeHardware(Match match) {
        // Init based on selected match
    }
    
    @Override
    protected void executeAutonomous(Match match) {
        // Execute selected match
    }
}
```

**Pros:**
- ? **One OpMode for all matches**
- ? **Runtime match selection**
- ? Interactive UI
- ? Reload match data on-the-fly
- ? Match-specific initialization

**Cons:**
- ? More complex to implement
- ? Requires understanding base class
- ? Extra selection step

**Use When:**
- Running entire competition
- Need flexibility
- Want single OpMode
- Frequently change strategies

---

## Detailed Comparison

### Code Required

#### Basic OpMode
```java
// Need separate class for each match
@Autonomous(name = "Auto Match 1")
public class Auto1 extends LinearOpMode { /* ... */ }

@Autonomous(name = "Auto Match 2")
public class Auto2 extends LinearOpMode { /* ... */ }

@Autonomous(name = "Auto Match 3")
public class Auto3 extends LinearOpMode { /* ... */ }
```
**Result:** 3 OpModes for 3 matches

---

#### Fixed Match OpMode
```java
// Need separate class for each match
@Autonomous(name = "Auto Match 1")
public class Auto1 extends LimelightScannedAutoOpMode {
    private static final int MATCH_NUMBER = 1;
}

@Autonomous(name = "Auto Match 2")
public class Auto2 extends LimelightScannedAutoOpMode {
    private static final int MATCH_NUMBER = 2;
}
```
**Result:** 3 OpModes for 3 matches (simpler implementation)

---

#### Selectable Config OpMode
```java
// Single class for all matches
@Autonomous(name = "Competition Auto")
public class CompAuto extends SelectableConfigAutoOpMode {
    @Override
    protected void initializeHardware(Match match) { /* ... */ }
    
    @Override
    protected void executeAutonomous(Match match) { /* ... */ }
}
```
**Result:** 1 OpMode for all matches

---

### Runtime Behavior

#### Basic OpMode
```
1. Select "Auto Match 1" on Driver Station
2. Press INIT
3. Hardware initializes for Match 1
4. Press PLAY
5. Match 1 executes
```
**Fixed:** Always runs Match 1

---

#### Fixed Match OpMode
```
1. Select "Auto Match 1" on Driver Station
2. Press INIT
3. Match 1 loads and validates
4. Hardware initializes for Match 1
5. Press PLAY
6. Match 1 executes
```
**Fixed:** Always runs Match 1 (with better error handling)

---

#### Selectable Config OpMode
```
1. Select "Competition Auto" on Driver Station
2. Press INIT
3. Match list appears
4. Use DPAD to navigate matches
5. Press A to select Match 2
6. Hardware initializes for Match 2
7. Press PLAY
8. Match 2 executes
```
**Flexible:** Select any match at runtime

---

### Use Case Scenarios

#### Scenario 1: Learning and Testing

**Best Choice:** Basic OpMode

```
Goal: Learn how the system works
Matches: 1-2 for testing
Changes: Frequent code changes

Why Basic?
- Simple code structure
- Easy to understand
- Quick to modify
- Good for experimentation
```

---

#### Scenario 2: Small Competition (5-10 matches)

**Best Choice:** Fixed Match OpMode

```
Goal: Run competition with clear match assignments
Matches: 5-10 matches
Changes: Infrequent

Why Fixed?
- Separate OpModes are clear
- Good error handling
- Easy to select correct match
- Less chance of selection error
```

---

#### Scenario 3: Large Competition (10+ matches)

**Best Choice:** Selectable Config OpMode

```
Goal: Run entire competition efficiently
Matches: 10-20 matches
Changes: Frequent strategy updates

Why Selectable?
- One OpMode reduces clutter
- Easy to change match
- Reload updated match data
- Flexible for strategy changes
```

---

#### Scenario 4: Multiple Strategies

**Best Choice:** Multiple Selectable Config OpModes

```
Goal: Different autonomous strategies
Matches: All matches, 2+ strategies
Changes: Choose strategy per match

Create multiple:
@Autonomous(name = "Aggressive Auto")
public class AggressiveAuto extends SelectableConfigAutoOpMode { }

@Autonomous(name = "Safe Auto")
public class SafeAuto extends SelectableConfigAutoOpMode { }

Each can select any match, different execution.
```

---

## Feature Matrix

| Feature | Basic | Fixed | Selectable |
|---------|-------|-------|------------|
| **Runtime Selection** | ? | ? | ? |
| **Error Handling** | Manual | ? | ? |
| **Telemetry** | Manual | ? | ? |
| **Match Preview** | ? | ? | ? |
| **Reload Data** | ? | ? | ? |
| **One OpMode All Matches** | ? | ? | ? |
| **Simple Code** | ? | ? | ? |
| **Customization** | Full | Medium | Medium |

---

## Migration Guide

### From Basic to Fixed

**Before (Basic):**
```java
@Autonomous(name = "Auto Match 1")
public class Auto1 extends LinearOpMode {
    public void runOpMode() {
        // Manual loading
        Match match = loadMatch(1);
        
        // Manual initialization
        initHardware();
        
        waitForStart();
        
        // Manual execution
        for (Action action : match.alliance.auto.actions) {
            executeAction(action);
        }
    }
}
```

**After (Fixed):**
```java
@Autonomous(name = "Auto Match 1")
public class Auto1 extends LimelightScannedAutoOpMode {
    private static final int MATCH_NUMBER = 1;
    
    // Automatic loading and validation!
    // Just implement executeAction() methods
}
```

**Benefits:**
- Automatic error handling
- Better telemetry
- Cleaner code

---

### From Fixed to Selectable

**Before (Fixed - Multiple files):**
```java
// Auto1.java
@Autonomous(name = "Auto Match 1")
public class Auto1 extends LimelightScannedAutoOpMode {
    private static final int MATCH_NUMBER = 1;
}

// Auto2.java
@Autonomous(name = "Auto Match 2")
public class Auto2 extends LimelightScannedAutoOpMode {
    private static final int MATCH_NUMBER = 2;
}
```

**After (Selectable - Single file):**
```java
// CompetitionAuto.java
@Autonomous(name = "Competition Auto")
public class CompAuto extends SelectableConfigAutoOpMode {
    @Override
    protected void initializeHardware(Match match) {
        // Same hardware init as before
    }
    
    @Override
    protected void executeAutonomous(Match match) {
        // Same execution as before
    }
}
```

**Benefits:**
- Less code duplication
- Runtime flexibility
- Easier maintenance

---

## Decision Tree

```
Start: Which OpMode should I use?
?
?? Are you learning the system?
?  ?? YES ? Use Basic OpMode
?     ?? Simple, easy to understand
?
?? Do you have 5 or fewer matches?
?  ?? YES ? Use Fixed Match OpMode
?     ?? Clear, separate OpModes per match
?
?? Do you have 10+ matches?
?  ?? YES ? Use Selectable Config OpMode
?     ?? One OpMode for all matches
?
?? Do strategies change frequently?
?  ?? YES ? Use Selectable Config OpMode
?     ?? Easy to reload and change
?
?? Want minimal code complexity?
?  ?? YES ? Use Fixed Match OpMode
?     ?? Good balance of features vs complexity
?
?? Want maximum flexibility?
   ?? YES ? Use Selectable Config OpMode
      ?? Interactive selection + reload
```

---

## Recommendations by Team Experience

### Rookie Teams
**Start with:** Fixed Match OpMode

- Good error handling
- Clear structure
- Easy to understand
- Provided examples work well

---

### Experienced Teams
**Use:** Selectable Config OpMode

- Maximum flexibility
- Efficient code reuse
- Professional competition workflow
- Easy strategy updates

---

### Large Competitions
**Use:** Selectable Config OpMode

- One OpMode = less clutter
- Quick match changes
- Reload updated data
- Less deployment needed

---

### Small Events
**Use:** Fixed Match OpMode

- Clear match assignments
- Separate OpModes prevent confusion
- Good for new drive teams

---

## Summary Table

| Aspect | Basic | Fixed | Selectable |
|--------|-------|-------|------------|
| **Lines of Code** | ~200 | ~350 | ~150 (subclass) |
| **OpModes for 10 matches** | 10 | 10 | 1 |
| **Learning Curve** | Easy | Easy | Medium |
| **Competition Ready** | ?? | ???? | ????? |
| **Flexibility** | ? | ?? | ????? |
| **Error Handling** | ? | ???? | ????? |
| **Maintenance** | ?? | ??? | ????? |

---

## Final Recommendation

### For Most Teams
**Start with Fixed Match OpMode**, then migrate to Selectable Config OpMode when you need more flexibility.

### For Advanced Teams
**Go straight to Selectable Config OpMode** for maximum efficiency and flexibility.

### For Learning
**Use Basic OpMode** to understand the system, then upgrade.

---

**Version**: 2.6.0  
**Updated**: December 2024  
**See Also:**
- [Selectable Config Guide](SELECTABLE_CONFIG_GUIDE.md)
- [Limelight Scanner Guide](LIMELIGHT_QR_SCANNER_GUIDE.md)
- [Integration Guide](INTEGRATION_GUIDE.md)
