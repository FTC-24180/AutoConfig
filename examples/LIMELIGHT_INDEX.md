# Limelight QR Code Integration - Complete Package

## ?? What's Included

A complete solution for scanning AutoConfig match data using the goBILDA Limelight 3A camera and executing autonomous routines based on the scanned configuration.

**Version**: 2.6.0 | **Schema**: 1.0.0 | **Date**: December 2024

---

## ?? File Structure

```
examples/
??? java/
?   ??? LimelightQRScannerOpMode.java           ? Scanner OpMode
?   ??? LimelightScannedAutoOpMode.java         ? Fixed match autonomous
?   ??? SelectableConfigAutoOpMode.java         ? NEW: Base class with selection
?   ??? SelectableAutoExample.java              ? NEW: Selectable example
?   ??? AutoConfigOpModeExample.java            ? Basic example
?   ??? AutoConfigParser.java                   ? JSON parser
?   ??? MatchDataModels.java                    ? Data models
?   ??? README-LIMELIGHT.md                     ? Package overview
?
??? LIMELIGHT_QR_SCANNER_GUIDE.md               ? Scanner setup guide
??? LIMELIGHT_QR_SCANNER_QUICKREF.md            ? Quick reference
??? LIMELIGHT_WORKFLOW.md                       ? End-to-end workflow
??? SELECTABLE_CONFIG_GUIDE.md                  ? NEW: Selectable OpMode guide
??? OPMODE_COMPARISON.md                        ? NEW: Choose the right OpMode
??? LIMELIGHT_INDEX.md                          ? This file
??? INTEGRATION_GUIDE.md                        ? Updated with all options
```

---

## ?? Quick Start Guide

### 1?? Choose Your Approach

**New: Three OpMode Patterns Available!**

| Approach | Best For | File |
|----------|----------|------|
| **Interactive Selection** | Multiple matches, flexibility | `SelectableConfigAutoOpMode` |
| **Fixed Match** | Separate OpModes per match | `LimelightScannedAutoOpMode` |
| **Basic** | Learning, simple testing | `AutoConfigOpModeExample` |

?? **[OpMode Comparison Guide](OPMODE_COMPARISON.md)** - Detailed comparison to help you choose

### 2?? Choose Your Entry Point

**New to this system?** ? Start here:
- ?? [README-LIMELIGHT.md](java/README-LIMELIGHT.md) - Overview and introduction

**Ready to set up?** ? Follow this:
- ?? [LIMELIGHT_QR_SCANNER_GUIDE.md](LIMELIGHT_QR_SCANNER_GUIDE.md) - Complete setup instructions

**Want interactive match selection?** ? Read this:
- ?? [SELECTABLE_CONFIG_GUIDE.md](SELECTABLE_CONFIG_GUIDE.md) - Interactive selection guide

**Need quick reference?** ? Use this:
- ?? [LIMELIGHT_QR_SCANNER_QUICKREF.md](LIMELIGHT_QR_SCANNER_QUICKREF.md) - Competition day cheat sheet

**Want full workflow?** ? Read this:
- ?? [LIMELIGHT_WORKFLOW.md](LIMELIGHT_WORKFLOW.md) - End-to-end process

**Comparing options?** ? Check this:
- ?? [OPMODE_COMPARISON.md](OPMODE_COMPARISON.md) - Choose the right OpMode

---

## ?? Documentation by Use Case

### Setup & Installation
Start with these documents to get everything configured:

1. **[README-LIMELIGHT.md](java/README-LIMELIGHT.md)**
   - System overview
   - Feature list
   - Quick start checklist
   - Benefits and use cases

2. **[LIMELIGHT_QR_SCANNER_GUIDE.md](LIMELIGHT_QR_SCANNER_GUIDE.md)**
   - Hardware configuration
   - Limelight pipeline setup
   - Software installation
   - Detailed usage instructions
   - Troubleshooting

### Daily Use
Reference these during practice and competition:

1. **[LIMELIGHT_QR_SCANNER_QUICKREF.md](LIMELIGHT_QR_SCANNER_QUICKREF.md)**
   - Controls reference
   - Quick workflow
   - Common issues
   - Competition checklist

