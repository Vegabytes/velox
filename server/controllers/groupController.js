
import connection from '../database/db.js';
import 'dotenv/config'



export const getAllGroups = async (req, res) => {
  try {
    connection.query('SELECT * FROM UserGroups', (error, results) => {
      if (error) console.log(error);
      if (results.length === 0) res.status(200).send([]);
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
    console.log(error);
  }

}

export const getGroupByGrupoId = async (req, res) => {
  const { id } = req.params;
  try {
    connection.query('SELECT * FROM UserGroups where id = ?', [id], (error, results) => {
      if (error) console.log(error);
      if (results.length === 0) res.status(200).send({});
      res.status(200).send(results[0])
    });
  } catch (error) {
    res.status(500).send(error)
    console.log(error);
  }

}

export const getGroupByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const gruposByUserId = await getGroupsByUserId(id);

    let gruposUsuarios = await Promise.all(
      gruposByUserId.map(async (element) => {
        return await getGroupInfo(element);
      })
    );
    res.status(202).send(gruposUsuarios)


  } catch (error) {
    console.log(error);
  }
}



const getGroupsByUserId = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM  UserGroupMembers WHERE userId = ?', [id], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};
const getGroupInfo = ({ groupId }) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM UserGroups WHERE id = ?', [groupId], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements[0]);
    });
  });
};


export const createUserGroups = async (req, res) => {
  try {
    const { name, description, parentGroupId, status, createdBy, path } = req.body;
    connection.query('INSERT INTO UserGroups SET ?', { name, description, parentGroupId, status, createdBy, path }, (error, results) => {
      if (error) console.log(error);
      console.log(results);
      res.status(200).send(req.body)
    });
  } catch (error) {
    console.log(error);
  }

}















