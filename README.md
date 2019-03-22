# Coding exercise - Smart building

The building you are in possesses few sensor nodes (devices). These devices measure the temperature and humidity of the room there are in, and the data can be collected through a Gateway. This Gateway exposes a JSON-based REST API with few endpoints (see the full documentation below). Your goal will be to write a small program that interacts with the Gateway API in order to retrieve data from the devices.

This exercise will be achieved in a pair-programming style. It is not expected from you to be able to complete everything in the given time. Some of the questions might be imprecise so feel free to ask your interviewer for more details.

The command is just a string passed as an argument to your program. For example, it is expected for the `version` command to be called by typing `./yourExecutable version` in a terminal.

1.  Write a program that prints “1.0.0” when the `version` command is given.
2.  Implement a command `device-count` that shows the number of devices in the building.
3.  Implement a command `timeout-devices <threshold>` that list the UUIDs of all the devices that have a response time above the given threshold.
4.  Implement a command `register-device <device-uuid> <room-uuid>` that assigns a device to a room.
5.  Implement a command `remove-device <uuid>` that removes a device. Only stopped devices can be removed.
6.  Implement a command `temperatures <temperature-min> <temperature-max>` that prints the uuid and temperature of all the devices between the given range of temperature, sorted from coldest to warmest.
7.  Implement a command `start-devices` that starts all devices which are not started.
8.  Implement a command `most-humid-room <floor>` that prints the room label and the measured value with the highest humidity in the given floor.


## Data structure

```
Room {
  uuid: String
  label: String
  floor: Int
  devices: [ Device ]
}
```

```
Device {
  uuid: String
  status: "RUNNING" | "STOPPED"
  responseTime: Float
  room: Room
  temperature: Float
  humidity: Float
}
```

## Public API

### List all devices

```
GET /devices
```

### Show a specific device

```
GET /devices/<uuid>
```

### Show a room

```
GET /rooms
```

## Private API

The endpoints listed below are only accessible after authentication with a `Bearer token`.

### Assign a device to a room

```
POST /rooms/devices
```
Input:
```
{ "uuid": "<device-uuid>" }
```

### Update the status of a device

```
PUT /devices/<uuid>/status
```
Input:
```
{ "status": "RUNNING" | "STOPPED" }
```

### Remove a device

Only stopped devices can be removed.

```
DELETE /devices/<uuid>
```
