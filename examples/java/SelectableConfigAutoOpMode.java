package org.firstinspires.ftc.teamcode.auto;

import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;

import org.firstinspires.ftc.teamcode.auto.config.Action;
import org.firstinspires.ftc.teamcode.auto.config.AutoConfigParser;
import org.firstinspires.ftc.teamcode.auto.config.Match;
import org.firstinspires.ftc.teamcode.auto.config.MatchDataConfig;
import org.firstinspires.ftc.teamcode.auto.config.StartPosition;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Base class for autonomous OpModes with interactive match selection
 * 
 * This base class provides:
 * - Interactive match selection using gamepad after INIT
 * - Display of all available matches from scanned data
 * - Confirmation before proceeding to hardware initialization
 * - Template methods for subclass customization
 * 
 * How to use:
 * 1. Extend this class in your autonomous OpMode
 * 2. Implement required abstract methods:
 *    - initializeHardware(Match)
 *    - executeAutonomous(Match)
 * 3. Optionally override:
 *    - onMatchSelected(Match) - for early initialization
 *    - getDataFilePath() - to use different file location
 * 
 * Example:
 * <pre>
 * {@code
 * @Autonomous(name = "My Auto", group = "Competition")
 * public class MyAuto extends SelectableConfigAutoOpMode {
 *     
 *     @Override
 *     protected void initializeHardware(Match match) {
 *         // Initialize your robot hardware here
 *         drive = new MecanumDrive(hardwareMap);
 *     }
 *     
 *     @Override
 *     protected void executeAutonomous(Match match) {
 *         // Execute autonomous sequence
 *         for (Action action : match.alliance.auto.actions) {
 *             executeAction(action);
 *         }
 *     }
 * }
 * }
 * </pre>
 * 
 * Controls during selection:
 * - DPAD UP/DOWN: Navigate match list
 * - A Button: Confirm selection
 * - Y Button: Refresh/reload match data
 * - Back Button: Show detailed info about selected match
 */
public abstract class SelectableConfigAutoOpMode extends LinearOpMode {
    
    // Configuration
    private static final String DEFAULT_DATA_FILE = "/sdcard/FIRST/match-data.json";
    
    // State
    private MatchDataConfig config;
    private List<Match> availableMatches;
    private int selectedIndex = 0;
    private boolean matchConfirmed = false;
    private Match selectedMatch;
    
    // Gamepad state tracking
    private boolean previousDpadUp = false;
    private boolean previousDpadDown = false;
    private boolean previousA = false;
    private boolean previousY = false;
    private boolean previousBack = false;
    
    @Override
    public final void runOpMode() throws InterruptedException {
        // Stage 1: Load match data
        telemetry.addData("Status", "Loading match data...");
        telemetry.update();
        
        if (!loadMatchData()) {
            // Error already displayed, wait for user to stop
            while (!isStopRequested()) {
                sleep(100);
            }
            return;
        }
        
        // Stage 2: Interactive match selection
        telemetry.addData("Status", "Select match configuration");
        telemetry.addData("", "Use DPAD UP/DOWN to navigate");
        telemetry.addData("", "Press A to confirm");
        telemetry.update();
        
        while (!matchConfirmed && !isStopRequested()) {
            handleMatchSelection();
            sleep(50); // Small delay to prevent rapid updates
        }
        
        if (isStopRequested()) return;
        
        // Stage 3: Match-specific initialization
        telemetry.clear();
        telemetry.addData("Status", "Match selected!");
        telemetry.addData("Match", selectedMatch.number);
        telemetry.addData("Alliance", selectedMatch.alliance.color.toUpperCase());
        telemetry.addLine();
        telemetry.addData("", "Performing match-specific initialization...");
        telemetry.update();
        
        // Call hook for early initialization based on selected match
        onMatchSelected(selectedMatch);
        
        // Stage 4: Initialize hardware
        telemetry.addData("Status", "Initializing hardware...");
        telemetry.update();
        
        initializeHardware(selectedMatch);
        
        // Stage 5: Display final configuration and wait for start
        displayFinalConfiguration();
        
        telemetry.addLine();
        telemetry.addData("Status", "? READY TO START");
        telemetry.addData("", "Press PLAY when ready");
        telemetry.update();
        
        waitForStart();
        
        if (!opModeIsActive()) return;
        
        // Stage 6: Execute autonomous
        telemetry.clear();
        telemetry.addData("Status", "RUNNING AUTONOMOUS");
        telemetry.addData("Match", selectedMatch.number);
        telemetry.update();
        
        executeAutonomous(selectedMatch);
        
        // Stage 7: Complete
        telemetry.addData("Status", "? AUTONOMOUS COMPLETE");
        telemetry.update();
    }
    
