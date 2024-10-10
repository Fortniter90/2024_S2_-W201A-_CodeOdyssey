import { useParams } from 'react-router-dom';
import TestSystem from './TestSystem';
import NavigationBarUser from '../components/NavigationBarUser';

const TestTemplate = () => {
  const { courseId, lessonId } = useParams();

  return (
    <div>
        <NavigationBarUser />
        <TestSystem courseId={courseId} lessonId={lessonId} />
    </div>
  );
};

export default TestTemplate;