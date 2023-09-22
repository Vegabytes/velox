import connection from '../database/db.js';
import 'dotenv/config'

export const getDevice = async (req, res) => {
  try {
    const { id } = req.params;
    connection.query('SELECT * FROM Devices where id = ?', [id], (error, results) => {
      if (error) res.status(400).send(error)
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getDevicesByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const gruposByUserId = await getGroupsByUserId(id);

    let gruposUsuarios = await Promise.all(
      gruposByUserId.map(async (element) => {
        return await getGroupInfo(element);
      })
    );
    gruposUsuarios.forEach(element => {
      element['devicesGroups'] = [], element['devices'] = []
    }
    );

    let gruposDevices = await Promise.all(
      gruposUsuarios.map(async (element) => {
        return await getDevicesGroupsByUserGroupId(element);
      })
    )

    const flattenDeep = (arr1) => {
      return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
    }
    gruposDevices = flattenDeep(gruposDevices);

    gruposUsuarios.forEach(gu => {
      gruposDevices.map(gd => {
        if (gd.userGroupId === gu.id) gu.devicesGroups.push(gd);
      })
    });



    await Promise.all(
      gruposUsuarios.map(async gu => {
        return await Promise.all(gu.devicesGroups.map(async gd => {
          const devices = await getDeviceIdBygroupId(gd);

          let _devices = {}

          devices.forEach(d => {
            if (!_devices[d.id]) {
              _devices[d.id] = d
            }
          })

          gu.devices.push(Object.values(_devices)[0])

          return devices;
        })
        )
      })
    )
    res.status(202).send(gruposUsuarios)
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

const getDevicesGroupsByUserGroupId = ({ id }) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM DeviceGroupUserGroup WHERE userGroupId = ?', [id], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};

export const getDevicesIdByGroup = async (req, res) => {
  const { idGroup } = req.params;
  try {
    connection.query(`

    select * from Devices INNER JOIN  DeviceGroupMembers ON DeviceGroupMembers.deviceId = Devices.id where DeviceGroupMembers.groupId in (select deviceGroupId from DeviceGroupUserGroup where userGroupId = ${idGroup})`, (error, results) => {
      if (error) res.status(400).send(error)
      if (results.length === 0) {
        res.status(200).send([]);
      } else {
        res.status(200).send(results)
      }
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

const getDeviceIdBygroupId = ({ deviceGroupId }) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM DeviceGroupMembers INNER JOIN Devices WHERE deviceId = ? and Devices.id = DeviceGroupMembers.deviceId', [deviceGroupId], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};

export const getPositionDevice = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await getPositionDeviceService(id);
    if (device.length === 0) {
      res.status(200).send(null)
    } else {
      res.status(200).send(device[0])
    }

  } catch (error) {
    res.status(500).send(error)
  }
}

const getPositionDeviceService = (deviceId) => {
  return new Promise((resolve, reject) => {
    connection.query('select * from DeviceHistory  where deviceId = ? order by createdAt desc limit 1 ', [deviceId], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });

};

export const getDevicesGroupsNotAssigned = async (req, res) => {

  //select * from DeviceGroups WHERE id NOT IN (SELECT DISTINCT deviceGroupId FROM DeviceGroupUserGroup where userGroupId = 3)
  const { idGroup } = req.params;

  try {
    connection.query(`select * from DeviceGroups WHERE id NOT IN (SELECT DISTINCT deviceGroupId FROM DeviceGroupUserGroup where userGroupId = ${idGroup})`, (error, results) => {
      if (res.length === 0) {
        res.status(200).send([]);
      } else {
        res.status(200).send(results)
      }
    })
  } catch (error) {
    res.status(500).send(error)
  }


} 

export const setDevicesIntoGroup = async (req, res) => {

  const { deviceGroupId, groupId } = req.body;

  try {
    connection.query(`INSERT INTO DeviceGroupUserGroup (deviceGroupId, userGroupId)VALUES(${deviceGroupId},${groupId})`, (error, results) => {
      if (error) {
        res.status(401).send({ msg: 'Esta asociación ya existe' })
        return;
      } else {
        res.status(200).send('Dispositivos asignado a grupo correctamente')
      }
    });
  } catch (error) {
    res.status(500).send(error);
    return;
  }
}