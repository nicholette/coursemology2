import axios from 'axios';
import BaseAPI from './Base';
import { csrfToken } from 'lib/helpers/server-context';

export default class AttachmentAPI extends BaseAPI {
  // TODO: edit comment
  /**
  * Upload the attachment.
  *
  * @param {object} attachment
  * @return {Promise}
  * success response: {
  *   success: bool,
  *   url: string,
  *   id: int,
  * }
  * error response: {}
  */
  upload(attachment) {
    const config = { 
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'file_types',
      }
    };

    let formData = new FormData();
    formData.append('file', attachment);
    return this.getClient().post('/attachments', formData, config);
  }
}