2. **[LIMELIGHT_WORKFLOW.md](LIMELIGHT_WORKFLOW.md)**
   - Pre-match preparation
   - Match execution
   - Use case examples
   - Best practices

### Development & Integration
Use these for implementing and customizing:

1. **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)**
   - General OpMode integration
   - Scanner section
   - Data structure reference
   - Action implementation

2. **[AutoConfigOpModeExample.java](java/AutoConfigOpModeExample.java)**
   - Basic autonomous template
   - Action handler examples
   - Comments and TODOs

### NEW: Choosing the Right OpMode

1. **[OPMODE_COMPARISON.md](OPMODE_COMPARISON.md)**
   - Feature comparison
   - Use case scenarios
   - Decision tree
   - Migration guide

2. **[SELECTABLE_CONFIG_GUIDE.md](SELECTABLE_CONFIG_GUIDE.md)**
   - Interactive selection guide
   - Template method pattern
   - Utility methods
   - Complete examples

---

## ?? Code Files Reference

### OpModes (Ready to Use)

#### **SelectableConfigAutoOpMode.java** ? NEW
**Purpose**: Base class for OpModes with interactive match selection

**Key Features**:
- Interactive UI for match selection
- Navigate with DPAD UP/DOWN
- Confirm with A button
- Reload data on-the-fly
- Template methods for customization

**Controls**:
- DPAD UP/DOWN: Navigate matches
- A: Confirm selection
- Y: Reload match data
- BACK: View match details

**When to Use**: One OpMode for entire competition

**See**: [SELECTABLE_CONFIG_GUIDE.md](SELECTABLE_CONFIG_GUIDE.md)

---

#### **SelectableAutoExample.java** ? NEW
**Purpose**: Example implementation of selectable config pattern

**Key Features**:
- Shows how to extend base class
- Implements required methods
- Demonstrates best practices
- Ready to customize

**Customization**: Implement action handlers for your robot

**When to Use**: Starting point for your own selectable OpMode

---

#### **LimelightQRScannerOpMode.java**
**Purpose**: Scan QR codes and save match data

**Key Features**:
- Detects QR codes using Limelight 3A
- Parses and validates JSON
- Merges multiple scans
- Saves unified JSON file

**Controls**:
- A: Scan QR code
- B: Save & finish
- X: Clear all
- Y: Preview

**When to Use**: Before matches to load configurations

---

#### **LimelightScannedAutoOpMode.java**
**Purpose**: Execute autonomous using scanned data

**Key Features**:
- Loads scanned match data
- Validates configuration
- Sets start position
- Executes action sequence

**Customization**: Update MATCH_NUMBER for each match

**When to Use**: During matches for autonomous period

---

### Helper Classes (Required)

#### **AutoConfigParser.java**
**Purpose**: Parse JSON match data

**Key Methods**:
- `parseFile(path)` - Load from file
- `parseJson(string)` - Parse JSON string
- `getMatchByNumber(config, num)` - Find specific match
- `getMatchesByAlliance(config, color)` - Filter by alliance

---

#### **MatchDataModels.java**
**Purpose**: Data structure definitions

**Key Classes**:
- `MatchDataConfig` - Root object
- `Match` - Single match
- `Alliance` - Team and alliance info
- `Autonomous` - Auto configuration
- `StartPosition` - Robot position
- `Action` - Single action

---

## ?? Common Workflows

### Workflow 1: First Time Setup
```
1. Read: README-LIMELIGHT.md
2. Follow: LIMELIGHT_QR_SCANNER_GUIDE.md
   - Configure hardware
   - Set up Limelight
   - Install code files
3. Test: Scanner OpMode with sample QR
4. Test: Autonomous OpMode with saved data
5. Print: LIMELIGHT_QR_SCANNER_QUICKREF.md for team
```

