export const CourseItem = ({ course }) => {
    return (
        <div className='recent-levels' style={{ backgroundImage: `linear-gradient(var(--${course.color}-light), var(--${course.color}-medium), var(--${course.color}-dark))` }}>

        </div>
    );
}