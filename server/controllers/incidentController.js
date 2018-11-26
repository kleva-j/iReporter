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
}

export default IncidentController;
