onmessage = function({ data }) {
    switch(data.cmd) {
        case "move":
            for (const t of data.args.physics) {
                for (let e = 0; e < t.length; e += 2) {
                    t[e] += data.args.x;
                    t[e + 1] += data.args.y;
                }
            }
            for (const t of data.args.scenery) {
                for (let e = 0; e < t.length; e += 2) {
                    t[e] += data.args.x;
                    t[e + 1] += data.args.y;
                }
            }
            for (const t in data.args.powerups) {
                for (const e in data.args.powerups[t]) {
                    switch(t) {
                        case "teleporters":
                            data.args.powerups[t][e][2] += data.args.x;
                            data.args.powerups[t][e][3] += data.args.y;
                        case "targets":
                        case "boosters":
                        case "gravity":
                        case "slomos":
                        case "bombs":
                        case "checkpoints":
                        case "antigravity":
                            data.args.powerups[t][e][0] += data.args.x;
                            data.args.powerups[t][e][1] += data.args.y;
                        break;
                        
                        case "vehicles":
                            for (const i in data.args.powerups[t][e]) {
                                data.args.powerups[t][e][i][0] += data.args.x;
                                data.args.powerups[t][e][i][1] += data.args.y;
                            }
                        break;
                    } 
                }
            }
        break;

        case "rotate":
            for (const t of data.args.physics) {
                for (let e = 0, i = t[e]; e < t.length; e += 2) {
                    i = t[e],
                    t[e] = Math.cos(data.args.x) * i + Math.sin(data.args.x) * t[e + 1],
                    t[e + 1] = -Math.sin(data.args.x) * i + Math.cos(data.args.x) * t[e + 1];
                }
            }
            for (const t of data.args.scenery) {
                for (let e = 0, i = t[e]; e < t.length; e += 2) {
                    i = t[e],
                    t[e] = Math.cos(data.args.x) * i + Math.sin(data.args.x) * t[e + 1],
                    t[e + 1] = -Math.sin(data.args.x) * i + Math.cos(data.args.x) * t[e + 1];
                }
            }
            for (const t in data.args.powerups) {
                for (const e in data.args.powerups[t]) {
                    switch(t) {
                        case "teleporters":
                            let i = data.args.powerups[t][e][2];
                            data.args.powerups[t][e][2] = Math.cos(data.args.x) * i + Math.sin(data.args.x) * data.args.powerups[t][e][3],
                            data.args.powerups[t][e][3] = -Math.sin(data.args.x) * i + Math.cos(data.args.x) * data.args.powerups[t][e][3];
                        case "targets":
                        case "boosters":
                        case "gravity":
                        case "slomos":
                        case "bombs":
                        case "checkpoints":
                        case "antigravity":
                            let s = data.args.powerups[t][e][0];
                            data.args.powerups[t][e][0] = Math.cos(data.args.x) * s + Math.sin(data.args.x) * data.args.powerups[t][e][1],
                            data.args.powerups[t][e][1] = -Math.sin(data.args.x) * s + Math.cos(data.args.x) * data.args.powerups[t][e][1];
                            if (["boosters", "gravity"].includes(t)) {
                                data.args.powerups[t][e][2] += data.args.rotationFactor;
                            }
                        break;
                        
                        case "vehicles":
                            for (const i in data.args.powerups[t][e]) {
                                let s = data.args.powerups[t][e][i][0];
                                data.args.powerups[t][e][i][0] = Math.cos(data.args.x) * s + Math.sin(data.args.x) * data.args.powerups[t][e][1],
                                data.args.powerups[t][e][i][1] = -Math.sin(data.args.x) * s + Math.cos(data.args.x) * data.args.powerups[t][e][1];
                            }
                        break;
                    } 
                }
            }
        break;

        case "scale":
            for (const t of data.args.physics) {
                for (let e = 0; e < t.length; e += 2) {
                    t[e] *= data.args.x;
                    t[e + 1] *= data.args.y;
                }
            }
            for (const t of data.args.scenery) {
                for (let e = 0; e < t.length; e += 2) {
                    t[e] *= data.args.x;
                    t[e + 1] *= data.args.y;
                }
            }
            for (const t in data.args.powerups) {
                for (const e in data.args.powerups[t]) {
                    switch(t) {
                        case "teleporters":
                            data.args.powerups[t][e][2] *= data.args.x;
                            data.args.powerups[t][e][3] *= data.args.y;
                        case "targets":
                        case "boosters":
                        case "gravity":
                        case "slomos":
                        case "bombs":
                        case "checkpoints":
                        case "antigravity":
                            data.args.powerups[t][e][0] *= data.args.x;
                            data.args.powerups[t][e][1] *= data.args.y;
                        break;
                        
                        case "vehicles":
                            for (const i in data.args.powerups[t][e]) {
                                data.args.powerups[t][e][i][0] *= data.args.x;
                                data.args.powerups[t][e][i][1] *= data.args.y;
                            }
                        break;
                    } 
                }
            }
        break;
    }
    postMessage(data);
}