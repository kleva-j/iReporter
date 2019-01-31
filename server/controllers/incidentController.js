/* eslint-disable consistent-return */
import db from '../models/db';
import { sendJsonResponse } from '../utils/sanitizer';

const { log } = console;

/**
 * @class IncidentController
 * @classdesc Implements red-flag creation, edition and deletion
 */
class IncidentController {
  /**
   * Create a red-flag incident
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {object} The created incident record
   * @memberof IncidentController
   */
  static createRecord(req, res) {
    let images; let videos; const { type } = req.body;
    if (req.files) {
      images = (req.files.filter(item => item.mimetype.includes('image')).map(img => img.path)) || [];
      videos = (req.files.filter(item => item.mimetype.includes('video')).map(vid => vid.path)) || [];
    } else images = req.body.images || []; videos = req.body.videos || [];

    const newRecord = {
      createdby: req.auth.userId,
      type: req.body.type,
      location: req.body.location,
      images,
      videos,
      comment: req.body.comment,
    };

    db.incidents.createIncident(newRecord)
      .then((result) => {
        if (result) {
          return sendJsonResponse(res, 201, 'success', [{
            id: result.id,
            message: `Created new ${type} record`,
          }]);
        }
      });
  }

  /**
   * Get a specific red-flag incident
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {object} token or message
   * @memberof IncidentController
   */
  static getSpecificRedFlag(req, res) {
    const { id } = req.params;

    db.incidents.getById(id)
      .then((result) => {
        if (result) {
          return sendJsonResponse(res, 200, 'success', [result]);
        }
        return sendJsonResponse(res, 404, 'error', `Red-flag with id of ${id} was not found`);
      }).catch(err => log(err));
  }

  /**
   * Get all red-flag incidents
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {object} token or message
   * @memberof IncidentController
   */
  static getAllRecords(req, res) {
    if (req.auth.isadmin === true) {
      db.incidents.getAllRecords()
        .then(results => res.status(200).json({
          status: 200,
          data: results,
        })).catch(err => log(err));
    } else {
      return res.status(403).json({
        status: 403,
        error: 'Unauthorized, this requires admin access',
      });
    }
  }

  /**
   * Get all redflag records
   *
   * @static
   * @param {object} req - the request object
   * @param {object} res - the reponse object
   * @return {object} An array of red-flag records
   * @memberof IncidentController
   */
  static getUserRedflags(req, res) {
    const id = req.auth.userId;

    if (req.auth.isadmin === true) {
      db.incidents.getAllRedflags()
        .then(redflags => res.status(200).json({
          status: 200,
          data: redflags,
        }));
    } else {
      db.incidents.getUserRedflags(id)
        .then(results => res.status(200).json({
          status: 200,
          data: results,
        })).catch(err => log(err));
    }
  }

  /**
   * Get an Intervention record
   *
   * @static
   * @param {object} req - the request object
   * @param {object} res - the reponse object
   * @return {object} An array of intervention records
   * @memberof IncidentController
   */
  static getUserInterventions(req, res) {
    const id = req.auth.userId;

    if (req.auth.isadmin === true) {
      db.incidents.getAllInterventions()
        .then(interventions => res.status(200).json({
          status: 200,
          data: interventions,
        }));
    } else {
      db.incidents.getUserInterventions(id)
        .then(results => res.status(200).json({
          status: 200,
          data: results,
        })).catch(err => log(err));
    }
  }

  /**
   * Delete a red-flag incident
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {object} token or message
   * @memberof IncidentController
   */
  static deleteRedFlag(req, res) {
    if (!req.params.id) return sendJsonResponse(res, 403, 'error', 'Record id was not found');

    const { id } = req.params;

    db.task('delete incidents', t => t.incidents.getById(id)
      .then((results) => {
        if (results) {
          if (req.auth.userId === results.createdby) {
            return t.incidents.deleteRecord(id)
              .then(() => res.status(200).json({
                status: 200,
                data: [{
                  id: results.id,
                  message: `${results.type} record with id of ${results.id} has been deleted successfully`,
                }],
              }));
          } return sendJsonResponse(res, 403, 'error', 'Unauthorized, this record does not belong to this user');
        } return sendJsonResponse(res, 404, 'error', `Record with id of ${id} was not found`);
      }));
  }

