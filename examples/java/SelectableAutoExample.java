package org.firstinspires.ftc.teamcode.auto;

import com.qualcomm.robotcore.eventloop.opmode.Autonomous;

import org.firstinspires.ftc.teamcode.auto.config.Action;
import org.firstinspires.ftc.teamcode.auto.config.Match;
import org.firstinspires.ftc.teamcode.auto.config.StartPosition;

/**
 * Example autonomous OpMode using SelectableConfigAutoOpMode base class
 * 
 * This demonstrates how to extend the base class to create an autonomous
 * OpMode with interactive match selection.
 * 
 * Features:
 * - User selects match configuration after pressing INIT
 * - Hardware initialization occurs after match selection
 * - Match-specific setup can be performed in onMatchSelected()
 * - Actions are executed based on selected configuration
 * 
 * Usage:
 * 1. Press INIT on Driver Station
 * 2. Use DPAD UP/DOWN to navigate matches
 * 3. Press A to confirm selection
 * 4. Robot initializes hardware for selected match
 * 5. Press PLAY to start autonomous
 */
@Autonomous(name = "Selectable Auto", group = "Competition")
public class SelectableAutoExample extends SelectableConfigAutoOpMode {
    
    // Your robot hardware components
    // Example:
    // private MecanumDrive drive;
    // private DcMotor intake;
    // private Servo launcher;
    
    // Alliance-specific configurations
    private boolean useRedAlliance;
    
    @Override
    protected void onMatchSelected(Match match) {
        // This is called immediately after match selection
        // Use it for early initialization that depends on match config
        
        useRedAlliance = isRedAlliance();
        
        telemetry.addData("Alliance Setup", useRedAlliance ? "Red" : "Blue");
        telemetry.update();
        
        // Example: Load alliance-specific trajectories
        // if (useRedAlliance) {
        //     loadRedTrajectories();
        // } else {
        //     loadBlueTrajectories();
        // }
        
        sleep(500); // Brief pause to show message
    }
    
    @Override
    protected void initializeHardware(Match match) {
        // Initialize your robot hardware here
        // This is called after match selection but before waitForStart()
        
        telemetry.addData("Status", "Initializing hardware...");
        telemetry.update();
        
        // Example: Initialize drive system
        // drive = new MecanumDrive(hardwareMap);
        
        // Example: Initialize mechanisms
        // intake = hardwareMap.get(DcMotor.class, "intake");
        // launcher = hardwareMap.get(Servo.class, "launcher");
        
        // Set initial hardware states based on match config
        StartPosition startPos = match.alliance.auto.startPosition;
        if (startPos.isCustom()) {
            // Use custom coordinates
            telemetry.addData("Start Pose", 
                String.format("(%.1f, %.1f, %.0f°)", 
                    startPos.getX(), startPos.getY(), startPos.getTheta()));
            
            // Example: Set pose estimate
            // drive.setPoseEstimate(new Pose2d(
            //     startPos.getX(), 
            //     startPos.getY(), 
            //     Math.toRadians(startPos.getTheta())
            // ));
        } else {
            // Use preset position
            telemetry.addData("Start Pose", startPos.type);
            
            // Example: Map preset to coordinates
            // Pose2d pose = mapPresetPosition(startPos.type);
            // drive.setPoseEstimate(pose);
        }
        
        telemetry.addData("? Hardware", "Initialized");
        telemetry.update();
    }
    
    @Override
    protected void executeAutonomous(Match match) {
        // Execute the autonomous sequence
        // This is called after PLAY is pressed
        
        // Set start position
        setRobotStartPosition(match.alliance.auto.startPosition);
        
        // Execute each action in sequence
        for (int i = 0; i < match.alliance.auto.actions.size(); i++) {
            if (!opModeIsActive()) break;
            
            Action action = match.alliance.auto.actions.get(i);
            
            // Update telemetry
            telemetry.clear();
            telemetry.addData("Status", "EXECUTING");
            telemetry.addData("Action", (i + 1) + "/" + match.alliance.auto.actions.size());
            telemetry.addData("Type", action.type);
            telemetry.addData("Label", action.label);
            telemetry.update();
            
            // Execute the action
            executeAction(action);
        }
    }
    
