import AssessmentsAPI from './Assessments';
import VirtualClassroomsAPI from './VirtualClassrooms';
import MaterialsAPI from './Materials';
import MaterialFoldersAPI from './MaterialFolders';
import LessonPlanAPI from './LessonPlan';
import SurveyAPI from './Survey';
import ScribingAnswerAPI from './assessment/submission/answer/scribing';

const CourseAPI = {
  assessments: new AssessmentsAPI(),
  virtualClassrooms: new VirtualClassroomsAPI(),
  materials: new MaterialsAPI(),
  materialFolders: new MaterialFoldersAPI(),
  lessonPlan: new LessonPlanAPI(),
  survey: SurveyAPI,
  answer: {
    scribing: ScribingAnswerAPI,
  }
};

Object.freeze(CourseAPI);

export default CourseAPI;
