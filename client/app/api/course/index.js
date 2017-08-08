import AchievementsAPI from './Achievements';
import AssessmentAPI from './Assessment';
import CommentsAPI from './Comments';
import VirtualClassroomsAPI from './VirtualClassrooms';
import MaterialsAPI from './Materials';
import MaterialFoldersAPI from './MaterialFolders';
import LessonPlanAPI from './LessonPlan';
import SurveyAPI from './Survey';
import AdminAPI from './Admin';
import ScribingQuestionAPI from './Assessment/question/scribing';
import ScribingAnswerAPI from './assessment/submission/answer/scribing';

const CourseAPI = {
  achievements: new AchievementsAPI(),
  assessment: AssessmentAPI,
  comments: new CommentsAPI(),
  virtualClassrooms: new VirtualClassroomsAPI(),
  materials: new MaterialsAPI(),
  materialFolders: new MaterialFoldersAPI(),
  lessonPlan: new LessonPlanAPI(),
  survey: SurveyAPI,
  admin: AdminAPI,
  question: {
    scribing: ScribingQuestionAPI,
  },
  answer: {
    scribing: ScribingAnswerAPI,
  },
};

Object.freeze(CourseAPI);

export default CourseAPI;
