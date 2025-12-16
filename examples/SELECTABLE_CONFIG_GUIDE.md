# Selectable Config Auto OpMode Guide

## Overview

`SelectableConfigAutoOpMode` is a powerful base class that provides **interactive match selection** after pressing INIT, allowing drivers and coaches to choose which match configuration to run without redeploying code.

## Key Features

? **Interactive Selection** - Choose match using gamepad after INIT  
? **Visual Navigation** - Scrollable list with match details  
? **Confirmation Required** - Prevents accidental selection  
? **Match-Specific Init** - Hardware initialization after selection  
? **Template Pattern** - Easy to extend and customize  
? **Built-in Utilities** - Helper methods for common operations  

## When to Use This

### Perfect For:
- ?? **Competition** - Select match quickly between rounds
- ?? **Testing** - Try different configurations without redeploying
- ?? **Multiple Matches** - One OpMode for entire competition
- ?? **Flexibility** - Last-minute strategy changes

### Alternative: Fixed Match OpMode
Use `LimelightScannedAutoOpMode` when:
- You want separate OpModes for each match
- No selection UI needed
- Simpler code structure preferred

## Quick Start

### Step 1: Create Your OpMode

```java
@Autonomous(name = "My Auto", group = "Competition")
public class MyAuto extends SelectableConfigAutoOpMode {
    
    // Your robot hardware
    private MecanumDrive drive;
    
    @Override
    protected void initializeHardware(Match match) {
        // Initialize hardware AFTER match is selected
        drive = new MecanumDrive(hardwareMap);
        
        // Set start position
        StartPosition start = match.alliance.auto.startPosition;
        if (start.isCustom()) {
            drive.setPoseEstimate(new Pose2d(
                start.getX(), start.getY(), 
                Math.toRadians(start.getTheta())
            ));
        }
    }
    
    @Override
    protected void executeAutonomous(Match match) {
        // Execute actions
        for (Action action : match.alliance.auto.actions) {
            executeAction(action);
        }
    }
}
```

### Step 2: Use at Competition

```
1. Press INIT on Driver Station
2. View list of available matches
3. Use DPAD UP/DOWN to navigate
4. Press A to confirm selection
5. Robot initializes for selected match
6. Press PLAY to start autonomous
```

## Detailed Usage

### Required Methods

You **must** implement these two methods:

#### `initializeHardware(Match match)`
Called after match selection but before `waitForStart()`

```java
@Override
protected void initializeHardware(Match match) {
    // Initialize robot hardware
    drive = new MecanumDrive(hardwareMap);
    intake = hardwareMap.get(DcMotor.class, "intake");
    
    // Set initial states based on match config
    StartPosition start = match.alliance.auto.startPosition;
    // ... set start position
}
```

**When it's called:**
- ? After user confirms match selection (presses A)
- ? Before `waitForStart()`
- ? While in INIT phase

**What to do here:**
- Initialize all hardware devices
- Set start position/pose
- Configure servos/motors to initial states
- Load trajectories if needed

---

#### `executeAutonomous(Match match)`
Called after `waitForStart()` when match begins

```java
@Override
protected void executeAutonomous(Match match) {
    // Execute action sequence
    for (Action action : match.alliance.auto.actions) {
        if (!opModeIsActive()) break;
        
        // Execute each action
        switch (action.type) {
            case "drive_to":
                double x = action.getConfigDouble("x", 0);
                double y = action.getConfigDouble("y", 0);
                driveTo(x, y);
                break;
            // ... other actions
        }
    }
}
```

**When it's called:**
- ? After `waitForStart()` returns
- ? During autonomous period
- ? While `opModeIsActive()` is true

**What to do here:**
- Execute autonomous sequence
- Follow trajectories
- Score game elements
- Park robot

### Optional Methods

Override these for additional customization:

#### `onMatchSelected(Match match)`
Called **immediately** after match selection, before hardware init

```java
@Override
protected void onMatchSelected(Match match) {
    // Early initialization based on match config
    
    if (isRedAlliance()) {
        loadRedTrajectories();
    } else {
        loadBlueTrajectories();
    }
    
    // Log selection
    telemetry.addData("Selected", "Match " + match.number);
    telemetry.update();
}
```

**Use cases:**
- Load alliance-specific trajectories
- Pre-compute paths
- Set alliance-dependent variables
- Log match selection

---

#### `getDataFilePath()`
Override to use a different file location

```java
@Override
protected String getDataFilePath() {
    return "/sdcard/FIRST/competition-matches.json";
}
```

**Default:** `/sdcard/FIRST/match-data.json`

**Use cases:**
- Different file for practice vs competition
- Custom storage location
- Multiple match data files

## Interactive Selection Controls

### During Match Selection

| Control | Action |
|---------|--------|
| **DPAD UP** | Move selection up (wraps to bottom) |
| **DPAD DOWN** | Move selection down (wraps to top) |
| **A Button** | Confirm selection and proceed |
| **Y Button** | Reload match data from file |
| **BACK Button** | View detailed info for selected match |

