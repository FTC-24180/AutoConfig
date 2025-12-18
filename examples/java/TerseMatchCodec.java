package org.firstinspires.ftc.teamcode.auto.config;

import java.util.ArrayList;
import java.util.List;

/**
 * Ultra-compact match data codec for QR v4 (100 byte limit)
 * 
 * Format: {n}[R|B]S{startPos}[W{sec}|A{actionId}]*
 * 
 * Example: 5RS1W1A1A3A1A4W1A1A5A1A6
 *   5          = Match 5
 *   R          = Red alliance
 *   S1         = Start position 1
 *   W1         = Wait 1 second
 *   A1         = Action 1
 *   A3         = Action 3
 *   ...
 * 
 * Components:
 *   {n}        = Match number (required, no prefix)
 *   [R|B]      = Alliance color: R=red, B=blue (required)
 *   S{n}       = Start position ID (required)
 *   W{sec}     = Wait action in seconds (optional, repeatable, integer only)
 *   A{n}       = Action by ID (optional, repeatable)
 * 
 * Note: Wait times are in integer seconds only. No fractional seconds.
 */
public class TerseMatchCodec {
    
    /**
     * Encode a match to terse format
     * @param match Match to encode
     * @return Terse string (typically 10-40 bytes)
     */
    public static String encode(MatchDataConfig.Match match) {
        StringBuilder sb = new StringBuilder();
        
        // Match number (no M prefix)
        sb.append(match.number);
        
        if (match.alliance != null) {
            // Alliance color: R or B
            char color = match.alliance.color.toLowerCase().charAt(0);
            sb.append(color == 'r' ? 'R' : 'B');
            
            if (match.alliance.auto != null) {
                // Start position: S{id}
                if (match.alliance.auto.startPosition != null) {
                    sb.append("S").append(encodeStartPosition(match.alliance.auto.startPosition));
                }
                
                // Actions: sequence of W{sec} or A{n}
                if (match.alliance.auto.actions != null) {
                    for (MatchDataConfig.Action action : match.alliance.auto.actions) {
                        if ("wait".equals(action.type)) {
                            // Wait: W{seconds} - convert from milliseconds, round to nearest second
                            int waitTimeMs = action.getConfigInt("waitTime", 1000);
                            int waitTimeSec = Math.round(waitTimeMs / 1000.0f);
                            sb.append("W").append(waitTimeSec);
                        } else {
                            // Action: A{id}
                            sb.append("A").append(getActionId(action.type));
                        }
                    }
                }
            }
        }
        
        return sb.toString();
    }
    
    /**
     * Decode terse format to match
     * @param terse Terse string
     * @return Decoded match
     */
    public static MatchDataConfig.Match decode(String terse) {
        MatchDataConfig.Match match = new MatchDataConfig.Match();
        match.alliance = new MatchDataConfig.Alliance();
        match.alliance.auto = new MatchDataConfig.Autonomous();
        match.alliance.team_number = 0; // Not stored in terse format
        
        int i = 0;
        
        // Parse match number (no prefix)
        int numEnd = findNextLetter(terse, i);
        match.number = Integer.parseInt(terse.substring(i, numEnd));
        i = numEnd;
        
        // Parse alliance color: R or B
        if (i < terse.length()) {
            char colorChar = terse.charAt(i);
            match.alliance.color = colorChar == 'R' ? "red" : "blue";
            i++;
        }
        
        // Parse start position: S{n}
        if (i < terse.length() && terse.charAt(i) == 'S') {
            i++;
            numEnd = findNextLetter(terse, i);
            int startPosId = Integer.parseInt(terse.substring(i, numEnd));
            match.alliance.auto.startPosition = decodeStartPosition(startPosId);
            i = numEnd;
        }
        
        // Parse actions: [W{sec}|A{n}]*
        match.alliance.auto.actions = new ArrayList<>();
        
        while (i < terse.length()) {
            char actionChar = terse.charAt(i);
            i++;
            
            if (actionChar == 'W') {
                // Wait action: W{seconds} - convert to milliseconds
                numEnd = findNextLetter(terse, i);
                int waitTimeSec = Integer.parseInt(terse.substring(i, numEnd));
                int waitTimeMs = waitTimeSec * 1000;
                
                MatchDataConfig.Action waitAction = new MatchDataConfig.Action();
                waitAction.type = "wait";
                waitAction.label = "Wait";
                waitAction.config = new java.util.HashMap<>();
                waitAction.config.put("waitTime", waitTimeMs);
                
                match.alliance.auto.actions.add(waitAction);
                i = numEnd;
                
            } else if (actionChar == 'A') {
                // Regular action: A{id}
                numEnd = findNextLetter(terse, i);
                int actionId = Integer.parseInt(terse.substring(i, numEnd));
                
                MatchDataConfig.Action action = decodeActionFromId(actionId);
                match.alliance.auto.actions.add(action);
                i = numEnd;
            }
        }
        
        return match;
    }
    
