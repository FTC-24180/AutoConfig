package org.firstinspires.ftc.teamcode.auto;

import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;

import org.firstinspires.ftc.teamcode.auto.config.Action;
import org.firstinspires.ftc.teamcode.auto.config.AutoConfigParser;
import org.firstinspires.ftc.teamcode.auto.config.Match;
import org.firstinspires.ftc.teamcode.auto.config.MatchDataConfig;
import org.firstinspires.ftc.teamcode.auto.config.StartPosition;

import java.io.IOException;

/**
 * Complete autonomous OpMode using Limelight-scanned match data
 * 
 * Prerequisites:
 * 1. Run LimelightQRScannerOpMode to scan match data
 * 2. Verify match-data.json exists at /sdcard/FIRST/
 * 3. Update MATCH_NUMBER constant for your current match
 * 
 * This OpMode demonstrates:
 * - Loading scanned match data from JSON
 * - Validating match configuration
 * - Setting start position from match data
 * - Executing action sequence from match data
 * - Error handling and telemetry feedback
 * 
 * Workflow:
 * 1. Before match: Scan QR code(s) using LimelightQRScannerOpMode
 * 2. During match: Select this OpMode and press Play
 * 3. Robot executes autonomous based on scanned configuration
 */
@Autonomous(name = "Limelight Auto (Match 1)", group = "Competition")
public class LimelightScannedAutoOpMode extends LinearOpMode {
    
    // Configuration - Update these for your setup
    private static final String SCANNED_DATA_FILE = "/sdcard/FIRST/match-data.json";
    private static final int MATCH_NUMBER = 1;  // Update for each match
    
    // Match data
    private MatchDataConfig config;
    private Match currentMatch;
    
    @Override
    public void runOpMode() throws InterruptedException {
        // Stage 1: Load and validate match data
        telemetry.addData("Status", "Loading match data...");
        telemetry.update();
        
        if (!loadMatchData()) {
            // Error already displayed in loadMatchData()
            waitForStart();
            return;
        }
        
        // Stage 2: Initialize robot hardware
        telemetry.addData("Status", "Initializing hardware...");
        telemetry.update();
        
        initializeHardware();
        
        // Stage 3: Display match configuration
        displayMatchInfo();
        
        // Wait for start
        telemetry.addData("", "");
        telemetry.addData("Status", "? READY TO START");
        telemetry.update();
        
        waitForStart();
        
        if (!opModeIsActive()) return;
        
        // Stage 4: Execute autonomous sequence
        telemetry.clear();
        telemetry.addData("Status", "RUNNING AUTONOMOUS");
        telemetry.addData("Match", MATCH_NUMBER);
        telemetry.update();
        
        executeAutonomous();
        
        // Stage 5: Complete
        telemetry.addData("Status", "? AUTONOMOUS COMPLETE");
        telemetry.update();
    }
    
    /**
     * Load match data from scanned JSON file
     * @return true if successful, false on error
     */
    private boolean loadMatchData() {
        try {
            // Create parser
            AutoConfigParser parser = new AutoConfigParser();
            
            // Parse JSON file
            config = parser.parseFile(SCANNED_DATA_FILE);
            
            if (config == null || config.matches == null || config.matches.isEmpty()) {
                telemetry.clear();
                telemetry.addData("ERROR", "No matches found in file");
                telemetry.addData("File", SCANNED_DATA_FILE);
                telemetry.addData("", "");
                telemetry.addData("Action", "Run Limelight QR Scanner first");
                telemetry.update();
                return false;
            }
            
            // Find current match
            currentMatch = parser.getMatchByNumber(config, MATCH_NUMBER);
            
            if (currentMatch == null) {
                telemetry.clear();
                telemetry.addData("ERROR", "Match " + MATCH_NUMBER + " not found");
                telemetry.addData("File", SCANNED_DATA_FILE);
                telemetry.addData("Available", config.matches.size() + " match(es)");
                telemetry.addData("", "");
                telemetry.addData("Action", "Check MATCH_NUMBER constant");
                telemetry.update();
                return false;
            }
            
            // Validate match has required data
            if (currentMatch.alliance == null || currentMatch.alliance.auto == null) {
                telemetry.clear();
                telemetry.addData("ERROR", "Match " + MATCH_NUMBER + " incomplete");
                telemetry.addData("", "Missing alliance or auto configuration");
                telemetry.update();
                return false;
            }
            
            telemetry.addData("? Loaded", config.matches.size() + " match(es)");
            telemetry.addData("? Schema", config.version);
            return true;
            
        } catch (IOException e) {
            telemetry.clear();
            telemetry.addData("FILE ERROR", "");
            telemetry.addData("Message", e.getMessage());
            telemetry.addData("Path", SCANNED_DATA_FILE);
            telemetry.addData("", "");
            telemetry.addData("Solutions", "");
            telemetry.addData("1.", "Run Limelight QR Scanner OpMode");
            telemetry.addData("2.", "Verify file path is correct");
            telemetry.addData("3.", "Check SD card is readable");
            telemetry.update();
            return false;
            
        } catch (IllegalArgumentException e) {
            telemetry.clear();
            telemetry.addData("PARSE ERROR", "");
            telemetry.addData("Message", e.getMessage());
            telemetry.addData("", "");
            telemetry.addData("Action", "Rescan QR codes");
            telemetry.update();
            return false;
            
        } catch (Exception e) {
            telemetry.clear();
            telemetry.addData("UNEXPECTED ERROR", "");
            telemetry.addData("Message", e.getMessage());
            telemetry.update();
            return false;
        }
    }
    
