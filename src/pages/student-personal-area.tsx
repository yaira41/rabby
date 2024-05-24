import LessonView from "./lesson-view";

type StudentPersonalAreaProps = {
    currLesson: string | undefined;
}

const StudentPersonalArea = ({ currLesson }: StudentPersonalAreaProps) => {


    return <div>אזור אישי לתלמיד

        <LessonView currLesson={currLesson} />


    </div>;
}

export default StudentPersonalArea;
