/* eslint-disable consistent-return */
import db from '../models/db';

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
    const newRecord = {
      createdby: req.body.createdBy,
      type: req.body.type,
      location: req.body.location,
      images: req.body.images,
      videos: req.body.videos,
      comment: req.body.comment,
    };

    const { type } = req.body;
    db.incidents.createIncident(newRecord)
      .then((result) => {
        if (result) {
          return res.status(201).json({
            status: 201,
            data: [{
              id: result.id,
              message: `Created new ${type} record`,
            }],
          });
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
          return res.status(200).json({
            status: 200,
            data: [result],
          });
        }
        return res.status(404).json({
          status: 404,
          error: `Red-flag with id of ${id} was not found`,
        });
      }).catch(err => log(err));
  }

  /**
   * Get all red-flag incidents
   *
   * @static
   * @param {object} _req - The request object
   * @param {object} res - The response object
   * @return {object} token or message
   * @memberof IncidentController
   */
  static getAllRecords(_req, res) {
    db.incidents.getAllRecords()
      .then(results => res.status(200).json({
        status: 200,
        data: results,
      })).catch(err => log(err));
  }

  /**
   * @static getAllRedflag
   * @param {object} _req - the request object
   * @param {object} res - the reponse object
   * @return {object} An array of red-flag records
   * @memberof IncidentController
   */
  static getAllRedflags(_req, res) {
    db.incidents.getAllRedflags()
      .then(results => res.status(200).json({
        status: 200,
        data: results,
      })).catch(err => log(err));
  }

  /**
   * @static getAllInterventions
   * @param {object} _req - the request object
   * @param {object} res - the reponse object
   * @return {object} An array of intervention records
   * @memberof IncidentController
   */
  static getAllInterventions(_req, res) {
    db.incidents.getAllInterventions()
      .then(results => res.status(200).json({
        status: 200,
        data: results,
      }));
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
    if (!req.params.id) {
      return res.status(404).json({
        status: 403,
        message: 'Record id was not found',
      });
    }

    const { id } = req.params;

    db.task('delete incidents', t => t.incidents.getById(id)
      .then((results) => {
        if (results) {
          return t.incidents.deleteRecord(id)
            .then(() => res.status(200).json({
              status: 200,
              data: [{
                id: results.id,
                message: `${results.type} record with id of ${results.id} has been deleted successfully`,
              }],
            }));
        }
        return res.status(404).json({
          status: 404,
          error: `Record with id of ${id} was not found`,
        });
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
    let { id } = req.params;
    const { comment } = req.body;
    id = parseInt(id, 10);

    db.task('update comment', t => t.incident.getById(id)
      .then((result) => {
        if (result) {
          return t.incidents.updateARecordComment(comment, id)
            .then(() => res.status(200).json({
              status: 200,
              data: [{
                id,
                message: 'Updated record comment',
              }],
            }));
        }
        return res.status(404).json({
          status: 404,
          error: `Record with id of ${id} was not found`,
        });
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
    let { id } = req.params;
    const { location } = req.body;
    id = parseInt(id, 10);

    db.task('update location', t => t.incidents.getById(id)
      .then((result) => {
        if (result) {
          return t.incidents.updateARecordLocation(location, id)
            .then(() => res.status(200).json({
              status: 200,
              data: [{
                id,
                message: 'Updated record location',
              }],
            }));
        }
        return res.status(404).json({
          status: 404,
          error: `Record with id of ${id} was not found`,
        });
      }));
  }

  /**
   * Admin can update the status of a red-flag
   *
   * @static
   * @param {object} req - the reequest object
   * @param {object} res - The response object
   * @return {object} a token or message
   * @memberof IncidentController
   */
  static updateRedFlagStatus(req, res) {
    let { id } = req.params;
    id = parseInt(id, 10);

    if (!req.body.status) {
      return res.status(400).json({
        status: 400,
        error: 'Status was not sent in the request',
      });
    }

    const { status } = req.body;

    db.task('update status', t => t.incident.getById(id)
      .then((result) => {
        if (result) {
          const AcceptedStatus = ['under investigation', 'rejected', 'resolved'];

          if (AcceptedStatus.indexOf(status) === -1) {
            return res.status(400).json({
              status: 400,
              error: 'User record status can either be updated to under investigation, rejected or resolved',
            });
          }

          return t.incidents.updateARecordStatus(status, id)
            .then(response => res.status(200).json({
              status: 200,
              data: [{
                id: response.id,
                message: "User's red-flag status has been updated",
              }],
            }));
        }

        return res.status(404).json({
          status: 404,
          error: `Red-flag with id of ${id} was not found`,
        });
      }));
  }
}

export default IncidentController;
