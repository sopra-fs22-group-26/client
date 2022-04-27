import React from "react";
import 'styles/ui/EstimateTotal.scss';

export const EstimateTotals = props => (
    <div className="estimate-total-container">
        <h3>Your Total Estimate:</h3>
        <div className="estimate-dataset">
            <div>Current week:</div>
            <div>{props.currentWeek} h</div>
        </div>
        <div className="estimate-dataset">
            <div>Overall:</div>
            <div>{props.total} h</div>
        </div>
    </div>
);
