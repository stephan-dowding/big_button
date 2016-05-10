# Trumpet
Big Button module for IoT defuse game

### Config event payload

```
{
    "event": "config",
    "device": "trumpet-edison",
    "data": {
        "led": {
            "R": 0,
            "G": 0,
            "B": 1
        },
        "disarmCount": 4
    }
}
```

### Color combinations

- red: { "R": 1, "G": 0, "B": 0 }
- green: { "R": 0, "G": 1, "B": 0 }
- blue: { "R": 0, "G": 0, "B": 1 }
- yellow: { "R": 1, "G": 1, "B": 0 }
- white: { "R": 1, "G": 1, "B": 1 }
- purple: { "R": 1, "G": 0, "B": 1 }
- cyan: { "R": 0, "G": 1, "B": 1 }
- off: { "R": 0, "G": 0, "B": 0 }