    /**
     * Initialize robot hardware
     * TODO: Replace with your actual hardware initialization
     */
    private void initializeHardware() {
        // Example: Initialize your drive system
        // drive = new MecanumDrive(hardwareMap);
        
        // Example: Initialize mechanisms
        // intake = hardwareMap.get(DcMotor.class, "intake");
        // launcher = hardwareMap.get(Servo.class, "launcher");
        
        telemetry.addData("? Hardware", "Initialized");
        telemetry.update();
    }
    
    /**
     * Display match configuration on telemetry
     */
    private void displayMatchInfo() {
        telemetry.clear();
        telemetry.addData("MATCH CONFIGURATION", "");
        telemetry.addLine();
        
        // Match details
        telemetry.addData("Match Number", currentMatch.number);
        telemetry.addData("Alliance", currentMatch.alliance.color.toUpperCase());
        telemetry.addData("Partner Team", 
            currentMatch.alliance.team_number > 0 ? 
                currentMatch.alliance.team_number : "Not specified");
        
        telemetry.addLine();
        
        // Start position
        StartPosition start = currentMatch.alliance.auto.startPosition;
        if (start.isCustom()) {
            telemetry.addData("Start Position", "Custom");
            telemetry.addData("  X", String.format("%.1f", start.getX()));
            telemetry.addData("  Y", String.format("%.1f", start.getY()));
            telemetry.addData("  Heading", String.format("%.0f°", start.getTheta()));
        } else {
            telemetry.addData("Start Position", start.type);
        }
        
        telemetry.addLine();
        
        // Actions
        int actionCount = currentMatch.alliance.auto.actions.size();
        telemetry.addData("Actions", actionCount);
        
        // Show first few actions
        int displayCount = Math.min(5, actionCount);
        for (int i = 0; i < displayCount; i++) {
            Action action = currentMatch.alliance.auto.actions.get(i);
            telemetry.addData("  " + (i + 1), action.label);
        }
        if (actionCount > 5) {
            telemetry.addData("  ...", "+" + (actionCount - 5) + " more");
        }
        
        telemetry.update();
    }
    
    /**
     * Execute autonomous sequence from match data
     */
    private void executeAutonomous() {
        // Set start position
        setStartPosition(currentMatch.alliance.auto.startPosition);
        
        // Execute each action
        int totalActions = currentMatch.alliance.auto.actions.size();
        for (int i = 0; i < totalActions; i++) {
            if (!opModeIsActive()) break;
            
            Action action = currentMatch.alliance.auto.actions.get(i);
            
            // Update telemetry
            telemetry.clear();
            telemetry.addData("Status", "EXECUTING");
            telemetry.addData("Action", (i + 1) + "/" + totalActions);
            telemetry.addData("Type", action.type);
            telemetry.addData("Label", action.label);
            
            // Show config if present
            if (action.hasConfig()) {
                telemetry.addLine();
                telemetry.addData("Config", action.config.toString());
            }
            
            telemetry.update();
            
            // Execute action
            executeAction(action);
        }
    }
    
