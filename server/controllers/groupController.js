
import connection from '../database/db.js';
import 'dotenv/config'


export const getDevices = async (req, res) => {
  const { id } = req.params;
  let respond = {};
  try {
    const gruposByUserId = await getGroupsByUserId(id);

    const gruposUsuarios = await Promise.all(
      gruposByUserId.map(async (element) => {
        return await getGroupInfo(element);
      })
    )


    await Promise.all(
      gruposUsuarios.map(async (element) => {
        element['devices'] = [];
        const groups = await getDevicesGroupsByUserGroupId(element);
        groups.map(group => {
          gruposUsuarios.map(gu => {
            if (group.userGroupId === gu.id) element['devices'].push(group);
          })
        });
      })
    )





    /*     gruposUsuarios.forEach(gu => {
          gu['devices'] = [];
          gruposDevices.map(gd => {
            console.log("gu",gu);
            if (gu.id === gd.userGroupId) gu['devices'].push(gd);
          })
        }); */



    /*     console.log("gruposDevices", gruposUsuarios); */
    /*
            const devicesIds = await Promise.all(
              gruposDevices.map(async (element) => {
                return await getDeviceIdBygroupId(element);
              })
            ) */

    /*     const devices = await Promise.all(
          devicesIds.map(async (element) => {
            return await getDeviceByDeviceId(element);
          })
        ) */

    /*     console.log("gruposDevices", gruposDevices); */
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

const getDevicesGroupsByUserGroupId = ({ id }) => {
  console.log("id", id);
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM DeviceGroupUserGroup WHERE userGroupId = ?', [id], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve([...elements]);
    });
  });
};

const getDeviceIdBygroupId = ({ deviceGroupId }) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM DeviceGroupMembers WHERE groupId = ?', [deviceGroupId], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements[0]);
    });
  });
};

const getDeviceByDeviceId = ({ deviceId }) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Devices WHERE id = ?', [deviceId], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements[0]);
    });
  });
};












