/**
 * This helper function extracts the initials from a name.
 * If the name has >= 2 parts, it takes the first letters from the first 2 words.
 * Otherwise just the first 2 letters.
 * @param name {String}
 * @returns {String}
 */
export const initialsOf = (name) => {
    let userIconInitials;
    let name_parts = name.split(" ");

    if(name_parts.length > 1){
        userIconInitials = (name_parts[0][0] + name_parts[1][0]);
    }
    else {
        if (name_parts[0].length > 1){
            userIconInitials = name_parts[0].substring(0,2);
        }
        else {
            userIconInitials = name_parts[0][0];
        }
    }
    return userIconInitials.toUpperCase();
}