### Workflow 2: Competition Day (Interactive Selection) ? NEW
```
1. Review: SELECTABLE_CONFIG_GUIDE.md
2. Before competition:
   - Scan all matches with Limelight scanner
   - Deploy SelectableAutoOpMode
3. Before each match:
   - Select OpMode on Driver Station
   - Press INIT
   - Use DPAD to select correct match
   - Press A to confirm
   - Press PLAY when ready
4. Between matches:
   - Rescan if strategy changes
   - Press Y in OpMode to reload
```

### Workflow 3: Competition Day (Fixed Match)
```
1. Review: LIMELIGHT_QR_SCANNER_QUICKREF.md
2. Before matches:
   - Configure in AutoConfig web app
   - Run Limelight QR Scanner
   - Scan QR codes
   - Verify on telemetry
3. During matches:
   - Select autonomous OpMode
   - Verify configuration
   - Run autonomous
```

### Workflow 4: Last-Minute Changes
```
1. Update: Match config in web app
2. Generate: New QR code
3. Run: Limelight QR Scanner
4. Scan: Updated QR code (overwrites previous)
5. Verify: New configuration on telemetry
6. Run: Same autonomous OpMode
```

---

## ?? Learning Path

### Beginner
**Goal**: Get scanner working

1. Read overview (README-LIMELIGHT.md)
2. Follow setup guide (LIMELIGHT_QR_SCANNER_GUIDE.md)
3. Test with sample QR codes
4. Practice scanning workflow

**Estimated Time**: 30-45 minutes

---

### Intermediate
**Goal**: Use in autonomous

1. Review autonomous examples
2. **Choose OpMode pattern** (see comparison guide)
3. Implement action handlers
4. Test with scanned match data

**Estimated Time**: 1-2 hours

---

### Advanced
**Goal**: Master interactive selection ? NEW

1. Review selectable config guide
2. Understand template method pattern
3. Implement onMatchSelected() hook
4. Create custom base class variants
5. Optimize for competition workflow

**Estimated Time**: 2-3 hours

---

## ?? Find What You Need

### By Question

**"How do I set this up?"**
? [LIMELIGHT_QR_SCANNER_GUIDE.md](LIMELIGHT_QR_SCANNER_GUIDE.md)

**"What does this button do?"**
? [LIMELIGHT_QR_SCANNER_QUICKREF.md](LIMELIGHT_QR_SCANNER_QUICKREF.md)

**"How does the whole process work?"**
? [LIMELIGHT_WORKFLOW.md](LIMELIGHT_WORKFLOW.md)

**"Which OpMode should I use?"** ? NEW
? [OPMODE_COMPARISON.md](OPMODE_COMPARISON.md)

**"How do I use interactive selection?"** ? NEW
? [SELECTABLE_CONFIG_GUIDE.md](SELECTABLE_CONFIG_GUIDE.md)

**"What files do I need?"**
? [README-LIMELIGHT.md](java/README-LIMELIGHT.md)

**"How do I implement actions?"**
? [AutoConfigOpModeExample.java](java/AutoConfigOpModeExample.java)

