# Coding exercise - Smart building

This exercise will be achieved partly as homework (see questions below) and partly in a pair-programming style (on a follow-up call).

## Brief - outline and questions
The building you are in possesses a few sensor nodes (devices). These devices measure the temperature and humidity of the room they are in, and the data can be collected through a Gateway. This Gateway exposes a JSON-based REST API with a few endpoints (see the full documentation of this API below). Your goal will be to write a small program that interacts with the Gateway API in order to retrieve data from the devices.

In the questions below, the command is just a string passed as an argument to your program. For example, it is expected for the `version` command to be called by typing `./yourExecutable version` (or similar) into a terminal.

1.  Write a program that prints “1.0.0” when the `version` command is given.
2.  Implement a command `device-count` that shows the number of devices in the building.
3.  Implement a command `timeout-devices <threshold>` that list the UUIDs of all the devices that have a response time above the given threshold.
4.  Implement a command `register-device <device-uuid> <room-uuid>` that assigns a device to a room.

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
POST /rooms/<room-uuid>/devices
```
Input:
```
{ "uuid": "<device-uuid>" }
```

### Update the status of a device

```
PUT /devices/<device-uuid>/status
```
Input:
```
{ "status": "RUNNING" | "STOPPED" }
```

### Remove a device

Only stopped devices can be removed.

```
DELETE /devices/<device-uuid>
```