    /**
     * Load match data from file
     * @return true if successful, false on error
     */
    private boolean loadMatchData() {
        try {
            AutoConfigParser parser = new AutoConfigParser();
            config = parser.parseFile(getDataFilePath());
            
            if (config == null || config.matches == null || config.matches.isEmpty()) {
                telemetry.clear();
                telemetry.addData("ERROR", "No matches found");
                telemetry.addData("File", getDataFilePath());
                telemetry.addLine();
                telemetry.addData("Action", "Run Limelight QR Scanner first");
                telemetry.addData("", "or verify file path");
                telemetry.update();
                return false;
            }
            
            // Extract matches from wrappers
            availableMatches = new ArrayList<>();
            for (int i = 0; i < config.matches.size(); i++) {
                Match match = config.matches.get(i).match;
                if (match != null && match.alliance != null && match.alliance.auto != null) {
                    availableMatches.add(match);
                }
            }
            
            if (availableMatches.isEmpty()) {
                telemetry.clear();
                telemetry.addData("ERROR", "No valid matches found");
                telemetry.addData("Total entries", config.matches.size());
                telemetry.addLine();
                telemetry.addData("Action", "Check match data format");
                telemetry.update();
                return false;
            }
            
            return true;
            
        } catch (IOException e) {
            telemetry.clear();
            telemetry.addData("FILE ERROR", "");
            telemetry.addData("Message", e.getMessage());
            telemetry.addData("Path", getDataFilePath());
            telemetry.addLine();
            telemetry.addData("Solutions", "");
            telemetry.addData("1.", "Run Limelight QR Scanner OpMode");
            telemetry.addData("2.", "Verify file path is correct");
            telemetry.addData("3.", "Check SD card is readable");
            telemetry.update();
            return false;
            
        } catch (Exception e) {
            telemetry.clear();
            telemetry.addData("PARSE ERROR", "");
            telemetry.addData("Message", e.getMessage());
            telemetry.addLine();
            telemetry.addData("Action", "Rescan QR codes or check format");
            telemetry.update();
            return false;
        }
    }
    