    /**
     * Set robot start position from match data
     */
    private void setStartPosition(StartPosition position) {
        telemetry.addData("Setting position", "");
        telemetry.update();
        
        if (position.isCustom()) {
            // Use exact coordinates from match data
            double x = position.getX();
            double y = position.getY();
            double theta = position.getTheta();
            
            telemetry.addData("Custom Position", 
                String.format("(%.1f, %.1f, %.0f°)", x, y, theta));
            
            // TODO: Set your robot's pose estimate
            // Example with RoadRunner:
            // drive.setPoseEstimate(new Pose2d(x, y, Math.toRadians(theta)));
            
        } else {
            // Map preset position name to coordinates
            telemetry.addData("Preset Position", position.type);
            
            // TODO: Map position type to your robot's start poses
            // Example:
            // switch (position.type) {
            //     case "front":
            //         drive.setPoseEstimate(FRONT_START_POSE);
            //         break;
            //     case "back":
            //         drive.setPoseEstimate(BACK_START_POSE);
            //         break;
            //     case "left":
            //         drive.setPoseEstimate(LEFT_START_POSE);
            //         break;
            //     case "right":
            //         drive.setPoseEstimate(RIGHT_START_POSE);
            //         break;
            //     default:
            //         telemetry.addData("Warning", "Unknown position: " + position.type);
            // }
        }
        
        telemetry.update();
        sleep(500);  // Brief pause to confirm position
    }
    
    /**
     * Execute a single action from match data
     */
    private void executeAction(Action action) {
        // Map action types to your robot's commands
        // These are examples - replace with your actual implementations
        
        switch (action.type) {
            case "wait":
                executeWait(action);
                break;
                
            case "drive_to":
                executeDriveTo(action);
                break;
                
            case "near_launch":
                executeNearLaunch();
                break;
                
            case "far_launch":
                executeFarLaunch();
                break;
                
            case "spike_1":
            case "spike_2":
            case "spike_3":
                executeSpike(action.type);
                break;
                
            case "near_park":
            case "far_park":
                executePark(action.type);
                break;
                
            case "dump":
                executeDump();
                break;
                
            case "corner":
                executeCorner();
                break;
                
            default:
                // Unknown action - log warning but continue
                telemetry.addData("Warning", "Unknown action: " + action.type);
                telemetry.addData("", "Skipping...");
                telemetry.update();
                sleep(500);
        }
    }
    
    // ========== Action Implementations ==========
    // TODO: Replace these with your actual robot commands
    
    private void executeWait(Action action) {
        int duration = action.getConfigInt("waitTime", 1000);
        sleep(duration);
    }
    
    private void executeDriveTo(Action action) {
        double x = action.getConfigDouble("x", 0);
        double y = action.getConfigDouble("y", 0);
        String target = action.getConfigString("target", "");
        
        // TODO: Navigate to coordinates
        // Example with RoadRunner:
        // drive.followTrajectorySequence(
        //     drive.trajectorySequenceBuilder(drive.getPoseEstimate())
        //         .lineToLinearHeading(new Pose2d(x, y, drive.getPoseEstimate().getHeading()))
        //         .build()
        // );
        
        sleep(1000);  // Placeholder
    }
    
    private void executeNearLaunch() {
        // TODO: Implement near launch sequence
        sleep(1000);
    }
    
    private void executeFarLaunch() {
        // TODO: Implement far launch sequence
        sleep(1000);
    }
    
    private void executeSpike(String spikeType) {
        // Extract spike number: "spike_1" -> "1"
        String spikeNum = spikeType.substring(6);
        
        // TODO: Navigate to spike mark
        // Use spikeNum to determine which spike (1, 2, or 3)
        
        sleep(1000);
    }
    
    private void executePark(String parkType) {
        boolean nearPark = parkType.contains("near");
        
        // TODO: Navigate to parking zone
        // Use nearPark boolean to determine which zone
        
        sleep(1000);
    }
    
    private void executeDump() {
        // TODO: Execute dump mechanism
        sleep(1000);
    }
    
    private void executeCorner() {
        // TODO: Navigate to corner
        sleep(1000);
    }
}
