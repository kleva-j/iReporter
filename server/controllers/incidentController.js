/* eslint-disable consistent-return */
import db from '../models/db';

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
  static createRedFlag(req, res) {
    const newRecord = {
      createdby: req.body.createdBy,
      type: req.body.type,
      location: req.body.location,
      images: req.body.images,
      videos: req.body.videos,
      comment: req.body.comment,
    };

    db.task('create a record', t => t.users.getByCreatorId(newRecord.createdby)
      .then((user) => {
        if (user) {
          return t.incidents.createIncident(newRecord)
            .then(record => res.status(201).json({
              status: 201,
              data: [{
                record,
                message: 'Created a new record',
              }],
            }));
        }
        return res.status(404).json({
          status: 404,
          error: 'User id is invalid',
        });
      }));
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

    const redFlag = Incidents.find(incident => incident.id === id);
    if (redFlag) {
      return res.status(200).json({
        status: 200,
        data: [redFlag],
      });
    }

    return res.status(404).json({
      status: 404,
      error: `Red-flag with id of ${id} was not found`,
    });
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
  static getAllRedFlag(req, res) {
    return res.status(200).json({
      status: 200,
      data: Incidents,
    });
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
    const { id } = req.params;

    const redFlagIndex = Incidents.findIndex(incident => incident.id === id);

    if (redFlagIndex !== -1) {
      Incidents.splice(redFlagIndex, 1);
      return res.status(200).json({
        status: 200,
        data: [{
          id,
          message: 'red-flag record has been deleted',
        }],
      });
    }

    return res.status(404).json({
      status: 404,
      error: `Red-flag with id of ${id} was not found`,
    });
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
          return t.incidents.updateRedFlagComment(comment, id)
            .then(response => res.status(200).json({
              status: 200,
              data: [{
                response,
                message: 'Updated incident record location',
              }],
            }));
        }
        return res.status(404).json({
          status: 404,
          error: `Red-flag with id of ${id} was not found`,
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

    db.task('update location', t => t.incident.getById(id)
      .then((result) => {
        if (result) {
          return t.incidents.updateRedFlagLocation(location, id)
            .then(response => res.status(200).json({
              status: 200,
              data: [{
                response,
                message: 'Updated incident record location',
              }],
            }));
        }
        return res.status(404).json({
          status: 404,
          error: `Red-flag with id of ${id} was not found`,
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

    db.task('update location', t => t.incident.getById(id)
      .then((result) => {
        if (result) {
          const AcceptedStatus = ['under investigation', 'rejected', 'resolved'];

          if (AcceptedStatus.indexOf(status) === -1) {
            return res.status(400).json({
              status: 400,
              error: 'User record status can either be updated to under investigation, rejected or resolved',
            });
          }

          return t.incidents.updateRedFlagStatus(status, id)
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

module.exports = IncidentController;
