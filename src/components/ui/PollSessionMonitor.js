/**
 * Show temporary Estimate-Poll-Session Monitor on right side
 * => needs to be implemented in further sprint...
 */

import "styles/ui/PollSessionMonitor.scss"

export const PollSessionMonitor = props => {

    return (
        <div className="poll-session-monitor">
            <div className="poll-session-monitor psm-header">
                <h2>Estimate Poll Sessions</h2>
            </div>
            <div className="poll-session-monitor psm-body">
                <div className="poll-session-monitor psm-body psm-section">
                    <h3>Pending Invitations</h3>
                    <div>
                        <p className="no-session">No pending invitations</p>
                    </div>
                </div>
                <div className="poll-session-monitor psm-body psm-section">
                    <h3>Running Sessions</h3>
                    <div>
                        <p className="no-session">No running sessions</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
