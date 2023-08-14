
import connection from '../database/db.js';
import 'dotenv/config'



export const getAllGroups = async (req, res) => {
  try {
    connection.query('SELECT * FROM UserGroups', (error, results) => {
      if (error) res.status(400).send(error);
      if (results.length === 0) res.status(200).send([]);
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
  }

}


export const getGroupByGroupIdByUserId = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    const gruposByUserId = await getGroupsByUserId(userId);
    console.log("gruposByUserId", gruposByUserId);

    let gruposUsuarios = await Promise.all(
      gruposByUserId.map(async (element) => {
        return await getGroupInfoByParent(element, groupId);
      })
    );
    const gruposUsuariosNotNull = gruposUsuarios.filter(user => !!user);
    res.status(200).send(gruposUsuariosNotNull)


  } catch (error) {
    res.status(500).send(error)
  }
}



export const getGroupByGrupoId = async (req, res) => {
  const { id } = req.params;
  try {
    connection.query('SELECT * FROM UserGroups where id = ?', [id], (error, results) => {
      if (error) res.status(400).send(error);
      if (results.length === 0) res.status(200).send({});
      res.status(200).send(results[0])
    });
  } catch (error) {
    res.status(500).send(error)
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
    res.status(200).send(gruposUsuarios)


  } catch (error) {
    res.status(500).send(error)
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

const getGroupInfoByParent = ({ groupId }, parentGroupId) => {
  return new Promise((resolve, reject) => {
    console.error("groupId", groupId);
    console.error("parentGroupId", parentGroupId);
    connection.query('SELECT * FROM UserGroups WHERE id = ? and parentGroupId = ?', [groupId, parentGroupId], (error, elements) => {
      if (error) {
        return reject(error);
      }
      console.log("Elements", elements);
      return resolve(elements[0]);
    });
  });
};



export const createUserGroup = async (req, res) => {
  try {
    const { name, description, parentGroupId, status, createdBy, path } = req.body;
    connection.query('INSERT INTO UserGroups SET ?', { name, description, parentGroupId, status, createdBy, path }, (error, results) => {
      if (error) res.status(400).send(error);
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
  }

}


export const associateUserUserGroup = async (req, res) => {
  try {
    const { userId, groupId, createdBy } = req.body;
    connection.query('INSERT INTO UserGroupMembers SET ?', { userId, groupId, createdBy }, (error, results) => {
      if (error) res.status(400).send(error);
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error);
  }

}