### Selection Display

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

### Detail View (Press BACK)

```
??? MATCH DETAILS ???

Match Number: 2
Alliance: BLUE
Partner Team: 24180

Start Position: front

Actions: 5
  1: Near Launch
  2: Spike 1
  3: Wait
  4: Near Park

Press BACK to return
```

## Utility Methods

The base class provides helpful utility methods:

### `getSelectedMatch()`
Get the currently selected match configuration

```java
Match match = getSelectedMatch();
int matchNumber = match.number;
```

### `isRedAlliance()`
Check if selected match is red alliance

```java
if (isRedAlliance()) {
    // Use red alliance logic
}
```

### `isBlueAlliance()`
Check if selected match is blue alliance

```java
if (isBlueAlliance()) {
    // Use blue alliance logic
}
```

### `getStartPosition()`
Get start position from selected match

```java
StartPosition start = getStartPosition();
if (start.isCustom()) {
    double x = start.getX();
    double y = start.getY();
    // ...
}
```

### `getActions()`
Get list of actions from selected match

```java
List<Action> actions = getActions();
for (Action action : actions) {
    // Process action
}
```

## Complete Example

Here's a full implementation showing all features:

```java
@Autonomous(name = "Advanced Auto", group = "Competition")
public class AdvancedAuto extends SelectableConfigAutoOpMode {
    
    // Hardware
    private MecanumDrive drive;
    private DcMotor intake;
    private Servo launcher;
    
    // Match-specific data
    private boolean useRedAlliance;
    private List<Trajectory> trajectories;
    
    @Override
    protected void onMatchSelected(Match match) {
        // Called immediately after selection
        useRedAlliance = isRedAlliance();
        
        telemetry.addData("Loading", "Alliance-specific trajectories");
        telemetry.update();
        
        // Load trajectories based on alliance
        if (useRedAlliance) {
            trajectories = loadRedTrajectories();
        } else {
            trajectories = loadBlueTrajectories();
        }
        
        telemetry.addData("? Loaded", trajectories.size() + " trajectories");
        telemetry.update();
        sleep(500);
    }
    
    @Override
    protected void initializeHardware(Match match) {
        // Initialize hardware
        telemetry.addData("Status", "Initializing hardware...");
        telemetry.update();
        
        drive = new MecanumDrive(hardwareMap);
        intake = hardwareMap.get(DcMotor.class, "intake");
        launcher = hardwareMap.get(Servo.class, "launcher");
        
        // Set start position
        StartPosition start = getStartPosition();
        if (start.isCustom()) {
            drive.setPoseEstimate(new Pose2d(
                start.getX(),
                start.getY(),
                Math.toRadians(start.getTheta())
            ));
        } else {
            drive.setPoseEstimate(mapPresetPosition(start.type));
        }
        
        // Set initial mechanism states
        intake.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        launcher.setPosition(0);
        
        telemetry.addData("? Hardware", "Ready");
        telemetry.update();
    }
    
    @Override
    protected void executeAutonomous(Match match) {
        // Execute actions
        List<Action> actions = getActions();
        
        for (int i = 0; i < actions.size(); i++) {
            if (!opModeIsActive()) break;
            
            Action action = actions.get(i);
            
            telemetry.clear();
            telemetry.addData("Action", (i + 1) + "/" + actions.size());
            telemetry.addData("Type", action.label);
            telemetry.update();
            
            executeAction(action);
        }
    }
    
    // Helper methods
    
    private void executeAction(Action action) {
        switch (action.type) {
            case "drive_to":
                double x = action.getConfigDouble("x", 0);
                double y = action.getConfigDouble("y", 0);
                drive.followTrajectory(
                    drive.trajectoryBuilder(drive.getPoseEstimate())
                        .lineToLinearHeading(new Pose2d(x, y, 0))
                        .build()
                );
                break;
                
            case "near_launch":
                launcher.setPosition(0.5);
                sleep(500);
                launcher.setPosition(0);
                break;
                
            case "wait":
                sleep(action.getConfigInt("waitTime", 1000));
                break;
                
            // ... other actions
        }
    }
    
    private Pose2d mapPresetPosition(String type) {
        return switch (type) {
            case "front" -> new Pose2d(12, 63, Math.toRadians(90));
            case "back" -> new Pose2d(-12, 63, Math.toRadians(90));
            default -> new Pose2d(0, 63, Math.toRadians(90));
        };
    }
    
    private List<Trajectory> loadRedTrajectories() {
        // Load red-specific trajectories
        return List.of(/* ... */);
    }
    
    private List<Trajectory> loadBlueTrajectories() {
        // Load blue-specific trajectories
        return List.of(/* ... */);
    }
}
```

## Execution Flow

### Complete Timeline

