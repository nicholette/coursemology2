import AssessmentsAPI from './Assessments';
import VirtualClassroomsAPI from './VirtualClassrooms';
import MaterialsAPI from './Materials';
import MaterialFoldersAPI from './MaterialFolders';
import SurveyAPI from './Survey';
import ScribingQuestionAPI from './assessment/question/scribing';
import ScribingAnswerAPI from './assessment/submission/answer/scribing';

const CourseAPI = {
  assessments: new AssessmentsAPI(),
  virtualClassrooms: new VirtualClassroomsAPI(),
  materials: new MaterialsAPI(),
  materialFolders: new MaterialFoldersAPI(),
  survey: SurveyAPI,
  question: {
    scribing: ScribingQuestionAPI,
  },
  answer: {
    scribing: ScribingAnswerAPI,
  }
};

Object.freeze(CourseAPI);

export default CourseAPI;
