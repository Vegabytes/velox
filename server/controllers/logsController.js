
import connection from '../database/db.js';
import 'dotenv/config'

export const getLogsByDeviceId = async (req, res) => {

  try {
    const { id } = req.params;
    connection.query('SELECT * FROM Logs where deviceId = ?', [id], (error, results) => {
      if (error) console.log(error);
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
    console.log(error);
  }
}
