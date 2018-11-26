/* eslint-disable consistent-return */
import models from '../models/index';

const { Incidents, Users } = models;

/**
 * @class IncidentController
 * @classdesc Implements user sign up, log in and profile update
 */
class IncidentController {
  /**
   * Validate an incident
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

    Users.forEach((user) => {
      if (userId === user.id) {
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
    });
  }

  /**
   * Validate an incident
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {object} token or message
   * @memberof IncidentController
   */
  static getSpecificRedFlag(req, res) {
    const { id } = req.params;

    Incidents.forEach((redflag) => {
      if (id === redflag.id) {
        return res.status(200).json({
          status: 200,
          data: [redflag],
        });
      }
    });

    return res.status(404).json({
      status: 404,
      error: `Red-flag with id of ${id} was not found`,
    });
  }

  /**
   * Validate an incident
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
}

export default IncidentController;