  /**
   * Update a red-flag comment
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {object} A json object of the results
   * @memberof IncidentController
   */
  static updateRedFlagComment(req, res) {
    let { id } = req.params; const { comment } = req.body;
    id = parseInt(id, 10);

    db.task('update comment', t => t.incidents.getById(id)
      .then((result) => {
        if (result) {
          const userId = parseInt(req.auth.userId, 10);
          if (userId === result.createdby) {
            return t.incidents.updateARecordComment(comment, id)
              .then(() => sendJsonResponse(res, 200, 'success', [{
                id,
                message: 'Updated record comment',
              }]));
          } return sendJsonResponse(res, 403, 'error', 'Unauthorized, this record does not belong to this user');
        } return sendJsonResponse(res, 404, 'error', `Record with id of ${id} was not found`);
      }));
  }

  /**
   * Update a red-flag comment
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {object} token or message
   * @memberof IncidentController
   */
  static updateRedFlagLocation(req, res) {
    let { id } = req.params; const { location } = req.body;
    id = parseInt(id, 10);

    db.task('update location', t => t.incidents.getById(id)
      .then((result) => {
        if (result) {
          const userId = parseInt(req.auth.userId, 10);
          if (userId === result.createdby) {
            return t.incidents.updateARecordLocation(location, id)
              .then(() => sendJsonResponse(res, 200, 'success', [{
                id,
                message: 'Updated record location',
              }]));
          } return sendJsonResponse(res, 403, 'error', 'Unauthorized, this record does not belong to this user');
        } return sendJsonResponse(res, 404, 'error', `Record with id of ${id} was not found`);
      }));
  }

  /**
   * Admin can update the status of a red-flag
   *
   * @static
   * @param {object} req - the reequest object
   * @param {object} res - The response object
   * @return {object} a json object
   * @memberof IncidentController
   */
  static updateRedFlagStatus(req, res) {
    let { id } = req.params; const { status } = req.body; id = parseInt(id, 10);
    if (req.auth.isadmin === false) {
      return sendJsonResponse(res, 403, 'error', 'Unauthorized, Admin access required');
    }

    db.task('update status', t => t.incidents.getById(id)
      .then((result) => {
        if (result) {
          const AcceptedStatus = ['under investigation', 'rejected', 'resolved'];
          if (AcceptedStatus.indexOf(status) === -1) {
            return sendJsonResponse(res, 400, 'error', 'User record status can either be updated to under investigation, rejected or resolved');
          }
          return t.incidents.updateARecordStatus(status, id)
            .then(response => sendJsonResponse(res, 200, 'success', [{
              id: response.id,
              message: `User's ${result.type} status has been updated`,
            }]));
        } return sendJsonResponse(res, 404, 'error', `Red-flag with id of ${id} was not found`);
      }));
  }

  /**
   * Update the evidence of a single record of an incident
   *
   * @static
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} a token or message
   * @memberof IncidentController
   */
  static updateImage(req, res) {
    const { file } = req; let { id } = req.params; id = parseInt(id, 10);
    db.task('update image', t => t.getById(id)
      .then((result) => {
        if (result) {
          if (req.auth.userId === result.id) {
            return t.updateImage(file.path, id)
              .then(response => sendJsonResponse(res, 200, 'success', [{
                id: response.id,
                message: `Updated ${result.type} image evidence`,
              }]));
          } return sendJsonResponse(res, 403, 'error', 'Unauthorized, this record does not belong to you');
        } return sendJsonResponse(res, 404, 'error', `Record with id of ${id} was not found`);
      }));
  }
}

export default IncidentController;
