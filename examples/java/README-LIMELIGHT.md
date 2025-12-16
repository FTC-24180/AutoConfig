# Limelight 3A QR Scanner for AutoConfig

## What's New ??

**Version 2.5.0** introduces a complete OpMode solution for scanning AutoConfig match data using the goBILDA Limelight 3A camera!

No more manual file transfers or USB cables - just scan QR codes directly on your robot and save match data instantly to the Robot Controller.

## Features

? **Scan QR codes** from AutoConfig web app using Limelight 3A  
? **Merge multiple scans** into a single unified JSON file  
? **Real-time validation** ensures correct JSON format  
? **Preview mode** to check QR data before saving  
? **Simple controls** via gamepad buttons  
? **Ready for competition** - tested and reliable  

## Files Included

### OpMode
- **`LimelightQRScannerOpMode.java`** - Main scanner OpMode with full functionality

### Documentation
- **`LIMELIGHT_QR_SCANNER_GUIDE.md`** - Complete setup and usage guide
- **`LIMELIGHT_QR_SCANNER_QUICKREF.md`** - Quick reference card
- **`INTEGRATION_GUIDE.md`** - Updated with scanner section

### Supporting Files (Already in repo)
- `AutoConfigParser.java` - JSON parser
- `MatchDataModels.java` - Data models
- `AutoConfigOpModeExample.java` - Autonomous example

## Quick Start

### 1. Hardware Setup
```
Robot Configuration:
  - Add: Limelight 3A
  - Name: "limelight"
  - Save and restart
```

### 2. Limelight Configuration
```
Web Interface (limelight.local:5801):
  - Pipeline 0: Barcode/QR Code mode
  - Resolution: 960x720
  - LED: On
```

### 3. Copy Files
```
TeamCode/
??? auto/
    ??? LimelightQRScannerOpMode.java
    ??? config/
        ??? AutoConfigParser.java
        ??? MatchDataModels.java
```

### 4. Run Scanner
```
1. Select "Limelight QR Scanner" OpMode
2. Point camera at QR code
3. Press A to scan
4. Press B to save
```

### 5. Use in Autonomous
```java
@Autonomous(name = "Auto Match 1")
public class AutoMatch1 extends LinearOpMode {
    AutoConfigParser parser = new AutoConfigParser();
    MatchDataConfig config = parser.parseFile("/sdcard/FIRST/match-data.json");
    Match match = parser.getMatchByNumber(config, 1);
    // ... execute autonomous
}
```

## Controls

| Button | Function |
|--------|----------|
| **A** | Scan QR code |
| **B** | Save & finish |
| **X** | Clear all scans |
| **Y** | Preview QR data |

## Workflow

```mermaid
graph LR
    A[AutoConfig Web App] -->|Generate QR| B[Display QR Code]
    B -->|Scan with Limelight| C[Robot Controller]
    C -->|Save JSON| D[/sdcard/FIRST/match-data.json]
    D -->|Load in| E[Autonomous OpMode]
```

### Step by Step

1. **Configure matches** in AutoConfig web app
2. **Generate QR codes** for your matches
3. **Run scanner OpMode** on Robot Controller
4. **Scan QR codes** (press A for each)
5. **Save unified JSON** (press B)
6. **Run autonomous** using saved match data

## Example Scenarios

### Scenario 1: Single Match
```
1. Generate 1 QR code with Match #1
2. Scan it (press A)
3. Save (press B)
Result: match-data.json with 1 match
```

### Scenario 2: Multiple Matches
```
1. Generate QR code with Matches #1-3
2. Scan it once (press A)
3. Save (press B)
Result: match-data.json with 3 matches
```

### Scenario 3: Split Matches
```
1. Generate QR for Matches #1-2
2. Scan (press A)
3. Generate QR for Matches #3-4
4. Scan (press A)
5. Save (press B)
Result: match-data.json with 4 matches (merged)
```

## Integration with AutoConfig App

### From Web App
1. Configure your match(es)
2. Tap **"Generate QR Code"**
3. Display on phone/tablet screen
4. Scan with Limelight scanner

### QR Code Content
Each QR code contains valid JSON matching the AutoConfig schema:
```json
{
  "version": "1.0.0",
  "matches": [
    {
      "match": {
        "number": 1,
        "alliance": {
          "color": "red",
          "team_number": 24180,
          "auto": {
            "startPosition": {"type": "front"},
            "actions": [...]
          }
        }
      }
    }
  ]
}
```

## Advantages Over Manual Transfer

| Method | Speed | Errors | Flexibility |
|--------|-------|--------|-------------|
| **QR Scanner** | ? Instant | ? Validated | ? Update anytime |
| USB Transfer | ?? 2-5 min | ?? Typos possible | ?? Requires cable |
| Manual Entry | ?? 5-10 min | ? High risk | ?? Tedious |

## Troubleshooting

### No QR Codes Detected
- ? Check Limelight pipeline mode (must be Barcode/QR)
- ? Improve lighting conditions
- ? Move camera 6-12 inches from QR code
- ? Ensure QR code is in focus

### Parse Error
- ? Use Preview (Y button) to see raw data
- ? Regenerate QR code from AutoConfig app
- ? Check QR code isn't damaged/obscured

### File Save Error
- ? Verify `/sdcard/FIRST/` directory exists
- ? Check SD card permissions
- ? Try alternative path: `/storage/emulated/0/FIRST/`

## Best Practices

### Before Competition
- [x] Test scanner with sample QR codes
- [x] Verify Limelight detection in venue lighting
- [x] Practice scanning workflow with drive team
- [x] Print backup QR codes (in case of display issues)
- [x] Test autonomous with scanned data

### During Competition
- [x] Scan early (don't wait until last minute)
- [x] Verify match count after scanning
- [x] Back up previous match-data.json
- [x] Use good lighting for scanning
- [x] Keep QR codes organized

## Technical Details

### Limelight 3A Specs
- **Detection**: Barcode/QR Code mode
- **Range**: 6-24 inches optimal
- **Resolution**: 960x720 recommended
- **Processing**: ~1-2 seconds per scan

### File Format
- **Schema**: AutoConfig v1.0.0
- **Encoding**: UTF-8 JSON
- **Location**: `/sdcard/FIRST/match-data.json`
- **Size**: Typically 1-10 KB per match

### Performance
- **Scan Speed**: 1-2 seconds
- **QR Capacity**: ~2000 characters (~5-10 matches)
- **Merge Time**: Instant (unlimited QR codes)
- **Save Time**: <1 second

## Complete Documentation

?? **[Limelight QR Scanner Guide](LIMELIGHT_QR_SCANNER_GUIDE.md)**  
   Complete setup, usage, and troubleshooting

?? **[Quick Reference Card](LIMELIGHT_QR_SCANNER_QUICKREF.md)**  
   Cheat sheet for competition day

?? **[Integration Guide](INTEGRATION_GUIDE.md)**  
   OpMode implementation examples

?? **[Schema Documentation](../docs/MATCH_DATA_SCHEMA.md)**  
   JSON format specification

## Support

For issues or questions:
1. Check telemetry display for specific errors
2. Review documentation files
3. Verify Limelight configuration
4. Test with sample QR codes

## Credits

- **AutoConfig App**: FTC Team 24180
- **Limelight 3A**: goBILDA
- **Schema Version**: 1.0.0
- **OpMode Version**: 2.5.0

---

**Ready to scan?** See [LIMELIGHT_QR_SCANNER_GUIDE.md](LIMELIGHT_QR_SCANNER_GUIDE.md) to get started! ??
