# SimpleVolumeControl

SimpleVolumeControl is a web application
that allows the simple remote control of digital mixing consoles.

It is intended to be used with a Raspberry Pi as a local server.
The Raspberry Pi must be connected to the local network,
from which the web application will be used.
A network route must exist on the Raspberry Pi to reach the mixing console.

Currently, only mixing consoles belonging to the Behringer X32/Midas M32 family are supported.

## Running SimpleVolumeControl

You can create a production build of SimpleVolumeControl and start it using the following commands:

```
 $ yarn build
 $ yarn start
```

SimpleVolumeControl is only intended to be run on Linux,
but it might very well be possible that it (at least partially) works on other operating systems, too.

## Configuration

The configuration file for SimpleVolumeControl can be found at `~/.simplevolumecontrol_config.json`.
The configuration has the following format:

```json
{
  "ip": "192.168.2.60",
  "mixer": "Behringer X32",
  "mixes": [
    {
      "mix": "bus-01",
      "inputs": ["ch-01", "ch-03", "ch-04", "ch-05"]
    },
    {
      "mix": "bus-02",
      "inputs": ["ch-01", "ch-05"]
    },
    {
      "mix": "bus-03",
      "inputs": ["ch-01", "ch-03", "ch-04", "ch-05"]
    },
    {
      "mix": "bus-04",
      "inputs": ["ch-01", "ch-02", "ch-03", "ch-04", "ch-05"]
    },
    {
      "mix": "bus-05",
      "inputs": ["ch-02", "ch-05"]
    },
    {
      "mix": "bus-06",
      "inputs": ["ch-03", "ch-04", "ch-05"]
    }
  ],
  "password": "foobar"
}
```

## Screenshots

TODO

## License

TODO