    // ========== Helper Methods ==========
    
    /**
     * Set robot start position
     */
    private void setRobotStartPosition(StartPosition position) {
        if (position.isCustom()) {
            // Use exact coordinates
            double x = position.getX();
            double y = position.getY();
            double theta = position.getTheta();
            
            telemetry.addData("Position", 
                String.format("Custom (%.1f, %.1f, %.0f°)", x, y, theta));
            
            // TODO: Set your robot's pose estimate
            // Example with RoadRunner:
            // drive.setPoseEstimate(new Pose2d(x, y, Math.toRadians(theta)));
            
        } else {
            // Map preset position
            telemetry.addData("Position", "Preset: " + position.type);
            
            // TODO: Map position type to coordinates
            // Example:
            // switch (position.type) {
            //     case "front":
            //         drive.setPoseEstimate(FRONT_START_POSE);
            //         break;
            //     case "back":
            //         drive.setPoseEstimate(BACK_START_POSE);
            //         break;
            //     // ... other positions
            // }
        }
        
        telemetry.update();
    }
    
    /**
     * Execute a single action
     */
    private void executeAction(Action action) {
        // Map action types to robot commands
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
                telemetry.addData("Warning", "Unknown action: " + action.type);
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
        
        telemetry.addData("Driving to", String.format("(%.1f, %.1f)", x, y));
        if (!target.isEmpty()) {
            telemetry.addData("Target", target);
        }
        telemetry.update();
        
        // TODO: Navigate to coordinates
        // Example with RoadRunner:
        // drive.followTrajectorySequence(
        //     drive.trajectorySequenceBuilder(drive.getPoseEstimate())
        //         .lineToLinearHeading(new Pose2d(x, y, drive.getPoseEstimate().getHeading()))
        //         .build()
        // );
        
        sleep(1000); // Placeholder
    }
    
    private void executeNearLaunch() {
        telemetry.addData("Executing", "Near Launch");
        telemetry.update();
        
        // TODO: Implement near launch sequence
        sleep(1000);
    }
    
    private void executeFarLaunch() {
        telemetry.addData("Executing", "Far Launch");
        telemetry.update();
        
        // TODO: Implement far launch sequence
        sleep(1000);
    }
    
    private void executeSpike(String spikeType) {
        // Extract spike number: "spike_1" -> "1"
        String spikeNum = spikeType.substring(6);
        
        telemetry.addData("Executing", "Spike " + spikeNum);
        telemetry.update();
        
        // TODO: Navigate to spike mark
        // Use spikeNum to determine which spike (1, 2, or 3)
        // May need to adjust based on alliance color
        // if (isRedAlliance()) {
        //     navigateToRedSpike(Integer.parseInt(spikeNum));
        // } else {
        //     navigateToBlueSpike(Integer.parseInt(spikeNum));
        // }
        
        sleep(1000);
    }
    
    private void executePark(String parkType) {
        boolean nearPark = parkType.contains("near");
        
        telemetry.addData("Executing", nearPark ? "Near Park" : "Far Park");
        telemetry.update();
        
        // TODO: Navigate to parking zone
        // May need to adjust based on alliance color
        // if (isRedAlliance()) {
        //     parkInRedZone(nearPark);
        // } else {
        //     parkInBlueZone(nearPark);
        // }
        
        sleep(1000);
    }
    
    private void executeDump() {
        telemetry.addData("Executing", "Dump");
        telemetry.update();
        
        // TODO: Execute dump mechanism
        sleep(1000);
    }
    
    private void executeCorner() {
        telemetry.addData("Executing", "Corner");
        telemetry.update();
        
        // TODO: Navigate to corner
        sleep(1000);
    }
    
    // ========== Optional: Custom file path ==========
    
    /**
     * Override to use a different file location
     * Uncomment to use custom path
     */
    // @Override
    // protected String getDataFilePath() {
    //     return "/sdcard/FIRST/my-custom-match-data.json";
    // }
}