```
1. Driver presses INIT
   ?
2. Base class loads match data from file
   ?
3. User navigates match list with DPAD
   ?
4. User presses A to confirm selection
   ?
5. onMatchSelected(match) is called
   - Load alliance-specific data
   - Pre-compute trajectories
   ?
6. initializeHardware(match) is called
   - Initialize hardware devices
   - Set start position
   - Configure initial states
   ?
7. Final configuration displayed
   ?
8. waitForStart() blocks
   ?
9. Driver presses PLAY
   ?
10. executeAutonomous(match) is called
    - Run autonomous sequence
    - Execute actions
    ?
11. Autonomous complete
```

## Advanced Features

### Reload Match Data

Press **Y button** during selection to reload from file:

```
Use case:
1. Start OpMode (INIT)
2. Realize match data is old
3. Scan new QR codes with scanner OpMode
4. Return to this OpMode
5. Press Y to reload
6. New matches appear in list
```

### Scrollable List

List automatically scrolls to show 5 matches at a time:

```
Shows: Matches 3-7 of 10

  Match 3 - RED Alliance
  Match 4 - BLUE Alliance
? Match 5 - RED Alliance     ? Current selection
  Match 6 - BLUE Alliance
  Match 7 - RED Alliance

? More above
? More below
```

### Wrap-Around Navigation

- Press UP at top ? wraps to bottom
- Press DOWN at bottom ? wraps to top

Makes navigation faster when many matches present.

## Error Handling

### No Match Data File

```
FILE ERROR

Message: FileNotFoundException
Path: /sdcard/FIRST/match-data.json

Solutions:
1. Run Limelight QR Scanner OpMode
2. Verify file path is correct
3. Check SD card is readable
```

**Solution:** Run `LimelightQRScannerOpMode` to scan matches

---

### Empty Match Data

```
ERROR: No matches found
File: /sdcard/FIRST/match-data.json

Action: Run Limelight QR Scanner first
        or verify file path
```

**Solution:** Ensure match data contains valid matches

---

### Invalid JSON Format

```
PARSE ERROR

Message: Unexpected character...

Action: Rescan QR codes or check format
```

**Solution:** Rescan QR codes with scanner OpMode

## Best Practices

### Competition Setup

1. **Before competition:**
   - Scan all matches in morning
   - Test selection interface
   - Verify all matches load correctly

2. **Between matches:**
   - Select appropriate match
   - Verify alliance color
   - Confirm start position
   - Check action count

3. **If match changes:**
   - Rescan QR code
   - Press Y to reload in OpMode
   - Select updated match

### Code Organization

```java
// ? Good: Separate concerns
@Override
protected void onMatchSelected(Match match) {
    // Load data based on match
    loadTrajectories(match);
}

@Override
protected void initializeHardware(Match match) {
    // Initialize hardware
    drive = new MecanumDrive(hardwareMap);
}

// ? Bad: Everything in initializeHardware
@Override
protected void initializeHardware(Match match) {
    loadTrajectories(match);  // Should be in onMatchSelected
    drive = new MecanumDrive(hardwareMap);
}
```

### Testing

```java
// Create test match data file
@Override
protected String getDataFilePath() {
    // Use test file during practice
    return "/sdcard/FIRST/test-matches.json";
}
```

## Troubleshooting

### Selection Not Working

**Symptoms:**
- DPAD doesn't navigate
- A button doesn't confirm

**Solutions:**
- Check gamepad is connected
- Verify gamepad1 is being used
- Ensure buttons aren't stuck

---

### Hardware Not Initialized

**Symptoms:**
- NullPointerException during autonomous
- Hardware devices not found

**Solutions:**
- Implement `initializeHardware()` properly
- Ensure all devices initialized before use
- Check hardware configuration names

---

### Wrong Match Executing

**Symptoms:**
- Wrong actions execute
- Wrong alliance color

**Solutions:**
- Verify selection on telemetry
- Check match number displayed
- Rescan match data if incorrect

## Integration with Other OpModes

### Use with Scanner

```
1. Run "Limelight QR Scanner" OpMode
   - Scan match QR codes
   - Save to /sdcard/FIRST/match-data.json

2. Run "Selectable Auto" OpMode (this one)
   - Select match from list
   - Execute autonomous
```

### Multiple Selectable OpModes

```java
// Create specialized versions for different strategies

@Autonomous(name = "Aggressive Auto", group = "Competition")
public class AggressiveAuto extends SelectableConfigAutoOpMode {
    // Implements aggressive strategy
}

@Autonomous(name = "Safe Auto", group = "Competition")
public class SafeAuto extends SelectableConfigAutoOpMode {
    // Implements conservative strategy
}
```

Both use same match selection, different execution strategies.

## Related Documentation

- **[Limelight QR Scanner Guide](LIMELIGHT_QR_SCANNER_GUIDE.md)** - Scan match data
- **[Integration Guide](INTEGRATION_GUIDE.md)** - General OpMode integration
- **[AutoConfigOpModeExample.java](AutoConfigOpModeExample.java)** - Basic example
- **[LimelightScannedAutoOpMode.java](LimelightScannedAutoOpMode.java)** - Fixed match OpMode

---

**Version**: 2.5.0  
**Base Class**: SelectableConfigAutoOpMode  
**Example**: SelectableAutoExample  
**Status**: Production Ready
