import ScribingsAPI from './Scribing';
import ResponsesAPI from './Responses';

const ScribingAPI = {
  scribings: new ScribingsAPI(),
  responses: new ResponsesAPI(),
};

Object.freeze(ScribingAPI);

export default ScribingAPI;
