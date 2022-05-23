import {ReactComponent as Rating_0} from "images/ratings/rating-0.svg";
import {ReactComponent as Rating_1} from "images/ratings/rating-1.svg";
import {ReactComponent as Rating_2} from "images/ratings/rating-2.svg";
import {ReactComponent as Rating_3} from "images/ratings/rating-3.svg";
import {ReactComponent as Rating_4} from "images/ratings/rating-4.svg";
import {ReactComponent as Rating_5} from "images/ratings/rating-5.svg";

export const RatingDisplay = props => {

    let ratingImageSources = [
        <Rating_0 />,
        <Rating_1 />,
        <Rating_2 />,
        <Rating_3 />,
        <Rating_4 />,
        <Rating_5 />
        ];

    // Assign score and check for boundaries
    let score = props.score ? props.score : 0;
    // score must be in range [0..5]
    score = score < 0 ? 0 : score;
    score = score > 5 ? 5 : score;

    return (
        <div className="ratingDisplay">
            {ratingImageSources[score]}
        </div>
    );
}