## doihaveinternet

Simple `npm` based cli for knowing when the internet goes up or down.

Useful for diagnosing network cuts or instability in a simple way.

```
npm install -g doihaveinternet
```

Needs `ping` available on the system.

### Example

```
# Starting with the internet off, and turning it on and off
$ doihaveinternet
DOWN 8/18/2015 12:57:52 PM
UP 8/18/2015 12:58:02 PM
DOWN 8/18/2015 12:58:12 PM
UP 8/18/2015 12:58:18 PM
```

