import { FaPlus } from "react-icons/fa6";
import './Section.css';

// Section component to render a titled section with content or an empty state
const Section = ({ title, children, emptyMessage, onEmptyClick, outerContainer = true }) => {
  return outerContainer ? (
    <div className='section-container'>
      <h2 className='section-title roboto-bold'>{title}</h2>

      {children.length > 0 ? children : (
        <div className='section-empty' onClick={onEmptyClick}>
          <h3 className='fira-code'>{emptyMessage}</h3>

          <div className='empty-align'>
            <p className='roboto-medium'>Start a new journey today!</p>
            <FaPlus />
          </div>
        </div>
      )}
    </div>
  ) : (
    <>
      {children.length > 0 ? children : (
        <div className='section-empty' onClick={onEmptyClick}>
          <h3 className='fira-code'>{emptyMessage}</h3>

          <div className='empty-align'>
            <p className='roboto-medium'>Start a new journey today!</p>
            <FaPlus />
          </div>
        </div>
      )}
    </>
  );
}

export default Section;