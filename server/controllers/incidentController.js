/* eslint-disable consistent-return */
import models from '../models/index';

const { Incidents, Users } = models;

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
   * @return {object} token or message
   * @memberof IncidentController
   */
  static createRedFlag(req, res) {
    const {
      createdBy,
      type,
      location,
      images,
      videos,
      comment,
    } = req.body;

    const userId = createdBy;

    const isUserIdValid = Users.findIndex(user => user.id === userId);

    if (isUserIdValid !== -1) {
      const newIncident = {
        id: Incidents[Incidents.length - 1].id + 1,
        createOn: new Date(),
        createdBy,
        type,
        location,
        images,
        videos,
        comment,
      };

      Incidents.push(newIncident);

      return res.status(200).json({
        status: 200,
        message: newIncident,
      });
    }

    return res.status(404).json({
      status: 404,
      error: 'User id is invalid',
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
      Incidents.slice(redFlagIndex, 1);
      return res.status(200).json({
        status: 200,
        data: [{}],
        message: 'Red-flag record has been successfully deleted',
      });
    }

    return res.status(404).json({
      status: 404,
      error: `Red-flag with id of ${id} was not found`,
    });
  }
}

export default IncidentController;
