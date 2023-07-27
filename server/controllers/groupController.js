
import connection from '../database/db.js';
import 'dotenv/config'


export const getDevices = async (req, res) => {
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



    let grupoDevicesInfo = await Promise.all(
      gruposUsuarios.map(async gu => {
        return await Promise.all(gu.devicesGroups.map(async gd => {
          const devices = await getDeviceIdBygroupId(gd);

          let _devices = {}

          devices.forEach(d => {
            if(!_devices[d.id]){
              _devices[d.id] = d
            }
          })

          gu.devices.push(Object.values(_devices))

          /**
           *  devices.forEach(device => {
            gu.devices.push(device)
          });
           */
         
          //gu.devices.push(devices);
          return devices;
        })
        )
      })
    )




    console.log("grupoDevicesInfo", grupoDevicesInfo);



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
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM DeviceGroupUserGroup WHERE userGroupId = ?', [id], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};




/* const getDeviceIdBygroupId = ({ deviceGroupId }) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM DeviceGroupMembers WHERE deviceId = ?', [deviceGroupId], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
}; */

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



/*
SELECT * FROM DeviceGroupMembers INNER JOIN Devices WHERE deviceId = 2 and Devices.id = DeviceGroupMembers.deviceId

SELECT * FROM Devices where id in (select deviceId from DeviceGroupMembers where groupid = 2)*/