    /**
     * Encode start position to ID
     * Maps position type to numeric ID
     */
    private static int encodeStartPosition(MatchDataConfig.StartPosition pos) {
        String type = pos.type.toLowerCase();
        switch (type) {
            case "front": return 1;
            case "back": return 2;
            case "left": return 3;
            case "right": return 4;
            case "custom": return 9; // Custom with coordinates
            default: return 1;
        }
    }
    
    /**
     * Decode start position from ID
     */
    private static MatchDataConfig.StartPosition decodeStartPosition(int id) {
        MatchDataConfig.StartPosition pos = new MatchDataConfig.StartPosition();
        switch (id) {
            case 1: pos.type = "front"; break;
            case 2: pos.type = "back"; break;
            case 3: pos.type = "left"; break;
            case 4: pos.type = "right"; break;
            case 9: pos.type = "custom"; break;
            default: pos.type = "front";
        }
        return pos;
    }
    
    /**
     * Get numeric ID for action type
     * Standard action IDs for common FTC actions
     */
    private static int getActionId(String actionType) {
        switch (actionType) {
            case "near_launch": return 1;
            case "far_launch": return 2;
            case "spike_1": return 3;
            case "spike_2": return 4;
            case "spike_3": return 5;
            case "near_park": return 6;
            case "far_park": return 7;
            case "dump": return 8;
            case "corner": return 9;
            case "drive_to": return 10;
            default: return 99; // Unknown action
        }
    }
    
    /**
     * Decode action from ID
     */
    private static MatchDataConfig.Action decodeActionFromId(int id) {
        MatchDataConfig.Action action = new MatchDataConfig.Action();
        
        switch (id) {
            case 1:
                action.type = "near_launch";
                action.label = "Near Launch";
                break;
            case 2:
                action.type = "far_launch";
                action.label = "Far Launch";
                break;
            case 3:
                action.type = "spike_1";
                action.label = "Spike 1";
                break;
            case 4:
                action.type = "spike_2";
                action.label = "Spike 2";
                break;
            case 5:
                action.type = "spike_3";
                action.label = "Spike 3";
                break;
            case 6:
                action.type = "near_park";
                action.label = "Near Park";
                break;
            case 7:
                action.type = "far_park";
                action.label = "Far Park";
                break;
            case 8:
                action.type = "dump";
                action.label = "Dump";
                break;
            case 9:
                action.type = "corner";
                action.label = "Corner";
                break;
            case 10:
                action.type = "drive_to";
                action.label = "Drive To";
                break;
            default:
                action.type = "unknown";
                action.label = "Unknown";
        }
        
        return action;
    }
    
    /**
     * Find next letter in string (not digit)
     */
    private static int findNextLetter(String s, int start) {
        for (int i = start; i < s.length(); i++) {
            if (!Character.isDigit(s.charAt(i))) {
                return i;
            }
        }
        return s.length();
    }
    
    /**
     * Encode a MatchDataConfig (single match) to terse format
     */
    public static String encodeConfig(MatchDataConfig config) {
        if (config == null || config.matches == null || config.matches.isEmpty()) {
            return "";
        }
        
        // Encode first match only
        MatchDataConfig.MatchWrapper wrapper = config.matches.get(0);
        return wrapper.match != null ? encode(wrapper.match) : "";
    }
    
    /**
     * Decode terse format to MatchDataConfig
     */
    public static MatchDataConfig decodeConfig(String terse) {
        MatchDataConfig config = new MatchDataConfig();
        config.version = "1.0.0";
        config.matches = new ArrayList<>();
        
        MatchDataConfig.MatchWrapper wrapper = new MatchDataConfig.MatchWrapper();
        wrapper.match = decode(terse);
        
        config.matches.add(wrapper);
        return config;
    }
}