**"What's the data structure?"**
? [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

---

### By OpMode Type ? NEW

**Selectable Config (Interactive)**
- Guide: [SELECTABLE_CONFIG_GUIDE.md](SELECTABLE_CONFIG_GUIDE.md)
- Base Class: [SelectableConfigAutoOpMode.java](java/SelectableConfigAutoOpMode.java)
- Example: [SelectableAutoExample.java](java/SelectableAutoExample.java)

**Fixed Match**
- Base: [LimelightScannedAutoOpMode.java](java/LimelightScannedAutoOpMode.java)
- Guide: [LIMELIGHT_WORKFLOW.md](LIMELIGHT_WORKFLOW.md)

**Basic**
- Example: [AutoConfigOpModeExample.java](java/AutoConfigOpModeExample.java)
- Guide: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

**Comparison**
- [OPMODE_COMPARISON.md](OPMODE_COMPARISON.md)

---

### By Problem

**"Limelight won't detect QR codes"**
? LIMELIGHT_QR_SCANNER_GUIDE.md ? Troubleshooting ? "No QR codes detected"

**"File won't save"**
? LIMELIGHT_QR_SCANNER_GUIDE.md ? Troubleshooting ? "Save Error"

**"Match not found"**
? LIMELIGHT_WORKFLOW.md ? Troubleshooting ? "Match not found"

**"Actions not executing"**
? AutoConfigOpModeExample.java ? Action Implementations

**"Unknown action type"**
? INTEGRATION_GUIDE.md ? Common Action Types

---

## ?? Feature Comparison ? UPDATED

| Feature | Basic OpMode | Fixed Match | Selectable Config |
|---------|-------------|-------------|-------------------|
| **Runtime Selection** | ? | ? | ? |
| **One OpMode All Matches** | ? | ? | ? |
| **Interactive UI** | ? | ? | ? |
| **Reload Match Data** | ? | ? | ? |
| **Error Handling** | Manual | ? | ? |
| **Telemetry** | Manual | ? | ? |
| **Simple Code** | ? | ? | ? |
| **Match Preview** | ? | ? | ? |
| **Best For** | Learning | Fixed matches | Competition |

**See detailed comparison**: [OPMODE_COMPARISON.md](OPMODE_COMPARISON.md)

---

## ? Checklist for Success

### Hardware
- [ ] Limelight 3A installed on robot
- [ ] Limelight powered and connected
- [ ] Camera has clear view for scanning
- [ ] LED lights functional

### Configuration
- [ ] Hardware config includes "limelight"
- [ ] Pipeline 0 set to barcode mode
- [ ] Resolution 960x720 or higher
- [ ] LED mode set to "On"

### Software
- [ ] Gson dependency in build.gradle
- [ ] All Java files copied to TeamCode
- [ ] Project builds without errors
- [ ] OpModes appear in Driver Station

### Testing
- [ ] Scanner detects sample QR code
- [ ] JSON saves to /sdcard/FIRST/
- [ ] Autonomous loads saved data
- [ ] Actions execute correctly

### Documentation
- [ ] Team trained on scanner workflow
- [ ] Quick reference printed/accessible
- [ ] Troubleshooting guide reviewed
- [ ] Competition checklist ready

---

## ?? Getting Help

### Check Documentation
1. Find your issue in this index
2. Go to relevant documentation section
3. Follow troubleshooting steps

### Common Solutions
- **Hardware**: Check Limelight configuration
- **Detection**: Verify pipeline mode and lighting
- **Parsing**: Regenerate QR from web app
- **Saving**: Check SD card and permissions
- **Execution**: Implement action handlers

### Support Resources
- Telemetry messages (show specific errors)
- Limelight documentation (camera setup)
- AutoConfig schema (JSON format)
- Example OpModes (implementation patterns)

---

## ?? Next Steps

### To Get Started
1. **Read**: [README-LIMELIGHT.md](java/README-LIMELIGHT.md)
2. **Set Up**: [LIMELIGHT_QR_SCANNER_GUIDE.md](LIMELIGHT_QR_SCANNER_GUIDE.md)
3. **Test**: Scan a sample QR code
4. **Implement**: Add action handlers for your robot

### For Competition
1. **Practice**: Run through complete workflow
2. **Print**: Quick reference card
3. **Verify**: Test in venue lighting
4. **Execute**: Use confidently in matches

---

## ?? Version History

### v2.6.0 (Current)
- ? New: Selectable configuration OpMode integration
- ? New: Interactive match selection feature
- ?? Updated: Quick start guide and documentation
- ?? Fixed: Minor bugs and performance enhancements

### Previous Versions
- v2.5.0: Initial QR scanner integration
- See version.js for full history

---

## ?? Contributing

Found an issue or have a suggestion?
- Document it with telemetry output
- Note your hardware configuration
- Include QR code data if relevant
- Reference specific documentation section

---

## ?? License & Credits

**Project**: AutoConfig  
**Team**: FTC 24180  
**Hardware**: goBILDA Limelight 3A  
**Schema**: AutoConfig v1.0.0  
**Version**: 2.6.0  

---

**Ready to scan?** Start with [README-LIMELIGHT.md](java/README-LIMELIGHT.md)!  
**Ready to select?** See [SELECTABLE_CONFIG_GUIDE.md](SELECTABLE_CONFIG_GUIDE.md)! ??