    /**
     * Handle interactive match selection with gamepad
     */
    private void handleMatchSelection() {
        // Detect button presses (only on button down, not held)
        boolean dpadUpPressed = gamepad1.dpad_up && !previousDpadUp;
        boolean dpadDownPressed = gamepad1.dpad_down && !previousDpadDown;
        boolean aPressed = gamepad1.a && !previousA;
        boolean yPressed = gamepad1.y && !previousY;
        boolean backPressed = gamepad1.back && !previousBack;
        
        // Update previous button states
        previousDpadUp = gamepad1.dpad_up;
        previousDpadDown = gamepad1.dpad_down;
        previousA = gamepad1.a;
        previousY = gamepad1.y;
        previousBack = gamepad1.back;
        
        // Handle navigation
        if (dpadUpPressed) {
            selectedIndex--;
            if (selectedIndex < 0) {
                selectedIndex = availableMatches.size() - 1; // Wrap to bottom
            }
        } else if (dpadDownPressed) {
            selectedIndex++;
            if (selectedIndex >= availableMatches.size()) {
                selectedIndex = 0; // Wrap to top
            }
        }
        
        // Handle reload
        if (yPressed) {
            telemetry.clear();
            telemetry.addData("Status", "Reloading match data...");
            telemetry.update();
            
            if (loadMatchData()) {
                selectedIndex = 0; // Reset selection
                telemetry.addData("Success", "Match data reloaded");
                telemetry.addData("Matches", availableMatches.size());
            }
            telemetry.update();
            sleep(1000);
        }
        
        // Handle detail view
        if (backPressed) {
            showMatchDetails(availableMatches.get(selectedIndex));
            return; // Don't update main display this frame
        }
        
        // Handle confirmation
        if (aPressed) {
            selectedMatch = availableMatches.get(selectedIndex);
            matchConfirmed = true;
            return;
        }
        
        // Update display
        displayMatchSelection();
    }
    
    /**
     * Display match selection interface
     */
    private void displayMatchSelection() {
        telemetry.clear();
        telemetry.addData("??? SELECT MATCH ???", "");
        telemetry.addLine();
        
        // Display match list
        int startIdx = Math.max(0, selectedIndex - 2);
        int endIdx = Math.min(availableMatches.size(), startIdx + 5);
        
        for (int i = startIdx; i < endIdx; i++) {
            Match match = availableMatches.get(i);
            String prefix = (i == selectedIndex) ? "? " : "  ";
            String matchInfo = String.format("Match %d - %s Alliance", 
                match.number, 
                match.alliance.color.toUpperCase());
            
            if (i == selectedIndex) {
                telemetry.addData(prefix, matchInfo);
                
                // Show additional info for selected match
                if (match.alliance.team_number > 0) {
                    telemetry.addData("", "  Partner: " + match.alliance.team_number);
                }
                telemetry.addData("", "  Start: " + 
                    (match.alliance.auto.startPosition.isCustom() ? "Custom" : 
                     match.alliance.auto.startPosition.type));
                telemetry.addData("", "  Actions: " + match.alliance.auto.actions.size());
            } else {
                telemetry.addData(prefix, matchInfo);
            }
        }
        
        // Show scroll indicators
        if (startIdx > 0) {
            telemetry.addData("", "? More above");
        }
        if (endIdx < availableMatches.size()) {
            telemetry.addData("", "? More below");
        }
        
        telemetry.addLine();
        telemetry.addData("??? CONTROLS ???", "");
        telemetry.addData("DPAD ?/?", "Navigate");
        telemetry.addData("A Button", "Confirm selection");
        telemetry.addData("Y Button", "Reload data");
        telemetry.addData("BACK", "View details");
        telemetry.addLine();
        telemetry.addData("Available", availableMatches.size() + " match(es)");
        telemetry.addData("Selected", (selectedIndex + 1) + " of " + availableMatches.size());
        
        telemetry.update();
    }
    
    /**
     * Show detailed information about a match
     */
    private void showMatchDetails(Match match) {
        telemetry.clear();
        telemetry.addData("??? MATCH DETAILS ???", "");
        telemetry.addLine();
        
        telemetry.addData("Match Number", match.number);
        telemetry.addData("Alliance", match.alliance.color.toUpperCase());
        telemetry.addData("Partner Team", 
            match.alliance.team_number > 0 ? 
                match.alliance.team_number : "Not specified");
        
        telemetry.addLine();
        
        // Start position
        StartPosition start = match.alliance.auto.startPosition;
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
        int actionCount = match.alliance.auto.actions.size();
        telemetry.addData("Actions", actionCount);
        
        int displayCount = Math.min(4, actionCount);
        for (int i = 0; i < displayCount; i++) {
            Action action = match.alliance.auto.actions.get(i);
            telemetry.addData("  " + (i + 1), action.label);
        }
        if (actionCount > 4) {
            telemetry.addData("  ...", "+" + (actionCount - 4) + " more");
        }
        
        telemetry.addLine();
        telemetry.addData("", "Press BACK to return");
        
        telemetry.update();
        
        // Wait for button release and press again
        while (gamepad1.back && !isStopRequested()) {
            sleep(50);
        }
        while (!gamepad1.back && !isStopRequested()) {
            sleep(50);
        }
        while (gamepad1.back && !isStopRequested()) {
            sleep(50);
        }
    }
    
