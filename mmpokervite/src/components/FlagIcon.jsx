import PropTypes from 'prop-types';
import { FLAG_COMPONENTS } from "../components/flags";

// Renders the flag icon based on the provided country code
// It has a default size of 24x24 pixels, which can be changed via the 'size' prop
function FlagIcon({ code, size = 24 }) {
    const Flag = FLAG_COMPONENTS[code?.toUpperCase()];
    if (!Flag) return null;
    return <Flag style={{ width: size, height: size }} />;
}
export default FlagIcon;

// Ensures that 'code' and 'size' props are passed correctly
FlagIcon.propTypes = {
    code: PropTypes.string.isRequired,
    size: PropTypes.number,
};