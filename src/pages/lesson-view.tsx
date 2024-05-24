import { useParams } from 'react-router-dom';
import TranslatorLibrary from '../components/lesson-test';
import { convertBase64ToBlob } from '../utils/audio-parser';

type LessonViewProps = {
    currLesson: string | undefined;
}

const LessonView = ({ currLesson }: LessonViewProps) => {
    const { id } = useParams<{ id: string }>();

    const asd = currLesson ? convertBase64ToBlob(currLesson) : undefined;

    return <div>
        <TranslatorLibrary audioBlob={asd} />

        Lesson Page for lesson {id}</div>;
}

export default LessonView;