    /**
     * Display final configuration before start
     */
    private void displayFinalConfiguration() {
        telemetry.clear();
        telemetry.addData("??? READY TO START ???", "");
        telemetry.addLine();
        
        telemetry.addData("Match", selectedMatch.number);
        telemetry.addData("Alliance", selectedMatch.alliance.color.toUpperCase());
        
        if (selectedMatch.alliance.team_number > 0) {
            telemetry.addData("Partner", selectedMatch.alliance.team_number);
        }
        
        telemetry.addLine();
        
        StartPosition start = selectedMatch.alliance.auto.startPosition;
        if (start.isCustom()) {
            telemetry.addData("Start", String.format("Custom (%.1f, %.1f, %.0f°)",
                start.getX(), start.getY(), start.getTheta()));
        } else {
            telemetry.addData("Start", start.type);
        }
        
        telemetry.addData("Actions", selectedMatch.alliance.auto.actions.size());
        
        telemetry.update();
    }
    
    // ========== Template Methods ==========
    // Subclasses must implement these
    
    /**
     * Initialize robot hardware after match is selected
     * This is called after the user confirms their match selection
     * but before waitForStart()
     * 
     * @param match The selected match configuration
     */
    protected abstract void initializeHardware(Match match);
    
    /**
     * Execute the autonomous sequence
     * This is called after the match starts (after waitForStart())
     * 
     * @param match The selected match configuration
     */
    protected abstract void executeAutonomous(Match match);
    
    // ========== Optional Overrides ==========
    
    /**
     * Called immediately after match is selected, before hardware initialization
     * Override this to perform early initialization that depends on match config
     * (e.g., loading trajectories specific to the alliance color)
     * 
     * @param match The selected match configuration
     */
    protected void onMatchSelected(Match match) {
        // Default: do nothing
        // Subclasses can override to add custom behavior
    }
    
    /**
     * Get the file path for match data
     * Override this to use a different file location
     * 
     * @return Path to match data JSON file
     */
    protected String getDataFilePath() {
        return DEFAULT_DATA_FILE;
    }
    
    // ========== Utility Methods ==========
    // Available to subclasses for common operations
    
    /**
     * Get the currently selected match
     * Useful in initializeHardware and executeAutonomous
     * 
     * @return The selected match configuration
     */
    protected final Match getSelectedMatch() {
        return selectedMatch;
    }
    
    /**
     * Check if this is a red alliance match
     * 
     * @return true if red alliance
     */
    protected final boolean isRedAlliance() {
        return selectedMatch != null && 
               "red".equalsIgnoreCase(selectedMatch.alliance.color);
    }
    
    /**
     * Check if this is a blue alliance match
     * 
     * @return true if blue alliance
     */
    protected final boolean isBlueAlliance() {
        return selectedMatch != null && 
               "blue".equalsIgnoreCase(selectedMatch.alliance.color);
    }
    
    /**
     * Get start position from selected match
     * 
     * @return Start position configuration
     */
    protected final StartPosition getStartPosition() {
        return selectedMatch != null ? 
               selectedMatch.alliance.auto.startPosition : null;
    }
    
    /**
     * Get actions list from selected match
     * 
     * @return List of actions to execute
     */
    protected final List<Action> getActions() {
        return selectedMatch != null ? 
               selectedMatch.alliance.auto.actions : null;
    }
}
